
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../features/transactions/types/transaction.types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getFinancialAdvice = async (transactions: Transaction[]) => {
  const model = "gemini-3-flash-preview";

  const prompt = `
    Como experto financiero, analiza los siguientes datos de transacciones (cuentas por pagar, cobrar, gastos fijos e ingresos).
    Prioriza las cuentas por pagar basándote en la fecha de vencimiento (antigüedad), el impacto en el flujo de caja y la urgencia.
    
    Datos: ${JSON.stringify(transactions)}

    Devuelve un análisis detallado que incluya:
    1. Una lista de prioridades de pago con razones específicas.
    2. Un resumen ejecutivo del estado financiero.
    3. 3 consejos prácticos para optimizar el presupuesto del próximo mes.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priorityList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  priorityScore: { type: Type.NUMBER, description: "Del 1 al 10" }
                },
                required: ["id", "reason", "priorityScore"]
              }
            },
            summary: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["priorityList", "summary", "tips"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    throw error;
  }
};
