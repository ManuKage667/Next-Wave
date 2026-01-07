import { GoogleGenAI, Type } from "@google/genai";
import { Player, Position } from "../types";

// Helper to initialize Gemini
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePlayerProfile = async (firstName: string, lastName: string): Promise<Partial<Player>> => {
  const ai = getAiClient();
  
  const prompt = `Génère un profil de scouting détaillé pour le jeune joueur de football ${firstName} ${lastName}. 
  Si le joueur n'est pas réel ou très peu connu, invente un profil réaliste de "wonderkid" (crack) crédible.
  IMPORTANT:
  1. Pour 'nationalities', retourne un tableau d'objets avec 'country' (nom en français) et 'code' (code ISO 2 lettres majuscules, ex: FR, ES, BR).
  2. Inclus la 'height' (taille) en cm.
  3. Défini 'primaryPosition' (Poste principal) et 'secondaryPositions' (Liste des postes secondaires possibles).
  4. Inclus 'seasonStats' avec les stats de la saison actuelle et précédente.
  5. Inclus 'nationalStats' (Sélection nationale) avec caps (matchs), goals, assists.
  6. Inclus 'potential' : une note de 1 à 5 (entier) représentant son potentiel futur (5 = futur Ballon d'Or, 1 = professionnel moyen).
  Réponds uniquement au format JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            age: { type: Type.INTEGER },
            height: { type: Type.INTEGER, description: "Height in cm" },
            nationalities: { 
                type: Type.ARRAY, 
                items: { 
                    type: Type.OBJECT,
                    properties: {
                        country: { type: Type.STRING },
                        code: { type: Type.STRING, description: "ISO 2 letter country code" }
                    }
                } 
            },
            strongFoot: { type: Type.STRING, enum: ["Droit", "Gauche", "Ambidextre"] },
            primaryPosition: { type: Type.STRING, enum: Object.values(Position) },
            secondaryPositions: { type: Type.ARRAY, items: { type: Type.STRING, enum: Object.values(Position) } },
            club: { type: Type.STRING },
            description: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            progressionArea: { type: Type.STRING },
            potential: { type: Type.INTEGER, description: "Rating from 1 to 5" },
            stats: {
              type: Type.OBJECT,
              properties: {
                pace: { type: Type.INTEGER },
                shooting: { type: Type.INTEGER },
                passing: { type: Type.INTEGER },
                dribbling: { type: Type.INTEGER },
                defending: { type: Type.INTEGER },
                physical: { type: Type.INTEGER },
              }
            },
            nationalStats: {
              type: Type.OBJECT,
              properties: {
                caps: { type: Type.INTEGER },
                goals: { type: Type.INTEGER },
                assists: { type: Type.INTEGER }
              }
            },
            seasonStats: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        season: { type: Type.STRING },
                        club: { type: Type.STRING },
                        competition: { type: Type.STRING },
                        appearances: { type: Type.INTEGER },
                        goals: { type: Type.INTEGER },
                        assists: { type: Type.INTEGER }
                    }
                }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<Player>;
    }
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Error generating player profile:", error);
    throw error;
  }
};