import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function PromptForm() {
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in to save prompts.");
      return;
    }

    const { error } = await supabase.from("prompts").insert([
      {
        user_id: user.id,
        title,
        template,
      },
    ]);

    if (error) setMessage(error.message);
    else {
      setMessage("✅ Prompt saved successfully!");
      setTitle("");
      setTemplate("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow space-y-4 mt-10"
    >
      <h2 className="text-2xl font-bold text-center text-indigo-600">
        🧠 Create New Prompt
      </h2>

      <input
        type="text"
        placeholder="Enter Prompt Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        placeholder="Enter your prompt here..."
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        rows={6}
        className="w-full p-2 border rounded resize-none"
        required
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
      >
        Save Prompt
      </button>

      {message && <p className="text-center text-gray-600">{message}</p>}
    </form>
  );
}
