"use client";

import { UserProvider } from "@/app/contexts/UserContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
} 