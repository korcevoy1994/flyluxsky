"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Navbar from '@/components/navbar';

import FlightSearchFormVertical from '@/components/flight-search-form-vertical';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import Image from 'next/image';
import { ArrowLeftRight, Lock, ShieldCheck, Plane, Wifi, Coffee, Monitor, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { generateFlightsClient, generateMultiCityFlightsFromSegments } from '@/lib/flightGenerator';
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
        </div>
    );
};

const MultiCityFlightCard = ({ flight, isSelected, onSelect, passengers, departureDates }: { flight: MultiCityFlight, isSelected: boolean, onSelect: () => void, passengers?: string, departureDates?: string[] }) => {
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
                isSelected ? 'border-[#0abab5] shadow-lg ring-2 ring-[#0abab5]/20' : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={onSelect}
        >
            {/* Multi-City Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#0abab5] to-[#EC5E39] rounded-lg flex items-center justify-center">
                        <Plane size={20} className="text-white" />
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
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    {segment.logo && segment.logo.trim() !== '' ? (
                                        <Image src={segment.logo} alt={segment.airline} width={16} height={16} className="object-contain" />
                                    ) : (
                                        <Plane size={12} className="text-gray-400" />
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
                                        <Plane size={12} className="text-[#0abab5] transform rotate-90" />
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
                            total for {passengers || '1'} passenger{parseInt(passengers || '1') > 1 ? 's' : ''}
                        </span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-[#0abab5]">
                        ${('totalPrice' in flight ? flight.totalPrice : (flight as GeneratedFlight).price) * parseInt(passengers || '1')}
                    </p>
                    <p className="text-sm text-gray-500">USD total</p>
                </div>
            </div>
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FlightCard = ({ flight, isSelected, onSelect, tripType, passengers, departureDate, returnDate }: { flight: GeneratedFlight, isSelected: boolean, onSelect: () => void, tripType?: string, passengers?: string, departureDate?: string, returnDate?: string }) => {
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
                isSelected ? 'border-[#0abab5] shadow-lg ring-2 ring-[#0abab5]/20' : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={onSelect}
        >

            
            {/* Airline Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                        {flight.logo && flight.logo.trim() !== '' ? (
                            <Image src={flight.logo} alt={flight.airline} width={24} height={24} className="object-contain" />
                        ) : (
                            <Plane size={20} className="text-gray-400" />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{flight.airline}</p>
                        <p className="text-sm text-gray-500">{flight.flightNumber} • {flight.aircraft}</p>
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
                            <Plane size={16} className="text-[#0abab5] transform rotate-90" />
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
                        className="flex items-center gap-2 text-sm text-[#0abab5] hover:text-[#0abab5]/80 transition-colors cursor-pointer"
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
                                <Image src={flight.returnFlight.logo} alt={flight.returnFlight.airline} width={20} height={20} className="object-contain" />
                            ) : (
                                <Plane size={16} className="text-gray-400" />
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{flight.returnFlight.airline}</p>
                            <p className="text-xs text-gray-500">{flight.returnFlight.flightNumber} • {flight.returnFlight.aircraft}</p>
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
                                    <Plane size={14} className="text-[#0abab5] transform rotate-90" />
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
                            total for {passengers || '1'} passenger{parseInt(passengers || '1') > 1 ? 's' : ''}
                        </span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-[#0abab5]">
                        ${flight.price * parseInt(passengers || '1')}
                    </p>
                    <p className="text-sm text-gray-500">USD</p>
                </div>
            </div>
        </div>
    );
};


function isMultiCityFlight(flight: MultiCityFlight | GeneratedFlight): flight is MultiCityFlight {
    return 'segments' in flight && Array.isArray(flight.segments);
}

function SearchResultsContent() {
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

    const [activeSort, setActiveSort] = useState('Best');
    const [selectedFlight, setSelectedFlight] = useState<number | null>(null);

    const [flights, setFlights] = useState<(GeneratedFlight | MultiCityFlight)[]>([]);

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
            setPassengers({ adults: parseInt(pass, 10), children: 0, infants: 0 });
        }
        if (trip) {
            setTripType(trip);
        }
        if (flightClass) {
            setSelectedClass(flightClass);
        }
    }, [searchParams, setFromInput, setFromSelection, setToInput, setToSelection, setDepartureDate, setReturnDate, setPassengers, setTripType, setSelectedClass]);

    // Generate flights when search parameters change
    useEffect(() => {
        const tripType = searchParams.get('tripType') || (searchParams.get('returnDate') ? 'Round Trip' : 'One way');
        const flightClass = searchParams.get('class');
        let fromCode, toCode;
        
        if (tripType === 'Multi-city') {
            // For multi-city, get all from/to parameters
            const fromParams = searchParams.getAll('from');
            const toParams = searchParams.getAll('to');
            const departureDateParams = searchParams.getAll('departureDate');
            
            if (fromParams.length > 0 && toParams.length > 0) {
                fromCode = fromParams[0];
                toCode = toParams[toParams.length - 1];
                
                // Create segments array for multi-city
                const segments = [];
                for (let i = 0; i < Math.min(fromParams.length, toParams.length); i++) {
                    segments.push({
                        from: fromParams[i],
                        to: toParams[i],
                        date: departureDateParams[i] || departureDateParams[0] || ''
                    });
                }
                
                // Generate flights for multi-city using all segments
                const generatedFlights = generateMultiCityFlightsFromSegments(segments, flightClass || 'Business class');
                setFlights(generatedFlights);
            }
        } else {
            fromCode = searchParams.get('from');
            toCode = searchParams.get('to');
            
            if (fromCode && toCode && flightClass) {
                const departure = searchParams.get('departureDate');
                const returnValue = searchParams.get('returnDate');
                const generatedFlights = generateFlightsClient(fromCode, toCode, flightClass, tripType, departure || undefined, returnValue || undefined);
                setFlights(generatedFlights);
            }
        }
    }, [searchParams]);

    const tripType = searchParams.get('tripType') || (searchParams.get('returnDate') ? 'Round Trip' : 'One way');
    let fromCode, toCode;
    
    if (tripType === 'Multi-city') {
        // For multi-city, get all from/to parameters
        const fromParams = searchParams.getAll('from');
        const toParams = searchParams.getAll('to');
        
        // Use first and last destinations for display
        fromCode = fromParams[0] || 'LHR';
        toCode = toParams[toParams.length - 1] || 'MUC';
    } else {
        fromCode = searchParams.get('from') || 'LHR';
        toCode = searchParams.get('to') || 'MUC';
    }
    const passengers = searchParams.get('passengers') || '1';
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

    const sortOptions = {
        Best: { price: 2023, duration: '1h 20 min' },
        Cheapest: { price: 1984, duration: '1h 30 min' },
        Fastest: { price: 2523, duration: '1h 10 min' },
    };
    




    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            {/* Search Summary Header */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="bg-[#0abab5] text-white px-3 py-1 rounded-full text-sm font-medium">{fromCode}</span>
                                <span className="font-semibold">{fromAirport?.name}</span>
                            </div>
                            <ArrowLeftRight size={20} className="text-gray-400"/>
                            <div className="flex items-center gap-2">
                                <span className="bg-[#0abab5] text-white px-3 py-1 rounded-full text-sm font-medium">{toCode}</span>
                                <span className="font-semibold">{toAirport?.name}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>{formatDate(departureDate)}</span>
                                {tripType === 'Round Trip' && returnDate && (
                                    <span> - {formatDate(returnDate)}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <Users size={16} />
                                <span>{passengers} passenger{parseInt(passengers) > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-[#0abab5] rounded-full"></span>
                                <span>{selectedClass}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Sort Options */}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-gray-600 font-medium">Sort by:</span>
                        <div className="flex gap-2">
                            {Object.entries(sortOptions).map(([key]) => (
                                <button 
                                    key={key} 
                                    onClick={() => setActiveSort(key)} 
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                        activeSort === key 
                                            ? 'bg-[#0abab5] text-white shadow-md' 
                                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                        <div className="ml-auto text-sm text-gray-500">
                            {flights.length} flights found
                        </div>
                    </div>

                    {/* Flight Cards */}
                    <div className="space-y-4">
                        {flights.map((flight) => {
                            if (isMultiCityFlight(flight)) {
                                return (
                                    <MultiCityFlightCard 
                                        key={flight.id}
                                        flight={flight}
                                        isSelected={selectedFlight === flight.id}
                                        onSelect={() => setSelectedFlight(flight.id)}
                                        passengers={passengers}
                                        departureDates={searchParams.getAll('departureDate')}
                                    />
                                );
                            } else {
                                return (
                                    <FlightCard 
                                        key={flight.id}
                                        flight={flight}
                                        isSelected={selectedFlight === flight.id}
                                        onSelect={() => setSelectedFlight(flight.id)}
                                        tripType={tripType}
                                        passengers={passengers}
                                        departureDate={departureDate}
                                        returnDate={returnDate}
                                    />
                                );
                            }
                        })} 
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="space-y-6">
                        {/* Selected Flight Summary */}
                        {selectedFlight && (
                            <div className="bg-white rounded-xl shadow-sm border p-3">
                                <h3 className="font-semibold text-sm mb-2">Selected Flight</h3>
                                {(() => {
                                    const flight = flights.find(f => f.id === selectedFlight);
                                    if (!flight) return null;

                                    if (isMultiCityFlight(flight)) {
                                        return (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                                                        <Plane size={12} className="text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">Multi-city Flight</p>
                                                    </div>
                                                </div>
                                                <div className="text-center py-2 border border-gray-100 rounded">
                                                    <p className="text-xl font-bold text-[#0abab5]">
                                                        ${flight.totalPrice * parseInt(passengers || '1')}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        <span className="flex items-center justify-center gap-1">
                                                            <Users size={10} />
                                                            total for {passengers || '1'} passenger{parseInt(passengers || '1') > 1 ? 's' : ''}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <CountdownTimer />
                                                </div>
                                            </div>
                                        )
                                    }

                                    const generatedFlight = flight as GeneratedFlight;

                                    return (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                {generatedFlight.logo && generatedFlight.logo.trim() !== '' ? (
                                                    <Image src={generatedFlight.logo} alt={generatedFlight.airline} width={20} height={20} className="object-contain" />
                                                ) : (
                                                    <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                                                        <Plane size={12} className="text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-sm">{generatedFlight.airline}</p>
                                                    <p className="text-xs text-gray-500">{generatedFlight.flightNumber}</p>
                                                </div>
                                            </div>
                                            <div className="text-center py-2 border border-gray-100 rounded">
                                                <p className="text-xl font-bold text-[#0abab5]">
                                                    ${generatedFlight.price * parseInt(passengers || '1')}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    <span className="flex items-center justify-center gap-1">
                                                        <Users size={10} />
                                                        total for {passengers || '1'} passenger{parseInt(passengers || '1') > 1 ? 's' : ''}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <CountdownTimer />
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Search Form */}
                        <FlightSearchFormVertical onSubmit={() => {}} />

                        {/* Guarantees */}
                        <div className="bg-white rounded-2xl shadow-sm border p-6">
                            <h3 className="font-semibold text-lg mb-4">Why book with us?</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 flex items-center justify-center bg-[#0abab5]/10 rounded-full text-[#0abab5]">
                                        <ArrowLeftRight size={20}/>
                                    </div>
                                    <div>
                                        <p className="font-medium">Free exchange</p>
                                        <p className="text-sm text-gray-500">Change your flight for free</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 flex items-center justify-center bg-[#0abab5]/10 rounded-full text-[#0abab5]">
                                        <Lock size={20}/>
                                    </div>
                                    <div>
                                        <p className="font-medium">Free fare lock</p>
                                        <p className="text-sm text-gray-500">Hold your price for 24h</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 flex items-center justify-center bg-[#0abab5]/10 rounded-full text-[#0abab5]">
                                        <ShieldCheck size={20}/>
                                    </div>
                                    <div>
                                        <p className="font-medium">Refund guaranteed</p>
                                        <p className="text-sm text-gray-500">100% money back guarantee</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="bg-gray-50/50">
            <Navbar />
            <main className="flex min-h-screen flex-col items-center justify-between pt-20">
                <Suspense fallback={<div className="text-center py-10">Loading search results...</div>}>
                    <SearchResultsContent />
                </Suspense>
            </main>

        </div>
    );
}