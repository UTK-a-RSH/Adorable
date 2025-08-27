
import { getQueryClient, trpc } from "@/trpc/server";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ProjectView } from "@/modules/projects/ui/views/project-view";
import { Helix } from "ldrs/react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    params: Promise<{
        projectId : string;
    }>
};


const Page = async ({ params }: Props) => {
    const { projectId } = await params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({
        projectId,
    }))

    void queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({
        id: projectId
    }))
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary fallback={<p>Something went wrong</p>}>
                <Suspense fallback={<div className="flex justify-center items-center min-h-[80vh]"><Helix /></div>}>
                    <ProjectView projectId={projectId} />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
};

export default Page;