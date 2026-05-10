import type { FileNode, FolderNode, TreeNode } from "../types";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseNode = (value: unknown, path = "root"): TreeNode => {
  if (!isObject(value)) {
    throw new Error(`Invalid node at ${path}: expected object`);
  }

  const { name, type } = value;

  if (typeof name !== "string" || !name.trim()) {
    throw new Error(`Invalid node at ${path}: "name" must be non-empty string`);
  }

  if (type !== "file" && type !== "folder") {
    throw new Error(`Invalid node "${name}" at ${path}: "type" must be "file" or "folder"`);
  }

  if (type === "file") {
    const size = value.size;
    if (typeof size !== "number" || Number.isNaN(size) || size < 0) {
      throw new Error(`Invalid file "${name}" at ${path}: "size" must be >= 0`);
    }

    const fileNode: FileNode = { name, type: "file", size };
    return fileNode;
  }

  const children = value.children;
  if (!Array.isArray(children)) {
    throw new Error(`Invalid folder "${name}" at ${path}: "children" must be array`);
  }

  const folderNode: FolderNode = {
    name,
    type: "folder",
    isOpen: path === "root",
    children: children.map((child, index) => parseNode(child, `${path}/${name}[${index}]`)),
  };

  return folderNode;
};

export const parseTreeFromJson = (input: string): TreeNode => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(input);
  } catch {
    throw new Error("Invalid JSON format");
  }

  return parseNode(parsed);
};
