export interface Variable {
  id: string;
  name: string;
  tags: string[];
  selectedTag?: string;
  separator?: string;
  isLocked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  variables: Variable[];
}

export interface Connector {
  id: string;
  value: string;
}

export interface Template {
  name: string;
  items: (Variable | Connector)[];
}

export type DragItem = {
  type: 'VARIABLE';
  id: string;
  index: number;
};