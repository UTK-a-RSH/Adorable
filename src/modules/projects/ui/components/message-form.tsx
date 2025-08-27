import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Loader2Icon, SendIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Usage } from "./usage";




interface ProjectId {
    projectId: string;
}

const formSchema = z.object({
  value: z.string()
  .min(1, {message: "Type your message here"}).max(18000, {message: "Value is too long"}),
});

export const MessageForm = ({ projectId }: ProjectId) => {
    const trpc = useTRPC();
    const [isFocused, setIsFocused] = useState(false);
    
    const queryClient = useQueryClient();

    const {data: usage} = useQuery(trpc.usage.status.queryOptions())
    
    const showUsage = !!usage;
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        },
    });
    
    const createMessage = useMutation(trpc.messages.create.mutationOptions({
        onSuccess: (data) => {
            form.reset();
            queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({
                projectId: data.projectId,
            }));
        },

        onError: (error) => {
            toast.error(`Failed to send message: ${error.message}`);
        }
    }));
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createMessage.mutateAsync({
            value: values.value,
            projectId,
        });
    };

    const isPending = createMessage.isPending;
    const isDisabled = isPending || !form.formState.isValid;
  return (
    <Form {...form}>
      {showUsage && (
        <Usage
          points={usage.remainingPoints}
          msBeforeNext={usage.msBeforeNext}
        />
      )}
     <form onSubmit={form.handleSubmit(onSubmit)} className={cn("relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all overflow-visible w-full", isFocused && "shadow-xs", showUsage && "rounded-l-none",)}>
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              disabled={isPending}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
                minRows={2}
                maxRows={8}
                className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                placeholder="Let's build together !!"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
            />
          )}
        />
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            Press <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs font-mono">Enter</kbd> to send
          </div>
        </div>
        <motion.div 
          className="absolute top-4 right-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button type="submit" disabled={isDisabled} size="icon" className="h-8 w-8">
            {form.formState.isSubmitting ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
     </form>
    </Form>
  );
};
