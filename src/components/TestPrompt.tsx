import { useState } from "react";
import { runPromptWithOpenAI } from "../lib/aiService";

export default function TestPrompt() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("⏳ Running your prompt...");
    try {
      const result = await runPromptWithOpenAI(input);
      setResponse(result);
    } catch (err: any) {
      setResponse("⚠️ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center text-indigo-600">
        🤖 Test Prompt with OpenAI
      </h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={5}
        placeholder="Type your prompt here..."
        className="w-full p-2 border rounded resize-none"
      />

      <button
        onClick={handleRun}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Running..." : "Run Prompt"}
      </button>

      <div className="bg-gray-50 p-4 rounded text-gray-800 whitespace-pre-wrap min-h-[100px]">
        {response}
      </div>
    </div>
  );
}
