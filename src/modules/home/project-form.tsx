"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader2Icon, SendIcon, SparklesIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";




interface ProjectId {
    projectId: string;
}

const formSchema = z.object({
  value: z.string()
  .min(1, {message: "Type your message here"}).max(18000, {message: "Value is too long"}),
});

export const ProjectForm = () => {
  const router = useRouter();
  const trpc = useTRPC();
    const [isFocused, setIsFocused] = useState(false);
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        },
    });
    
    const createdProject = useMutation(trpc.projects.create.mutationOptions({
        onSuccess: (data) => {
            queryClient.invalidateQueries(trpc.projects.getMany.queryOptions())
            router.push(`/projects/${data.id}`);
        },

        onError: (error) => {
            toast.error(`Failed to send message: ${error.message}`);
        }
    }));
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createdProject.mutateAsync({
            value: values.value,
        });
    };

    const isPending = createdProject.isPending;
    const isDisabled = isPending || !form.formState.isValid;
  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-500 overflow-visible w-full group",
          isFocused &&
            "border-purple-400/50 shadow-2xl shadow-purple-500/25 bg-white/10"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div
          className={cn(
            "absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-2xl opacity-0 blur-sm transition-opacity duration-500",
            isFocused && "opacity-30 animate-pulse"
          )}
        />

        <div className="relative z-10">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <div className="relative">
                <TextareaAutosize
                  {...field}
                  disabled={isPending}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  minRows={3}
                  maxRows={8}
                  className="w-full resize-none border-none outline-none bg-transparent text-white placeholder:text-slate-400 text-lg leading-relaxed py-2 font-serif"
                  placeholder="✨ Let's build something amazing together..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)(e);
                    }
                  }}
                />

                {isFocused && (
                  <motion.div
                    className="absolute top-2 right-2 text-purple-400"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <SparklesIcon className="w-4 h-4 animate-pulse" />
                  </motion.div>
                )}
              </div>
            )}
          />

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <motion.div
              className="flex items-center gap-2 text-sm text-slate-400 font-serif italic"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-slate-300 font-medium not-italic">
                Press
              </span>{" "}
              <kbd className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg text-xs font-mono text-purple-200 shadow-lg backdrop-blur-sm ring-1 ring-purple-400/20 not-italic">
                Enter
              </kbd>{" "}
              <span className="text-slate-300 font-medium not-italic">
                to send
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="submit"
                disabled={isDisabled}
                size="icon"
                className={cn(
                  "h-10 w-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-0 shadow-lg transition-all duration-300",
                  !isDisabled &&
                    "shadow-purple-500/25 hover:shadow-purple-500/40"
                )}
              >
                {isPending ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SendIcon className="h-4 w-4" />
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.form>
    </Form>
  );
};
