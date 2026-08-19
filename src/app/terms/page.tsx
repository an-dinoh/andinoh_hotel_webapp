import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Andinoh Hotel Management",
  description: "Terms of Service and Partner Agreement for Andinoh Hotel Management Platform.",
};

export default function TermsPage() {
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
              <ShieldCheck className="w-3 h-3" />
              Legal & Partner Compliance
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-1">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-400 font-normal">
              Last Updated: August 19, 2026
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-slate-900">
              1. Acceptance of Terms
            </h2>
            <p className="text-sm font-normal text-slate-600 leading-relaxed">
              By creating an account, registering your hotel, or accessing the Andinoh Hotel Management Platform (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not access or use our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-slate-900">
              2. Hotel Account & Partner Responsibilities
            </h2>
            <p className="text-sm font-normal text-slate-600 leading-relaxed">
              As a hotel owner or authorized administrator:
            </p>
            <ul className="list-disc pl-5 text-sm font-normal text-slate-600 space-y-1.5 leading-relaxed">
              <li>You must provide accurate, current, and verifiable information during registration, including valid license details.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials and staff access levels.</li>
              <li>You agree to notify Andinoh immediately of any unauthorized use or security breach related to your hotel account.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-slate-900">
              3. Room Inventory & Reservation Accuracy
            </h2>
            <p className="text-sm font-normal text-slate-600 leading-relaxed">
              Hotels using our platform agree to maintain accurate room pricing, availability, and facility statuses. Overbooking due to deliberate inventory manipulation or failure to update status is grounds for account suspension.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-slate-900">
              4. Fees, Wallet & Settlements
            </h2>
            <p className="text-sm font-normal text-slate-600 leading-relaxed">
              Platform transaction fees, wallet payout terms, and settlement schedules are governed by your partner agreement. Payout requests will be processed to the verified bank account attached to your hotel profile.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-slate-900">
              5. Intellectual Property
            </h2>
            <p className="text-sm font-normal text-slate-600 leading-relaxed">
              Andinoh retains all rights, title, and interest in and to the platform, branding, graphics, software, and underlying APIs. Hotel partners grant Andinoh a non-exclusive license to display hotel imagery and details for customer booking purposes.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-slate-900">
              6. Limitation of Liability
            </h2>
            <p className="text-sm font-normal text-slate-600 leading-relaxed">
              In no event shall Andinoh be liable for indirect, incidental, special, or consequential damages resulting from platform downtime, network disruptions, or third-party service failures beyond our reasonable control.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="text-base font-medium text-slate-900">
              7. Contact & Inquiries
            </h2>
            <p className="text-sm font-normal text-slate-600 leading-relaxed">
              If you have any questions regarding these Terms of Service, please contact our legal team at{" "}
              <a href="mailto:support@andinoh.com" className="text-[#0F75BD] hover:underline font-normal">
                support@andinoh.com
              </a>.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
