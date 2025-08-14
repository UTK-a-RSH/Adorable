import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { useEffect, useRef } from "react";


interface Props {
    projectId: string;
}

export const MessageContainer = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({
      projectId: projectId,
    })
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to newest message
  useEffect(() => {
    if (!scrollRef.current || !bottomRef.current) return;
    requestAnimationFrame(() => {
      try {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      } catch {
        /* noop */
      }
    });
  }, [messages.length]);

  return (
    <div className="flex flex-col h-full min-h-0 w-full relative">
      {/* Scrollable messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <div className="w-full px-4 pt-6 space-y-4 pb-36">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={false}
              onFragmentClick={() => {}}
              type={message.type}
            />
          ))}
          <div ref={bottomRef} />
        </div>
        {/* Gradient fade above form */}
        <div className="sticky bottom-0 h-20 -mb-20 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />
      </div>
      {/* Form */}
      <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-10">
        <div className="w-full px-4 py-4">
          <MessageForm projectId={projectId} />
        </div>
      </div>
    </div>
  );
};
