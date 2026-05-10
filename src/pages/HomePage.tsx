import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { sampleInputJson } from "../features/fileTree/sampleInput.json";

export default function HomePage() {
  const [rawJson, setRawJson] = useState(sampleInputJson);
  const [error, setError] = useState<string>("");
  const [preview, setPreview] = useState<string>("");

  const canSubmit = useMemo(() => rawJson.trim().length > 0, [rawJson]);

  const handleLoad = () => {
    setError("");
    setPreview("");

    try {
      const parsed = JSON.parse(rawJson) as unknown;
      console.log("Parsed JSON:", parsed);
      setPreview(JSON.stringify(parsed, null, 2));
    } catch {
      setError("Invalid JSON. Please fix input and try again.");
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setRawJson(text);
    setError("");
    setPreview("");
  };

return (
  <main className="min-h-screen bg-slate-50 text-slate-900">
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">FileTree Explorer</h1>
        <p className="mt-2 text-sm text-slate-600">
          Paste JSON or upload a .json file.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <label htmlFor="json-input" className="mb-2 block text-sm font-medium">
            Input JSON
          </label>
          <textarea
            id="json-input"
            className="h-80 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm outline-none focus:border-blue-500"
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLoad}
              disabled={!canSubmit}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Load JSON
            </button>

            <label className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100">
              Upload file
              <input
                type="file"
                accept="application/json,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Parsed preview</h2>
          <pre className="h-80 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
            {preview || "No parsed data yet."}
          </pre>
        </div>
      </div>
    </div>
  </main>
);
}
