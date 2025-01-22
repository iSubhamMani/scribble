import { UserType } from "./user";

export type ShareOption = "restricted" | "anyone";
export type PublicEditAccess = "all" | "none";

export type PrivateAccessListUser = {
  user: UserType;
  editAccess: boolean;
};

export interface Whiteboard {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  admin: string;
  shareOption: ShareOption;
  publicEditAccess: PublicEditAccess;
  privateAccessList: PrivateAccessListUser[];
}
