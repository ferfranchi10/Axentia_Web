-- CreateTable
CREATE TABLE "UsageLog" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "detail" TEXT,
    "resultCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsageLog_type_createdAt_idx" ON "UsageLog"("type", "createdAt");
