import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { projectEntrypointsSubscribe } from "next/dist/build/swc/generated-native";
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
      value: z.string().min(1, "Message is required"),

    }),
  )
  .mutation(async ({ input }) => {
   // Get or create a default project
   const project = await prisma.project.findFirst() || await prisma.project.create({ data: { name: "Default Project" } });
   
   const createdMessage = await prisma.message.create({
     data: {
       content: input.value,
       role: "USER",
       type: "RESULT",
       project: {
         connect: { id: project.id },
       },
     },
   });
   await inngest.send({
     name: 'adorable/run',
     data: {
       value: input.value,
     },
   });
   return createdMessage;
  })
});
