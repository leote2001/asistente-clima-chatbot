import { google } from "@ai-sdk/google";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import z from "zod";
import { getWeather } from "./tools/weather";
import {dayRateLimit, minuteRateLimit } from "@/app/lib/rateLimit";
import { recaptcha } from "@/app/lib/recaptcha";
import { checkRateLimit } from "@/app/lib/checkRateLimit";
import { isEmpty } from "@/app/lib/isEmpty";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { messages, recaptchaToken } = await req.json();
    if (!recaptchaToken) {
        return new Response("Token de seguridad requerido.", { status: 400 });
    }
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const checkingRateLimit = await checkRateLimit(ip);
    if (!checkingRateLimit.success) {
        return new Response(checkingRateLimit.error, {status: checkingRateLimit.status});
    }
    const {success, error, status} = await recaptcha(recaptchaToken);
    if (!success) {
        return new Response(error, {status});
    }
    console.log("El usuario es humano.");
    const checkEmpty = isEmpty(messages);
    if (!checkEmpty.success) {
        return new Response(checkEmpty.error, {status: checkEmpty.status});
    }
    const text = checkEmpty.message;
    if (text.length > 250) {
        return new Response("Mensaje demasiado largo.", {status: 400});
    }
    try {    
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
            }
        });
        return response.toUIMessageStreamResponse();
    } catch (err: any) {
        console.log("Error en el chat: " + err);
        return new Response("error interno.", { status: 500 });
    }
}