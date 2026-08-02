

export default function MinisterHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  

  return (
    <header className="flex items-center justify-between border-b border-cream-50/10 px-6 py-4 sm:px-10">
      <div>
        <h1 className="font-display text-xl sm:text-2xl text-cream-50">{title}</h1>
        {subtitle && <p className="text-xs text-cream-50/50">{subtitle}</p>}
      </div>
     
    </header>
  );
}