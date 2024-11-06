import { FileText } from "lucide-react";
import { Avatar, AvatarFallback } from "./avatar";
import { IMessage } from "../types/IMessage";
import { RefObject } from "react";

interface Props {
  message: IMessage;
  elementRef: RefObject<HTMLElement | null>;
  currentUser?: string;
}

export const MessageBubble = ({ message, currentUser, elementRef }: Props) => {
  const { name, type, url } = message?.fileData || {};

  const isImage = type?.startsWith("image/");
  const isVideo = type?.startsWith("video/");
  const isDocument = url && !isImage && !isVideo;

  return (
    <div className="mb-4" {...(elementRef ? { ref: elementRef } : {})}>
      <div className="flex items-start">
        <Avatar className="text-slate-950 shadow">
          <AvatarFallback>{message.sender[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 ml-2">
          <div className="flex items-center mb-1">
            <span className="font-semibold mr-2 text-slate-950">
              {message.sender}
            </span>
            <span className="text-xs text-gray-500">{message.timestamp}</span>
          </div>
          <div
            className={`p-3 rounded-2xl ${
              message.sender === currentUser
                ? "bg-indigo-100 dark:bg-indigo-900 ml-auto"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            {message.text && (
              <p className="mb-2 text-slate-900">{message.text}</p>
            )}
            {url && (
              <div className="mt-2 text-slate-950">
                {isImage && (
                  <img
                    src={url}
                    alt={name || "Image"}
                    className="max-w-full h-auto rounded-lg"
                  />
                )}
                {isVideo && (
                  <video controls className="max-w-full h-auto rounded-lg">
                    <source src={url} type={type} />
                    Seu browser não suporta a tag de video.
                  </video>
                )}
                {isDocument && (
                  <div className="flex items-center bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <FileText className="h-6 w-6 mr-2" />
                    <span className="text-sm">{name || "Document"}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
