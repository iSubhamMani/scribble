export interface Whiteboard {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  admin: string;
  isPublic: boolean;
  accessList: string[];
}
