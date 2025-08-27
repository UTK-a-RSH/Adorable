import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { consumeCredits } from "@/lib/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const messagesRouter = createTRPCRouter({

  getMany: protectedProcedure
  .input(
    z.object({
      projectId: z.string().uuid("Invalid project ID"),
    })
  )
  .query(async ({ input, ctx }) => {
    const messages = await prisma.message.findMany({
      where: {
        projectId: input.projectId,
        project: {
          userId: ctx.auth.userId,
        },
      },
      include: {
        fragment: true,
      },
      orderBy: {
        updatedAt: "asc",
      },
    });
    return messages;
  }),
  create: protectedProcedure
  .input(
    z.object({
      value: z.string()
      .min(1, "Message is required")
      .max(10000, "Message must be less than 10000 characters"),
      projectId: z.string().uuid("Invalid project ID"),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const existingProject = await prisma.project.findUnique({
      where: {
        id: input.projectId,
        userId: ctx.auth.userId,
      }
    });

    if(!existingProject) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }

   try {
     await consumeCredits();
   } catch (error) {
    if(error instanceof Error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Something went wrong",
      });
    } else {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "No more credits left",
      });
    }
   }

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
