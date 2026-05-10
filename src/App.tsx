import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NodeDetailsPage from "./pages/NodeDetailsPage";
import TreePage from "./pages/TreePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tree" element={<TreePage />} />
      <Route path="/tree/:nodePath" element={<NodeDetailsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
