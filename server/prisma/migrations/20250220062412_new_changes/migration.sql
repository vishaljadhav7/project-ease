/*
  Warnings:

  - The `status` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priority` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('Urgent', 'High', 'Medium', 'Low', 'Backlog');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('To_Do', 'In_Progress', 'Under_Review', 'Completed');

-- DropIndex
DROP INDEX "User_googleId_key";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ADD COLUMN     "status" "Status",
DROP COLUMN "priority",
ADD COLUMN     "priority" "Priority";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "googleId",
ADD COLUMN     "userName" TEXT NOT NULL;
