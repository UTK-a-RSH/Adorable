"use client"
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { UseControl } from '../use-control';
import { Button } from './button';
import { LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function GlassyNavbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between items-center h-16">
          {/* Logo Section - Top Left */}
            <div className="flex items-center">
            <Link href="/">
              <Image
              src="/logo1.svg"
              alt="Logo"
              width={150}
              height={32}
              />
            </Link>
            </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {!isSignedIn && (
              <>
                {/* Sign In Button */}
                <SignInButton>
                  <Button className="p-3 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200 hover:scale-105">
                    <LogIn className="w-5 h-5" />
                  </Button>
                </SignInButton>

                {/* Sign Up Button */}
                <SignUpButton>
                  <Button className="p-3 rounded-xl bg-gradient-to-r from-blue-500/80 to-purple-600/80 backdrop-blur-sm text-white hover:from-blue-600/90 hover:to-purple-700/90 transition-all duration-200 shadow-lg hover:scale-105">
                    <UserPlus className="w-5 h-5" />
                  </Button>
                </SignUpButton>
              </>
            )}

            {/* User Control Dropdown - Only show when signed in */}
            {isSignedIn && (
              <div className="relative flex justify-end w-40">
              <UseControl showName={true} />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}