export type MessageType = "success" | "danger";

export interface Message {
  text: string;
  type: MessageType;
}