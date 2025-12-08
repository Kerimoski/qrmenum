
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { generateMenuDescription } from "@/lib/ai/google-gemini";

export async function POST(req: NextRequest) {
    try {
        // Oturum kontrolü
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { productName } = body;

        if (!productName || productName.trim().length < 2) {
            return NextResponse.json(
                { error: "Lütfen geçerli bir ürün adı girin." },
                { status: 400 }
            );
        }

        // AI ile üretim
        const result = await generateMenuDescription(productName);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("AI Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Bir hata oluştu" },
            { status: 500 }
        );
    }
}
