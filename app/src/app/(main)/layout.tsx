import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex bg-background min-h-[100dvh]">
      <Navbar />
      {children}
    </div>
  );
}
