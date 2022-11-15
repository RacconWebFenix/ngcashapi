/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_id_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Transaction";
