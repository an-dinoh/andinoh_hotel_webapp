"use client";

import { useState } from "react";
import { Send, MoreVertical, MapPin, Star, X, Bold, Italic, Underline, RotateCcw, RotateCw, Image as ImageIcon, ChevronDown } from "lucide-react";
import MessageIcon from "@/icons/MessageIcon";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  role?: string;
  rating?: number;
  reviews?: number;
}

interface Message {
  id: string;
  text: string;
  time: string;
  sent: boolean;
}

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<string>("1");
  const [message, setMessage] = useState("");
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const chats: Chat[] = [
    {
      id: "1",
      name: "Adebanjo Nawas",
      avatar: "👤",
      lastMessage: "Hi Praise, I want to design a end-to-e...",
      time: "Just Now",
      unread: 1,
    },
    {
      id: "2",
      name: "Muhammad Nuralim",
      avatar: "👤",
      lastMessage: "Hi Praise, I want to design a end-to-e...",
      time: "03:10 PM",
    },
    {
      id: "3",
      name: "Grace Philomena",
      avatar: "👤",
      lastMessage: "Hi Praise, I want to design a end-to-e...",
      time: "Yesterday",
    },
    {
      id: "4",
      name: "Adeyanju Emmanuel",
      avatar: "👤",
      lastMessage: "Hi Praise, I want to design a end-to-e...",
      time: "Jun 28",
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      text: "Hi Praise, I want to design a end-to-end fintech product with 3 month maximum duration. Would you be available by 2:00PM for us to discuss the details?",
      time: "11:54 AM",
      sent: false,
    },
    {
      id: "2",
      text: "Hi Nawas, I will not be available during the time slot you suggested. However, between 5 - 7 pm is a good time for me. Please let me know that time works for you.",
      time: "11:54 AM",
      sent: true,
    },
    {
      id: "3",
      text: "That's a great time. See you then!",
      time: "11:54 AM",
      sent: false,
    },
    {
      id: "4",
      text: "Thank you!\nSee you soon.",
      time: "11:54 AM",
      sent: true,
    },
    {
      id: "5",
      text: "Hello It's time please. An end-to-end fintech product is a big one, however the duration might be bit or worries. I can't really give a timeframe until we get to discuss the product in details. Map out the requirement both on high and detailed level. So I will not say YES to the timeframe neither would I say NO. Lets just discuss the product in details and we can go from there.",
      time: "11:54 AM",
      sent: true,
    },
  ];

  const currentChat = chats.find((c) => c.id === selectedChat);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("");
    }
  };

  const handleReport = () => {
    setShowOptionsMenu(false);
    setShowReportModal(true);
  };

  const handleSubmitReport = () => {
    setShowReportModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Recent Chats */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#0B0A07]">Chats</h2>
        </div>

        {/* Recent Label */}
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-[#0B0A07]">Recent</h3>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`w-full px-6 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                selectedChat === chat.id ? "bg-gray-50" : ""
              }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                {chat.avatar}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-[#0B0A07] text-sm">{chat.name}</h4>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>

              {/* Unread Badge */}
              {chat.unread && (
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Browse Gigs Button */}
        <div className="p-6 border-t border-gray-200">
          <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Browse Gigs
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                👤
              </div>

              {/* User Info */}
              <div>
                <h3 className="font-bold text-[#0B0A07] text-lg">{currentChat?.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Product Designer</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-orange-400 fill-orange-400" />
                    <span className="font-semibold text-[#0B0A07]">4.5</span>
                    <span>(50+)</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>Lagos, Nigeria</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Options Menu */}
            <div className="relative">
              <button
                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>

              {showOptionsMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-2">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <span>👤</span>
                    <span className="text-gray-700">View Profile</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <span>🔕</span>
                    <span className="text-gray-700">Mute Notification</span>
                  </button>
                  <button
                    onClick={handleReport}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span className="text-red-500">⚠️</span>
                    <span className="text-red-500">Report</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Project Info Card */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full mb-2">
                  Web Development
                </span>
                <h4 className="text-lg font-bold text-[#0B0A07] mb-2">Front-End Development</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Skilled Front End Developer with 7 years of experience in crafting responsive and interactive...
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Rate: </span>
                    <span className="text-lg font-bold text-green-600">₦500K</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Available Now
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                  Mark as Completed
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                  View Project
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Today Label */}
          <div className="flex justify-center mb-6">
            <span className="px-4 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
              Today
            </span>
          </div>

          {/* Messages */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-2xl px-4 py-3 rounded-2xl ${
                    msg.sent
                      ? "bg-gray-200 text-gray-900"
                      : "bg-blue-50 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  <p className="text-xs text-gray-500 mt-1">Delivered: {msg.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            {/* Bold N Icon */}
            <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-700 hover:bg-gray-200 transition-colors">
              N
            </button>

            {/* Message Input Field */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type message here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowReportModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowReportModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>

              {/* Header */}
              <h2 className="text-2xl font-bold text-[#0B0A07] mb-2">Report an Issue</h2>
              <p className="text-sm text-gray-600 mb-6">
                If you notice any anomalies or have concerns, please report them here. We aim to keep our community safe and respectful.
              </p>

              {/* Form */}
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email:
                  </label>
                  <input
                    type="email"
                    placeholder="Type your email here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Who are you reporting */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Who are you reporting?
                  </label>
                  <input
                    type="text"
                    value="Auto filled"
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                {/* Their Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Their Username
                  </label>
                  <input
                    type="text"
                    value="Auto filled"
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                {/* Why are you Reporting */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why are you Reporting?
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Choose here...</option>
                    <option value="spam">Spam</option>
                    <option value="harassment">Harassment</option>
                    <option value="fraud">Fraud</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message
                  </label>
                  <div className="border border-gray-300 rounded-lg">
                    {/* Toolbar */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Bold size={18} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Italic size={18} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Underline size={18} className="text-gray-600" />
                      </button>
                      <div className="w-px h-6 bg-gray-300 mx-1" />
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <RotateCcw size={18} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <RotateCw size={18} className="text-gray-600" />
                      </button>
                      <div className="w-px h-6 bg-gray-300 mx-1" />
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <ImageIcon size={18} className="text-gray-600" />
                      </button>
                    </div>
                    {/* Textarea */}
                    <textarea
                      placeholder="Type your question"
                      rows={6}
                      className="w-full px-4 py-3 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReport}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-[#0B0A07] mb-2">
                Report Submitted Successfully
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you certain you want to delete this post? Deleting is permanent and cannot be undone.
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  No, Cancel
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                  View Ticket
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
