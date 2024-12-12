import LoginButton from "@/components/LoginButton";
import Meteors from "@/components/ui/meteors";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden relative ">
      <Meteors number={10} />
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <div className="flex items-center">
            <span className="font-bold text-lg md:text-2xl text-primary">
              Board Mates
            </span>
          </div>
        </Link>
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto">
        <section className="py-20 md:py-28 lg:py-32 xl:py-40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="mb-6 fade-pullup text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none xl:text-7xl/none">
                  Sketch your team&apos;s
                  <br />
                  Ideas Together
                </h1>
                <p className="fade-pullup-delayed-1 font-medium text-primary md:text-xl">
                  A collaborative whiteboard for your team to bring ideas to
                  life.
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
