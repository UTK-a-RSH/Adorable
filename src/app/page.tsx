"use client"; 
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Page =   () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [value, setValue] = useState("");
  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success("Project created successfully!");
      router.push(`/projects/${data.id}`);
    }
  }));
  return (
    <div className="p-4 max-w-md mx-auto">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button disabled={createProject.isPending} onClick={() => createProject.mutate({ value: value })}>
      Create Project
      </Button>
    </div>

  );
};

export default Page;