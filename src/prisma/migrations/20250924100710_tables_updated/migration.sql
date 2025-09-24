/*
  Warnings:

  - The primary key for the `CustomerProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CustomerProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `HomeBasedRestaurant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `HomeBasedRestaurant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `restaurantId` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `homeBasedRestaurantId` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RestaurantProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RestaurantProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[restaurantId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[homeBasedRestaurantId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `userId` on the `AdminProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `CustomerProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `HomeBasedRestaurant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `customerId` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `RestaurantProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `uid` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "public"."AdminProfile" DROP CONSTRAINT "AdminProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CustomerProfile" DROP CONSTRAINT "CustomerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."HomeBasedRestaurant" DROP CONSTRAINT "HomeBasedRestaurant_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_homeBasedRestaurantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RestaurantProfile" DROP CONSTRAINT "RestaurantProfile_userId_fkey";

-- AlterTable
ALTER TABLE "public"."AdminProfile" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."CustomerProfile" DROP CONSTRAINT "CustomerProfile_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."HomeBasedRestaurant" DROP CONSTRAINT "HomeBasedRestaurant_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "HomeBasedRestaurant_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
DROP COLUMN "restaurantId",
ADD COLUMN     "restaurantId" INTEGER,
DROP COLUMN "homeBasedRestaurantId",
ADD COLUMN     "homeBasedRestaurantId" INTEGER,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."RestaurantProfile" DROP CONSTRAINT "RestaurantProfile_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "RestaurantProfile_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "uid" TEXT NOT NULL,
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_userId_key" ON "public"."AdminProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_userId_key" ON "public"."CustomerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeBasedRestaurant_userId_key" ON "public"."HomeBasedRestaurant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_customerId_key" ON "public"."Order"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_restaurantId_key" ON "public"."Order"("restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_homeBasedRestaurantId_key" ON "public"."Order"("homeBasedRestaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantProfile_userId_key" ON "public"."RestaurantProfile"("userId");

-- AddForeignKey
ALTER TABLE "public"."AdminProfile" ADD CONSTRAINT "AdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RestaurantProfile" ADD CONSTRAINT "RestaurantProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HomeBasedRestaurant" ADD CONSTRAINT "HomeBasedRestaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerProfile" ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "public"."RestaurantProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_homeBasedRestaurantId_fkey" FOREIGN KEY ("homeBasedRestaurantId") REFERENCES "public"."HomeBasedRestaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
