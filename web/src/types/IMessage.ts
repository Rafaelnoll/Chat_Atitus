export interface IMessage {
    id: number
    text: string
    sender: string
    timestamp: string
    fileData?: {
        url: string;
        type: string;
        name: string;
    }
  }