import { inngest } from "./client";
import {Sandbox} from "@e2b/code-interpreter"
import { openai, createAgent, createTool, createNetwork , type Tool, gemini} from "@inngest/agent-kit";
import {z} from "zod";
import { getSandbox, lastAssistantTextMessage} from "./utils";
import { PROMPT } from "@/prompt";
import { prisma } from "@/lib/db";



interface AgentState {
  summary: string | null;
  files: { [path: string]: string };
}

export const agentAdorable = inngest.createFunction(
  { id: "agent-adorable" },
  { event: "adorable/run" },
  async ({ event, step}) => {
    const sandboxId = await step.run("get sandbox-id", async () => {
      const sandbox = await Sandbox.create("adorable-nextjs-test-01");
      return sandbox.sandboxId;
    })
    try {
      const codeAgent = createAgent<AgentState>({
        name: "code-agent",
        // Prompt hardening (Option A): explicitly restrict tool usage & forbid meta tokens
        system: `${PROMPT}\n\nSTRICT TOOL ENFORCEMENT:\nYou may ONLY use these exact tool names: terminal, createOrUpdateFile, readFiles.\nANY other tool name is FORBIDDEN and will cause errors.\nNEVER output <|constrain|>json, <|json|>, or any angle-bracket tokens.\nIF you see yourself trying to use a non-existent tool, STOP and respond with plain text instead.\nTool names are case-sensitive. Use exactly: terminal, createOrUpdateFile, readFiles.`,
        model: gemini({
          model: "gemini-2.5-pro",
          apiKey: process.env.GEMINI_API_KEY,
        }),
        tools: [
          createTool({
            name: "terminal",
            description: "Use the terminal to run commands",
            parameters: z.object({
              command:  z.string(),
            }) ,
            handler: async ({ command }, {step}) => {
              return await step?.run("terminal", async () => {
                const buffers = {stdout: "", stderr: ""};
                try {
                  const sandbox = await getSandbox(sandboxId);
                  const result = await sandbox.commands.run(command, {
                    onStdout: (data: string) => {
                      buffers.stdout += data;
                    },
                    onStderr: (data: string) => {
                      buffers.stderr += data;
                    }
                  });
                  return result.stdout;

                } catch (e) {
                  console.error(`Command execution failed: ${e}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`);
                  return `Command execution failed: ${e}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
                }
            
              });
            }
          }),

          createTool({
            name: "createOrUpdateFile",
            description: "Create or update a file in the sandbox",
            parameters: z.object({
              files: z.array(
                z.object({
                  filePath: z.string(),
                  content: z.string(),
                }),
              ),
            }) ,
            handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
              const newFiles =  await step?.run("createOrUpdateFile", async () => {
                try {
                  if (!network.state.data) {
                    network.state.data = { files: {}, summary: null };
                  }
                  const updatedFiles = network.state.data?.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.filePath, file.content);
                    updatedFiles[file.filePath] = file.content;
                  }
                  return updatedFiles;
                } catch (error) {
                  return "Error: " + error;
                }
              });
              if (typeof newFiles === "object"){
                if (!network.state.data) {
                  network.state.data = { files: {}, summary: null };
                }
                network.state.data.files = newFiles;
              }
            }
          }),

          createTool({
            name: "readFiles",
            description: "Read files from the sandbox",
            parameters: z.object({
              files: z.array(z.string()),
            }),
            handler: async ({ files }, { step }) => {
              return await step?.run("readFiles", async () => {
                try {
                  const sandbox = await getSandbox(sandboxId);
                  const contents = [];
                  for (const file of files) {
                    const content = await sandbox.files.read(file);
                    contents.push({ path: file, content });
                  }
                  return JSON.stringify(contents);
                } catch (error) {
                  return "Error: " + error;
                }
              });
            }
          }),

        ],
        lifecycle: {
          onResponse: async ({ result, network }) => {
            const lastAssistantMessageText = lastAssistantTextMessage(result);

            if(lastAssistantMessageText && network) {
              if (!network.state.data) {
                network.state.data = { files: {}, summary: null };
              }
              if( lastAssistantMessageText.includes("<task_summary>")){
                network.state.data.summary = lastAssistantMessageText
              }
            }
            return result;
          }
        }
      });

      const network = createNetwork<AgentState>({
        name: "adorable-coding-network",
        agents: [codeAgent],
        maxIter: 10,
        router: async ({ network }) => {
          const summary = network.state.data?.summary;

          if(summary) {
            return
          }
          return codeAgent; 
        }
      });

       const result = await network.run(event.data.value);
       const isError = 
       !result.state.data.summary || 
       Object.keys(result.state.data.files || {}).length === 0;

      const sandboxUrl = await step.run("get sandbox url", async () => {
        const sandbox = await getSandbox(sandboxId);
        const host = sandbox.getHost(3000);
        return `https://${host}`;
      });

      await step.run("save-result", async () => {

        if(isError) {
          return await prisma.message.create({
            data: {
              content: "Something went wrong. Please try again later.",
              role: "ASSISTANT",
              type: "ERROR",
              projectId: event.data.projectId,
              
            },
          });
        }
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: result.state.data.summary!,
            role: "ASSISTANT",
            type: "RESULT",
            fragment: {
              create: {
                sandboxurl: sandboxUrl,
                title: "Fragment",
                files: result.state.data.files,
              }
            }
          },
        });
      });

      return {
        url: sandboxUrl,
        title: "Fragment",
        files: result.state.data.files,
        summary: result.state.data.summary,
      }
    
    } catch (error) {
      console.error("Error in helloWorld function:", error);
      throw error;
    }
  },
);