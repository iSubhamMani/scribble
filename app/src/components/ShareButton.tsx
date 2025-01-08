"use client";

import { ForwardIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { UserType } from "@/models/user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ShareButton = () => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState<string>("restricted");
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    if (!query || query.trim() === "") {
      setUsers([]);
      return;
    }
    async function searchUsers() {
      // search users
      try {
        const res = await axios.get("/api/user/all?q=" + query);
        setUsers(res.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    searchUsers();
  }, [query]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 absolute top-4 right-4">
          Share
          <ForwardIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Share With</DialogTitle>
        </DialogHeader>
        <div className="grid flex-1 gap-4">
          <RadioGroup
            onValueChange={(value) => setValue(value)}
            defaultValue={"restricted"}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="anyone" id="anyone" />
              <Label className="text-base" htmlFor="anyone">
                Anyone with the link
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="restricted" id="restricted" />
              <Label className="text-base" htmlFor="restricted">
                Restricted
              </Label>
            </div>
          </RadioGroup>
          {value === "restricted" && (
            <div className="relative">
              <Input
                onChange={(e) => setQuery(e.target.value)}
                id="title"
                placeholder="Search users.."
              ></Input>
              {users.length !== 0 && (
                <div className="bg-secondary absolute mt-1 w-full rounded-md shadow-lg p-4">
                  {users.map((u) => {
                    return (
                      <div key={u.email} className="flex items-start gap-2">
                        <Avatar className="shadow-xl">
                          <AvatarImage src={u.image} />
                          <AvatarFallback>
                            {u.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{u.name}</p>
                          <p className="text-secondary-foreground text-sm">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose ref={closeRef} asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" variant="default">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
