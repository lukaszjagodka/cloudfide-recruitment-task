import type { TreeNode } from "./types";

export const sampleTree: TreeNode = {
  name: "root",
  type: "folder",
  isOpen: true,
  children: [
    {
      name: "src",
      type: "folder",
      isOpen: true,
      children: [
        { name: "index.ts", type: "file", size: 1024 },
        {
          name: "components",
          type: "folder",
          isOpen: true,
          children: [{ name: "Button.tsx", type: "file", size: 512 }],
        },
      ],
    },
    { name: "package.json", type: "file", size: 300 },
  ],
};
