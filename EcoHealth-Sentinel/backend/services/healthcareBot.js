import { openai, genAI } from "./aiClient.js";

export const healthcareBot = async (message) => {
  try {

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const geminiResult = await model.generateContent(
      `You are a responsible healthcare assistant. Provide clear, safe responses.
      User: ${message}`
    );

    const geminiResponse = geminiResult.response.text();
    if (geminiResponse && geminiResponse.trim() !== "") {
      return geminiResponse;
    }


    const openaiResult = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a responsible healthcare assistant. Always prioritize safety and clarity.",
        },
        { role: "user", content: message },
      ],
    });

    return openaiResult.choices[0].message.content;
  } catch (err) {
    console.error("HealthcareBot Error:", err);


    return "Sorry, I couldn't fetch healthcare advice at this time.";
  }
};
