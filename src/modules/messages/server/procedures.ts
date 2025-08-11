import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messagesRouter = createTRPCRouter({

  getMany: baseProcedure
  .query(async () => {
    const messages = await prisma.message.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return messages;
  }),
  create: baseProcedure
  .input(
    z.object({
      value: z.string()
      .min(1, "Message is required")
      .max(10000, "Message must be less than 10000 characters"),
      projectId: z.string().uuid("Invalid project ID"),
    }),
  )
  .mutation(async ({ input }) => {
     
   const createdMessage = await prisma.message.create({
     data: {
       content: input.value,
       role: "USER",
       type: "RESULT",
       projectId: input.projectId,
     },
   });
   await inngest.send({
     name: 'adorable/run',
     data: {
       value: input.value,
       projectId: input.projectId,
     },
   });
   return createdMessage;
  })
});
