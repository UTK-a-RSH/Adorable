import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
    ChevronDownIcon, 
    ChevronLeftIcon, 
    SunIcon, 
    MoonIcon 
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface ProjectHeaderProps {
    projectId: string;
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
    const { theme, setTheme } = useTheme();
    const trpc = useTRPC();

    const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId,
    }));

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <header className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/">
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Link>
                    </Button>
                    
                    <Image 
                        src="/logo1.svg" 
                        alt="Logo" 
                        width={100} 
                        height={32}
                    />
                    
                   
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                 <h1 className="text-xl font-semibold">{project?.name}</h1>
                                <ChevronDownIcon className="h-4 w-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                            <DropdownMenuRadioItem value="light">
                                                <SunIcon className="h-4 w-4 mr-2" />
                                                Light
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="dark">
                                                <MoonIcon className="h-4 w-4 mr-2" />
                                                Dark
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="system">
                                                System
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            
                            <DropdownMenuSeparator />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
        </Suspense>
    );
}
