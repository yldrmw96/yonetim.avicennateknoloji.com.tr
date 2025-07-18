import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function buildPrompt(text: string, targetLang: string) {
  return `**Rol**: Profesyonel çevirmen  
**Görev**: Bana verilen anahtar adını (snake_case) önce İngilizce başlığa çevir, sonra ${targetLang} diline çevir.  
**Kurallar**:  
1. Alt çizgileri boşlukla değiştirip Başlık Biçimi kullan (“tourism_news” → “Tourism News”).  
2. Yalnızca ${targetLang} çıktısını döndür: ek açıklama ekleme.  
3. Özel isimler varsa orijinal hâliyle koru.

**Anahtar**: ${text}
${text}`;
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang = "English" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "text boş olamaz" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY as string
    );

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = buildPrompt(text, targetLang);
    const result = await model.generateContent(prompt);
    const translation = result.response.text();
    // console.log('translation:', translation)
    return NextResponse.json({ translation });
  } catch (err) {
    // console.error(err);
    return NextResponse.json(
      { error: err},
      { status: 500 }
    );
  }
}
