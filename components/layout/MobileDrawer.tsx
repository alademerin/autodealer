"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Users,
  DollarSign,
  UserCog,
  Wrench,
  BarChart3,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Cars", href: "/cars", icon: Car },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Sales", href: "/sales", icon: DollarSign },
  { name: "Staff", href: "/staff", icon: UserCog },
  { name: "Services", href: "/services", icon: Wrench },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawer({ open, onOpenChange }: MobileDrawerProps) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col gap-y-5 overflow-y-auto bg-sidebar px-6 pb-4">
          {/* Logo */}
          <SheetHeader className="h-16 flex-row items-center space-y-0 pt-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <Car className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <SheetTitle className="text-lg font-semibold text-sidebar-foreground">
                DriveSmart Motors
              </SheetTitle>
            </div>
          </SheetHeader>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive
                            ? "text-primary-foreground"
                            : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/50 text-center">
              Car Dealer Management
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
