"use client";

import { useSession } from "next-auth/react";
import { LogoutButton } from "./logout-button";
import { User } from "lucide-react";

export function UserNav() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <User className="w-4 h-4" />
        <div>
          <div className="font-medium">{session.user.name}</div>
          <div className="text-xs text-gray-500">{session.user.email}</div>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}

