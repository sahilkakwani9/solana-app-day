"use client";

import { ChevronDown, Copy, LogOut, Menu, Wallet, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { shortenAddress } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useWallet } from "@/hooks/useWalletProvider";
import Image from "next/image";

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { connect, disconnect, isConnected, publicKey } = useWallet();

  const handleCopy = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey.toString());
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const MenuItems = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >((props, ref) => (
    <div
      ref={ref}
      className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
      {...props}
    >
      <Link href="/leaderboard" onClick={toggleMenu}>
        <div className="bg-white text-black block md:hidden px-3 py-2 rounded-3xl text-base font-medium hover:bg-[#98FB98] font-barlow text-center">
          Leaderboard
        </div>
      </Link>
      <Link href="/leaderboard">
        <div className="bg-white hidden text-black md:block px-3 py-2 rounded-3xl text-base font-medium hover:bg-[#98FB98] font-barlow text-center">
          Leaderboard
        </div>
      </Link>
      {isConnected && publicKey ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-[#98FB98] text-black font-barlow px-3 py-5 h-0 rounded-3xl"
            >
              {shortenAddress(publicKey!.toString())}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Address</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={disconnect}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <div
            className="bg-[#98FB98] text-black md:hidden px-3 py-2 rounded-3xl text-base font-medium hover:bg-white cursor-pointer font-barlow flex flex-row gap-x-1 items-center justify-center"
            onClick={async () => {
              await connect();
              toggleMenu();
            }}
          >
            <Wallet size={20} />
            Connect Wallet
          </div>
          <div
            className="bg-[#98FB98] hidden md:flex text-black px-3 py-2 rounded-3xl text-base font-medium hover:bg-white cursor-pointer font-barlow flex-row gap-x-1 items-center justify-center"
            onClick={async () => {
              await connect();
            }}
          >
            <Wallet size={20} />
            Connect Wallet
          </div>
        </>
      )}
    </div>
  ));

  return (
    <div className="flex flex-col bg-black">
      <div className="flex justify-between items-center px-8 md:px-12 py-4 relative">
        <Link href={"/"}>
          <img
            src="./eclipse-logo.png"
            className="w-10 h-10"
            alt="Eclipse Logo"
          />
        </Link>
        <h1 className="text-4xl font-barlowItalic font-bold absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
          SOLANA APP DAY
        </h1>
        <div className="hidden md:block">
          <MenuItems />
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] bg-black border-l border-[#98FB98]"
          >
            <nav className="flex flex-col h-full">
              <h2 className="text-2xl font-bold mb-4 text-[#98FB98]">Menu</h2>
              <MenuItems />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <div className="px-8 md:px-12 py-2 flex justify-center items-center">
        <div className="flex items-center space-x-2">
          <span className="text-eclipseGreen text-lg font-barlow">Powered by</span>
          <Image
            src="/fleek-branding.png"
            alt="Fleek"
            width={160}
            height={50}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
