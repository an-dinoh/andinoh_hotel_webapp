import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-white">
          <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-16">
          {children}
        </main>
      </div>
  
    </div>
  );
}
