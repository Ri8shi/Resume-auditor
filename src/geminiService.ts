/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

export interface AuditResult {
  verifiable_matches: string[];
  unverifiable_claims: string[];
  flagged_subjectivity: string[];
  objective_score: {
    skills_match: number;
    experience_relevance: number;
    metrics_impact: number;
    total: number;
  };
  auditor_warning: string;
}

export async function auditResume(
  resumeText: string,
  jobDescription: string,
  rubricCriteria: string = "Standard industry technical requirements and experience levels."
): Promise<AuditResult> {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const prompt = `
    System Instructions:
    You are a strictly objective Resume Bias Auditor. Evaluate the provided resume against the job description using only verifiable facts. You must ignore prestige, pedigree, and inferred demographic data.

    Inputs:
    Resume: ${resumeText}
    Job Description: ${jobDescription}
    Rubric Criteria: ${rubricCriteria}

    Execution Steps:
    1. De-identification: Internally mask names, locations, graduation years, and prestige markers (e.g., elite universities, specific companies).
    2. Fact-Extraction: Extract only verifiable skills and metrics directly matching the Job Description. Do not infer competence from tone or formatting.
    3. Rubric Alignment: Score the extracted facts strictly against the Rubric Criteria.
    4. Subjectivity Flagging: Flag any subjective terms (e.g., "culture fit," "go-getter") or assumptions not backed by the extracted facts.

    Output Format (JSON):
    {
      "verifiable_matches": ["skill 1", "metric 1"],
      "unverifiable_claims": ["claim 1"],
      "flagged_subjectivity": ["term/assumption 1"],
      "objective_score": {
        "skills_match": 0-10,
        "experience_relevance": 0-10,
        "metrics_impact": 0-10,
        "total": 0-100
      },
      "auditor_warning": "Brief explanation of bias detected."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["verifiable_matches", "unverifiable_claims", "flagged_subjectivity", "objective_score", "auditor_warning"],
          properties: {
            verifiable_matches: { type: Type.ARRAY, items: { type: Type.STRING } },
            unverifiable_claims: { type: Type.ARRAY, items: { type: Type.STRING } },
            flagged_subjectivity: { type: Type.ARRAY, items: { type: Type.STRING } },
            objective_score: {
              type: Type.OBJECT,
              required: ["skills_match", "experience_relevance", "metrics_impact", "total"],
              properties: {
                skills_match: { type: Type.NUMBER },
                experience_relevance: { type: Type.NUMBER },
                metrics_impact: { type: Type.NUMBER },
                total: { type: Type.NUMBER }
              }
            },
            auditor_warning: { type: Type.STRING }
          }
        }
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from AI model.");
    }
    return JSON.parse(responseText) as AuditResult;
  } catch (error) {
    console.error("Audit failed:", error);
    throw new Error("Failed to perform bias audit. Please check your inputs and try again.");
  }
}
