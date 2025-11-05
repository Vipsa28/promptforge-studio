import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ReactDiffViewer from "react-diff-viewer-continued";

interface Version {
  id: string;
  title: string;
  template: string;
  created_at: string;
}

export default function VersionHistory({ promptId, currentTemplate }: { promptId: string; currentTemplate: string }) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [selected, setSelected] = useState<Version | null>(null);

  useEffect(() => {
    const fetchVersions = async () => {
      const { data, error } = await supabase
        .from("prompt_versions")
        .select("*")
        .eq("prompt_id", promptId)
        .order("created_at", { ascending: false });
      if (!error) setVersions(data || []);
    };
    fetchVersions();
  }, [promptId]);

  return (
    <div className="mt-4">
      <h3 className="text-md font-semibold text-indigo-600 mb-2">🕒 Version History</h3>

      {versions.length === 0 ? (
        <p className="text-sm text-gray-500">No previous versions found.</p>
      ) : (
        <div className="space-y-2">
          {versions.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelected(v)}
              className="text-sm text-left w-full p-2 border rounded hover:bg-gray-100"
            >
              {v.title} — {new Date(v.created_at).toLocaleString()}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-4 border rounded p-4 bg-gray-50">
          <h4 className="font-semibold mb-2">Comparing Current ↔ Selected</h4>
          <ReactDiffViewer
            oldValue={selected.template}
            newValue={currentTemplate}
            splitView={true}
            leftTitle="Old Version"
            rightTitle="Current"
          />
        </div>
      )}
    </div>
  );
}
