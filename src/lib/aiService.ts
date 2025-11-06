// Run prompt by selected model
export async function runPrompt(model: string, prompt: string) {
  switch (model) {
    case "openai":
      return await runPromptWithOpenAI(prompt);
    default:
      return "⚠️ Unsupported model.";
  }
}

// OpenAI integration 
export async function runPromptWithOpenAI(prompt: string) {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", 
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Failed to fetch AI response");
    return data.choices?.[0]?.message?.content || "No response.";
  } catch (err: any) {
    console.error("OpenAI error:", err);
    return "⚠️ Failed to fetch from OpenAI: " + err.message;
  }
}
