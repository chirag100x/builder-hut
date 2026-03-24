"use client"
import { useState, useEffect, useRef } from 'react'
import { sendChatMessage, ChatMessage } from '@/lib/api'

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [projectContext, setProjectContext] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const formData = localStorage.getItem('buildatlas_form')
    if (formData) {
      try {
        const data = JSON.parse(formData)
        const summary = `${data.project_type} project, ${data.location_tier} city, ${data.total_area_sqft} sqft, ${data.num_floors} floors, ${data.structure_type} structure, ${data.material_quality} materials, ${data.num_workers} workers, ${data.site_condition} site`
        setProjectContext(summary)
      } catch (e) {
        setProjectContext('Unknown project context')
      }
    }

    setMessages([
      { role: 'assistant', content: "Hello! I'm your BuildAtlas AI assistant. Ask me anything about your construction project." }
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMsg = inputValue.trim()
    setInputValue('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const reply = await sendChatMessage(userMsg, projectContext)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the server." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-72px)] bg-gray-50 border-x border-gray-200">
      <div className="bg-white border-b p-4 shadow-sm z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">💬</span> BuildAtlas Assistant
        </h1>
        <p className="text-sm text-gray-500">Ask about timeline, resources, or budget</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-slate-800 shadow-sm rounded-bl-sm'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-sm p-4 flex gap-1 items-center h-12">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
