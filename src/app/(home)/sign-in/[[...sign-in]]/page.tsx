"use client"
import { useCustomTheme } from "@/hooks/use-theme";
import { SignIn } from '@clerk/nextjs'
import { dark } from "@clerk/themes";

export default function Page() {
  const currentTheme = useCustomTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="backdrop-blur-sm bg-white/70 rounded-2xl border border-gray-200 shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <SignIn appearance={{ baseTheme: currentTheme === "dark" ? dark : undefined }} />
      </div>
    </div>
  )
}