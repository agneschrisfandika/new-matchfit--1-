
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateInvitationMessage(params: {
  eventType: string;
  eventName: string;
  organizerName: string;
}) {
  try {
    const prompt = `
      Bertindaklah sebagai penulis undangan profesional. 
      Buatkan teks undangan digital untuk acara ${params.eventType}.
      Nama Acara: ${params.eventName}
      Penyelenggara: ${params.organizerName}
      Bahasa Indonesia elegan, max 120 kata. Tanpa markdown.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text?.trim() || "Kehadiran Anda adalah kehormatan bagi kami.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Kehadiran Anda adalah kehormatan bagi kami.";
  }
}

export async function analyzeFashion(params: {
  imageData?: string; // Base64
  measurements?: { shoulder: number, waist: number, hip: number };
}) {
  try {
    const contents: any[] = [];
    
    let userPrompt = "Bertindaklah sebagai Senior Fashion Stylist dan Makeup Consultant. ";
    
    if (params.imageData) {
      contents.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: params.imageData.split(',')[1]
        }
      });
      userPrompt += "Analisis foto ini untuk menentukan bentuk tubuh (Apple, Pear, Hourglass, Rectangle, Inverted Triangle) and undertone kulit. ";
    } else if (params.measurements) {
      userPrompt += `Berdasarkan ukuran ini: Bahu ${params.measurements.shoulder}cm, Pinggang ${params.measurements.waist}cm, Pinggul ${params.measurements.hip}cm. Tentukan bentuk tubuh. `;
    }

    userPrompt += `
      Berikan output dalam format JSON murni:
      {
        "bodyShape": string,
        "undertone": string,
        "recommendations": string[],
        "powerColors": string[],
        "makeupPalette": [
          { "name": string, "hex": string }
        ],
        "outfits": [
          {
            "occasion": "Casual/Formal/Party",
            "items": string[],
            "reason": string
          }
        ]
      }
      
      Note: makeupPalette harus berisi 4-5 warna yang harmonis dengan undertone dan gaya fashion yang direkomendasikan.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [...contents, { text: userPrompt }] },
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Fashion AI Error:", error);
    throw error;
  }
}

export async function analyzeFace(params: {
  imageData: string;
  skinType: string;
  concerns: string[];
}) {
  try {
    const userPrompt = `
      Bertindaklah sebagai Ahli Dermatologi dan Makeup Artist Senior.
      Analisis wajah dari foto yang diberikan secara mendetail.
      Gunakan data tambahan dari pengguna: Jenis Kulit: ${params.skinType}, Keluhan: ${params.concerns.join(', ')}.
      
      Berikan analisis mendalam meliputi:
      1. skinTone & undertone kulit.
      2. facialAge (estimasi umur wajah).
      3. skinTexture & acneStatus (kondisi jerawat/tekstur).
      4. faceShape & detail fitur (mata, hidung, mulut, jarak mata-alis).
      
      5. Rekomendasi makeup LENGKAP:
         - Foundation/Cushion: Tekstur yang cocok (matte/dewy) dan palet warna HEX.
         - Blush On: Titik penempatan (apple of the cheeks/high cheekbones) dan palet HEX.
         - Lipstick: Bentuk aplikasi (ombre/full lips) dan panduan ketebalan.
         - Eyeshadow: Kombinasi warna yang menonjolkan mata.
         - Eyeliner: Tentukan bentuk yang paling cocok (Winged, Puppy, Cat-eye, Classic) berdasarkan bentuk mata.
         - Alis (Eyebrows): Tentukan bentuk (Straight, Arched, S-Shaped) agar wajah terlihat proporsional.
         - Shading/Contour: Titik penempatan spesifik untuk memberikan dimensi pada wajah.

      PENTING: Berikan "applicationTips" yang sangat spesifik untuk setiap kategori (contoh: "Gunakan lipstick tipis di tengah lalu blend ke luar agar wajah terlihat lebih muda").

      6. Rutinitas skincare.
      7. Tips diet.

      Berikan output dalam format JSON sesuai schema berikut:
      {
        "skinTone": string,
        "undertone": string,
        "facialAge": number,
        "skinTexture": string,
        "acneStatus": string,
        "faceShape": string,
        "features": {
          "eyes": string,
          "nose": string,
          "mouth": string,
          "eyeToBrowDistance": string
        },
        "makeupRecommendations": [
          {
            "category": string,
            "suggestion": string,
            "palette": [{ "name": string, "hex": string }],
            "shape": string,
            "shadingTechnique": string,
            "applicationTips": string
          }
        ],
        "skincareRoutine": {
          "type": string,
          "recommendedIngredients": string[],
          "avoidIngredients": string[],
          "explanation": string
        },
        "dietaryTips": {
          "recommended": string[],
          "avoid": string[]
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: params.imageData.split(',')[1]
            }
          },
          { text: userPrompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Face AI Error:", error);
    throw error;
  }
}
