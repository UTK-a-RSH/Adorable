"use client";
import React from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";



interface HintProps {
    children: React.ReactNode;
    text: string;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
}

const Hint: React.FC<HintProps> = ({ children, text, side = "top", align = "center" }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>{children}</TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    {text}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default Hint;