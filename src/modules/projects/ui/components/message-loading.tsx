"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';






const ShimmerMessages = () => {
    const DEFAULT_PHRASES = ["THINKING", "PROCESSING", "DRAFTING", "REFINING"];

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % DEFAULT_PHRASES.length);
        }, 1600);

        return () => clearInterval(interval);
    }, [DEFAULT_PHRASES.length]);

    return (
        <div className="flex items-center justify-center shimmer-messages">
           <span className="text-base text-muted-foreground animate-plus font-bold font-mono tracking-wider">{DEFAULT_PHRASES[currentMessageIndex]}</span>
        </div>
    );
}


export const MessageLoading = () => {
    return (
        <motion.div 
          className="flex flex-col items-start justify-start group px-4 py-6 relative backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-xl shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          
          <motion.div 
            className='flex items-center gap-3 mb-4 relative z-10'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="relative backdrop-blur-sm bg-white/20 dark:bg-white/10 rounded-full p-2 border border-white/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
            duration: 1.2, 
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1]
              }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-md"
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
              />
              <Image 
            src="/logo1.svg" 
            className='shrink-0 relative z-10' 
            alt="Agent logo" 
            width={100} 
            height={28}
            priority
              />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className='flex flex-col gap-y-6 relative z-10 w-full flex-1 items-center justify-center -translate-y-2'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.5,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <ShimmerMessages />
          </motion.div>
        </motion.div>
    );
}
