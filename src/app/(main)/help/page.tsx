"use client";

import { useState } from "react";
import { Search, MessageCircle, Mail, Book, Video, ExternalLink, Clock, CheckCircle2, ArrowRight, Zap, Shield, HeadphonesIcon, MessageSquare } from "lucide-react";
import Image from "next/image";
import SupportTicketModal from "@/components/help/SupportTicketModal";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showTicketModal, setShowTicketModal] = useState(false);

  const quickActions = [
    {
      icon: Book,
      title: "Getting Started Guide",
      description: "Learn the basics of managing your hotel",
      bg: "bg-[#F0F9FF]",
      iconColor: "text-blue-600",
      link: "#"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      bg: "bg-[#F5F3FF]",
      iconColor: "text-purple-600",
      link: "#"
    },
    {
      icon: MessageCircle,
      title: "Contact Support",
      description: "Get help from our support team",
      bg: "bg-[#ECFDF5]",
      iconColor: "text-green-600",
      action: () => setShowTicketModal(true),
    },
  ];

  const popularTopics = [
    {
      title: "How do I add new rooms?",
      category: "Room Management",
      views: "1.2k views",
    },
    {
      title: "Managing guest check-in and check-out",
      category: "Bookings",
      views: "980 views",
    },
    {
      title: "Setting up room pricing and availability",
      category: "Room Management",
      views: "856 views",
    },
    {
      title: "How to process refunds for cancelled bookings",
      category: "Payments",
      views: "743 views",
    },
    {
      title: "Adding and managing staff accounts",
      category: "Staff Management",
      views: "621 views",
    },
    {
      title: "Understanding your revenue reports",
      category: "Analytics",
      views: "589 views",
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
      description: "Send us an email and we'll respond within 24 hours",
      availability: "Response within 24h",
      actionText: "support@andinoh.com",
      action: () => setShowTicketModal(true),
      bg: "bg-[#F5F3FF]",
      iconColor: "text-purple-600",
      available: true,
      isPhone: false,
    },
    {
      icon: null,
      title: "Phone Support",
      description: "Speak directly with our support team",
      availability: "Available 24/7",
      actionText: "+234 7079726698",
      bg: "bg-[#ECFDF5]",
      iconColor: "text-green-600",
      available: true,
      isPhone: true,
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Support",
      description: "Chat with us on WhatsApp for quick assistance",
      availability: "Available 24/7",
      actionText: "+44 7400 730594",
      bg: "bg-[#F0F9FF]",
      iconColor: "text-blue-600",
      available: true,
      isPhone: false,
    },
  ];

  return (
    <div className="h-full bg-white overflow-y-auto scrollbar-hide">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-[#E8F4F8]">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0F75BD] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#02A5E6] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-8 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-[#0F75BD] text-sm mb-6 border border-[#E5E7EB]">
              <HeadphonesIcon className="w-4 h-4" />
              <span className="font-medium">We're here to help 24/7</span>
            </div>
            <h1 className="text-5xl font-bold text-[#1A1A1A] mb-4">How can we help you?</h1>
            <p className="text-xl text-[#5C5B59] max-w-2xl mx-auto">
              Find answers, get support, and learn how to make the most of your hotel management system
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F8E8D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, guides, FAQs..."
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-[#D3D9DD] text-sm focus:outline-none focus:ring-1 focus:ring-[#8E9397] focus:border-transparent text-gray-800 placeholder:text-[#8F8E8D] placeholder:text-sm"
              />
            </div>
            <div className="flex items-center gap-3 mt-4 justify-center flex-wrap">
              <span className="text-gray-500 text-sm">Popular:</span>
              {["Add rooms", "Check-in guests", "Process payments", "View reports"].map((tag, i) => (
                <button
                  key={i}
                  className="px-4 py-1.5 bg-white border border-[#D3D9DD] hover:bg-gray-50 text-gray-800 text-sm rounded-lg transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="bg-white rounded-2xl p-6 transition-all border border-[#D3D9DD] hover:border-[#0F75BD] hover:shadow-lg group text-left"
              >
                <div className={`w-14 h-14 ${action.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${action.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{action.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{action.description}</p>
                <div
                  className="flex items-center gap-2 text-[#0F75BD] font-medium text-sm group-hover:gap-3 transition-all cursor-pointer"
                  onClick={action.action}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Popular Topics */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Popular Topics</h2>
              <p className="text-[#5C5B59]">Most searched help articles this week</p>
            </div>
            <button className="px-5 py-2.5 text-[#0F75BD] font-medium hover:bg-[#0F75BD]/5 rounded-xl transition-colors flex items-center gap-2">
              View all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularTopics.map((topic, index) => (
              <button
                key={index}
                className="flex items-start gap-4 p-5 bg-white rounded-xl border border-[#D3D9DD] hover:border-[#0F75BD] hover:shadow-md transition-all text-left group"
              >
                <div className="w-10 h-10 bg-[#0F75BD]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#0F75BD]/20 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-[#0F75BD]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-[#0F75BD] transition-colors">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded">{topic.category}</span>
                    <span>{topic.views}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#0F75BD] transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Help Categories */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Browse by Category</h2>
            <p className="text-[#5C5B59]">Explore help articles organized by topic</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {helpCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-[#D3D9DD] hover:border-[#0F75BD] hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-[#0F75BD] transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{category.description}</p>
                <div className="space-y-2 mb-4">
                  {category.topics.slice(0, 3).map((topic, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-1 h-1 bg-[#0F75BD] rounded-full"></div>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#D3D9DD]">
                  <span className="text-sm text-gray-500">{category.articleCount} articles</span>
                  <ArrowRight className="w-4 h-4 text-[#0F75BD] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Channels */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Still need help?</h2>
            <p className="text-[#5C5B59] text-lg">Our support team is ready to assist you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <div
                  key={index}
                  className={`${channel.bg} rounded-2xl p-8 border border-[#D3D9DD] relative overflow-hidden group cursor-pointer hover:border-[#0F75BD] hover:shadow-lg transition-all`}
                >
                  <div className="relative">
                    {channel.available && (
                      <div className="inline-flex items-center gap-1.5 bg-green-100 px-3 py-1 rounded-full text-xs mb-4 text-green-700">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        Available now
                      </div>
                    )}

                    {channel.isPhone ? (
                      <Image src="/icons/call.svg" alt="Phone" width={48} height={48} className="mb-4" />
                    ) : (
                      Icon && <Icon className={`w-12 h-12 mb-4 ${channel.iconColor}`} />
                    )}
                    <h3 className="font-bold text-xl mb-2 text-gray-800">{channel.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{channel.description}</p>

                    <div className="flex items-center gap-2 text-sm mb-6 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{channel.availability}</span>
                    </div>

                    <button
                      className="w-full py-3 bg-[#0F75BD] text-white font-semibold rounded-xl hover:bg-[#0050C8] transition-colors flex items-center justify-center gap-2"
                      onClick={channel.action}
                    >
                      <span>{channel.actionText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-br from-[#FAFAFB] to-white border border-[#D3D9DD] rounded-2xl p-10 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0F75BD] to-[#02A5E6] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Book className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Want to learn more?</h3>
            <p className="text-gray-500 mb-6">
              Check out our comprehensive knowledge base with detailed guides and tutorials to help you master your hotel management system
            </p>
            <button className="px-8 py-3 bg-[#0F75BD] text-sm text-white font-medium rounded-xl hover:bg-[#0050C8] transition-colors inline-flex items-center gap-2">
              Visit Knowledge Base
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <SupportTicketModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
      />
    </div>
  );
}
