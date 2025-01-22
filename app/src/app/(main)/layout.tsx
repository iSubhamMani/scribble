import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex bg-background min-h-[100dvh] bg-[radial-gradient(ellipse_60%_60%_at_10%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]">
      <Navbar />
      {children}
    </div>
  );
}
