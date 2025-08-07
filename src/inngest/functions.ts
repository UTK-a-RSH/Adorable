import { inngest } from "./client";
import {Sandbox} from "@e2b/code-interpreter"
import { openai, createAgent } from "@inngest/agent-kit";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step}) => {
    const sandboxId = await step.run("get sandbox-id", async () => {
      const sandbox = await Sandbox.create("adorable-nextjs-test-01");
      return sandbox.sandboxId;
    })
    try {
      const codeAgent = createAgent({
        name: "code-agent",
        system: "You are an expert Next.js developer.  You write readable, maintainable, and executable code. You write simple Next.js components & react snippets ",
        model: openai({ 
          model: "openai/gpt-4o-mini", // Use a valid OpenRouter model ID
          apiKey: process.env.OPENROUTER_API_KEY, // Ensure you have set your OpenAI API key in environment variables
          baseUrl: "https://openrouter.ai/api/v1" // OpenRouter's base URL
        }),
      });

      const sandboxUrl = await step.run("get sandbox url", async () => {
        const sandbox = await getSandbox(sandboxId);
        const host = sandbox.getHost(3000);
        return `https://${host}`;
      });
      const { output } = await codeAgent.run(`write the following snippet: ${event.data.value}`);
        return { output, sandboxUrl };
    } catch (error) {
      console.error("Error in helloWorld function:", error);
      throw error;
    }
  },
);