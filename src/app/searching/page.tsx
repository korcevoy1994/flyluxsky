"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Plane } from 'lucide-react';



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
  
  // Calculate airplane position and rotation along the bezier curve
  const airplaneX = useTransform(pathProgress, [0, 1], [42, 342]);
  const airplaneY = useTransform(pathProgress, (progress) => {
    const t = progress;
    const x0 = 50, y0 = 150;
    const x1 = 150, y1 = 50;
    const x2 = 250, y2 = 50;
    const x3 = 350, y3 = 150;
    
    return Math.pow(1-t, 3) * y0 + 
           3 * Math.pow(1-t, 2) * t * y1 + 
           3 * (1-t) * Math.pow(t, 2) * y2 + 
           Math.pow(t, 3) * y3 - 8;
  });
  // Simple airplane rotation for landing effect
   const airplaneRotation = useTransform(pathProgress, [0, 0.7, 1], [0, 45, 90]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center relative overflow-hidden">

      
      {/* Animated background gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#0abab5]/5 via-transparent to-[#0cd1cb]/5"
        animate={{
          background: [
            "linear-gradient(to bottom right, rgba(10,186,181,0.05), transparent, rgba(12,209,203,0.05))",
            "linear-gradient(to bottom right, rgba(12,209,203,0.05), transparent, rgba(10,186,181,0.05))",
            "linear-gradient(to bottom right, rgba(10,186,181,0.05), transparent, rgba(12,209,203,0.05))"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="text-center relative z-10">
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
            
            {/* Animated airplane */}
            <motion.g>
              <motion.circle
                cx={useTransform(pathProgress, [0, 1], [50, 350])}
                cy={useTransform(pathProgress, (progress) => {
                  // Bezier curve calculation: M 50 150 C 150 50, 250 50, 350 150
                  const t = progress;
                  const x0 = 50, y0 = 150;
                  const x1 = 150, y1 = 50;
                  const x2 = 250, y2 = 50;
                  const x3 = 350, y3 = 150;
                  
                  return Math.pow(1-t, 3) * y0 + 
                         3 * Math.pow(1-t, 2) * t * y1 + 
                         3 * (1-t) * Math.pow(t, 2) * y2 + 
                         Math.pow(t, 3) * y3;
                })}
                r="12"
                fill="white"
                stroke="url(#routeGradient)"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              />
              <motion.foreignObject
                x={airplaneX}
                y={airplaneY}
                width="16"
                height="16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                style={{
                  rotate: airplaneRotation
                }}
              >
                <Plane className="w-4 h-4 text-[#0abab5]" />
              </motion.foreignObject>
            </motion.g>
          </svg>
          
          {/* Airport codes with pulsing effect */}
          <motion.div 
            className="absolute left-[12.5%] top-[75%] mt-4 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative">
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 bg-[#0abab5] rounded-full opacity-30"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative bg-gradient-to-r from-[#0abab5] to-[#0cd1cb] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {fromAirport}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute right-[12.5%] top-[75%] mt-4 transform translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="relative">
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 bg-[#0cd1cb] rounded-full opacity-30"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <div className="relative bg-gradient-to-r from-[#0abab5] to-[#0cd1cb] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {toAirport}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress percentage with enhanced animation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="text-4xl md:text-5xl font-bold relative"
            key={displayPercentage}
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Glowing background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#0abab5] to-[#0cd1cb] opacity-20 blur-xl rounded-lg"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative bg-gradient-to-r from-[#0abab5] to-[#0cd1cb] bg-clip-text text-transparent">
              {displayPercentage}% complete
            </span>
            {/* Sparkle effect for milestones */}
            {displayPercentage % 25 === 0 && displayPercentage > 0 && (
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1.5, 0], rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            )}
          </motion.div>
        </motion.div>

        {/* Checked providers with animated indicators */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="text-lg text-gray-600 mb-4"
            key={checkedProviders}
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            Checked {checkedProviders} of 15 providers
          </motion.div>
          
          {/* Provider dots animation */}
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 15 }, (_, i) => (
              <motion.div
                key={i}
                className={`relative w-2 h-2 rounded-full ${
                  i < checkedProviders 
                    ? 'bg-gradient-to-r from-[#0abab5] to-[#0cd1cb]' 
                    : 'bg-gray-300'
                }`}
                initial={{ scale: 0 }}
                animate={{ 
                   scale: i < checkedProviders ? 1 : 1,
                   opacity: i < checkedProviders ? 1 : 0.5
                 }}
                 transition={{ 
                   delay: i * 0.1,
                   duration: 0.3,
                   type: "spring",
                   stiffness: 400
                 }}
              >
                {/* Pulse effect when active */}
                {i < checkedProviders && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#0abab5] to-[#0cd1cb] rounded-full"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ 
                      duration: 0.6,
                      ease: "easeOut"
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
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