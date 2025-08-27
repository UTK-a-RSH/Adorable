-- CreateTable
CREATE TABLE "public"."Usuage" (
    "key" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuage_pkey" PRIMARY KEY ("key")
);
