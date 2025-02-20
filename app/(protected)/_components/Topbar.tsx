import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/shared/auth/log-out-button";
import { LogOut } from "lucide-react";
import { auth } from "@/auth";
import { formatPrice } from "@/components/shared/formatPrice";
import { db } from "@/lib/db";

const TopBar = async ({ title }: { title: string }) => {
  const session = await auth();
  const wallets = await db.wallet.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  console.log("User Wallets:", wallets);
  return (
    <nav className="md:flex md:items-center md:justify-between">
      <div className="hidden md:block ml-2">
        <h1 className="text-nowrap text-xl">{title}</h1>
      </div>
      <div className="flex items-center justify-end">
        {session?.user.role !== "ADMIN" && (
          <div className="relative group flex items-center mr-2">
            <Image
              src={"/svgs/coin.svg"}
              width={5}
              height={5}
              alt="coin"
              className="w-6 h-6 m-2"
            />
            Wallets
            <div className="absolute hidden group-hover:flex flex-col bg-white shadow-md p-2 rounded-lg top-10 right-[10px] w-48 border transition-opacity duration-300 ease-in-out">
              <p className="font-semibold text-center">Wallets</p>
              <DropdownMenuSeparator />
              {wallets.map((wallet: any, index: number) => (
                <div key={index} className="flex justify-between p-2">
                  <span>{wallet.currencyCode}</span>
                  <span>{formatPrice(wallet.balance, wallet.currencyCode)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="link"
              className="font-semibold pointer text-lg capitalize"
            >
              {session?.user.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="m-1 w-48">
            <DropdownMenuLabel className="capitalize">
              {session?.user.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <LogoutButton>
              <DropdownMenuItem>
                <div className="cursor-pointer flex">
                  <LogOut className="h-4 w-4 mr-2 cursor-pointer" />
                  Logout
                </div>
              </DropdownMenuItem>
            </LogoutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default TopBar;