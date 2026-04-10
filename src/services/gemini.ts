import { GoogleGenAI } from "@google/genai";
import { HealthData, AssessmentResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function assessCancerRisk(data: HealthData): Promise<AssessmentResult> {
  const prompt = `
    As an AI medical assessment assistant, analyze the following health data for cancer risk for user ${data.name}.
    Provide a risk score (0-100), a risk level (Low, Medium, High), a summary of the analysis, 
    personalized recommendations, and suggested screenings.

    User Data:
    - Name: ${data.name}
    - Age: ${data.age}
    - Gender: ${data.gender}
    - Smoker: ${data.isSmoker} ${data.isSmoker ? `(${data.smokingYears} years)` : ''}
    - Family History: ${data.familyHistory} ${data.familyHistoryTypes?.length ? `(Types: ${data.familyHistoryTypes.join(', ')})` : ''} ${data.familyHistoryDetails ? `(Details: ${data.familyHistoryDetails})` : ''}
    - Genetic Predispositions: ${data.geneticHistory} ${data.geneticMarkers?.length ? `(Markers: ${data.geneticMarkers.join(', ')})` : ''} ${data.geneticHistoryDetails ? `(Details: ${data.geneticHistoryDetails})` : ''}
    - Symptoms: ${data.symptoms.join(', ') || 'None'}
    - BMI: ${(data.weight / ((data.height / 100) ** 2)).toFixed(1)} (Weight: ${data.weight}kg, Height: ${data.height}cm)
    - Alcohol: ${data.alcoholConsumption}
    - Activity: ${data.physicalActivity}
    - Diet: ${data.dietType}
    - Health Devices Used: ${data.useActionableDevices ? data.deviceTypes?.join(', ') : 'None'}

    Return the response in JSON format matching this structure:
    {
      "riskScore": number,
      "riskLevel": "Low" | "Medium" | "High",
      "summary": "string",
      "recommendations": ["string"],
      "suggestedScreenings": ["string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      ...result,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Gemini Assessment Error:", error);
    throw new Error("Failed to perform AI assessment. Please try again later.");
  }
}
