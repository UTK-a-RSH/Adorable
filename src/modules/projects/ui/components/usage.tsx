import Link from "next/link";
import { CrownIcon } from "lucide-react";
import {formatDuration, intervalToDuration} from "date-fns";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

interface Props {
    points: number;
    msBeforeNext: number;
}



export const Usage = ({ points, msBeforeNext }: Props) => {
    const {has} = useAuth();
    const hasProAccess = has?.({plan: "pro"});
   

    return (
        <div className="rounded-t-xl bg-background borde border-b-0 p-2.5">
            <div className="flex items-center gap-x-2">
                <div>
                    <p className="text-sm">
                        {points} {hasProAccess ? "" : "Free"} free credits remaining
                    </p>
                    <p className="text-sm text-gray-500">
                        Next reset in {formatDuration(intervalToDuration({
                            start: new Date(),
                            end : new Date(Date.now() + msBeforeNext)
                        }),
                        {format: ["months", "days", "hours", "minutes"]})}
                    </p>
                </div>

               {!hasProAccess && (<Button asChild size="sm" variant="secondary" className="ml-auto">
                    <Link href="/pricing"><CrownIcon></CrownIcon>Buy more credits</Link>
                </Button>) }  
            </div>
        </div>
    );
};