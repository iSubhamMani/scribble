import LoginButton from "@/components/LoginButton";
import DotPattern from "@/components/ui/dot-pattern";
import Meteors from "@/components/ui/meteors";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden relative bg-background bg-[radial-gradient(ellipse_90%_90%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Meteors number={5} />
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(250px_circle_at_center,white,transparent)]"
        )}
      />
      <header className="px-6 lg:px-10 mt-8 flex items-center justify-center">
        <Link className="flex items-center justify-center" href="#">
          <div className="flex items-center gap-2">
            <Image src={"/scribble.png"} width={32} height={32} alt="logo" />
            <span className="patrick-hand font-bold text-2xl md:text-3xl text-primary-foreground">
              Scribble
            </span>
          </div>
        </Link>
      </header>
      <main className="flex-1 max-w-6xl mx-auto">
        <section className="py-20 md:py-28 lg:py-32 xl:py-40">
          <div className="container px-6 lg:px-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="tracking-wide mb-6 fade-pullup text-4xl font-bold sm:text-5xl md:text-6xl/none xl:text-7xl/none">
                  Scribble Your Team&apos;s
                  <br />
                  Ideas Together
                </h1>
                <p className="fade-pullup-delayed-1 font-medium text-accent md:text-xl">
                  Because Brilliant Ideas Don&apos;t Stay in Boxes
                </p>
              </div>
              <LoginButton />
              <div className="w-full max-w-5xl"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
