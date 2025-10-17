import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden">
      {/* Top-left logo */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 md:top-14 md:left-14">
        <Image
          className="light:invert w-20 h-auto sm:w-28 md:w-[140px]"
          src="/next.svg"
          alt="Next.js logo"
          width={140}
          height={30}
          priority
        />
      </div>

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
          src="/leaf-off.png"
          alt="Decorative Leaf"
          fill
          className="object-contain"
        />
      </div>

      {/* Centered content */}
      <div className="w-full px-4 sm:px-6 md:px-0 lg:w-[30%] relative z-10">
        <div className="max-w-md w-full mx-auto">{children}</div>
      </div>
    </div>
  );
}
