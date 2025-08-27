"use client";

import { PricingTable } from "@clerk/clerk-react";
import Image from "next/image";
import { dark } from "@clerk/themes";
import { use } from "react";
import { useCustomTheme } from "@/hooks/use-theme";


const Page = () => {
    const currentTheme = useCustomTheme();
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
        <section className="space-y-6 pt-[16vh] 2xl:pt-48">
            <div className="flex flex-col items-center">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={200}
                    height={100}
                />
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">Pricing</h1>
                <p className="text-muted-foreground">
                    Choose the plan that’s right for you.
                </p>
            </div>
            <PricingTable 
            appearance={{ baseTheme: currentTheme === "dark" ? dark : undefined ,
                elements:{
                    pricingTableCard: "border shadow-none rounded-lg"
                }
            }}
            />
        </section>

    </div>
  );
};

export default Page;
