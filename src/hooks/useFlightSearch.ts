"use client";

import { useState, useEffect } from 'react';
import { GroupedSearchResult, Airport, formatAirportName } from '@/lib/utils';
interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

export const useFlightSearch = (initialFromAirport?: Airport | null) => {
  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');
  const [fromSelection, setFromSelection] = useState<Airport | null>(null);
  const [toSelection, setToSelection] = useState<Airport | null>(null);
  const [tripType, setTripType] = useState('Round Trip');
  const [selectedClass, setSelectedClass] = useState('Business class');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ name: '', email: '', phone: '' });

  const [multiSegments, setMultiSegments] = useState<{ from: string; to: string; date: Date | null; fromSelection: Airport | null; toSelection: Airport | null }[]>([]);
  const [multiPopovers, setMultiPopovers] = useState<boolean[]>([]);
  const [multiFromSuggestions, setMultiFromSuggestions] = useState<GroupedSearchResult[][]>([]);
  const [multiToSuggestions, setMultiToSuggestions] = useState<GroupedSearchResult[][]>([]);
  const [multiShowFromSuggestions, setMultiShowFromSuggestions] = useState<boolean[]>([]);
  const [multiShowToSuggestions, setMultiShowToSuggestions] = useState<boolean[]>([]);
  const [multiActiveInputs, setMultiActiveInputs] = useState<('from' | 'to' | null)[]>([]);
  const [initialAirportSet, setInitialAirportSet] = useState(false);

  useEffect(() => {
    // Set the initial airport only once if it's provided and it hasn't been set before.
    if (initialFromAirport && !initialAirportSet) {
      setFromInput(formatAirportName(initialFromAirport.name));
      setFromSelection(initialFromAirport);
      setInitialAirportSet(true);
    }
  }, [initialFromAirport, initialAirportSet]);

  useEffect(() => {
    if (tripType === 'Multi-city' && multiSegments.length === 0) {
      setMultiSegments([{ from: '', to: '', date: null, fromSelection: null, toSelection: null }]);
      setMultiPopovers([false]);
      setMultiFromSuggestions([[]]);
      setMultiToSuggestions([[]]);
      setMultiShowFromSuggestions([false]);
      setMultiShowToSuggestions([false]);
      setMultiActiveInputs([null]);
    } else if (tripType !== 'Multi-city' && multiSegments.length > 0) {
      setMultiSegments([]);
      setMultiPopovers([]);
      setMultiFromSuggestions([[]]);
      setMultiToSuggestions([[]]);
      setMultiShowFromSuggestions([false]);
      setMultiShowToSuggestions([false]);
      setMultiActiveInputs([]);
    }
  }, [tripType, multiSegments.length]);

  return {
    fromInput, setFromInput,
    toInput, setToInput,
    fromSelection, setFromSelection,
    toSelection, setToSelection,
    tripType, setTripType,
    selectedClass, setSelectedClass,
    passengers, setPassengers,
    departureDate, setDepartureDate,
    returnDate, setReturnDate,
    contactInfo, setContactInfo,
    multiSegments, setMultiSegments,
    multiPopovers, setMultiPopovers,
    multiFromSuggestions, setMultiFromSuggestions,
    multiToSuggestions, setMultiToSuggestions,
    multiShowFromSuggestions, setMultiShowFromSuggestions,
    multiShowToSuggestions, setMultiShowToSuggestions,
    multiActiveInputs, setMultiActiveInputs,
  };
};