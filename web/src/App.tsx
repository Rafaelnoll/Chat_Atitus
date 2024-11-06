import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "./components/button";
import { Input } from "./components/input";
import { ScrollArea } from "./components/scroll-area";
import { Send, Paperclip, Menu, MessageCircleMore, LogOut } from "lucide-react";
import useSocketIo from "./hooks/useSocketIo";
import { FilePreview } from "./components/file-preview";
import { IMessage } from "./types/IMessage";
import { MessageBubble } from "./components/message-bubble";
import useUser from "./hooks/useUser";

interface SideBarOptions {
  id: number;
  name: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export default function App() {
  const { send, onMessage } = useSocketIo<IMessage>({
    url: "ws://localhost:5000",
  });

  const { user, logout } = useUser();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sidebarOption, setSidebarOptions] = useState("Chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const lastMessageRef = useRef<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sidebarOptions: SideBarOptions[] = [
    { id: 1, name: "Chat", icon: <MessageCircleMore size="18" /> },
    { id: 2, name: "Deslogar", icon: <LogOut size="18" />, onClick: logout },
  ];

  const handleSendMessage = async () => {
    const lastMessageElement = lastMessageRef.current;

    const newMessage: IMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: user?.name || "",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const fileData = data?.fileData || {};

      if (fileData) {
        newMessage.fileData = fileData;
      }
    }

    if (inputMessage.trim() !== "" || selectedFile) {
      send(newMessage);
      setSelectedFile(null);
      setInputMessage("");

      if (lastMessageElement) {
        lastMessageElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleOpenFilePicker = () => {
    const fileInput = fileInputRef.current;

    if (fileInput) {
      fileInput.click();
    }
  };

  const onUploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = event?.target?.files || [];

    if (file) {
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    onMessage((message) => {
      setMessages((prevState) => [...prevState, message]);
    });
  }, [onMessage]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-gray-950 text-white overflow-hidden`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Atitus Chat</h2>
          <nav className="space-y-2">
            {sidebarOptions.map((option) => (
              <button
                key={option.id}
                className={`w-full flex gap-x-2 text-left p-2 rounded-lg transition-colors ${
                  sidebarOption === option.name
                    ? "bg-indigo-700"
                    : "hover:bg-indigo-500"
                }`}
                onClick={option.onClick || undefined}
              >
                <span>{option.icon}</span> {option.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl text-slate-950 font-semibold">Chat</h1>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              currentUser={user?.name}
              message={message}
              {...(index === messages.length - 1
                ? { elementRef: lastMessageRef }
                : {})}
            />
          ))}
        </ScrollArea>

        {/* Message Input */}
        <div className="bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
          <div className="flex flex-col space-y-2">
            {selectedFile && (
              <FilePreview
                file={selectedFile}
                onRemove={() => setSelectedFile(null)}
              />
            )}

            <div className="flex items-end space-x-2">
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl p-2">
                <Input
                  type="text"
                  placeholder="Escreva uma mensagem..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  className="bg-transparent text-slate-900 border-none focus:ring-0 p-2"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleOpenFilePicker}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <input
                      onChange={onUploadFile}
                      ref={fileInputRef}
                      type="file"
                      className="opacity-0"
                    ></input>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
