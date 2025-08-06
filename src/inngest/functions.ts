import { inngest } from "./client";
import { openai, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event}) => {
    try {
      const codeAgent = createAgent({
        name: "code-agent",
        system: "You are an expert Next.js developer.  You write readable, maintainable, and executable code. You write simple Next.js components & react snippets ",
        model: openai({ 
          model: "openai/gpt-4o-mini", // Use a valid OpenRouter model ID
          apiKey: process.env.OPENAI_API_KEY, // Ensure you have set your OpenAI API key in environment variables
          baseUrl: "https://openrouter.ai/api/v1" // OpenRouter's base URL
        }),
      });

      const { output } = await codeAgent.run(`write the following snippet: ${event.data.value}`);
      return { output };
    } catch (error) {
      console.error("Error in helloWorld function:", error);
      throw error;
    }
  },
);