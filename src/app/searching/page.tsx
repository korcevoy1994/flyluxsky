"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const SearchingContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [checkedProviders, setCheckedProviders] = useState(0);

  // Get airport codes from search params
  const fromAirport = searchParams.get('from') || 'LAX';
  const toAirport = searchParams.get('to') || 'SFO';

  // Motion values for smooth animations
  const pathProgress = useMotionValue(0);
  const percentage = useTransform(pathProgress, (latest) => Math.round(latest * 100));
  const providersCount = useTransform(pathProgress, (latest) => Math.round(latest * 15));

  useEffect(() => {
    const unsubscribePercentage = percentage.on("change", (latest) => {
      setDisplayPercentage(latest);
    });

    const unsubscribeProviders = providersCount.on("change", (latest) => {
      setCheckedProviders(latest);
    });

    const pathAnimation = animate(pathProgress, 1, {
      duration: 7,
      ease: "easeInOut",
    });

    const redirectTimer = setTimeout(() => {
      const queryString = searchParams.toString();
      router.replace(`/search?${queryString}`);
    }, 7500);

    return () => {
      unsubscribePercentage();
      unsubscribeProviders();
      pathAnimation.stop();
      clearTimeout(redirectTimer);
    };
  }, [pathProgress, percentage, router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        {/* FLS Logo */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[#0abab5] to-[#0cd1cb] bg-clip-text text-transparent tracking-wider">
            FLS
          </h1>
        </motion.div>

        {/* Flight route animation */}
        <motion.div 
          className="relative w-96 h-48 mb-12 mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <svg 
            className="w-full h-full" 
            viewBox="0 0 400 200" 
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0abab5" />
                <stop offset="50%" stopColor="#0cd1cb" />
                <stop offset="100%" stopColor="#0abab5" />
              </linearGradient>
            </defs>
            
            {/* Dotted background path */}
            <path
              d="M 50 150 C 150 50, 250 50, 350 150"
              stroke="#e5e7eb"
              strokeWidth="2"
              strokeDasharray="5,5"
              strokeLinecap="round"
              fill="none"
            />
            
            {/* Animated progress path */}
            <motion.path
              d="M 50 150 C 150 50, 250 50, 350 150"
              stroke="url(#routeGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              style={{ pathLength: pathProgress }}
            />
          </svg>
          
          {/* Airport codes */}
          <motion.div 
            className="absolute left-[12.5%] top-[75%] mt-4 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-gradient-to-r from-[#0abab5] to-[#0cd1cb] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {fromAirport}
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute right-[12.5%] top-[75%] mt-4 transform translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-gradient-to-r from-[#0abab5] to-[#0cd1cb] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {toAirport}
            </div>
          </motion.div>
        </motion.div>

        {/* Progress percentage */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="text-4xl md:text-5xl font-bold"
            key={displayPercentage}
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="bg-gradient-to-r from-[#0abab5] to-[#0cd1cb] bg-clip-text text-transparent">
              {displayPercentage}% complete
            </span>
          </motion.div>
        </motion.div>

        {/* Checked providers */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="text-lg text-gray-600"
            key={checkedProviders}
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            Checked {checkedProviders} of 15 providers
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const SearchingPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold bg-gradient-to-r from-[#0abab5] to-[#0cd1cb] bg-clip-text text-transparent tracking-wider">
            FLS
          </div>
        </div>
      </div>
    }>
      <SearchingContent />
    </Suspense>
  );
};

export default SearchingPage;