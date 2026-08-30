"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLogout } from "@/hooks/useLogout";
import { User, UserCircle, LogOut, ChevronDown } from "lucide-react";

export default function ProfileNav({ user }: { user: { id: string; name: string } }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const logoutMutation = useLogout();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-gold-300/25 bg-gold-300/10 py-1.5 pl-1.5 pr-3 transition-all duration-200 hover:border-gold-300/40 hover:bg-gold-300/15"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-300/20 text-gold-300">
          <User className="h-3.5 w-3.5" />
        </span>
        <span className="max-w-[100px] truncate text-sm font-medium text-cream-50">
          {user.name}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-cream-50/50 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-cream-50/10 bg-olive-950/95 shadow-xl shadow-black/30 backdrop-blur-md">
          <div className="border-b border-cream-50/10 px-4 py-3">
            <p className="truncate text-sm font-medium text-cream-50">{user.name}</p>
            <p className="text-xs text-cream-50/50">Compte exportateur</p>
          </div>

          <div className="p-1.5">
            <Link
              href="/espace"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-cream-50/85 transition-colors duration-150 hover:bg-cream-50/5 hover:text-gold-300"
            >
              <UserCircle className="h-4 w-4" />
              Mon espace
            </Link>
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                logoutMutation.mutate();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-cream-50/85 transition-colors duration-150 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}