import { PDFDocument, StandardFonts } from "pdf-lib";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    const {text} = await req.json();
    try {
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage();
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
page.drawText(text, {
    x: 50,
    y: 700,
    size: 12,
    font
});
const pdfBytes = await pdfDoc.save();
return new NextResponse(pdfBytes.buffer, {
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