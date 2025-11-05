import { useState } from "react";
import OpenAI from "openai";
import * as Diff2Html from "diff2html";
import { createTwoFilesPatch } from "diff";
import "diff2html/bundles/css/diff2html.min.css";
import toast from "react-hot-toast";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function MultiModelRunner() {
  const [prompt, setPrompt] = useState("");
  const [model1, setModel1] = useState("gpt-4o-mini");
  const [model2, setModel2] = useState("gpt-4-turbo");
  const [output1, setOutput1] = useState<string>("");
  const [output2, setOutput2] = useState<string>("");
  const [diffHtml, setDiffHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!prompt.trim()) return toast.error("Please enter a prompt.");
    setLoading(true);
    setOutput1("");
    setOutput2("");
    setDiffHtml("");

    try {
      const [res1, res2] = await Promise.all([
        openai.chat.completions.create({
          model: model1,
          messages: [{ role: "user", content: prompt }],
        }),
        openai.chat.completions.create({
          model: model2,
          messages: [{ role: "user", content: prompt }],
        }),
      ]);

      const text1 = res1.choices[0]?.message?.content || "";
      const text2 = res2.choices[0]?.message?.content || "";
      setOutput1(text1);
      setOutput2(text2);

      // 🧠 Generate visual diff
      const diff = createTwoFilesPatch(model1, model2, text1, text2);
      const html = Diff2Html.getPrettyHtml(diff, {
        inputFormat: "diff",
        showFiles: false,
        matching: "lines",
        outputFormat: "side-by-side",
      });
      setDiffHtml(html);
      toast.success("✅ Comparison complete!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch responses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-xl shadow transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">
        🧠 Compare Model Outputs (OpenAI)
      </h2>

      {/* 🧭 Input Area */}
      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          rows={4}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
        />

        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={model1}
            onChange={(e) => setModel1(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="gpt-4o-mini">GPT-4o-mini</option>
            <option value="gpt-4-turbo">GPT-4-turbo</option>
          </select>

          <select
            value={model2}
            onChange={(e) => setModel2(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="gpt-4-turbo">GPT-4-turbo</option>
            <option value="gpt-4o-mini">GPT-4o-mini</option>
          </select>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Comparing..." : "Compare Models"}
          </button>
        </div>
      </div>

      {/* 🧩 Model Outputs */}
      {(output1 || output2) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Output 1 */}
          <div className="relative bg-gray-50 border p-4 rounded-lg">
            <h3 className="font-semibold text-indigo-600 mb-2">{model1}</h3>
            <div className="relative">
              <pre className="whitespace-pre-wrap text-gray-800">{output1}</pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output1);
                  toast.success("Copied GPT-4o-mini output!");
                }}
                className="absolute top-0 right-0 mt-2 mr-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Output 2 */}
          <div className="relative bg-gray-50 border p-4 rounded-lg">
            <h3 className="font-semibold text-indigo-600 mb-2">{model2}</h3>
            <div className="relative">
              <pre className="whitespace-pre-wrap text-gray-800">{output2}</pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output2);
                  toast.success("Copied GPT-4-turbo output!");
                }}
                className="absolute top-0 right-0 mt-2 mr-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧩 Diff Viewer */}
      {diffHtml && (
        <div
          className="diff-output mt-10 overflow-auto border rounded-lg"
          dangerouslySetInnerHTML={{ __html: diffHtml }}
        />
      )}
    </div>
  );
}
