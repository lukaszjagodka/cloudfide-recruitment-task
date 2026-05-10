import type { TreeNode } from "../types";

const TREE_KEY = "cloudfide.fileTree.data";
const SEARCH_KEY = "cloudfide.fileTree.search";

export const saveTreeToStorage = (tree: TreeNode): void => {
  localStorage.setItem(TREE_KEY, JSON.stringify(tree));
};

export const loadTreeFromStorage = (): TreeNode | null => {
  const raw = localStorage.getItem(TREE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as TreeNode;
  } catch {
    return null;
  }
};

export const saveSearchQuery = (query: string): void => {
  localStorage.setItem(SEARCH_KEY, query);
};

export const loadSearchQuery = (): string => {
  return localStorage.getItem(SEARCH_KEY) ?? "";
};
