import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Andinoh Hotel Management",
  description: "Privacy Policy and Data Protection guidelines for Andinoh Hotel Management Platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/login" className="flex items-center">
            <Image
              src="/logos/ANDINOH.svg"
              alt="Andinoh Logo"
              width={100}
              height={28}
              className="h-6 w-auto object-contain"
              priority
            />
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-xs font-normal text-[#0F75BD] hover:text-[#0050C8] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Register
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <article className="space-y-6">
          {/* Page Title */}
          <div className="border-b border-slate-200/60 pb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-[#0F75BD] rounded-full text-xs font-normal mb-2">
              <Lock className="w-3 h-3" />
              Data Security & Privacy
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-1">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 font-normal">
              Last Updated: August 19, 2026
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-slate-900">
              1. Information We Collect
            </h2>
            <p className="text-sm font-normal text-slate-600 leading-relaxed">
              When you use the Andinoh platform, we collect information required to operate your hotel account efficiently:
            </p>
            <ul className="list-disc pl-5 text-sm font-normal text-slate-600 space-y-1.5 leading-relaxed">
              <li><strong className="font-medium text-slate-800">Account Information:</strong> Hotel name, email address, password, official phone numbers, and license numbers.</li>
              <li><strong className="font-medium text-slate-800">Hotel & Room Details:</strong> Pricing, room categories, physical room statuses, facilities, and image uploads.</li>
              <li><strong className="font-medium text-slate-800">Financial Data:</strong> Payout bank account numbers and transaction ledgers for wallet withdrawals.</li>
              <li><strong className="font-medium text-slate-800">Guest & Booking Activity:</strong> Reservation details, guest check-ins, check-outs, and staff assignment logs.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-slate-900">
              2. How We Use Your Information
            </h2>
            <p className="text-sm font-normal text-slate-600 leading-relaxed">
              We utilize collected data solely to deliver and improve platform services:
            </p>
            <ul className="list-disc pl-5 text-sm font-normal text-slate-600 space-y-1.5 leading-relaxed">
              <li>Processing guest bookings and providing real-time inventory synchronization.</li>
              <li>Executing automated payouts to your registered bank account.</li>
              <li>Sending critical operational alerts, security updates, and transaction receipts via email or notifications.</li>
              <li>Preventing fraud, unauthorized access, and policy violations.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-slate-900">
              3. Data Sharing & Security
            </h2>
            <p className="text-sm font-normal text-slate-600 leading-relaxed">
              We do not sell your personal or business data to third parties. We strictly implement SSL/TLS encryption, JWT authentication, and secure database storage to safeguard all hotel records and transaction histories.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-slate-900">
              4. Your Choices & Data Rights
            </h2>
            <p className="text-sm font-normal text-slate-600 leading-relaxed">
              You may update your hotel information, staff profiles, or notification preferences at any time from your settings panel. To request account deletion or export your transaction records, please contact our support team.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-slate-900">
              5. Contact Us
            </h2>
            <p className="text-sm font-normal text-slate-600 leading-relaxed">
              If you have any questions or privacy concerns, please contact our Data Protection Officer at{" "}
              <a href="mailto:privacy@andinoh.com" className="text-[#0F75BD] hover:underline font-normal">
                privacy@andinoh.com
              </a>.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
