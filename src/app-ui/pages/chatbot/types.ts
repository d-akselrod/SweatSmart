export enum ChatAuthor {
  System = 'system',
  User = 'user',
  Assistant = 'assistant',
}
export interface IChatMessage {
  role: ChatAuthor;
  content: string;
}
