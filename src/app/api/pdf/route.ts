import { PDFDocument} from "pdf-lib";
import fontkit  from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
const fontPath = path.join(process.cwd(), "public/fonts/NotoSans_Condensed-Regular.ttf");
const fontBytes = fs.readFileSync(fontPath);
export async function POST(req: Request) {
    const {text} = await req.json();
    try {
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage();
pdfDoc.registerFontkit(fontkit);
const customFont = await pdfDoc.embedFont(fontBytes);
page.drawText(text, {
    x: 50,
    y: 700,
    size: 12,
    font: customFont
});
const pdfBytes = await pdfDoc.save();
const buffer = Buffer.from(pdfBytes);
return new Response(buffer, {
    headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=clima.pdf"
    }
});
    } catch (err: any) {
        console.error("Error al crear pdf: "+err);
        return NextResponse.json({success: false, error: "Error al crear pdf: "+err.message}, {status: 500});
    }
}