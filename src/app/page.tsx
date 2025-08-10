"use client"; 
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import { useState } from "react";
import { toast } from "sonner";

const Page =   () => {
  const trpc = useTRPC();
  const [value, setValue] = useState("");
 const {data:messages} = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      toast.success("Message sent successfully!");
    }
  }));
  return (
    <div className="p-4 max-w-md mx-auto">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button disabled={createMessage.isPending} onClick={() => createMessage.mutate({ value: value })}>
      Create Message 
      </Button>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </div>

  );
};

export default Page;