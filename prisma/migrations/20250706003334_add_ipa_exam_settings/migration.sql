-- AlterTable
ALTER TABLE "User" ADD COLUMN     "examDate" TIMESTAMP(3),
ADD COLUMN     "targetExam" TEXT,
ADD COLUMN     "weekdayStudyHours" DOUBLE PRECISION,
ADD COLUMN     "weekendStudyHours" DOUBLE PRECISION;
