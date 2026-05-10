import { Link, useParams } from "react-router-dom";
import { loadTreeFromStorage } from "../features/fileTree/storage";
import { findNodeByPath, formatBytes, getFolderTotalSize } from "../features/fileTree/treeUtils";
import type { TreeNode } from "../features/fileTree/types";

export default function NodeDetailsPage() {
  const { nodePath } = useParams<{ nodePath: string }>();

  const tree = loadTreeFromStorage();
  const decodedPath = decodeURIComponent(nodePath ?? "");

  if (!tree) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">No tree loaded yet.</p>
          <Link to="/" className="mt-3 inline-block text-sm font-medium text-blue-600">
            Go back to Home
          </Link>
        </div>
      </main>
    );
  }

  const node = findNodeByPath([tree], decodedPath);

  if (!node) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Node not found</h1>
          <p className="mt-2 text-sm text-slate-600">Path does not exist in current tree.</p>
          <Link to="/tree" className="mt-4 inline-block text-sm font-medium text-blue-600">
            Back to tree
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Node details</h1>
          <Link to="/tree" className="text-sm font-medium text-blue-600">
            Back to tree
          </Link>
        </div>

        <dl className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-4 text-sm md:grid-cols-[220px_1fr]">
          <dt className="font-semibold text-slate-700">Name</dt>
          <dd className="text-slate-900">{node.name}</dd>

          <dt className="font-semibold text-slate-700">Type</dt>
          <dd className="text-slate-900">{node.type}</dd>

          <dt className="font-semibold text-slate-700">Full path</dt>
          <dd className="break-all text-slate-900">{decodedPath}</dd>

          {node.type === "file" ? (
            <>
              <dt className="font-semibold text-slate-700">Size</dt>
              <dd className="text-slate-900">{formatBytes(node.size)}</dd>
            </>
          ) : (
            <>
              <dt className="font-semibold text-slate-700">Direct children</dt>
              <dd className="text-slate-900">{node.children.length}</dd>

              <dt className="font-semibold text-slate-700">Total subtree size</dt>
              <dd className="text-slate-900">{formatBytes(getFolderTotalSize(node))}</dd>
            </>
          )}
        </dl>

        {node.type === "folder" ? (
          <section className="mt-6">
            <h2 className="mb-2 text-lg font-semibold text-slate-900">Children</h2>

            {node.children.length === 0 ? (
              <p className="text-sm text-slate-600">Folder is empty.</p>
            ) : (
              <ul className="space-y-2">
                {node.children.map((child: TreeNode) => {
                  const childPath = `${decodedPath}/${child.name}`;
                  return (
                    <li
                      key={childPath}
                      className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                    >
                      <Link
                        to={`/tree/${encodeURIComponent(childPath)}`}
                        className="text-sm text-slate-800 hover:text-blue-600 hover:underline"
                      >
                        {child.type === "folder" ? "📁 " : "📄 "}
                        {child.name}
                      </Link>
                      <span className="text-xs text-slate-500">
                        {child.type === "file"
                          ? formatBytes(child.size)
                          : `${child.children.length} children`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ) : null}
      </div>
    </main>
  );
}
