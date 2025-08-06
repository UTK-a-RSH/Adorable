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
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Background job invoked successfully!");
    }
  }));
  return (
    <div className="p-4 max-w-md mx-auto">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button disabled={invoke.isPending} onClick={() => invoke.mutate({ value: value })}>
        Invoke Background Job
      </Button>
    </div>

  );
};

export default Page;