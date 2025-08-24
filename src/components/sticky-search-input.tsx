"use client"

import React from "react"
import Image from "next/image"
import { Airport } from "@/lib/utils"

interface StickySearchInputProps {
  fromSelection: Airport | null;
  toSelection: Airport | null;
  onClick: () => void;
}

const StickySearchInput: React.FC<StickySearchInputProps> = ({
  fromSelection,
  toSelection,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <div 
      className="bg-white rounded-full shadow-lg border border-gray-100 p-2 cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        {/* From Input */}
        <div className="flex items-center space-x-2 flex-1 min-w-0 pl-2">
          <div className="w-8 h-8 flex-shrink-0 bg-[#E8F4F8] rounded-full flex items-center justify-center">
            <Image src="/icons/airport-from.svg" alt="From" width={14} height={14} style={{width: '16px'}} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-gray-800 tracking-wider uppercase">FROM</div>
            <div className="font-semibold text-base text-gray-500 truncate">
              {fromSelection ? `${fromSelection.name} (${fromSelection.code})` : "Flying from?"}
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="w-px h-10 bg-gray-200 mx-3"></div>
        
        {/* To Input */}
        <div className="flex items-center space-x-2 flex-1 min-w-0 pr-2">
          <div className="w-8 h-8 flex-shrink-0 bg-[#E8F4F8] rounded-full flex items-center justify-center">
            <Image src="/icons/airport-to.svg" alt="To" width={14} height={14} style={{width: '16px'}} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-gray-800 tracking-wider uppercase">GOING TO</div>
            <div className="font-semibold text-base text-gray-500 truncate">
              {toSelection ? `${toSelection.name} (${toSelection.code})` : "Where are you flying?"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StickySearchInput