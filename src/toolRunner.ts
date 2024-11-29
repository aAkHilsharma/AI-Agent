import type OpenAI from "openai";

const getWeather = (input: {
  userMessage: string;
  toolArgs: OpenAI.Chat.Completions.ChatCompletionMessageToolCall;
}) => `The weather is chilly ❄️`;

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || "{}"),
  };

  switch (toolCall.function.name) {
    case "get_weather":
      return getWeather(input);
    default:
      throw new Error(`Unknown tool: ${toolCall.function.name}`);
  }
};
