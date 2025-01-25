import { Whiteboard } from "./Whiteboard";

export type ACLData = Pick<
  Whiteboard,
  "privateAccessList" | "publicEditAccess" | "shareOption"
>;
