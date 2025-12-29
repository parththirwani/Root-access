-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "xLink" TEXT,
    "instagramLink" TEXT,
    "linkedinLink" TEXT,
    "bio" TEXT,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_adminId_key" ON "Profile"("adminId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
