# LLM Implementation Guide (Future Phase)

This guide outlines exactly how to replace the current "Mock JSON" resume parsing system with a real Large Language Model (LLM) when you are ready to implement it.

## 1. Prerequisites

Before writing the code, you will need:
1. An account with an LLM provider (e.g., Google Gemini, OpenAI, or Anthropic).
2. An API Key from that provider.
3. Add the API Key to your `.env` file (e.g., `GEMINI_API_KEY=your_key_here`).

*Recommendation: Use **Gemini 1.5 Flash** or **GPT-4o-mini**. They are incredibly fast (usually returning JSON in 3-5 seconds), very cheap, and highly capable of structuring text.*

## 2. The Dependency

Depending on your provider, you will need to install their SDK. For this example, we will assume you are using Google Gemini:

```bash
npm install @google/genai
```

## 3. The Prompt Engineering (Crucial)

To ensure the LLM always returns a perfect JSON object that your frontend form can auto-fill (without random conversational text like "Here is your JSON:"), you must explicitly define the JSON structure in the prompt.

**Example Prompt Template:**
```text
You are an expert resume data extractor. 
I will provide you with the raw text extracted from a PDF resume.
Your job is to read the text and extract the data into a STRICT JSON format.
Do NOT include any markdown formatting, backticks, or conversational text. Return ONLY the JSON object.

The JSON MUST follow this exact structure:
{
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "github": "string (optional)",
    "linkedin": "string (optional)"
  },
  "summary": "string (a short 2-3 sentence summary of the candidate)",
  "skills": ["string", "string"],
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "string (YYYY-MM)",
      "endDate": "string (YYYY-MM or Present)",
      "description": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string"
    }
  ]
}

Here is the raw resume text:
[INSERT RAW TEXT HERE]
```

## 4. How to Update `resume.controller.ts`

When you are ready, go to `src/controllers/resume.controller.ts` and replace the `mockParsedData` section with the actual LLM call.

Here is an example using the `@google/genai` SDK:

```typescript
import { GoogleGenAI } from '@google/genai';

// Initialize the client (Put this outside the controller function)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const parseResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ error: { message: 'No file uploaded' } });

    // 1. Extract raw text (Already implemented)
    const pdfData = await pdf(req.file.buffer);
    const rawText = pdfData.text;

    // 2. Call the LLM
    const prompt = `... (Insert the prompt template from above, replacing [INSERT RAW TEXT HERE] with the rawText variable) ...`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Force the model to output JSON
        responseMimeType: "application/json", 
      }
    });

    const llmOutput = response.text();

    // 3. Safely parse the JSON string back into a JavaScript object
    let finalParsedData;
    try {
      finalParsedData = JSON.parse(llmOutput);
    } catch (e) {
      console.error("LLM returned invalid JSON:", llmOutput);
      return res.status(500).json({ error: { message: 'AI parsing failed. Please try again or fill manually.' } });
    }

    // 4. Return to frontend
    return res.status(200).json({
      message: 'Resume parsed successfully via AI',
      data: finalParsedData,
    });

  } catch (error) {
    next(error);
  }
};
```

## 5. Security & Edge Cases to Handle

1. **Large Resumes:** Very large PDFs might exceed the LLM's token limit (though Gemini has a massive context window, so this is rare). You might want to slice the `rawText` to a maximum character count before sending it.
2. **Hallucinations:** The LLM might guess information if it's missing from the resume. This is exactly why the frontend Form step exists—so the user can review and correct the AI's work before saving it to the database!
