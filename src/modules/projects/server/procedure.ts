import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";

export const projectRouter = createTRPCRouter({

  getMany: baseProcedure
  .query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return projects;
  }),
  create: baseProcedure
  .input(
    z.object({
      value: z.string()
      .min(1, "Value is required")
      .max(10000, "Value must be less than 10000 characters"),
    }),
  )
  .mutation(async ({ input }) => {
   // Get or create a default project
   const createdProject =  await prisma.project.create({
     data: {
       name: generateSlug(2, {
         format: "kebab"
       }),
       messages: {
         create: {
           content: input.value,
           role: "USER",
           type: "RESULT",
         },
       },
     }
   });
   
   await inngest.send({
     name: 'adorable/run',
     data: {
       value: input.value,
       projectId: createdProject.id,
     },
   });
   return createdProject;
  })
});
