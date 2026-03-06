import {dayRateLimit, minuteRateLimit } from "./rateLimit";
export const checkRateLimit = async (ip: string) => {
    try {
        const  {success: minuteSuccess, remaining: minuteRemaining, limit: minuteLimit} = await minuteRateLimit.limit(ip);
        console.log(ip)
        console.log(`MinuteLimit: ${minuteRemaining}/${minuteLimit}`);
        if (!minuteSuccess) {
            return {success: false, error: "Demasiadas solicitudes. Intenta nuevamente en un minuto.", status: 429};
        }
        const {success: daySuccess, remaining: dayRemaining, limit: dayLimit} = await dayRateLimit.limit(ip);
    console.log(`DayLimit: ${dayRemaining}/${dayLimit}`);
    if (!daySuccess) {
        return {success: false, error: "Demasiadas solicitudes. Intenta nuevamente en 24 horas.", status: 429};
    }
    return {success: true};
    } catch (err: any) {
        return {success: false, error: "Error inesperado al chequear rate limit.", status: 500};
    }
}