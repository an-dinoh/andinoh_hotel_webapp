import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-y-auto py-8">
      {/* Decorative leaf */}
      <div className="hidden md:block absolute -left-90 top-1/6 w-260 h-260">
        <Image
          src="/leaf.png"
          alt="Decorative Leaf"
          fill
          className="object-contain"
        />
      </div>

      <div className="absolute top-1 -right-10 w-32 h-32 sm:-right-20 sm:w-40 sm:h-40 md:-right-30 md:w-60 md:h-60">
        <Image
          src="/leaf.png"
          alt="Decorative Leaf"
          fill
          className="object-contain"
        />
      </div>

      {/* Centered content */}
      <div className="w-full px-4 sm:px-6 md:px-0 lg:w-[90%] relative z-10">
        <div className="max-w-xl w-full mx-auto">{children}</div>
      </div>
    </div>
  );
}
