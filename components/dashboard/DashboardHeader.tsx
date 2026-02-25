"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Bell, Search } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function DashboardHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: Props) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
      
      {/* LEFT */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-400 mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH (desktop only) */}
        <div className="hidden md:flex items-center bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
          <Search size={16} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent outline-none text-sm text-white placeholder-gray-500"
          />
        </div>

        {/* NOTIFICATIONS */}
        <button className="relative p-2 rounded-lg bg-gray-900 border border-gray-800 hover:bg-gray-800 transition">
          <Bell size={18} className="text-gray-400" />
        </button>

        {/* ACTION BUTTON */}
        {actionLabel && (
          <button
            onClick={onAction}
            className="bg-white text-black px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            {actionLabel}
          </button>
        )}

        {/* USER */}
        {user && (
          <div className="flex items-center gap-3 ml-2">
            <img
              src={user.user_metadata?.avatar_url}
              alt="Avatar"
              className="w-9 h-9 rounded-full border border-gray-700"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">
                {user.user_metadata?.full_name}
              </p>
              <p className="text-xs text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}