CREATE TYPE "Platform" AS ENUM ('STEAM', 'PLAYSTATION', 'XBOX', 'SWITCH');
CREATE TYPE "ConnectedAccountStatus" AS ENUM ('CONNECTED', 'ERROR');
CREATE TYPE "OwnershipStatus" AS ENUM ('OWNED', 'PLAYED');
CREATE TYPE "NoteVisibility" AS ENUM ('PRIVATE');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConnectedAccount" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "platform" "Platform" NOT NULL,
  "externalAccountId" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "status" "ConnectedAccountStatus" NOT NULL DEFAULT 'CONNECTED',
  "lastSyncedAt" TIMESTAMP(3),
  "lastSyncError" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ConnectedAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Game" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "canonicalKey" TEXT NOT NULL,
  "coverUrl" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserGame" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "gameId" TEXT NOT NULL,
  "ownership" "OwnershipStatus" NOT NULL,
  "recentRank" INTEGER,
  "playtimeForeverMinutes" INTEGER,
  "playtimeLastTwoWeeksMinutes" INTEGER,
  "firstSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSyncedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserGame_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserGameSource" (
  "id" TEXT NOT NULL,
  "userGameId" TEXT NOT NULL,
  "connectedAccountId" TEXT NOT NULL,
  "platform" "Platform" NOT NULL,
  "platformGameId" TEXT NOT NULL,
  "rawData" JSONB,
  "lastSyncedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserGameSource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GameNote" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "userGameId" TEXT NOT NULL,
  "visibility" "NoteVisibility" NOT NULL DEFAULT 'PRIVATE',
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GameNote_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "ConnectedAccount_userId_platform_key" ON "ConnectedAccount"("userId", "platform");
CREATE UNIQUE INDEX "Game_canonicalKey_key" ON "Game"("canonicalKey");
CREATE UNIQUE INDEX "UserGame_userId_gameId_key" ON "UserGame"("userId", "gameId");
CREATE UNIQUE INDEX "UserGameSource_connectedAccountId_platformGameId_key" ON "UserGameSource"("connectedAccountId", "platformGameId");
CREATE UNIQUE INDEX "GameNote_id_userId_key" ON "GameNote"("id", "userId");

ALTER TABLE "ConnectedAccount"
ADD CONSTRAINT "ConnectedAccount_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserGame"
ADD CONSTRAINT "UserGame_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserGame"
ADD CONSTRAINT "UserGame_gameId_fkey"
FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserGameSource"
ADD CONSTRAINT "UserGameSource_userGameId_fkey"
FOREIGN KEY ("userGameId") REFERENCES "UserGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserGameSource"
ADD CONSTRAINT "UserGameSource_connectedAccountId_fkey"
FOREIGN KEY ("connectedAccountId") REFERENCES "ConnectedAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GameNote"
ADD CONSTRAINT "GameNote_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GameNote"
ADD CONSTRAINT "GameNote_userGameId_fkey"
FOREIGN KEY ("userGameId") REFERENCES "UserGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
