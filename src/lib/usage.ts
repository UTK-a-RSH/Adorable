import {RateLimiterPrisma} from "rate-limiter-flexible"
import { prisma } from "./db"
import { auth } from "@clerk/nextjs/server";


const PRO_POINTS = 100;

export async function getUsageTracker() {
    const {has} = await auth();
    const hasProAccess = has({plan: "pro"})

  const usage = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usuage",
    keyPrefix: "usage",
    points: hasProAccess ? PRO_POINTS : 5, // Number of points
    duration: 30 * 24 * 60 * 60,
  })

  return usage;
}

export async function consumeCredits() {
    const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized")
  const usage = await getUsageTracker()
  return await usage.consume(userId, 2)
  
}


export async function getUsageStatus() {
    const {userId} = await auth();
    if(!userId) throw new Error("Unauthenticated User")
  const usage = await getUsageTracker()
  return await usage.get(userId)
}