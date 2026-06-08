"use client";

import { useState } from "react";
import {
  Search, MessageCircle, Mail, Book, Video, ExternalLink,
  CheckCircle2, ArrowRight, HeadphonesIcon, MessageSquare, ChevronDown, Phone
} from "lucide-react";
import SupportTicketModal from "@/components/help/SupportTicketModal";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const quickActions = [
    {
      icon: Book,
      title: "Getting Started Guide",
      description: "Learn the basics of setting up, managing, and customizing your hotel system.",
      bg: "bg-blue-50 text-blue-600",
      iconColor: "text-blue-600",
      action: () => {},
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch quick, step-by-step visual guides on managing rooms, bookings, and roles.",
      bg: "bg-purple-50 text-purple-600",
      iconColor: "text-purple-600",
      action: () => {},
    },
    {
      icon: MessageCircle,
      title: "Submit Support Ticket",
      description: "Create a support request and track status directly inside the web app.",
      bg: "bg-emerald-50 text-emerald-600",
      iconColor: "text-emerald-600",
      action: () => setShowTicketModal(true),
    },
  ];

  const popularTopics = [
    {
      title: "How do I add new rooms?",
      category: "Room Management",
      views: "1.2k views",
      answer: "Navigate to the Rooms screen, click the 'Add Room' button in the top right, specify the room type name, category, standard pricing, amenities, and details. Once the room category is created, click the 'Add Room Unit' action to register physical room numbers."
    },
    {
      title: "Managing guest check-in and check-out",
      category: "Bookings",
      views: "980 views",
      answer: "From the Bookings list screen, select the active booking to view the details drawer. Click the green 'Check-In' button when the guest arrives to mark the room as occupied. For check-out, select 'Check-Out' to settle the folio balance and update housekeeping status."
    },
    {
      title: "Setting up room pricing and availability",
      category: "Room Management",
      views: "856 views",
      answer: "Go to Room Management, select the category, and navigate to the 'Pricing Rules' tab to set seasonal rates or custom rules. For availability, you can toggle room unit status between 'Available' and 'Maintenance' directly from the Room Units tab."
    },
    {
      title: "How to process refunds for cancelled bookings",
      category: "Payments",
      views: "743 views",
      answer: "Open the cancelled booking in the Bookings detail panel. Go to the payment ledger, select the processed transaction, and click 'Initiate Refund'. The backend will process the reversal to the original bank account or card details."
    },
    {
      title: "Adding and managing staff accounts",
      category: "Staff Management",
      views: "621 views",
      answer: "Go to the Staff section, click 'Invite Staff', and enter their email and role (e.g. manager, receptionist, housekeeper). The system will generate a temporary password and email them an invitation link to register."
    },
    {
      title: "Understanding your revenue reports",
      category: "Analytics",
      views: "589 views",
      answer: "The Reports page displays real-time performance indicators like Average Daily Rate (ADR) and Revenue Per Available Room (RevPAR). You can export monthly summaries in PDF or CSV formats from the Generate Report control card."
    },
  ];

  const helpCategories = [
    {
      title: "Room Management",
      description: "Add, edit, and organize your hotel rooms",
      icon: "🏨",
      articleCount: 12,
      topics: ["Adding new rooms", "Room pricing", "Room availability", "Room amenities"]
    },
    {
      title: "Booking Management",
      description: "Handle reservations and guest bookings",
      icon: "📅",
      articleCount: 15,
      topics: ["Creating bookings", "Check-in process", "Check-out process", "Cancellations"]
    },
    {
      title: "Guest Management",
      description: "Manage guest profiles and preferences",
      icon: "👥",
      articleCount: 8,
      topics: ["Guest profiles", "Guest history", "Special requests", "VIP guests"]
    },
    {
      title: "Payments & Billing",
      description: "Process payments and manage invoices",
      icon: "💳",
      articleCount: 10,
      topics: ["Payment methods", "Invoicing", "Refunds", "Financial reports"]
    },
    {
      title: "Staff Management",
      description: "Add and manage your hotel staff",
      icon: "👨‍💼",
      articleCount: 6,
      topics: ["Adding staff", "Staff roles", "Permissions", "Staff schedule"]
    },
    {
      title: "Reports & Analytics",
      description: "View and export performance reports",
      icon: "📊",
      articleCount: 9,
      topics: ["Revenue reports", "Occupancy rates", "Performance metrics", "Export data"]
    },
  ];

  const supportChannels = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email and our support team will respond within 24 hours.",
      availability: "Response within 24h",
      actionText: "support@andinoh.com",
      action: () => setShowTicketModal(true),
      bg: "bg-white",
      iconColor: "text-purple-600",
      available: true,
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team for help with any issues.",
      availability: "Available 24/7",
      actionText: "+234 7079726698",
      action: () => { window.location.href = "tel:+2347079726698"; },
      bg: "bg-white",
      iconColor: "text-emerald-600",
      available: true,
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Support",
      description: "Chat with us on WhatsApp for rapid real-time assistance.",
      availability: "Available 24/7",
      actionText: "+44 7400 730594",
      action: () => { window.open("https://wa.me/447400730594", "_blank"); },
      bg: "bg-white",
      iconColor: "text-blue-600",
      available: true,
    },
  ];

  const filteredTopics = popularTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Custom micro-animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out forwards;
        }
      `}</style>

      {/* Page Header */}
      <div className="border-b border-gray-100 py-6 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Help & Support</h1>
          <p className="text-[#5C5B59] mt-1">We're here to assist you with any questions or requests 24/7</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide py-6 space-y-8 pb-16">
        
        {/* Search Header Banner */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-2 bg-[#0F75BD]/5 px-4 py-2 rounded-full text-[#0F75BD] text-xs font-semibold mb-6 border border-[#0F75BD]/10">
            <HeadphonesIcon className="w-3.5 h-3.5 animate-pulse" />
            Active Live Support
          </div>
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">How can we help you today?</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-lg">
            Search our knowledge base for quick solutions or connect with one of our channels.
          </p>

          <div className="w-full max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for articles, guides, FAQs..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 rounded-2xl border border-gray-200 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0F75BD]/10 focus:border-[#0F75BD] text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* Popular searches tag cloud */}
          <div className="flex items-center gap-2.5 mt-5 justify-center flex-wrap">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Popular:</span>
            {["Add rooms", "Check-in guests", "Process payments", "View reports"].map((tag, i) => (
              <button
                key={i}
                onClick={() => setSearchQuery(tag)}
                className="px-3 py-1.5 bg-white border border-gray-200 hover:border-[#0F75BD] text-gray-600 hover:text-[#0F75BD] text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                onClick={action.action}
                className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-[#0F75BD] transition-all group cursor-pointer flex flex-col justify-between h-52"
              >
                <div>
                  <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-base mb-1.5">{action.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{action.description}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[#0F75BD] font-semibold text-xs">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Popular FAQ Topics Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Frequently Asked Questions</h2>
            <p className="text-xs text-gray-500">Find quick answers to common support topics</p>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-3xl bg-gray-50/20">
              <p className="text-sm text-gray-400 font-semibold">No results found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map((topic, index) => (
                <div
                  key={index}
                  className="flex flex-col p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#0F75BD] transition-all text-left group cursor-pointer"
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  <div className="flex items-start justify-between w-full gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#0F75BD]/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#0F75BD]/10 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-[#0F75BD]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-gray-800 group-hover:text-[#0F75BD] transition-colors pr-2">
                          {topic.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1 font-medium">
                          <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-gray-500 capitalize">
                            {topic.category}
                          </span>
                          <span>•</span>
                          <span>{topic.views}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-[#0F75BD] transition-transform duration-200 shrink-0 ${expandedIndex === index ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {expandedIndex === index && (
                    <div className="mt-4 pl-14 text-xs text-gray-500 border-t border-gray-50 pt-3 animate-fadeIn leading-relaxed">
                      {topic.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Browse by Category</h2>
            <p className="text-xs text-gray-500">Explore support resources organized by feature module</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-[#0F75BD] transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-4 transition-transform group-hover:scale-105 w-fit">{category.icon}</div>
                  <h3 className="font-bold text-gray-800 text-base mb-1.5 group-hover:text-[#0F75BD] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{category.description}</p>
                  <div className="space-y-2 mb-6">
                    {category.topics.slice(0, 3).map((topic, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <div className="w-1 h-1 bg-[#0F75BD] rounded-full"></div>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400 font-semibold">{category.articleCount} articles</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0F75BD] transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Channels Section */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Still need help?</h2>
            <p className="text-xs text-gray-500">Reach out through any of our official support channels</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-[#0F75BD] transition-all flex flex-col justify-between h-72 text-center items-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="inline-flex items-center gap-1.5 bg-[#E7F2EB] px-3 py-1 rounded-full text-[10px] font-bold mb-4 text-[#117C35]">
                      <div className="w-1.5 h-1.5 bg-[#117C35] rounded-full animate-pulse"></div>
                      Online
                    </div>
                    
                    <div className={`w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-600`}>
                      <Icon className={`w-5 h-5 ${channel.iconColor}`} />
                    </div>
                    
                    <h3 className="font-bold text-gray-800 text-base mb-1.5">{channel.title}</h3>
                    <p className="text-gray-500 text-xs leading-normal mb-4 max-w-[200px]">{channel.description}</p>
                  </div>

                  <button
                    onClick={channel.action}
                    className="w-full py-2.5 bg-gray-50 border border-gray-100 text-[#0F75BD] font-bold text-xs rounded-xl hover:bg-[#0F75BD] hover:text-white hover:border-[#0F75BD] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{channel.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="border border-gray-100 rounded-3xl p-8 text-center bg-white flex flex-col items-center">
          <div className="w-12 h-12 bg-[#0F75BD]/5 rounded-2xl flex items-center justify-center mb-4">
            <Book className="w-6 h-6 text-[#0F75BD]" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1.5">Want to explore our knowledge base?</h3>
          <p className="text-gray-500 text-xs max-w-md mb-6 leading-relaxed">
            Read comprehensive step-by-step documentations, configuration details, and system administration manuals.
          </p>
          <button className="px-6 py-2.5 border border-gray-200 hover:border-[#0F75BD] text-[#0F75BD] text-xs font-bold rounded-xl hover:bg-[#0F75BD]/5 transition-all inline-flex items-center gap-1.5 cursor-pointer">
            <span>Visit Knowledge Base</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      <SupportTicketModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
      />
    </div>
  );
}
