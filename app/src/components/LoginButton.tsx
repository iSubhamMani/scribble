"use client";

import { signIn } from "next-auth/react";
import ShinyButton from "./ui/shiny-button";
import Image from "next/image";
import { MoveRight } from "lucide-react";

const LoginButton = () => {
  return (
    <div className="fade-pullup-delayed-2">
      <ShinyButton
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="text-black rounded-full font-bold px-8 border border-primary "
      >
        <span className="flex items-center gap-2 text-primary-foreground">
          <Image src={"/google.svg"} width={36} height={36} alt="Google logo" />
          Try Scribble
          <MoveRight />
        </span>
      </ShinyButton>
    </div>
  );
};

export default LoginButton;
