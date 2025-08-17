
"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { MessageContainer } from "../components/message-container";
import { useState, Suspense } from "react";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";


interface Props {
    projectId: string;
}

export const ProjectView = ({projectId }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);  
    const trpc = useTRPC();
    const {data: project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId,
    }))
    
    return (
    <div className="h-screen w-full bg-gray-50">
        <ResizablePanelGroup
            direction="horizontal"
            className="h-full w-full border rounded-lg shadow-sm bg-white"
        >
            <ResizablePanel
                defaultSize={25}
                minSize={15}
                collapsible
                className="p-6 border-r border-gray-200 bg-gray-50/50"
            >
                <div className="h-full overflow-auto">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Details</h2>
                    <pre className="bg-white p-4 rounded-lg border text-sm text-gray-700 overflow-auto shadow-sm">
    {JSON.stringify(project, null, 2)}
                    </pre>
                </div>
            </ResizablePanel>

            {/* Draggable handle */}
            <ResizableHandle withHandle className="bg-gray-200 hover:bg-blue-300 transition-colors" />

            <ResizablePanel
                defaultSize={activeFragment ? 40 : 75}
                minSize={25}
                collapsible
                className="flex flex-col bg-white"
            >
                <div className="p-4 border-b border-gray-200 bg-gray-50/30">
                    <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
                </div>
                <div className="flex-1 p-4 min-h-0 flex flex-col">
                    <ProjectHeader projectId={projectId} />
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                    <p className="text-gray-600">Loading messages...</p>
                                </div>
                            </div>
                        }
                    >
                        <MessageContainer projectId={projectId} activeFragment={activeFragment} setActiveFragment={setActiveFragment} />
                    </Suspense>
                </div>
            </ResizablePanel>

            {/* Fragment panel - only show when there's an active fragment */}
            {activeFragment && (
                <>
                    <ResizableHandle withHandle className="bg-gray-200 hover:bg-blue-300 transition-colors" />
                    <ResizablePanel 
                        defaultSize={35} 
                        minSize={20}
                        collapsible
                        className="bg-gray-50"
                    >
                        <div className="h-full">
                            <FragmentWeb data={activeFragment} />
                        </div>
                    </ResizablePanel>
                </>
            )}
        </ResizablePanelGroup>
    </div>
    );
}