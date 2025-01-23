"use client";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { UserType } from "@/models/user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";
import {
  PrivateAccessListUser,
  PublicEditAccess,
  ShareOption,
} from "@/models/Whiteboard";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

export type ACLFormData = {
  shareOption: ShareOption;
  publicEditAccess: PublicEditAccess;
  privateAccessList: PrivateAccessListUser[];
};

const AccessControlForm = ({ id }: { id: string }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState<ACLFormData>({
    shareOption: "restricted",
    publicEditAccess: "none",
    privateAccessList: [],
  });

  useEffect(() => {
    if (!query || query.trim() === "") {
      setUsers([]);
      return;
    }
    async function searchUsers() {
      // search users
      try {
        const res = await axios.get("/api/user/all?q=" + query);
        const filteredUsers = res.data.data.filter((u: UserType) => {
          return !formData.privateAccessList.find(
            (al) => al.user.email === u.email
          );
        });
        setUsers(filteredUsers);
      } catch (error) {
        console.log(error);
      }
    }
    searchUsers();
  }, [query]);

  useEffect(() => {
    if (formData.shareOption === "anyone") {
      setFormData((f) => ({ ...f, privateAccessList: [] }));
    }

    if (formData.shareOption === "restricted") {
      setFormData((f) => ({
        ...f,
        publicEditAccess: "none",
      }));
    }
  }, [formData.shareOption]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("id", id);
    fd.append("aclData", JSON.stringify(formData));

    try {
      setSubmitting(true);
      const res = await axios.put("/api/whiteboard", fd);

      if (res.data.success) {
        toast.success("Access Control Updated");
        closeRef.current?.click();
      }
    } catch (error) {
      toast.error("Failed to update access control");
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid flex-1 gap-4">
        <RadioGroup
          className="space-y-2"
          onValueChange={(value) =>
            setFormData((f) => ({ ...f, shareOption: value as ShareOption }))
          }
          value={formData.shareOption}
        >
          <div className="flex items-start space-x-4">
            <RadioGroupItem className="mt-1" value="anyone" id="anyone" />
            <div className="w-full">
              <Label htmlFor="anyone">
                <p className="text-base text-secondary-foreground font-normal">
                  Anyone with the link
                </p>
                <p className="text-xs font-normal text-secondary-foreground/80">
                  Everyone can view
                </p>
              </Label>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <RadioGroupItem
              className="mt-1"
              value="restricted"
              id="restricted"
            />
            <div className="w-full">
              <Label htmlFor="restricted">
                <p className="text-base text-secondary-foreground font-normal">
                  Restricted
                </p>
                <p className="text-xs font-normal text-secondary-foreground/80">
                  Only you and people you choose can view and edit
                </p>
              </Label>
            </div>
          </div>
        </RadioGroup>
        {formData.shareOption === "anyone" && (
          <div className="mt-2">
            <p className="text-lg font-bold">Edit access</p>
            <RadioGroup
              className="flex space-x-4 items-center mt-4"
              onValueChange={(value) =>
                setFormData((f) => ({
                  ...f,
                  publicEditAccess: value as PublicEditAccess,
                }))
              }
              defaultValue={formData.publicEditAccess}
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label
                  className="mt-0.5 font-normal text-secondary-foreground"
                  htmlFor="all"
                >
                  All
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label
                  className="mt-0.5 font-normal text-secondary-foreground"
                  htmlFor="none"
                >
                  None
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}
        {formData.shareOption === "restricted" && (
          <>
            <div className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                id="title"
                placeholder="Search users by email.."
              />
              {users.length !== 0 && (
                <Card className="backdrop-blur-xl bg-card/45 shadow-xl absolute w-full z-50 top-full mt-2">
                  <ScrollArea className="w-full h-[120px]">
                    {users.map((u) => {
                      return (
                        <div
                          onClick={() => {
                            if (
                              formData.privateAccessList.find(
                                (al) => al.user.email === u.email
                              )
                            )
                              return;
                            const user: PrivateAccessListUser = {
                              user: u,
                              editAccess: false,
                            };
                            setFormData((f) => ({
                              ...f,
                              privateAccessList: [...f.privateAccessList, user],
                            }));
                            setQuery("");
                          }}
                          key={u.email}
                          className="cursor-pointer p-2 rounded-sm hover:bg-primary/15 flex items-start gap-2"
                        >
                          <Avatar className="shadow-xl">
                            <AvatarImage src={u.image} />
                            <AvatarFallback>
                              {u.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{u.name}</p>
                            <p className="text-secondary-foreground/85 text-xs">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </ScrollArea>
                </Card>
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-secondary-foreground">
                People with access
              </h3>
              {formData.privateAccessList.length !== 0 && (
                <>
                  <p className="text-end font-bold text-secondary-foreground/85 text-sm my-1">
                    Edit Access
                  </p>
                  <ScrollArea className="w-full h-[120px] my-2">
                    {formData.privateAccessList.map((u) => {
                      return (
                        <div
                          key={u.user.email}
                          className="flex items-start gap-2"
                        >
                          <Avatar className="shadow-xl">
                            <AvatarImage src={u.user.image} />
                            <AvatarFallback>
                              {u.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex gap-2 items-center justify-between w-full">
                            <div>
                              <p className="text-sm font-medium">
                                {u.user.name}
                              </p>
                              <p className="text-secondary-foreground/85 text-xs">
                                {u.user.email}
                              </p>
                            </div>
                            <Checkbox
                              onCheckedChange={(e) => {
                                setFormData((f) => ({
                                  ...f,
                                  privateAccessList: f.privateAccessList.map(
                                    (al) => {
                                      if (al.user.email === u.user.email) {
                                        return {
                                          ...al,
                                          editAccess: e.valueOf() as boolean,
                                        };
                                      }
                                      return al;
                                    }
                                  ),
                                }));
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </ScrollArea>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <DialogFooter className="sm:justify-end">
        <DialogClose ref={closeRef} asChild>
          <Button disabled={submitting} type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <Button disabled={submitting} type="submit" variant="default">
          {submitting ? (
            <LoaderCircle className="text-primary-foreground animate-spin size-4" />
          ) : (
            "Save"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AccessControlForm;
