"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, UserCircle, LogOut } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";

import { useRouter } from "next/navigation";
export default function ProfileNav({ user }: { user: { id: string; name: string } }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter()
  const LogoutMutation = useMutation({
    mutationFn: async () => {
      const res = await privateApi.post("/api/auth/logout")
      return res.data
    },
    onSuccess: () => router.push("/login"),
    onError: () => console.log("nonnn"),
  })
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
        className="flex items-center justify-center h-10 w-10 rounded-full bg-gold-300/20 hover:bg-gold-300/30 text-gold-300 font-medium transition-all duration-200 border border-gold-300/30"
      >
        <User className="h-5 w-5" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-olive-950/95 backdrop-blur-md border border-gold-300/10 shadow-lg overflow-hidden">
          <Link
            href={`/dashboard/${user.id}`}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-cream-50/80 hover:text-gold-300 hover:bg-olive-800/30 transition-all duration-200"
            onClick={() => setIsDropdownOpen(false)}
          >
            <UserCircle className="h-4 w-4" />
            Profil
          </Link>
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              LogoutMutation.mutate()
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-cream-50/80 hover:text-gold-300 hover:bg-olive-800/30 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}