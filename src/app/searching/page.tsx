"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plane, Loader2 } from 'lucide-react';
import Navbar from '@/components/navbar';

const SearchingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const searchSteps = [
    "Searching for the best flights...",
    "Comparing prices across airlines...",
    "Finding exclusive deals...",
    "Almost ready!"
  ];

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2.5; // 100% in 4 seconds (100/2.5 = 40 intervals * 100ms = 4000ms)
      });
    }, 100);

    // Step animation
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= searchSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000); // Change step every second

    // Redirect after 4 seconds
    const redirectTimer = setTimeout(() => {
      const queryString = searchParams.toString();
      router.replace(`/search?${queryString}`);
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(redirectTimer);
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navbar isDarkBackground={false} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Animated Plane Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-[#0abab5] rounded-full flex items-center justify-center shadow-lg">
              <Plane size={40} className="text-white animate-bounce" />
            </div>
            
            {/* Floating dots animation */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#0abab5] rounded-full animate-ping opacity-75"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-1/2 -right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
          </div>

          {/* Search Status Text */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {searchSteps[currentStep]}
          </h1>
          
          <p className="text-gray-600 mb-8">
            We're finding the perfect flights for your journey
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-[#0abab5] to-cyan-400 h-2 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-sm text-gray-500">
            {Math.round(progress)}% complete
          </div>

          {/* Loading Spinner */}
          <div className="mt-8 flex items-center justify-center space-x-2">
            <Loader2 size={20} className="animate-spin text-[#0abab5]" />
            <span className="text-sm text-gray-600">Processing your request...</span>
          </div>

          {/* Flight Route Preview */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <div className="font-semibold text-[#0abab5]">
                  {searchParams.get('from') || 'DEP'}
                </div>
                <div className="text-xs text-gray-500">From</div>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="h-px bg-gradient-to-r from-[#0abab5] to-cyan-400 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#0abab5] rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-semibold text-[#0abab5]">
                  {searchParams.get('to') || 'ARR'}
                </div>
                <div className="text-xs text-gray-500">To</div>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 text-center">
              {searchParams.get('departureDate') && (
                <span>Departure: {new Date(searchParams.get('departureDate') + 'T00:00:00').toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
              )}
              {searchParams.get('returnDate') && (
                <span className="ml-2">• Return: {new Date(searchParams.get('returnDate') + 'T00:00:00').toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchingPage;