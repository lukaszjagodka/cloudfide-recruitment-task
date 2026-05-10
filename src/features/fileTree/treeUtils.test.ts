import { describe, expect, it } from "vitest";
import { parseTreeFromJson } from "./parser";
import { flattenTree, formatBytes, getFolderTotalSize, searchNodesByName, toggleFolderByPath } from "./treeUtils";

const raw = `{
  "name": "root",
  "type": "folder",
  "children": [
    {
      "name": "src",
      "type": "folder",
      "children": [
        { "name": "index.ts", "type": "file", "size": 1024 },
        {
          "name": "components",
          "type": "folder",
          "children": [
            { "name": "Button.tsx", "type": "file", "size": 512 }
          ]
        }
      ]
    },
    { "name": "package.json", "type": "file", "size": 300 }
  ]
}`;

describe("fileTree utils", () => {
  it("parses valid json tree", () => {
    const tree = parseTreeFromJson(raw);
    expect(tree.type).toBe("folder");
    expect(tree.name).toBe("root");
  });

  it("flattens only visible nodes (respects isOpen)", () => {
    const tree = parseTreeFromJson(raw);
    const rows = flattenTree([tree]);
    expect(rows.length).toBeGreaterThan(1);
    expect(rows[0].path).toBe("root");
  });

it("toggles folder open state by path", () => {
  const tree = parseTreeFromJson(raw);

  const before = flattenTree([tree]).length;
  const onceToggled = toggleFolderByPath([tree], "root/src");
  const afterFirstToggle = flattenTree(onceToggled).length;
  const twiceToggled = toggleFolderByPath(onceToggled, "root/src");
  const afterSecondToggle = flattenTree(twiceToggled).length;

  expect(afterFirstToggle).not.toBe(before);
  expect(afterSecondToggle).toBe(before);
});

  it("calculates total folder size", () => {
    const tree = parseTreeFromJson(raw);
    expect(getFolderTotalSize(tree)).toBe(1836);
  });

  it("searches by name across the whole tree", () => {
    const tree = parseTreeFromJson(raw);
    const results = searchNodesByName([tree], "button");
    expect(results).toHaveLength(1);
    expect(results[0].path).toBe("root/src/components/Button.tsx");
  });

  it("formats bytes", () => {
    expect(formatBytes(300)).toBe("300 B");
    expect(formatBytes(1024)).toContain("KB");
  });
});
