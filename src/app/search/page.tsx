"use client";

import { useSearchParams } from 'next/navigation';
import FlightSummaryChips from '@/components/flight-summary-chips'
import { Suspense, useState, useEffect } from 'react';
import Navbar from '@/components/navbar';

import FlightSearchFormVertical from '@/components/flight-search-form-vertical';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import Image from 'next/image';
import { ArrowLeftRight, Wifi, Coffee, Monitor, Users, ChevronDown, ChevronUp, X } from 'lucide-react';
// Local SVG from public as a component via next/image
const AirportFromIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => {
    const aspectRatio = 24/17; // Original SVG dimensions
    const height = Math.round(size / aspectRatio);
    return (
        <Image src="/icons/airport-from.svg" alt="" width={size} height={height} className={className} style={{width: 'auto'}} />
    );
};
import { generateFlightsClient, generateMultiCityFlightsFromSegments, calculateTotalPriceWithPassengers } from '@/lib/flightGenerator';
import type { GeneratedFlight, MultiCityFlight, FlightSegment } from '@/lib/flightGenerator';

// Mock data for airports to get full names
import airports from '@/lib/airports.json';
import { Airport } from '@/lib/utils';

const airportsMap = new Map(airports.map(a => [a.code, a]));



const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState(12 * 60); // 12 minutes in seconds

    useEffect(() => {
        if (timeLeft <= 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = (timeLeft / (12 * 60)) * 100;

    return (
        <div>
            <span className="font-mono text-xs tracking-wider uppercase">Price expires in {String(minutes).padStart(2, '0')}m:{String(seconds).padStart(2, '0')}s</span>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-[#EC5E39] h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Mobile Fixed Bottom Bar */}
        </div>
    );
};

const MultiCityFlightCard = ({ flight, isSelected, onSelect, departureDates }: { flight: MultiCityFlight, isSelected: boolean, onSelect: () => void, departureDates?: string[] }) => {
    const getAmenityIcon = (amenity: string) => {
        switch (amenity) {
            case 'wifi': return <Wifi size={16} />;
            case 'entertainment': return <Monitor size={16} />;
            case 'meal': return <Coffee size={16} />;
            default: return null;
        }
    };

    // Format date for display
    const formatFlightDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div 
            className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg relative ${
                isSelected ? 'border-[#ec5e39] shadow-lg ring-2 ring-[#ec5e39]/20' : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={onSelect}
        >
            {isSelected && (
                <div className="absolute -top-2 -right-2 bg-[#ec5e39] text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                    Selected Flight
                </div>
            )}
            {/* Multi-City Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#0abab5] to-[#EC5E39] rounded-lg flex items-center justify-center">
                        <AirportFromIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">Multi-City Journey</p>
                        <p className="text-sm text-gray-500">{flight.segments?.length || 0} segments</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Duration: {flight.totalDuration}</p>
                    <p className="text-xs text-gray-400">{flight.segments?.length || 0} flights</p>
                </div>
            </div>

            {/* Flight Segments */}
            <div className="space-y-4">
                {flight.segments?.map((segment: FlightSegment, index: number) => (
                    <div key={index} className="border border-gray-100 rounded-lg p-4">
                        {/* Segment Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center p-1">
                                    {segment.logo && segment.logo.trim() !== '' ? (
                                        <Image src={segment.logo} alt={segment.airline} width={28} height={28} className="object-contain w-full h-full" style={{height: 'auto'}} />
                                    ) : (
                                        <AirportFromIcon className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                <span className="text-sm font-medium">{segment.airline}</span>
                                <span className="text-xs text-gray-500">{segment.flightNumber}</span>
                            </div>

                        </div>

                        {/* Segment Route */}
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-900">{segment.departure.time}</p>
                                <p className="text-sm text-gray-500">{segment.departure.airport}</p>
                                <p className="text-xs text-gray-400">{segment.departure.city}</p>
                                {departureDates && departureDates[index] && (
                                    <p className="text-xs text-[#0abab5] font-medium mt-1">{formatFlightDate(departureDates[index])}</p>
                                )}
                            </div>
                            
                            <div className="flex-1 mx-4">
                                <div className="flex items-center justify-center relative">
                                    <div className="w-full h-px bg-gray-200"></div>
                                    <div className="absolute bg-white px-2">
                                        <AirportFromIcon className="w-3 h-3 text-[#0abab5]" />
                                    </div>
                                </div>
                                <div className="text-center mt-1">
                                    <p className="text-xs font-medium text-gray-600">{segment.duration}</p>
                                    <p className="text-xs text-gray-400">
                                        {segment.stops === 0 ? 'Non-stop' : (
                                            segment.stopoverAirports && segment.stopoverAirports.length > 0 
                                                ? `${segment.stops} stop${segment.stops > 1 ? 's' : ''} via ${segment.stopoverAirports.map(airport => `${airport.code} (${airport.country})`).join(', ')}`
                                                : `${segment.stops} stop${segment.stops > 1 ? 's' : ''}`
                                        )}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-900">{segment.arrival.time}</p>
                                <p className="text-sm text-gray-500">{segment.arrival.airport}</p>
                                <p className="text-xs text-gray-400">{segment.arrival.city}</p>
                                {departureDates && departureDates[index] && (
                                    <p className="text-xs text-[#0abab5] font-medium mt-1">{formatFlightDate(departureDates[index])}</p>
                                )}
                            </div>
                        </div>

                        {/* Segment Amenities */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                            <span className="text-xs text-gray-500">Amenities:</span>
                            <div className="flex gap-1">
                                {segment.amenities?.map((amenity: string, amenityIndex: number) => (
                                    <div key={amenityIndex} className="text-[#0abab5]" title={amenity}>
                                        {getAmenityIcon(amenity)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Journey Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                <div>
                    <p className="text-sm text-gray-500">{flight.class}</p>
                    <p className="text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <Users size={12} />
                            per passenger
                        </span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Starting from</p>
                    <p className="text-2xl font-bold text-[#0abab5]">
                        ${flight.totalPrice}
                    </p>
                    <p className="text-sm text-gray-500">USD</p>
                </div>
            </div>


        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FlightCard = ({ flight, isSelected, onSelect, tripType, passengers, departureDate, returnDate }: { flight: GeneratedFlight, isSelected: boolean, onSelect: () => void, tripType?: string, passengers?: string, departureDate?: string, returnDate?: string }) => {
    // Flight price calculation
    const [showReturnFlight, setShowReturnFlight] = useState(false);
    const getAmenityIcon = (amenity: string) => {
        switch (amenity) {
            case 'wifi': return <Wifi size={16} />;
            case 'entertainment': return <Monitor size={16} />;
            case 'meal': return <Coffee size={16} />;
            default: return null;
        }
    };

    // Use seats left from flight data
    const seatsLeft = flight.seatsLeft;
    


    // Format date for display
    const formatFlightDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div 
            className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg relative ${
                isSelected ? 'border-[#ec5e39] shadow-lg ring-2 ring-[#ec5e39]/20' : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={onSelect}
        >
            {isSelected && (
                <div className="absolute -top-2 -right-2 bg-[#ec5e39] text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                    Selected Flight
                </div>
            )}

            
            {/* Airline Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                        {flight.logo && flight.logo.trim() !== '' ? (
                            <Image src={flight.logo} alt={flight.airline} width={48} height={48} className="object-contain w-full h-full" style={{height: 'auto'}} />
                        ) : (
                            <AirportFromIcon className="w-8 h-8 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{flight.airline}</p>
                        <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                    </div>
                </div>

            </div>

            {/* Flight Times */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{flight.departure.time}</p>
                    <p className="text-sm text-gray-500">{flight.departure.airport}</p>
                    <p className="text-xs text-gray-400">{flight.departure.city}</p>
                    {flight.departure.date && (
                        <p className="text-xs text-[#0abab5] font-medium mt-1">{formatFlightDate(flight.departure.date)}</p>
                    )}
                </div>
                
                <div className="flex-1 mx-6">
                    <div className="flex items-center justify-center relative">
                        <div className="w-full h-px bg-gray-200"></div>
                        <div className="absolute bg-white px-2">
                            <AirportFromIcon className="w-4 h-4 text-[#0abab5]" />
                        </div>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-sm font-medium text-gray-600">{flight.duration}</p>
                        <p className="text-xs text-gray-400">
                            {flight.stops === 0 ? 'Non-stop' : (
                                flight.stopoverAirports && flight.stopoverAirports.length > 0 
                                    ? `${flight.stops} stop${flight.stops > 1 ? 's' : ''} via ${flight.stopoverAirports.map(airport => `${airport.code} (${airport.country})`).join(', ')}`
                                    : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`
                            )}
                        </p>
                    </div>
                </div>
                
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{flight.arrival.time}</p>
                    <p className="text-sm text-gray-500">{flight.arrival.airport}</p>
                    <p className="text-xs text-gray-400">{flight.arrival.city}</p>
                    {flight.arrival.date && (
                        <p className="text-xs text-[#0abab5] font-medium mt-1">
                            {formatFlightDate(flight.arrival.date)}
                        </p>
                    )}
                </div>
            </div>

            {/* Amenities */}
            <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-gray-500">Amenities:</span>
                <div className="flex gap-2">
                    {flight.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="text-[#0abab5]" title={amenity}>
                            {getAmenityIcon(amenity)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Seats Left Indicator */}
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-orange-600 font-medium">
                        Only {seatsLeft} seats left at this price
                    </span>
                </div>
            </div>

            {/* Return Flight Toggle Button for Round Trip */}
        {tripType === 'Round Trip' && flight.returnFlight && (
                <div className="mb-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowReturnFlight(!showReturnFlight);
                        }}
                        className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium cursor-pointer
                            ${showReturnFlight ? 'bg-[#1C5E59] text-white border-[#1C5E59]' : 'bg-[#1C5E59] text-white border-[#1C5E59] hover:bg-[#1C5E59]/90'}
                            transition-colors`}
                    >
                        {showReturnFlight ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {showReturnFlight ? 'Hide return flight' : 'Show return flight'}
                    </button>
                </div>
            )}

            {/* Return Flight Details */}
            {tripType === 'Round Trip' && flight.returnFlight && showReturnFlight && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                        <ArrowLeftRight size={16} className="text-[#0abab5]" />
                        <span className="text-sm font-medium text-gray-700">Return Flight</span>
                    </div>
                    
                    {/* Return Flight Header */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            {flight.returnFlight.logo && flight.returnFlight.logo.trim() !== '' ? (
                                <Image src={flight.returnFlight.logo} alt={flight.returnFlight.airline} width={20} height={20} className="object-contain" style={{height: 'auto'}} />
                            ) : (
                                <AirportFromIcon className="w-4 h-4 text-gray-400" />
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{flight.returnFlight.airline}</p>
                            <p className="text-xs text-gray-500">{flight.returnFlight.flightNumber}</p>
                        </div>
                    </div>

                    {/* Return Flight Times */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">{flight.returnFlight.departure.time}</p>
                            <p className="text-xs text-gray-500">{flight.returnFlight.departure.airport}</p>
                            <p className="text-xs text-gray-400">{flight.returnFlight.departure.city}</p>
                            {flight.returnFlight.departure.date && (
                                <p className="text-xs text-[#0abab5] font-medium mt-1">{formatFlightDate(flight.returnFlight.departure.date)}</p>
                            )}
                        </div>
                        
                        <div className="flex-1 mx-4">
                            <div className="flex items-center justify-center relative">
                                <div className="w-full h-px bg-gray-300"></div>
                                <div className="absolute bg-gray-50 px-2">
                                    <AirportFromIcon className="w-3.5 h-3.5 text-[#0abab5]" />
                                </div>
                            </div>
                            <div className="text-center mt-1">
                                <p className="text-xs font-medium text-gray-600">{flight.returnFlight.duration}</p>
                                <p className="text-xs text-gray-400">
                                    {flight.returnFlight.stops === 0 ? 'Non-stop' : (
                                        flight.returnFlight.stopoverAirports && flight.returnFlight.stopoverAirports.length > 0 
                                            ? `${flight.returnFlight.stops} stop${flight.returnFlight.stops > 1 ? 's' : ''} via ${flight.returnFlight.stopoverAirports.map(airport => `${airport.code} (${airport.country})`).join(', ')}`
                                            : `${flight.returnFlight.stops} stop${flight.returnFlight.stops > 1 ? 's' : ''}`
                                    )}
                                </p>
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">{flight.returnFlight.arrival.time}</p>
                            <p className="text-xs text-gray-500">{flight.returnFlight.arrival.airport}</p>
                            <p className="text-xs text-gray-400">{flight.returnFlight.arrival.city}</p>
                            {flight.returnFlight.arrival.date && (
                                <p className="text-xs text-[#0abab5] font-medium mt-1">{formatFlightDate(flight.returnFlight.arrival.date)}</p>
                            )}
                        </div>
                    </div>

                    {/* Return Flight Amenities */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Amenities:</span>
                        <div className="flex gap-1">
                            {flight.returnFlight.amenities.map((amenity: string, index: number) => (
                                <div key={index} className="text-[#0abab5]" title={amenity}>
                                    {getAmenityIcon(amenity)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                    <p className="text-sm text-gray-500">{flight.class} • {tripType === 'Round Trip' ? 'Round trip' : 'One way'}</p>
                    <p className="text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <Users size={12} />
                            per passenger
                        </span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Starting from</p>
                    <p className="text-3xl font-bold text-[#0abab5]">
                        ${flight.price}
                    </p>
                    <p className="text-sm text-gray-500">USD</p>
                </div>
            </div>

            {/* Mobile Fixed Bottom Bar removed from here */}
        </div>
    );
};


function isMultiCityFlight(flight: MultiCityFlight | GeneratedFlight): flight is MultiCityFlight {
    return 'segments' in flight && Array.isArray(flight.segments);
}

// Removed old header block (replaced by unified FlightSummaryChips)

function SearchResultsContentMain() {
    const searchParams = useSearchParams();
    const flightSearch = useFlightSearch();
    const {
        setFromInput,
        setFromSelection,
        setToInput,
        setToSelection,
        setDepartureDate,
        setReturnDate,
        setPassengers,
        setTripType,
        setSelectedClass,
        selectedClass,
    } = flightSearch;

    const [selectedFlight, setSelectedFlight] = useState<number | null>(null);
    const [isSelectedSummaryOpen, setIsSelectedSummaryOpen] = useState(false);
    const selectedSummaryVariant: 'card' | 'bar' | 'ticket' | 'lux' = 'bar';

    const [flights, setFlights] = useState<(GeneratedFlight | MultiCityFlight)[]>([]);
    const [stickyFormOffset, setStickyFormOffset] = useState(16); // 1rem = 16px

    useEffect(() => {
        const trip = searchParams.get('tripType');
        let fromCode, toCode;
        
        if (trip === 'Multi-city') {
            // For multi-city, get all from/to parameters
            const fromParams = searchParams.getAll('from');
            const toParams = searchParams.getAll('to');
            fromCode = fromParams[0]; // First departure
            toCode = toParams[toParams.length - 1]; // Last destination
        } else {
            fromCode = searchParams.get('from');
            toCode = searchParams.get('to');
        }
        
        const departure = searchParams.get('departureDate');
        const returnValue = searchParams.get('returnDate');
        const pass = searchParams.get('passengers');
        const flightClass = searchParams.get('class');

        if (fromCode) {
            const airport = airportsMap.get(fromCode) as Airport | undefined;
            if (airport) {
                setFromInput(airport.name);
                setFromSelection(airport);
            }
        }
        if (toCode) {
            const airport = airportsMap.get(toCode) as Airport | undefined;
            if (airport) {
                setToInput(airport.name);
                setToSelection(airport);
            }
        }
        if (departure) {
            setDepartureDate(new Date(departure + 'T00:00:00'));
        }
        if (returnValue) {
            setReturnDate(new Date(returnValue + 'T00:00:00'));
        }
        if (pass) {
            const adults = parseInt(searchParams.get('adults') || pass, 10);
            const children = parseInt(searchParams.get('children') || '0', 10);
            const infants = parseInt(searchParams.get('infants') || '0', 10);
            setPassengers({ adults, children, infants });
        }
        if (trip) {
            setTripType(trip as 'One-way' | 'Round Trip' | 'Multi-city');
        }
        if (flightClass) {
            setSelectedClass(flightClass);
        }

        const generateFlights = async () => {
            if (trip === 'Multi-city') {
                // Handle multi-city flights
                const fromParams = searchParams.getAll('from');
                const toParams = searchParams.getAll('to');
                const dateParams = searchParams.getAll('departureDate');
                const flightClass = searchParams.get('class') || 'Business class';
                
                // Multi-city params
                
                if (fromParams.length > 0 && toParams.length > 0 && fromParams.length === toParams.length) {
                    const segments: { from: string; to: string; date: string }[] = fromParams.map((from, index) => ({
                        from,
                        to: toParams[index],
                        date: dateParams[index] || '2024-12-15'
                    }));
                    
                    // Get selected airlines and durations for each segment
                    const selectedFlights: {airline?: string, duration?: string}[] = [];
                    for (let i = 0; i < segments.length; i++) {
                        const segmentIndex = i + 1; // 1-based indexing for URL params
                        const selectedAirline = searchParams.get(`selectedAirline${segmentIndex === 1 ? '' : segmentIndex}`);
                        const selectedDuration = searchParams.get(`selectedDuration${segmentIndex === 1 ? '' : segmentIndex}`);
                        
                        selectedFlights.push({
                            airline: selectedAirline || undefined,
                            duration: selectedDuration || undefined
                        });
                    }
                    
                    // Generating multi-city flights
                    const generatedFlights = await generateMultiCityFlightsFromSegments(segments, flightClass, selectedFlights);
                    // Generated multi-city flights
                    setFlights(generatedFlights);
                }
            } else {
                // Handle regular flights
                fromCode = searchParams.get('from');
                toCode = searchParams.get('to');
                
                // Use default values if parameters are missing
                const finalFromCode = fromCode || 'LHR';
                const finalToCode = toCode || 'MUC';
                const finalFlightClass = flightClass || 'Business class';
                
                // Generating flights
                
                if (finalFromCode && finalToCode && finalFlightClass) {
                    const departure = searchParams.get('departureDate');
                    const returnValue = searchParams.get('returnDate');
                    
                    // Get selected flight parameters from URL
                    const selectedAirline = searchParams.get('selectedAirline');
                    const selectedPrice = searchParams.get('selectedPrice');
                    const selectedDuration = searchParams.get('selectedDuration');
                    
                    let selectedFlight = undefined;
                    if (selectedAirline && selectedPrice && selectedDuration) {
                        selectedFlight = {
                            airline: selectedAirline,
                            price: parseInt(selectedPrice),
                            duration: selectedDuration
                        };
                        // Selected flight to include
                    }
                    
                    const generatedFlights = await generateFlightsClient(finalFromCode, finalToCode, finalFlightClass, tripType, departure || undefined, returnValue || undefined, selectedFlight);
                    // Generated flights
                    setFlights(generatedFlights);
                }
            }
        };
        
        generateFlights();
    }, [searchParams]);

    // Auto-select flight based on URL parameters
    useEffect(() => {
        const tripType = searchParams.get('tripType');
        
        if (tripType === 'Multi-city') {
            // Handle multi-city flight auto-selection
            const selectedAirline1 = searchParams.get('selectedAirline');
            const selectedAirline2 = searchParams.get('selectedAirline2');
            const selectedDuration1 = searchParams.get('selectedDuration');
            const selectedDuration2 = searchParams.get('selectedDuration2');
            
            if ((selectedAirline1 || selectedAirline2 || selectedDuration1 || selectedDuration2) && flights.length > 0) {
                // Find multi-city flight that matches the selected parameters
                const flightIndex = flights.findIndex((flight) => {
                    if (!isMultiCityFlight(flight)) {
                        return false;
                    }
                    const multiCityFlight = flight as MultiCityFlight;
                    
                    // Check if any segment matches the selected criteria
                    let matches = 0;
                    const totalSegments = multiCityFlight.segments.length;
                    
                    if (selectedAirline1 && multiCityFlight.segments[0]?.airline === selectedAirline1) matches++;
                    if (selectedAirline2 && multiCityFlight.segments[1]?.airline === selectedAirline2) matches++;
                    if (selectedDuration1 && multiCityFlight.segments[0]?.duration === selectedDuration1) matches++;
                    if (selectedDuration2 && multiCityFlight.segments[1]?.duration === selectedDuration2) matches++;
                    
                    // Select if at least one parameter matches
                    return matches > 0;
                });
                
                if (flightIndex !== -1) {
                    setSelectedFlight(flightIndex);
                }
            }
        } else {
            // Handle regular flight auto-selection
            const selectedAirline = searchParams.get('selectedAirline');
            const selectedPrice = searchParams.get('selectedPrice');
            const selectedDuration = searchParams.get('selectedDuration');
            
            if (selectedAirline && selectedPrice && selectedDuration && flights.length > 0) {
                // Find the flight that matches the selected parameters
                const targetPrice = parseInt(selectedPrice);
                const flightIndex = flights.findIndex((flight) => {
                    if (isMultiCityFlight(flight)) {
                        return false;
                    }
                    const regularFlight = flight as GeneratedFlight;
                    // More lenient matching: allow greater price variance and up to 2h duration difference
                    const extractHours = (d: string) => {
                        const m = d.match(/(\d+)h/);
                        return m ? parseInt(m[1]) : 0;
                    };
                    return regularFlight.airline === selectedAirline && 
                           Math.abs((regularFlight.totalPrice || regularFlight.price) - targetPrice) <= 100 &&
                           Math.abs(extractHours(regularFlight.duration) - extractHours(selectedDuration)) <= 2;
                });
                
                if (flightIndex !== -1) {
                    setSelectedFlight(flightIndex);
                } else {
                    // If exact match not found, select the first flight from the same airline
                    const airlineIndex = flights.findIndex((flight) => {
                        if (isMultiCityFlight(flight)) {
                            return false;
                        }
                        return (flight as GeneratedFlight).airline === selectedAirline;
                    });
                    
                    if (airlineIndex !== -1) {
                        setSelectedFlight(airlineIndex);
                    }
                }
            }
        }
    }, [flights, searchParams]);

    const tripType = searchParams.get('tripType') || (searchParams.get('returnDate') ? 'Round Trip' : 'One-way');
    let fromCode, toCode;
    let allFromCodes: string[] = [];
    let allToCodes: string[] = [];
    
    if (tripType === 'Multi-city') {
        // For multi-city, get all from/to parameters
        const fromParams = searchParams.getAll('from');
        const toParams = searchParams.getAll('to');
        
        allFromCodes = fromParams;
        allToCodes = toParams;
        
        // Use first and last destinations for display
        fromCode = fromParams[0] || 'LHR';
        toCode = toParams[toParams.length - 1] || 'MUC';
    } else {
        fromCode = searchParams.get('from') || 'LHR';
        toCode = searchParams.get('to') || 'MUC';
    }
    const passengers = searchParams.get('passengers') || '1';
    const adults = parseInt(searchParams.get('adults') || passengers, 10);
    const children = parseInt(searchParams.get('children') || '0', 10);
    const infants = parseInt(searchParams.get('infants') || '0', 10);
    const departureDate = searchParams.get('departureDate') || undefined;
    const returnDate = searchParams.get('returnDate') || searchParams.get('return') || undefined;

    const fromAirport = airportsMap.get(fromCode);
    const toAirport = airportsMap.get(toCode);
    
    // Format departure date
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'Dec 15, 2024';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const [isMobileQuoteOpen, setIsMobileQuoteOpen] = useState(false);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6 pb-20 lg:pb-8">

            {/* Selected Flight Full-Width Sticky */}
            {selectedFlight !== null && flights[selectedFlight] && (
                <div className="hidden lg:block sticky top-4 z-30 mb-6 -mx-2 sm:-mx-4 lg:-mx-6">
                     {(() => {
                         const variant = selectedSummaryVariant as 'card' | 'bar' | 'ticket' | 'lux';
                         if (variant === 'bar') {
                             return (
                                <div className="rounded-2xl shadow-xl ring-1 ring-[#0abab5]/20 border border-[#0abab5]/30 bg-[#0abab5] text-white">
                                    <button type="button" className="w-full flex items-center justify-between px-8 py-6 cursor-pointer" onClick={() => setIsSelectedSummaryOpen(o => !o)}>
                                         <div className="flex-1 min-w-0">
                                             {isMultiCityFlight(flights[selectedFlight]) ? (() => {
                                                 const mc = flights[selectedFlight] as MultiCityFlight;
                                                 const airlines = Array.from(new Set(mc.segments.map(s => s.airline)));
                                                 const airlineLabel = airlines.length === 1 ? airlines[0] : 'Various airlines';
                                                 const numbers = mc.segments.map(s => s.flightNumber);
                                                 const shown = numbers.slice(0, 2).join(', ');
                                                 const tail = numbers.length > 2 ? '…' : '';
                                                 const fromApt = mc.segments[0]?.departure.airport;
                                                 const toApt = mc.segments[mc.segments.length - 1]?.arrival.airport;
                                                 return (
                                                     <div className="flex items-center gap-4">
                                                         <div className="text-lg font-bold text-white truncate">{airlineLabel}</div>
                                                         <div className="text-sm text-white/90 truncate">{shown}{tail}</div>
                                                         <div className="flex items-center gap-2 text-sm text-white/95">
                                                            {fromApt && toApt && (
                                                                <span className="px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white font-semibold">{fromApt} → {toApt}</span>
                                                            )}
                                                             <span className="px-3 py-1.5 rounded-full bg-white/15 text-white">{mc.segments.length} segment{mc.segments.length > 1 ? 's' : ''}</span>
                                                             {mc.totalDuration && (
                                                                 <span className="px-3 py-1.5 rounded-full bg-white/15 text-white">{mc.totalDuration}</span>
                                                             )}
                                                         </div>
                                                     </div>
                                                 );
                                             })() : (() => {
                                                 const f = flights[selectedFlight] as GeneratedFlight;
                                                 const airlineLabel = f.airline;
                                                 const numbers = `${f.flightNumber}${f.returnFlight?.flightNumber ? ` / ${f.returnFlight.flightNumber}` : ''}`;
                                                 return (
                                                     <div className="flex items-center gap-4">
                                                         <div className="text-lg font-bold text-white truncate">{airlineLabel}</div>
                                                         <div className="text-sm text-white/90 truncate">{numbers}</div>
                                                         <div className="flex items-center gap-2 text-sm text-white/95">
                                                            <span className="px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white font-semibold">{f.departure.airport} → {f.arrival.airport}</span>
                                                             <span className="px-3 py-1.5 rounded-full bg-white/15 text-white">{f.departure.time} — {f.arrival.time}</span>
                                                             {f.duration && (
                                                                 <span className="px-3 py-1.5 rounded-full bg-white/15 text-white">{f.duration}</span>
                                                             )}
                                                             {typeof f.stops === 'number' && (
                                                                 <span className="px-3 py-1.5 rounded-full bg-white/15 text-white">{f.stops === 0 ? 'Non-stop' : `${f.stops} stop${f.stops > 1 ? 's' : ''}`}</span>
                                                             )}
                                                             {tripType === 'Round Trip' && f.returnFlight && (
                                                                 <span className="px-3 py-1.5 rounded-full bg-white/15 text-white">Return included</span>
                                                             )}
                                                             {typeof f.seatsLeft === 'number' && f.seatsLeft > 0 && (
                                                                 <span className="px-3 py-1.5 rounded-full text-white border border-[#ec5e39]/40 font-semibold" style={{backgroundColor: '#ec5e39'}}>{f.seatsLeft} seat{f.seatsLeft > 1 ? 's' : ''} left</span>
                                                             )}
                                                         </div>
                                                     </div>
                                                 );
                                             })()}
                                         </div>
                                         <div className="ml-6 text-right">
                                             <div className="text-3xl font-bold text-white">
                                                 {isMultiCityFlight(flights[selectedFlight])
                                                     ? `$${calculateTotalPriceWithPassengers((flights[selectedFlight] as MultiCityFlight).totalPrice, adults, children, infants).totalPrice.toLocaleString()}`
                                                     : `$${calculateTotalPriceWithPassengers(((flights[selectedFlight] as GeneratedFlight).totalPrice || (flights[selectedFlight] as GeneratedFlight).price), adults, children, infants).totalPrice.toLocaleString()}`}
                                             </div>
                                             <div className="text-sm text-white/90">total for {passengers} passenger{parseInt(passengers) > 1 ? 's' : ''}</div>
                                         </div>
                                     </button>
                                     {isSelectedSummaryOpen && (
                                         <div className="px-3 pb-3">
                                             <div className="pt-2 border-t">
                                                 <CountdownTimer />
                                             </div>
                                         </div>
                                     )}
                                 </div>
                             );
                         }
                         if (variant === 'ticket') {
                             return (
                                 <div className="bg-white rounded-xl shadow-sm border p-4">
                                     <div className="flex items-center justify-between gap-3">
                                         <div className="min-w-0">
                                             {isMultiCityFlight(flights[selectedFlight]) ? (() => {
                                                 const mc = flights[selectedFlight] as MultiCityFlight;
                                                 const airlines = Array.from(new Set(mc.segments.map(s => s.airline)));
                                                 const airlineLabel = airlines.length === 1 ? airlines[0] : 'Various airlines';
                                                 const numbers = mc.segments.map(s => s.flightNumber);
                                                 const shown = numbers.slice(0, 3).join(' • ');
                                                 const tail = numbers.length > 3 ? '…' : '';
                                                 return (
                                                     <div className="truncate">
                                                         <div className="text-sm font-semibold text-gray-800 truncate">{airlineLabel}</div>
                                                         <div className="text-xs text-gray-500 truncate">{shown}{tail}</div>
                                                     </div>
                                                 );
                                             })() : (() => {
                                                 const f = flights[selectedFlight] as GeneratedFlight;
                                                 const airlineLabel = f.airline;
                                                 const numbers = `${f.flightNumber}${f.returnFlight?.flightNumber ? ` • ${f.returnFlight.flightNumber}` : ''}`;
                                                 return (
                                                     <div className="truncate">
                                                         <div className="text-sm font-semibold text-gray-800 truncate">{airlineLabel}</div>
                                                         <div className="text-xs text-gray-500 truncate">{numbers}</div>
                                                     </div>
                                                 );
                                             })()}
                                         </div>
                                         <div className="text-right shrink-0">
                                             <div className="text-xl font-bold text-[#0abab5]">
                                                 {isMultiCityFlight(flights[selectedFlight])
                                                     ? `$${calculateTotalPriceWithPassengers((flights[selectedFlight] as MultiCityFlight).totalPrice, adults, children, infants).totalPrice.toLocaleString()}`
                                                     : `$${calculateTotalPriceWithPassengers(((flights[selectedFlight] as GeneratedFlight).totalPrice || (flights[selectedFlight] as GeneratedFlight).price), adults, children, infants).totalPrice.toLocaleString()}`}
                                             </div>
                                             <div className="text-[11px] text-gray-500">for {passengers}</div>
                                         </div>
                                     </div>
                                     <div className="mt-3">
                                         <CountdownTimer />
                                     </div>
                                 </div>
                             );
                         }
                         if (variant === 'lux') {
                             return (
                                 <div className="relative overflow-hidden rounded-2xl border shadow-sm bg-white">
                                     <div className="p-5">
                                         <div className="flex items-center justify-between gap-4">
                                             <div className="flex items-center gap-3 min-w-0">
                                                 <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
                                                     <AirportFromIcon className="w-5 h-5 text-[#0ABAB5]" />
                                                 </div>
                                                 <div className="min-w-0">
                                                     {isMultiCityFlight(flights[selectedFlight]) ? (() => {
                                                         const mc = flights[selectedFlight] as MultiCityFlight;
                                                         const airlines = Array.from(new Set(mc.segments.map(s => s.airline)));
                                                         const airlineLabel = airlines.length === 1 ? airlines[0] : 'Various airlines';
                                                         const numbers = mc.segments.map(s => s.flightNumber).slice(0, 3).join(' • ');
                                                         return (
                                                             <>
                                                                 <div className="text-sm font-semibold text-[#08312F] truncate">{airlineLabel}</div>
                                                                 <div className="text-xs text-[#08312F]/70 truncate">{numbers}</div>
                                                             </>
                                                         );
                                                     })() : (() => {
                                                         const f = flights[selectedFlight] as GeneratedFlight;
                                                         const numbers = `${f.flightNumber}${f.returnFlight?.flightNumber ? ` • ${f.returnFlight.flightNumber}` : ''}`;
                                                         return (
                                                             <>
                                                                 <div className="text-sm font-semibold text-[#08312F] truncate">{f.airline}</div>
                                                                 <div className="text-xs text-[#08312F]/70 truncate">{numbers}</div>
                                                             </>
                                                         );
                                                     })()}
                                                 </div>
                                             </div>
                                             <div className="text-right">
                                                 <div className="text-2xl font-extrabold text-[#08312F]">
                                                     {isMultiCityFlight(flights[selectedFlight])
                                                         ? `$${calculateTotalPriceWithPassengers((flights[selectedFlight] as MultiCityFlight).totalPrice, adults, children, infants).totalPrice.toLocaleString()}`
                                                         : `$${calculateTotalPriceWithPassengers(((flights[selectedFlight] as GeneratedFlight).totalPrice || (flights[selectedFlight] as GeneratedFlight).price), adults, children, infants).totalPrice.toLocaleString()}`}
                                                 </div>
                                                 <div className="text-xs text-[#08312F]/70">total for {passengers} passenger{parseInt(passengers) > 1 ? 's' : ''}</div>
                                             </div>
                                         </div>
                                         {!isMultiCityFlight(flights[selectedFlight]) && (() => {
                                             const f = flights[selectedFlight] as GeneratedFlight;
                                             return (
                                                 <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                                                     <span className="px-2 py-1 rounded-full bg-white/80 text-[#08312F] border border-white/60">{f.departure.airport} → {f.arrival.airport}</span>
                                                     {tripType === 'Round Trip' && f.returnFlight && (
                                                         <span className="px-2 py-1 rounded-full bg-white/80 text-[#08312F] border border-white/60">Return included</span>
                                                     )}
                                                     {f.stops === 0 ? (
                                                         <span className="px-2 py-1 rounded-full bg-white/80 text-[#08312F] border border-white/60">Non-stop</span>
                                                     ) : (
                                                         <span className="px-2 py-1 rounded-full bg-white/80 text-[#08312F] border border-white/60">{f.stops} stop{f.stops > 1 ? 's' : ''}</span>
                                                     )}
                                                 </div>
                                             );
                                         })()}
                                         <div className="mt-4">
                                             <CountdownTimer />
                                         </div>
                                     </div>
                                 </div>
                             );
                         }
                         // default card
                         return (
                             <div className="bg-white rounded-xl shadow-sm border">
                                 <button type="button" className="w-full flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setIsSelectedSummaryOpen(o => !o)}>
                                     <div className="flex-1 min-w-0">
                                         {isMultiCityFlight(flights[selectedFlight]) ? (() => {
                                             const mc = flights[selectedFlight] as MultiCityFlight;
                                             const airlines = Array.from(new Set(mc.segments.map(s => s.airline)));
                                             const airlineLabel = airlines.length === 1 ? airlines[0] : 'Various airlines';
                                             const numbers = mc.segments.map(s => s.flightNumber);
                                             const shown = numbers.slice(0, 2).join(', ');
                                             const tail = numbers.length > 2 ? '…' : '';
                                             return (
                                                 <div className="text-left">
                                                     <div className="text-sm font-medium text-gray-800 truncate">Selected Flight — {airlineLabel}</div>
                                                     <div className="text-xs text-gray-500 truncate">{shown}{tail}</div>
                                                 </div>
                                             );
                                         })() : (() => {
                                             const f = flights[selectedFlight] as GeneratedFlight;
                                             const airlineLabel = f.airline;
                                             const numbers = `${f.flightNumber}${f.returnFlight?.flightNumber ? ` / ${f.returnFlight.flightNumber}` : ''}`;
                                             return (
                                                 <div className="text-left">
                                                     <div className="text-sm font-medium text-gray-800 truncate">Selected Flight — {airlineLabel}</div>
                                                     <div className="text-xs text-gray-500 truncate">{numbers}</div>
                                                 </div>
                                             );
                                         })()}
                                     </div>
                                     <div className="ml-3 text-right">
                                         <div className="text-lg font-bold text-[#0abab5]">
                                             {isMultiCityFlight(flights[selectedFlight])
                                                 ? `$${calculateTotalPriceWithPassengers((flights[selectedFlight] as MultiCityFlight).totalPrice, adults, children, infants).totalPrice.toLocaleString()}`
                                                 : `$${calculateTotalPriceWithPassengers(((flights[selectedFlight] as GeneratedFlight).totalPrice || (flights[selectedFlight] as GeneratedFlight).price), adults, children, infants).totalPrice.toLocaleString()}`}
                                         </div>
                                         <div className="text-[11px] text-gray-500">total for {passengers} passenger{parseInt(passengers) > 1 ? 's' : ''}</div>
                                     </div>
                                 </button>
                                 {isSelectedSummaryOpen && (
                                     <div className="px-4 pb-4">
                                         <div className="pt-3 border-t">
                                             <CountdownTimer />
                                         </div>
                                     </div>
                                 )}
                             </div>
                         );
                     })()}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="space-y-6">
                        {flights.length > 0 ? (
                            flights.map((flight, index) => (
                                isMultiCityFlight(flight) ? (
                                    <MultiCityFlightCard
                                        key={index}
                                        flight={flight}
                                        isSelected={selectedFlight === index}
                                        onSelect={() => setSelectedFlight(index)}
                                        departureDates={searchParams.getAll('departureDate')}
                                    />
                                ) : (
                                    <FlightCard
                                        key={index}
                                        flight={flight}
                                        isSelected={selectedFlight === index}
                                        onSelect={() => setSelectedFlight(index)}
                                        tripType={tripType}
                                        passengers={passengers}
                                        departureDate={departureDate}
                                        returnDate={returnDate}
                                    />
                                )
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-500">Loading flights...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32">
                        {/* Search Form */}
                        <FlightSearchFormVertical 
                            selectedFlight={selectedFlight !== null && flights[selectedFlight] ? (
                                isMultiCityFlight(flights[selectedFlight]) ? null : flights[selectedFlight] as GeneratedFlight
                            ) : undefined}
                            selectedMultiCityFlight={selectedFlight !== null && flights[selectedFlight] && isMultiCityFlight(flights[selectedFlight]) ? 
                                flights[selectedFlight] as MultiCityFlight : undefined}
                            passengers={passengers}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Bottom Bar */}
            {selectedFlight !== null && flights[selectedFlight] && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-600">Selected Flight</div>
                            <div className="font-semibold">
                                {isMultiCityFlight(flights[selectedFlight]) ? (
                                    `Multi-city - $${calculateTotalPriceWithPassengers((flights[selectedFlight] as MultiCityFlight).totalPrice, adults, children, infants).totalPrice.toLocaleString()}`
                                ) : (
                                    `${(flights[selectedFlight] as GeneratedFlight).departure.airport} → ${(flights[selectedFlight] as GeneratedFlight).arrival.airport} - $${calculateTotalPriceWithPassengers(((flights[selectedFlight] as GeneratedFlight).totalPrice || (flights[selectedFlight] as GeneratedFlight).price), adults, children, infants).totalPrice.toLocaleString()}`
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                total for {passengers} passenger{parseInt(passengers) > 1 ? 's' : ''}
                            </div>
                        </div>
                        <button onClick={() => setIsMobileQuoteOpen(true)} className="bg-[#EC5E39] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#d95733] transition-colors">
                            Book
                        </button>
                    </div>
                </div>
            )}
            {isMobileQuoteOpen && (
                <div className="fixed inset-0 z-[60] flex flex-col justify-end lg:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileQuoteOpen(false)} />
                    <div className="relative bg-white rounded-t-2xl shadow-lg w-full h-[85vh] p-4 animate-slide-up flex flex-col">
                        <button className="absolute right-4 top-4 cursor-pointer" onClick={() => setIsMobileQuoteOpen(false)} aria-label="Close">
                            <X size={24} />
                        </button>
                        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                        <div className="flex-1 overflow-y-auto">
                            <FlightSearchFormVertical 
                                variant="neutral" 
                                selectedFlight={selectedFlight !== null && flights[selectedFlight] && !isMultiCityFlight(flights[selectedFlight]) ? 
                                    flights[selectedFlight] as GeneratedFlight : undefined}
                                selectedMultiCityFlight={selectedFlight !== null && flights[selectedFlight] && isMultiCityFlight(flights[selectedFlight]) ? 
                                    flights[selectedFlight] as MultiCityFlight : undefined}
                                passengers={passengers}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
function HeroRouteText() {
    const sp = useSearchParams();
    const fromCode = sp.get('from') || '';
    const toCode = sp.get('to') || '';
    const fromAirport = airportsMap.get(fromCode) as Airport | undefined;
    const toAirport = airportsMap.get(toCode) as Airport | undefined;
    const fromCity = fromAirport?.city || fromAirport?.name || fromCode || '';
    const toCity = toAirport?.city || toAirport?.name || toCode || '';

    if (!fromCity && !toCity) return null;

    return (
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-0">
            <div className="text-center text-white">
                <div className="text-[24px] md:text-[72px] font-semibold">
                    {fromCity || '—'} 
                    <span className="opacity-80 mx-2">→</span> 
                    {toCity || '—'}
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="bg-gray-50/50">
            {/* Hero section with solid background */}
            <div className="relative w-full bg-[#0ABAB5] pb-8">
                <div className="absolute inset-0 -z-10 bg-[#0ABAB5] w-full h-full" />
                <Navbar isDarkBackground={true} />
                <Suspense fallback={null}>
                    <HeroRouteText />
                </Suspense>
                <Suspense fallback={null}>
                    <FlightSummaryChips variant="compact" />
                </Suspense>
            </div>

            {/* Main content with light background */}
            <main className="flex min-h-screen flex-col items-center justify-between">
                <Suspense fallback={<div className="text-center py-10">Loading search results...</div>}>
                    <SearchResultsContentMain />
                </Suspense>
            </main>

        </div>
    );
}