"use client"

import React, { Dispatch, SetStateAction } from "react"
import { motion, AnimatePresence } from "framer-motion"
import FlightSearchForm from "@/components/flight-search-form"
import FlightSearchFormMobile from "@/components/flight-search-form-mobile"
import { City } from "@/components/hero-section"

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromInput: string;
  setFromInput: Dispatch<SetStateAction<string>>;
  toInput: string;
  setToInput: Dispatch<SetStateAction<string>>;
  fromSelection: City | null;
  setFromSelection: Dispatch<SetStateAction<City | null>>;
  toSelection: City | null;
  setToSelection: Dispatch<SetStateAction<City | null>>;
  departureDate: Date | null;
  setDepartureDate: Dispatch<SetStateAction<Date | null>>;
  returnDate: Date | null;
  setReturnDate: Dispatch<SetStateAction<Date | null>>;
  passengers: { adults: number; children: number; infants: number };
  setPassengers: Dispatch<SetStateAction<{ adults: number; children: number; infants: number }>>;
  tripType: string;
  setTripType: Dispatch<SetStateAction<string>>;
  selectedClass: string;
  setSelectedClass: Dispatch<SetStateAction<string>>;
  multiSegments: { from: string; to: string; date: Date | null; fromSelection: City | null; toSelection: City | null }[];
  setMultiSegments: Dispatch<SetStateAction<{ from: string; to: string; date: Date | null; fromSelection: City | null; toSelection: City | null }[]>>;
  multiPopovers: boolean[];
  setMultiPopovers: Dispatch<SetStateAction<boolean[]>>;
  multiFromSuggestions: City[][];
  setMultiFromSuggestions: Dispatch<SetStateAction<City[][]>>;
  multiToSuggestions: City[][];
  setMultiToSuggestions: Dispatch<SetStateAction<City[][]>>;
  multiShowFromSuggestions: boolean[];
  setMultiShowFromSuggestions: Dispatch<SetStateAction<boolean[]>>;
  multiShowToSuggestions: boolean[];
  setMultiShowToSuggestions: Dispatch<SetStateAction<boolean[]>>;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  fromInput,
  setFromInput,
  toInput,
  setToInput,
  fromSelection,
  setFromSelection,
  toSelection,
  setToSelection,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  passengers,
  setPassengers,
  tripType,
  setTripType,
  selectedClass,
  setSelectedClass,
  multiSegments,
  setMultiSegments,
  multiPopovers,
  setMultiPopovers,
  multiFromSuggestions,
  setMultiFromSuggestions,
  multiToSuggestions,
  setMultiToSuggestions,
  multiShowFromSuggestions,
  setMultiShowFromSuggestions,
  multiShowToSuggestions,
  setMultiShowToSuggestions
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-white"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <div className="w-full h-full overflow-y-auto">
            <div className="max-w-[1280px] mx-auto p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Search Flights</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="hidden md:block">
                <FlightSearchForm 
                  isSticky={false}
                  fromInput={fromInput}
                  setFromInput={setFromInput}
                  toInput={toInput}
                  setToInput={setToInput}
                  fromSelection={fromSelection}
                  setFromSelection={setFromSelection}
                  toSelection={toSelection}
                  setToSelection={setToSelection}
                  departureDate={departureDate}
                  setDepartureDate={setDepartureDate}
                  returnDate={returnDate}
                  setReturnDate={setReturnDate}
                  passengers={passengers}
                  setPassengers={setPassengers}
                  tripType={tripType}
                  setTripType={setTripType}
                  selectedClass={selectedClass}
                  setSelectedClass={setSelectedClass}
                  multiSegments={multiSegments}
                  setMultiSegments={setMultiSegments}
                  multiPopovers={multiPopovers}
                  setMultiPopovers={setMultiPopovers}
                  multiFromSuggestions={multiFromSuggestions}
                  setMultiFromSuggestions={setMultiFromSuggestions}
                  multiToSuggestions={multiToSuggestions}
                  setMultiToSuggestions={setMultiToSuggestions}
                  multiShowFromSuggestions={multiShowFromSuggestions}
                  setMultiShowFromSuggestions={setMultiShowFromSuggestions}
                  multiShowToSuggestions={multiShowToSuggestions}
                  setMultiShowToSuggestions={setMultiShowToSuggestions}
                  multiActiveInputs={[]}
                  setMultiActiveInputs={() => {}}
                />
              </div>
              
              <div className="block md:hidden">
                <FlightSearchFormMobile 
                  fromInput={fromInput}
                  setFromInput={setFromInput}
                  toInput={toInput}
                  setToInput={setToInput}
                  fromSelection={fromSelection}
                  setFromSelection={setFromSelection}
                  toSelection={toSelection}
                  setToSelection={setToSelection}
                  tripType={tripType}
                  setTripType={setTripType}
                  selectedClass={selectedClass}
                  setSelectedClass={setSelectedClass}
                  passengers={passengers}
                  setPassengers={setPassengers}
                  departureDate={departureDate}
                  setDepartureDate={setDepartureDate}
                  returnDate={returnDate}
                  setReturnDate={setReturnDate}
                  multiSegments={multiSegments}
                  setMultiSegments={setMultiSegments}
                  multiPopovers={multiPopovers}
                  setMultiPopovers={setMultiPopovers}
                  multiFromSuggestions={multiFromSuggestions}
                  setMultiFromSuggestions={setMultiFromSuggestions}
                  multiToSuggestions={multiToSuggestions}
                  setMultiToSuggestions={setMultiToSuggestions}
                  multiShowFromSuggestions={multiShowFromSuggestions}
                  setMultiShowFromSuggestions={setMultiShowFromSuggestions}
                  multiShowToSuggestions={multiShowToSuggestions}
                  setMultiShowToSuggestions={setMultiShowToSuggestions}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SearchModal 