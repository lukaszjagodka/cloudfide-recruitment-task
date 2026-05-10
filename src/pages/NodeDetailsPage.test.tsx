import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import NodeDetailsPage from "./NodeDetailsPage";

afterEach(() => {
  cleanup();
});

const tree = {
  name: "root",
  type: "folder",
  children: [
    {
      name: "src",
      type: "folder",
      children: [
        { name: "index.ts", type: "file", size: 1024 },
        { name: "Button.tsx", type: "file", size: 512 },
      ],
    },
    { name: "package.json", type: "file", size: 300 },
  ],
};

describe("NodeDetailsPage (folder)", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("cloudfide.fileTree.data", JSON.stringify(tree));
  });

  it("shows total subtree size for folder", () => {
    render(
      <MemoryRouter initialEntries={["/tree/root%2Fsrc"]}>
        <Routes>
          <Route path="/tree/:nodePath" element={<NodeDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Total subtree size/i)).toBeInTheDocument();
    expect(screen.getByText(/1\.5 KB|2 KB|1536 B/i)).toBeInTheDocument();
  });

  it("renders children list with links", () => {
    render(
      <MemoryRouter initialEntries={["/tree/root%2Fsrc"]}>
        <Routes>
          <Route path="/tree/:nodePath" element={<NodeDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    const indexLink = screen.getByRole("link", { name: /index\.ts/i });
    const buttonLink = screen.getByRole("link", { name: /Button\.tsx/i });

    expect(indexLink).toHaveAttribute("href", "/tree/root%2Fsrc%2Findex.ts");
    expect(buttonLink).toHaveAttribute("href", "/tree/root%2Fsrc%2FButton.tsx");
  });
});
