import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  loadSearchQueryFromStorage,
  loadTreeFromStorage,
  saveSearchQueryToStorage,
  saveTreeToStorage,
} from "../features/fileTree/storage";
import {
  flattenTree,
  formatBytes,
  searchNodesByName,
  toggleFolderByPath,
} from "../features/fileTree/treeUtils";
import type { TreeNode } from "../features/fileTree/types";

export default function TreePage() {
  const [tree, setTree] = useState<TreeNode | null>(() => loadTreeFromStorage());
  const [query, setQuery] = useState(() => loadSearchQueryFromStorage());

  const searchResults = useMemo(() => {
    if (!tree) return [];
    return searchNodesByName([tree], query);
  }, [tree, query]);

  const rootNodes = useMemo(() => (tree ? [tree] : []), [tree]);
  const rows = useMemo(() => flattenTree(rootNodes), [rootNodes]);

  const handleToggleFolder = (path: string) => {
    if (!tree || tree.type !== "folder") return;

    const nextRoot = toggleFolderByPath([tree], path)[0];
    setTree(nextRoot);
    saveTreeToStorage(nextRoot);
  };

  if (!tree) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">No tree loaded yet.</p>
          <Link to="/" className="mt-3 inline-block text-sm font-medium text-blue-600">
            Go back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Tree view</h1>
          <Link to="/" className="text-sm font-medium text-blue-600">
            Change JSON source
          </Link>
        </div>

        <div className="mb-4">
          <label htmlFor="search" className="mb-2 block text-sm font-medium text-slate-700">
            Search by name
          </label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => {
              const next = e.target.value;
              setQuery(next);
              saveSearchQueryToStorage(next);
            }}
            placeholder="e.g. Button.tsx"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {query.trim() ? (
          <section className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-800">
              Search results ({searchResults.length})
            </h2>

            {searchResults.length === 0 ? (
              <p className="text-sm text-slate-600">No matches found.</p>
            ) : (
              <ul className="space-y-1">
                {searchResults.map((result) => (
                  <li key={result.path}>
                    <Link
                      to={`/tree/${encodeURIComponent(result.path)}`}
                      className="text-sm text-blue-700 hover:underline"
                    >
                      {result.path}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}

        <ul className="space-y-1">
          {rows.map((item) => {
            const isFolder = item.type === "folder";
            const encodedPath = encodeURIComponent(item.path);

            return (
              <li key={item.id}>
                <div
                  className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-slate-100"
                  style={{ paddingLeft: `${item.depth * 20 + 8}px` }}
                >
                  {isFolder ? (
                    <button
                      type="button"
                      onClick={() => handleToggleFolder(item.path)}
                      className="w-5 text-left text-slate-700"
                      aria-label={item.isOpen ? `Collapse ${item.name}` : `Expand ${item.name}`}
                    >
                      {item.hasChildren ? (item.isOpen ? "▾" : "▸") : "•"}
                    </button>
                  ) : (
                    <span className="w-5 text-slate-400">•</span>
                  )}

                  <span>{isFolder ? "📁" : "📄"}</span>

                  <Link
                    to={`/tree/${encodedPath}`}
                    className="text-sm text-slate-800 hover:text-blue-600 hover:underline"
                  >
                    {item.name}
                  </Link>

                  <span className="ml-auto text-xs text-slate-500">
                    {isFolder ? (item.hasChildren ? "folder" : "empty folder") : formatBytes(item.size ?? 0)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
