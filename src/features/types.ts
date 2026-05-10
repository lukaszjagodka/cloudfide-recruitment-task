export type NodeType = "file" | "folder";

export interface BaseNode {
  name: string;
  type: NodeType;
}

export interface FileNode extends BaseNode {
  type: "file";
  size: number;
}

export interface FolderNode extends BaseNode {
  type: "folder";
  children: TreeNode[];
  isOpen?: boolean;
}

export type TreeNode = FileNode | FolderNode;

export interface FlattenedNode {
  id: string;
  name: string;
  type: NodeType;
  depth: number;
  parentId: string | null;
  hasChildren: boolean;
  isOpen?: boolean;
  size?: number;
  path: string;
  order: number;
  position: number;
}
