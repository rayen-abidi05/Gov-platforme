import AdminSidebar from "@/components/admin/AdminSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}