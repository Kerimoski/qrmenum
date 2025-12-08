
import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key kontrolü
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
    console.warn("⚠️ GOOGLE_GEMINI_API_KEY is missing in environment variables!");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export interface GeneratedDescription {
    nameEn: string;
    descriptionTr: string;
    descriptionEn: string;
}

export async function generateMenuDescription(productName: string): Promise<GeneratedDescription> {
    if (!apiKey) {
        throw new Error("API Key is missing. Please configure GOOGLE_GEMINI_API_KEY.");
    }

    try {
        // Model seçimi (gemini-2.0-flash kullanıcı hesabı için geçerli sürüm)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
      Sen profesyonel bir restoran menü yazarısın. 
      "${productName}" isimli yemek için TÜRKÇE olarak iştah kabartıcı, satış artırıcı, kısa ve öz bir açıklama yaz (maksimum 2 cümle).
      Ayrıca bu ürünün adını İngilizceye çevir (nameEn) ve açıklamasını İngilizceye çevir (descriptionEn).
      
      Çıktıyı SADECE şu JSON formatında ver, başka hiçbir metin ekleme:
      {
        "nameEn": "Translated product name",
        "descriptionTr": "Buraya kesinlikle Türkçe açıklama yaz",
        "descriptionEn": "English description here"
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // JSON temizleme (bazen markdown ```json ... ``` içinde gelebilir)
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanedText) as GeneratedDescription;
    } catch (error) {
        console.error("Gemini AI Generation Error:", error);
        throw new Error("AI açıklama oluştururken bir hata oluştu. Lütfen tekrar deneyin.");
    }
}
