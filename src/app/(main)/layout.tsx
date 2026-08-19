import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto px-12 md:px-16 lg:px-24">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
