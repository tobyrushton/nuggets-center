-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('REGULAR', 'PLAYOFF', 'PRESEASON');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "type" "GameType" NOT NULL DEFAULT 'REGULAR';
