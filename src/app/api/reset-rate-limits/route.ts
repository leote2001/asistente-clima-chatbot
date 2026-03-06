import { redis } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    if (process.env.NODE_ENV !== "development") {
        console.log("Solo se puede ejecutar en desarrollo");
        return NextResponse.json({success: false}, {status: 403});
    }
    try {
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        const all = await redis.keys("ratelimit*");
        let deleting = 0;
        if (all.length > 0) {
            deleting = await redis.del(...all);
        }
        return NextResponse.json({success: true, message: `Se eliminaron ${deleting} registros.`}, {status: 200});
    } catch (err: any) {
        console.error("Error inesperado al resetear rate limiters: "+err);
        return NextResponse.json({success: false}, {status: 500});
    }
} 