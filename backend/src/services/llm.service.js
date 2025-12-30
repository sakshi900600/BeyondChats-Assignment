import { GoogleGenerativeAI } from "@google/generative-ai";

export const rewriteBlogWithGemini = async (originalContent, referenceUrls) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("❌ GEMINI_API_KEY missing");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const prompt = `
Rewrite the blog professionally.
Use references.
Add headings, bullets.
Cite references at the end.

CONTENT:
${originalContent}

REFERENCES:
${referenceUrls.join("\n")}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
