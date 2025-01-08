"use client";

import { LogOut, Star, Users } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full max-w-xs h-screen flex flex-col border border-r p-4 md:p-6">
      <div className="flex items-center gap-2">
        <Image src={"/scribble.png"} width={24} height={24} alt="logo" />
        <span className="patrick-hand font-bold text-xl md:text-2xl text-primary-foreground">
          Scribble
        </span>
      </div>
      {/* Content Section */}
      <div className="flex-1 my-6">
        <section>
          <ul>
            <Link href={"/shared"}>
              <li className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary/70">
                <Users className="size-4 text-secondary-foreground" />
                Shared With Me
              </li>
            </Link>
            <Link href={"/favourites"}>
              <li className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary/70">
                <Star className="size-4 text-secondary-foreground" />
                Favourites
              </li>
            </Link>
          </ul>
        </section>
      </div>
      {/* Logout Section */}
      <div>
        <ul>
          <li
            onClick={() => signOut({ callbackUrl: "/" })}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary/70"
          >
            <LogOut className="size-4 text-secondary-foreground" />
            Logout
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
