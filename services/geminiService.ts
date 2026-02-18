
import { GoogleGenAI, Type } from "@google/genai";
import { DocumentType, MedicalAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    documentType: { type: Type.STRING },
    summary: { type: Type.STRING },
    simplifiedTerms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          jargon: { type: Type.STRING },
          meaning: { type: Type.STRING },
          importance: { type: Type.STRING }
        }
      }
    },
    criticalFindings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING },
          description: { type: Type.STRING },
          action: { type: Type.STRING }
        }
      }
    },
    genericAlternatives: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          brandedName: { type: Type.STRING },
          genericName: { type: Type.STRING },
          approxBrandedPrice: { type: Type.STRING },
          approxGenericPrice: { type: Type.STRING },
          savingsPercentage: { type: Type.STRING }
        }
      }
    },
    costInsights: {
      type: Type.OBJECT,
      properties: {
        procedureName: { type: Type.STRING },
        billedAmount: { type: Type.STRING },
        expectedRange: {
          type: Type.OBJECT,
          properties: {
            privateLow: { type: Type.STRING },
            privateHigh: { type: Type.STRING },
            government: { type: Type.STRING }
          }
        },
        isOvercharged: { type: Type.BOOLEAN },
        tierComparison: { type: Type.STRING }
      }
    },
    billAnalysis: {
      type: Type.OBJECT,
      properties: {
        totalAmount: { type: Type.STRING },
        potentialOvercharges: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              reason: { type: Type.STRING },
              suggestedAction: { type: Type.STRING }
            }
          }
        }
      }
    },
    insuranceInsights: {
      type: Type.OBJECT,
      properties: {
        rejectionReason: { type: Type.STRING },
        appealAdvice: { type: Type.STRING }
      }
    },
    nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['documentType', 'summary', 'simplifiedTerms', 'criticalFindings', 'nextSteps']
};

export const analyzeMedicalDocument = async (
  base64Data: string,
  mimeType: string,
  cityTier: string = 'Tier-1'
): Promise<MedicalAnalysis> => {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        {
          text: `You are an expert Indian Medical Finance Consultant.
          Analyze the attached document for:
          1. Document Type: (Prescription, Bill, Lab, Insurance).
          2. GENERIC SAVINGS (FOR PRESCRIPTIONS): Identify branded Indian medicines (e.g., Augmentin, Lipitor). Provide Jan Aushadhi or generic equivalents and estimated price differences (₹ Branded vs ₹ Generic).
          3. COST BENCHMARKING (FOR BILLS): If a procedure/surgery is detected, compare the cost against standard Indian ranges for ${cityTier} cities.
             - Cataract: ₹15k - ₹40k
             - C-Section: ₹50k - ₹1.2L
             - Knee Replacement: ₹1.5L - ₹3L
             - Standard Consultation: ₹500 - ₹1500
          4. OVERCHARGES: Flag "Consumables" or "Service charges" that exceed 10% of the total bill.
          5. NEXT STEPS: Suggest "Switch to Generic", "Appeal Overcharge", or "Submit TPA claim".

          IMPORTANT: Use Indian numbering (Lakhs). Always add a disclaimer that switching medicines requires doctor consultation.
          Respond strictly in JSON according to schema.`
        }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: ANALYSIS_SCHEMA as any,
    }
  });

  const response = await model;
  const resultText = response.text;
  if (!resultText) throw new Error("Analysis failed.");
  return JSON.parse(resultText) as MedicalAnalysis;
};
