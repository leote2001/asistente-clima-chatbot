import { google } from "@ai-sdk/google";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import z from "zod";
import { getWeather } from "./tools/weather";

export async function POST(req: Request) {
    const { messages } = await req.json();
    const response = await streamText({
        model: google("gemini-2.5-flash"),
        messages: await convertToModelMessages(messages),
        system: "sos un asistente que recomienda actividades según el clima de una ciudad. Además puedes ofrecer los datos actuales del clima o dar el pronóstico de hasta 7 días.",
        stopWhen: stepCountIs(5),
        tools: {
            getWeather: tool({
                description: "permite obtener el clima actual o el pronostico de hasta 7 días.",
                inputSchema: z.object({
                    city: z.string().describe("Ciudad de la cual se debe obtener el clima actual o el pronóstico.")
                }),
                execute: async ({ city }) => {
                    return await getWeather(city);
                }
            })
        },
        onStepFinish: ({ toolResults }) => {
            console.log(toolResults);
        }
    });
    return response.toUIMessageStreamResponse();
}