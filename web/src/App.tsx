import { useRef, useState } from 'react'
import { Button } from "./components/button"
import { Input } from "./components/input"
import { ScrollArea } from "./components/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "./components/avatar"
import { Separator } from "./components/separator"
import { Bold, Italic, List, Send, Smile, Paperclip, Menu } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: string
  timestamp: string
}

interface Channel {
  id: number
  name: string
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello team! How's the project coming along?", sender: 'John Doe', timestamp: '10:30 AM' },
    { id: 2, text: "We're making good progress. The design phase is almost complete.", sender: 'Jane Smith', timestamp: '10:32 AM' },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [currentChannel, setCurrentChannel] = useState('General')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const lastMessageRef = useRef<HTMLElement | null>(null);

  const channels: Channel[] = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Project Alpha' },
    { id: 3, name: 'Random' },
  ]

  const handleSendMessage = () => {
    const lastMessageElement = lastMessageRef.current;

    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages([...messages, newMessage])
      setInputMessage('')

      if(lastMessageElement){
        lastMessageElement.scrollIntoView({ behavior: 'smooth' });
      }

    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-950 text-white overflow-hidden`}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Atitus Chat</h2>
          <nav className="space-y-2">
            {channels.map((channel) => (
              <button
                key={channel.id}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  currentChannel === channel.name ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                }`}
                onClick={() => setCurrentChannel(channel.name)}
              >
                # {channel.name}
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
          <h1 className="text-xl text-slate-950 font-semibold">#{currentChannel}</h1>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {messages.map((message, index) => (
            <div key={message.id} className="mb-4" {...(index === messages.length - 1 ? { ref: lastMessageRef } : {})}>
              <div className="flex items-start">
                <Avatar className="w-8 h-8 mr-2 text-slate-900 shadow">
                  <AvatarFallback>{message.sender[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold mr-2 text-slate-950">{message.sender}</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <div className={`p-3 rounded-2xl ${message.sender === 'You' ? 'bg-indigo-100 dark:bg-indigo-900 text-slate-950 ml-auto' : 'bg-gray-100 text-slate-950 dark:bg-gray-700'}`}>
                    <p>{message.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Message Input */}
        <div className="bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
          <div className="flex items-end space-x-2">
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl p-2">
              <Input
                type="text"
                placeholder="Escreva uma mensagem..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage()
                  }
                }}
                className="bg-transparent text-slate-900 border-none focus:ring-0 p-2"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleSendMessage} size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}