import axios from "axios";

export const rewriteBlogWithLLM = async (
  originalContent,
  scrapedContents,
  referenceUrls
) => {
  // Use Gemini 1.5 Flash for high speed and generous free tier limits
  const API_KEY = process.env.GEMINI_API_KEY;
  const MODEL = "gemini-2.5-flash"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  const prompt = `
    You are a professional content editor. Rewrite the following article to be more engaging, clear, and professional.
    
    RULES:
    - Use Markdown formatting (Headings, Bold text).
    - Use bullet points for readability.
    - Maintain the original core message but improve the vocabulary.
    - Add a "References" section at the end listing the provided URLs.

    ORIGINAL CONTENT:
    ${originalContent}

    ADDITIONAL RESEARCH CONTEXT:
    ${scrapedContents.join("\n\n")}

    REFERENCE URLS:
    ${referenceUrls.join("\n")}
  `;

  try {
    console.log(` 🤖 Sending request to Gemini API (${MODEL})...`);

    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 120000
      }
    );

    // Gemini's response structure is nested: candidates[0].content.parts[0].text
    const output = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output || output.length < 100) {
      throw new Error("Gemini generated content was empty or too short.");
    }

    return output;

  } catch (err) {
    const errorMsg = err.response?.data?.error?.message || err.message || "Gemini API failed";
    console.error("❌ Gemini Error:", errorMsg);
    throw new Error(errorMsg);
  }
};