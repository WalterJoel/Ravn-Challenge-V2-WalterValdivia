/*
  Warnings:

  - The `category` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('ZAPATILLAS', 'PLANTILLAS', 'SANDALIAS');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "ProductCategory" "ProductCategory"[],
DROP COLUMN "category",
ADD COLUMN     "category" "ProductCategory"[] DEFAULT ARRAY[]::"ProductCategory"[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;
