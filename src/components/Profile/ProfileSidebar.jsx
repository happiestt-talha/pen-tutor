"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, CreditCard, BarChart2, MessageSquare, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from "../auth/AuthContext";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { 
    id: "request",
    icon: FileText, 
    label: "Request",
    subItems: [
      { href: "/profile?form=tutor", label: "Register A Tutor" },
      { href: "/profile?form=student", label: "Register A Student" },
    ]
  },
  { href: "/payment", icon: CreditCard, label: "Payment Management" },
  { href: "/blog", icon: BarChart2, label: "Blog Posts" },
  { href: "/feedbacks", icon: MessageSquare, label: "Feedbacks" },
  { href: "/report", icon: BarChart2, label: "Report" },
];

export default function ProfileSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (user) {
      setUserName(`${user.first_name || 'New'} ${user.last_name || 'User'}`);
    }
  }, [user]);

  return (
    <aside className="w-64 flex-shrink-0 bg-[#313D6A] text-white flex flex-col p-4">
      <div className="flex flex-col items-center text-center py-6">
        <Avatar className="w-24 h-24 mb-4 border-4 border-white/20">
          <AvatarImage src="/avatar.webp" alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">{userName}</h2>
      </div>
      <nav className="flex-1 space-y-2">
        <Accordion type="single" collapsible defaultValue="request">
          {navItems.map((item) =>
            item.subItems ? (
              <AccordionItem key={item.id} value={item.id} className="border-b-0">
                <AccordionTrigger className="w-full text-left hover:bg-white/10 rounded-md px-3 py-2 text-base hover:no-underline">
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-8 pr-2 py-1">
                  <ul className="space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.href}>
                        <Link href={subItem.href} legacyBehavior>
                          <a className={cn(
                            "flex items-center justify-between w-full text-left text-sm hover:bg-white/10 rounded-md px-3 py-2",
                            pathname === subItem.href.split('?')[0] ? "bg-white/20" : ""
                          )}>
                            {subItem.label}
                            <ChevronRight className="h-4 w-4" />
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <Link key={item.href} href={item.href} legacyBehavior>
                <a className={cn(
                  "flex items-center w-full text-left hover:bg-white/10 rounded-md px-3 py-2 text-base",
                  pathname === item.href ? "bg-white/20" : ""
                )}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </a>
              </Link>
            )
          )}
        </Accordion>
      </nav>
      <div className="mt-auto">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start hover:bg-white/10 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
