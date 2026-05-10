import type { FlattenedNode, TreeNode } from "../types";

const buildPath = (parentPath: string | null, name: string): string =>
  parentPath ? `${parentPath}/${name}` : name;

export const searchNodesByName = (
  nodes: TreeNode[],
  query: string,
  parentPath: string | null = null
): Array<{ path: string; node: TreeNode }> => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const results: Array<{ path: string; node: TreeNode }> = [];

  for (const node of nodes) {
    const currentPath = buildPath(parentPath, node.name);

    if (node.name.toLowerCase().includes(normalized)) {
      results.push({ path: currentPath, node });
    }

    if (node.type === "folder" && node.children.length > 0) {
      results.push(...searchNodesByName(node.children, query, currentPath));
    }
  }

  return results;
};

export const flattenTree = (
  nodes: TreeNode[],
  depth = 0,
  parentId: string | null = null,
  parentPath: string | null = null,
  startOrder = 0
): FlattenedNode[] => {
  return nodes.reduce<FlattenedNode[]>((acc, node, index) => {
    const path = buildPath(parentPath, node.name);
    const id = path;
    const isFolder = node.type === "folder";
    const hasChildren = isFolder && node.children.length > 0;
    const order = startOrder + index;

    acc.push({
      id,
      path,
      name: node.name,
      type: node.type,
      depth,
      parentId,
      position: index,
      order,
      hasChildren,
      isOpen: isFolder ? Boolean(node.isOpen) : undefined,
      size: node.type === "file" ? node.size : undefined,
    });

    if (isFolder && node.isOpen && hasChildren) {
      const childrenFlat = flattenTree(
        node.children,
        depth + 1,
        id,
        path,
        order + 1
      );
      acc.push(...childrenFlat);
    }

    return acc;
  }, []);
};

export const toggleFolderByPath = (
  nodes: TreeNode[],
  targetPath: string,
  parentPath: string | null = null
): TreeNode[] => {
  return nodes.map((node) => {
    const currentPath = buildPath(parentPath, node.name);

    if (node.type !== "folder") {
      return node;
    }

    if (currentPath === targetPath) {
      return { ...node, isOpen: !node.isOpen };
    }

    return {
      ...node,
      children: toggleFolderByPath(node.children, targetPath, currentPath),
    };
  });
};

export const findNodeByPath = (
  nodes: TreeNode[],
  targetPath: string,
  parentPath: string | null = null
): TreeNode | null => {
  for (const node of nodes) {
    const currentPath = buildPath(parentPath, node.name);

    if (currentPath === targetPath) {
      return node;
    }

    if (node.type === "folder") {
      const found = findNodeByPath(node.children, targetPath, currentPath);
      if (found) return found;
    }
  }

  return null;
};

export const getFolderTotalSize = (node: TreeNode): number => {
  if (node.type === "file") return node.size;
  return node.children.reduce((sum, child) => sum + getFolderTotalSize(child), 0);
};

export const formatBytes = (size: number): string => {
  if (size < 1024) return `${size} B`;
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(kb >= 10 ? 0 : 1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
};
