import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import VersionHistory from "./VersionHistory";
import toast from "react-hot-toast";

interface Prompt {
  id: string;
  title: string;
  template: string;
  created_at: string;
}

export default function PromptList() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // 🧠 Fetch prompts for current user
  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else {
      setPrompts(data || []);
      setFilteredPrompts(data || []);
    }
    setLoading(false);
  };

  // 🧩 Filter + Sort logic (debounced)
  useEffect(() => {
    const delay = setTimeout(() => {
      let result = [...prompts];

      if (search.trim()) {
        const query = search.toLowerCase();
        result = result.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.template.toLowerCase().includes(query)
        );
      }

      if (sortOrder === "a-z") {
        result.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortOrder === "z-a") {
        result.sort((a, b) => b.title.localeCompare(a.title));
      } else if (sortOrder === "oldest") {
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else {
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      setFilteredPrompts(result);
    }, 200);

    return () => clearTimeout(delay);
  }, [search, sortOrder, prompts]);

  // 🗑️ Delete prompt (with toast)
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("prompts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("🗑️ Prompt deleted successfully!");
      setPrompts(prompts.filter((p) => p.id !== id));
    }
  };

  // ✏️ Update + Save version (with toast)
  const handleUpdate = async () => {
    if (!editingPrompt) return;

    const { data: existing } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", editingPrompt.id)
      .single();

    if (existing) {
      await supabase.from("prompt_versions").insert([
        {
          prompt_id: existing.id,
          user_id: existing.user_id,
          title: existing.title,
          template: existing.template,
        },
      ]);
    }

    const { error } = await supabase
      .from("prompts")
      .update({
        title: editingPrompt.title,
        template: editingPrompt.template,
      })
      .eq("id", editingPrompt.id);

    if (error) toast.error(error.message);
    else {
      toast.success("✅ Prompt updated and version saved!");
      setEditingPrompt(null);
      fetchPrompts();
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-4">Loading prompts...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-0">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center sm:text-left">
        📜 My Prompts
      </h2>

      {/* 🔍 Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="newest">Newest → Oldest</option>
          <option value="oldest">Oldest → Newest</option>
          <option value="a-z">A → Z</option>
          <option value="z-a">Z → A</option>
        </select>
      </div>

      {filteredPrompts.length === 0 ? (
        <p className="text-gray-500 text-center">
          No prompts found matching your search.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {filteredPrompts.map((p) => (
            <div
              key={p.id}
              className="bg-white p-5 rounded-2xl shadow-sm card-hover fade-in border border-gray-100"
            >
              {editingPrompt?.id === p.id ? (
                // ✏️ Edit Mode
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingPrompt.title}
                    onChange={(e) =>
                      setEditingPrompt({ ...editingPrompt, title: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    value={editingPrompt.template}
                    onChange={(e) =>
                      setEditingPrompt({
                        ...editingPrompt,
                        template: e.target.value,
                      })
                    }
                    rows={5}
                    className="w-full p-2 border rounded resize-none"
                  />
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPrompt(null)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // 💬 View Mode
                <>
                  <h3 className="text-lg font-semibold text-indigo-600">
                    {p.title}
                  </h3>
                  <p className="text-gray-700 mt-2 whitespace-pre-wrap leading-relaxed">
                    {p.template}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    Created on {new Date(p.created_at).toLocaleString()}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => setEditingPrompt(p)}
                      className="bg-yellow-500 text-white px-3 py-1.5 rounded hover:bg-yellow-600 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </div>

                  {/* 🕒 Version History */}
                  <VersionHistory
                    promptId={p.id}
                    currentTemplate={p.template}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
