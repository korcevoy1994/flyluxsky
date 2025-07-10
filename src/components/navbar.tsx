'use client'

import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"

const NAVBAR_PHONE = "+1 (888)  830 7444"

export const Navbar: React.FC = () => {
  const handleMenuClick = () => {
    // TODO: open menu
  }

  return (
    <header className="w-full px-4 py-2 flex items-center justify-between rounded-3xl max-w-[1280px] mx-auto mt-4">
      {/* Logo */}
      <div className="flex items-center select-none" tabIndex={0} aria-label="FLS logo">
        <span className="font-bold text-[24px] leading-[1.5em] font-poppins uppercase text-white tracking-tight">FLS</span>
      </div>
      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Phone CTA */}
        <Button
          variant="default"
          className="flex items-center gap-2 px-5 py-3 bg-[#EC5E39] text-white font-bold text-[14px] font-poppins uppercase leading-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#EC5E39] cursor-pointer"
          tabIndex={0}
          aria-label="Contact phone"
        >
          <Phone size={16} />
          <span>{NAVBAR_PHONE}</span>
        </Button>
        {/* Menu button */}
        <button
          onClick={handleMenuClick}
          tabIndex={0}
          aria-label="Open menu"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#0ABAB5] group cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="block h-0.5 w-5 bg-[#0ABAB5] rounded transition-all duration-200"></span>
            <span className="block h-0.5 w-5 bg-[#0ABAB5] rounded transition-all duration-200"></span>
            <span className="block h-0.5 w-5 bg-[#0ABAB5] rounded transition-all duration-200"></span>
          </div>
          <span className="font-bold text-[14px] font-poppins uppercase text-[#0ABAB5]">MENU</span>
        </button>
      </div>
    </header>
  )
}

export default Navbar 