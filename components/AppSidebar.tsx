"use client";

import {
  BookCopy,
  BookOpenCheck,
  BrainCircuit,
  Heart,
  Home,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "./ui/separator";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Contents",
    url: "/content",
    icon: BrainCircuit,
  },
  {
    title: "Collections",
    url: "/collections",
    icon: BookCopy,
  },
  {
    title: "Favorites",
    url: "/favorites",
    icon: Heart,
  },
  {
    title: "To Review",
    url: "/revise",
    icon: BookOpenCheck,
  },
];

export function AppSidebar() {
  const { isLoaded, user } = useUser();
  if (!isLoaded) return null;
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        <Link href="/" className="flex flex-row items-center gap-3">
          <BrainCircuit
            className="text-purple-700 h-8 w-8 rotate-90"
            strokeWidth={2}
          />
          <h1 className="text-4xl font-bold text-blue-500">Synap</h1>
        </Link>
      </SidebarHeader>
      <div className="px-10">
        <Separator className="mt-2" />
      </div>
      <SidebarContent>
        <div>
          <div className="mt-5 flex flex-row items-center justify-center gap-2 px-4">
            <Image
              src={user?.imageUrl || ""}
              width={30}
              height={30}
              alt="Picture of the author"
              className="rounded-full"
            />
            <h2 className="text-xl text-center font-semibold text-neutral-800">
              Hey, {user?.firstName || "there"}!
            </h2>
          </div>
        </div>
        <SidebarGroup>
          <SidebarMenu className="flex flex-col justify-center items-start mb-2 px-10">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span className="text-lg font-semibold text-neutral-800">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <div className="px-10">
        <Separator className="my-1" />
      </div>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row items-center justify-center gap-2 px-4 py-2">
            <a href="/profile" className="flex flex-row items-center gap-2">
              <User className="h-5 w-5" strokeWidth={2.5} />
              <span className="text-lg font-semibold text-neutral-800">
                Profile
              </span>
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
