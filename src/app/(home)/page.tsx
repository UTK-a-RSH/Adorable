"use client"

import { ProjectForm } from "@/modules/home/project-form"
import { ProjectsSidebar } from "@/modules/home/project-list"
import Image from "next/image"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useClerk, useUser } from "@clerk/nextjs"

const Page = () => {
  const {isSignedIn} = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const clerk = useClerk();

  return (
    <div className="min-h-screen w-full relative">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col max-w-4xl mx-auto w-full">
        <section className="space-y-16 py-[20vh] px-4">
          <div className="flex flex-col items-center text-center">
            <Image 
              src="./logo.svg" 
              alt="Adorable" 
              width={600} 
              height={45} 
              className="hidden md:block opacity-90" 
            />
          </div>
          <div className="space-y-6 text-center">
            <h1 className="text-5xl md:text-6xl font-serif italic font-medium text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
              Do you wanna VibeCode?
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-serif italic font-light">
              Build your UI with the power of Adorable
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <ProjectForm />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Hover Trigger Zone */}
      <div 
        className="fixed top-0 right-0 w-8 h-full z-40 cursor-pointer"
        onMouseEnter={() => setIsSidebarOpen(true)}
      />

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSidebarOpen(false)}
            />


            {isSignedIn ? (
              <motion.div
              className="fixed top-0 right-0 z-50"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                duration: 0.4
              }}
              onMouseLeave={() => setIsSidebarOpen(false)}
              >
              <ProjectsSidebar />
              </motion.div>
            ) :  clerk.openSignIn()}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Page