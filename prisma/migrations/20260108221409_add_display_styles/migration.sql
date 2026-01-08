-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "displayStyle" TEXT NOT NULL DEFAULT 'blog',
ADD COLUMN     "projectLink" TEXT;

-- CreateIndex
CREATE INDEX "Post_displayStyle_idx" ON "Post"("displayStyle");
