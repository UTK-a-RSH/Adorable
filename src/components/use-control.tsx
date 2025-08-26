"use client"

import { useCustomTheme } from "@/hooks/use-theme";
import { UserButton } from "@clerk/nextjs"
import { dark} from "@clerk/themes"

interface UseControlProps {
    showName?: boolean;
}


export const UseControl = ({ showName }: UseControlProps) => {
    const currentTheme = useCustomTheme();
    return (
        <div className="flex items-center space-x-4">
            <UserButton
                showName={showName}
                appearance={{
                elements: {
                    userButton: {
                        base: "bg-blue-500 text-white",
                        hover: "bg-blue-600",
                    },
                    userButtonAvatarBox: "rounded-md! size-8!",
                    userButtonTrigger: "rounded-md"
                },
                baseTheme: currentTheme === "dark" ? dark : undefined
            }}/>

        </div>
    );
};