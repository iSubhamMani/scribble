"use client";

import { SessionProvider } from "next-auth/react";

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default ProviderWrapper;
