"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Search, MoreVertical, Paperclip, Smile, UserCircle, FileText, X, RefreshCw } from "lucide-react";
import { chatService, ChatConversation, ChatMessage } from "@/services/chat.service";
import { webSocketService } from "@/services/websocket.service";
import { authService } from "@/services/auth.service";
import { hotelService } from "@/services/hotel.service";
import { toast } from "react-hot-toast";
import Loading from "@/components/ui/Loading";

type StatusFilter = "active" | "closed" | "archived";

/** Safely extract a string from any message shape the backend might send */
const extractText = (raw: any): string => {
  if (typeof raw === "string") return raw;
  if (typeof raw?.text === "string") return raw.text;
  if (typeof raw?.message === "string") return raw.message;
  if (typeof raw?.message?.text === "string") return raw.message.text;
  return "";
};

export default function ChatsPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch conversation list
  const fetchConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      const response = await chatService.getConversations(statusFilter);
      const results = (response.results || []).map(c => ({
        ...c,
        last_message: extractText(c.last_message),
      }));
      setConversations(results);
    } catch (err: any) {
      if (err?.message !== "Resource not found") {
        toast.error("Failed to load conversations");
      }
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, [statusFilter]);

  // Fetch messages for a specific chat
  const fetchMessages = useCallback(async (chat: ChatConversation) => {
    try {
      setLoadingMessages(true);
      const response = await chatService.getMessages(chat.id);
      const results = (response.results || []).map((m: any) => ({
        ...m,
        message: extractText(m.message),
      }));
      setMessages(results);
      // After fetching, clear the unread count locally
      setConversations(prev =>
        prev.map(c => c.id === chat.id ? { ...c, unread_count: 0 } : c)
      );
    } catch (err: any) {
      toast.error("Failed to load messages");
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscribe to chat-specific WebSocket room when a chat is selected
  useEffect(() => {
    if (!selectedChat) return;
    webSocketService.subscribe("subscribe_chat", selectedChat.id);
  }, [selectedChat]);

  // Fetch hotel ID on mount
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const hotel = await hotelService.getMyHotel();
        if (hotel?.id) {
          setHotelId(hotel.id);
        }
      } catch (err) {
        console.error("Failed to fetch hotel data:", err);
      }
    };
    fetchHotel();
  }, []);

  // Note: Global subscription to 'subscribe_hotel_reception' is now handled 
  // by NotificationProvider to ensure it persists across the entire app.

  // Listen for real-time new messages
  useEffect(() => {
    const removeListener = webSocketService.addListener((payload: any) => {
      if (payload.type === "reception_alert") {
        // New chat incoming elsewhere in the hotel
        fetchConversations();
        const alertMsg = payload.message?.text || "New incoming chat";
        toast(alertMsg, { icon: "🔔" });
        return;
      }

      if (payload.type === "new_chat_message") {
        const msg = payload.message;

        // CRITICAL: Only handle if sender is customer (to avoid double-rendering staff replies)
        // Normalize to lowercase for resilient matching
        if (msg.sender_type?.toLowerCase() !== "customer") return;

        // Append to messages if this chat is open
        if (selectedChat && msg.chat_id === selectedChat.id) {
          const newMessage: ChatMessage = {
            id: msg.message_id,
            chat_id: msg.chat_id,
            sender_type: msg.sender_type,
            sender_name: msg.sender_name,
            message: extractText(msg.message),
            created_at: msg.created_at,
          };
          setMessages(prev => [...prev, newMessage]);
        } else {
          // Not the current chat — bump unread count and refresh list
          setConversations(prev =>
            prev.map(c => c.id === msg.chat_id
              ? { ...c, unread_count: (c.unread_count || 0) + 1, last_message: extractText(msg.message) }
              : c
            )
          );
          toast(`New message from ${msg.sender_name}`, { icon: "💬" });
        }
      }
    });
    return () => { removeListener(); };
  }, [selectedChat]);

  const handleSelectChat = (chat: ChatConversation) => {
    setSelectedChat(chat);
    fetchMessages(chat);
    setShowChatMenu(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || sending) return;
    const text = message.trim();
    setMessage("");
    setSending(true);

    // Optimistic update
    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      chat_id: selectedChat.id,
      sender_type: "staff",
      sender_name: "You",
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      const sent = await chatService.sendMessage(selectedChat.id, text);
      // Replace optimistic with confirmed
      setMessages(prev => prev.map(m => m.id === optimistic.id ? sent : m));
    } catch {
      toast.error("Failed to send message");
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      setMessage(text);
    } finally {
      setSending(false);
    }
  };

  const handleCloseChat = async () => {
    if (!selectedChat) return;
    setShowChatMenu(false);
    try {
      await chatService.closeChat(selectedChat.id);
      toast.success("Chat closed");
      setSelectedChat(null);
      setMessages([]);
      fetchConversations();
    } catch {
      toast.error("Failed to close chat");
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.room_number?.includes(searchTerm)
  );

  const formatTime = (iso: string) => {
    try {
      if (!iso) return "";
      const d = new Date(iso);
      if (isNaN(d.getTime())) throw new Error("Invalid date");
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return d.toLocaleDateString();
    } catch (e) {
      return "Recently";
    }
  };

  const formatMessageTime = (iso: string) => {
    try {
      if (!iso) return "";
      const d = new Date(iso);
      if (isNaN(d.getTime())) throw new Error("Invalid date");
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  };

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-full sm:w-80 lg:w-96 border-r border-[#E5E7EB] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Messages</h1>
            <button onClick={fetchConversations} className="p-1.5 hover:bg-[#FAFAFB] rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-[#5C5B59]" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F8E8D]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guests or rooms..."
              className="w-full pl-10 pr-3 py-2 border border-[#D3D9DD] rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8E9397] placeholder:text-[#8F8E8D]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-1">
            {(["active", "closed", "archived"] as StatusFilter[]).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${statusFilter === s
                  ? "bg-[#0F75BD] text-white"
                  : "bg-[#F5F5F5] text-[#5C5B59] hover:bg-[#E5E7EB]"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {loadingConversations ? (
            <div className="flex items-center justify-center py-12">
              <Loading size="sm" text="Loading chats..." />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-[#5C5B59]">
              <p className="text-sm">No {statusFilter} conversations</p>
            </div>
          ) : (
            filteredConversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`w-full p-4 border-b border-[#E5E7EB] hover:bg-[#FAFAFB] transition-colors text-left ${selectedChat?.id === chat.id ? "bg-[#E8F4F8]" : ""
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#0F75BD] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold">
                      {chat.customer_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-semibold text-[#1A1A1A] text-sm truncate">{chat.customer_name}</h3>
                      <span className="text-xs text-[#5C5B59] flex-shrink-0 ml-2">
                        {formatTime(chat.last_message_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      {chat.room_number && (
                        <span className="text-xs text-[#5C5B59]">Room {chat.room_number}</span>
                      )}
                      {chat.assigned_staff_name && (
                        <span className="text-xs text-[#0F75BD]">→ {chat.assigned_staff_name}</span>
                      )}
                    </div>
                    <p className="text-sm text-[#5C5B59] truncate">{extractText(chat.last_message)}</p>
                  </div>
                  {chat.unread_count > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0F75BD] text-white text-xs flex items-center justify-center font-semibold">
                      {chat.unread_count}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#0F75BD] flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {selectedChat.customer_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold text-[#1A1A1A]">{selectedChat.customer_name}</h2>
                  <p className="text-xs text-[#5C5B59]">
                    {selectedChat.room_number ? `Room ${selectedChat.room_number}` : "Guest"}
                    {selectedChat.assigned_staff_name && ` · Assigned to ${selectedChat.assigned_staff_name}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="relative">
                  <button
                    onClick={() => setShowChatMenu(!showChatMenu)}
                    className="p-2 hover:bg-[#FAFAFB] rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-[#5C5B59]" />
                  </button>
                  {showChatMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#D3D9DD] rounded-xl shadow-lg z-10 py-2">
                      <button
                        onClick={() => setShowChatMenu(false)}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#FAFAFB] transition-colors flex items-center gap-3 text-[#1A1A1A]"
                      >
                        <UserCircle className="w-4 h-4 text-[#0F75BD]" />
                        View Guest Profile
                      </button>
                      <button
                        onClick={() => setShowChatMenu(false)}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#FAFAFB] transition-colors flex items-center gap-3 text-[#1A1A1A]"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        View Booking Details
                      </button>
                      <div className="border-t border-[#E5E7EB] my-1" />
                      <button
                        onClick={handleCloseChat}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                      >
                        <X className="w-4 h-4" />
                        Close Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-3 bg-[#FAFAFB]">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loading size="sm" text="Loading messages..." />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-[#5C5B59] text-sm">
                  No messages yet. Say hello!
                </div>
              ) : (
                messages.map((msg) => {
                  const isStaff = msg.sender_type === "staff";
                  return (
                    <div key={msg.id} className={`flex ${isStaff ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${isStaff ? "bg-[#0F75BD] text-white" : "bg-white text-[#1A1A1A] border border-[#E5E7EB]"
                        }`}>
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isStaff ? "text-white/80" : "text-[#0F75BD]"
                            }`}>
                            {isStaff ? "You" : "Guest"}
                          </span>
                          {!isStaff && msg.sender_name && (
                            <span className="text-[10px] text-[#5C5B59] font-medium">
                              {msg.sender_name}
                            </span>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {extractText(msg.message)}
                        </p>
                        <div className={`flex items-center gap-1 mt-1 ${isStaff ? "justify-end" : "justify-start"}`}>
                          <p className={`text-[10px] ${isStaff ? "text-white/70" : "text-[#5C5B59]"}`}>
                            {formatMessageTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-[#E5E7EB] bg-white">
              <div className="flex items-end gap-3">
                <button className="p-2 hover:bg-[#FAFAFB] rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-[#5C5B59]" />
                </button>
                <div className="flex-1 border border-[#D3D9DD] rounded-xl p-3 focus-within:ring-1 focus-within:ring-[#8E9397]">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message... (Enter to send)"
                    className="w-full resize-none focus:outline-none text-sm max-h-32 text-gray-800 placeholder:text-[#8F8E8D]"
                    rows={1}
                  />
                </div>
                <button className="p-2 hover:bg-[#FAFAFB] rounded-lg transition-colors">
                  <Smile className="w-5 h-5 text-[#5C5B59]" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                  className="p-3 bg-[#0F75BD] hover:bg-[#0050C8] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#FAFAFB]">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#E8F4F8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-[#0F75BD]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Select a conversation</h3>
              <p className="text-[#5C5B59] text-sm">Choose a guest conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
