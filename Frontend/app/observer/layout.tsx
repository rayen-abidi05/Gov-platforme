import ObserverSidebar from "@/components/observer/ObserverSidebar";

export default function ObserverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <ObserverSidebar />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
