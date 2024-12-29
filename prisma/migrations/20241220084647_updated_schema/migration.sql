-- CreateTable
CREATE TABLE "_instructorEnrollment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_instructorEnrollment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_instructorEnrollment_B_index" ON "_instructorEnrollment"("B");

-- AddForeignKey
ALTER TABLE "_instructorEnrollment" ADD CONSTRAINT "_instructorEnrollment_A_fkey" FOREIGN KEY ("A") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_instructorEnrollment" ADD CONSTRAINT "_instructorEnrollment_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
