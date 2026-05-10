import { Link } from "react-router-dom";
import { loadTreeFromStorage } from "../features/fileTree/storage";

export default function TreePage() {
  const tree = loadTreeFromStorage();

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

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Tree loaded</h1>
        <p className="mt-2 text-sm text-slate-600">
          Root: <span className="font-semibold">{tree.name}</span>
        </p>
      </div>
    </main>
  );
}
