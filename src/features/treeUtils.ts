import type { FlattenedNode, TreeNode } from "./types";

const joinPath = (parentPath: string | null, name: string): string =>
  parentPath ? `${parentPath}/${name}` : name;

export const flattenTree = (
  nodes: TreeNode[],
  depth = 0,
  parentId: string | null = null,
  parentPath: string | null = null,
  startOrder = 0
): FlattenedNode[] => {
  return nodes.reduce<FlattenedNode[]>((acc, node, index) => {
    const path = joinPath(parentPath, node.name);
    const id = path;
    const currentOrder = startOrder + index;
    const isFolder = node.type === "folder";
    const hasChildren = isFolder && node.children.length > 0;

    acc.push({
      id,
      name: node.name,
      type: node.type,
      depth,
      parentId,
      hasChildren,
      isOpen: isFolder ? Boolean(node.isOpen) : undefined,
      size: node.type === "file" ? node.size : undefined,
      path,
      order: currentOrder,
      position: index,
    });

    if (isFolder && node.isOpen && hasChildren) {
      const childrenFlat = flattenTree(
        node.children,
        depth + 1,
        id,
        path,
        currentOrder + 1
      );
      acc.push(...childrenFlat);
    }

    return acc;
  }, []);
};

export const toggleFolderById = (nodes: TreeNode[], id: string): TreeNode[] => {
  return nodes.map((node) => {
    const nodeId = node.name;
    if (node.type === "folder") {
      if (id === nodeId) {
        return { ...node, isOpen: !node.isOpen };
      }
      return {
        ...node,
        children: toggleFolderByIdWithParent(node.children, id, nodeId),
      };
    }
    return node;
  });
};

const toggleFolderByIdWithParent = (
  nodes: TreeNode[],
  id: string,
  parentPath: string
): TreeNode[] => {
  return nodes.map((node) => {
    const nodeId = `${parentPath}/${node.name}`;
    if (node.type === "folder") {
      if (id === nodeId) {
        return { ...node, isOpen: !node.isOpen };
      }
      return {
        ...node,
        children: toggleFolderByIdWithParent(node.children, id, nodeId),
      };
    }
    return node;
  });
};

export const findNodeByPath = (
  nodes: TreeNode[],
  targetPath: string,
  parentPath: string | null = null
): TreeNode | null => {
  for (const node of nodes) {
    const currentPath = joinPath(parentPath, node.name);
    if (currentPath === targetPath) return node;

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
