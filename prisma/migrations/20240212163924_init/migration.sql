-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "height_feet" INTEGER NOT NULL,
    "height_inches" INTEGER NOT NULL,
    "profile_url" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeasonAverages" (
    "id" TEXT NOT NULL,
    "games_played" INTEGER NOT NULL,
    "player_id" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "min" TEXT NOT NULL,
    "fgm" DOUBLE PRECISION NOT NULL,
    "fga" DOUBLE PRECISION NOT NULL,
    "fg3m" DOUBLE PRECISION NOT NULL,
    "fg3a" DOUBLE PRECISION NOT NULL,
    "ftm" DOUBLE PRECISION NOT NULL,
    "fta" DOUBLE PRECISION NOT NULL,
    "oreb" DOUBLE PRECISION NOT NULL,
    "dreb" DOUBLE PRECISION NOT NULL,
    "reb" DOUBLE PRECISION NOT NULL,
    "ast" DOUBLE PRECISION NOT NULL,
    "stl" DOUBLE PRECISION NOT NULL,
    "blk" DOUBLE PRECISION NOT NULL,
    "turnover" DOUBLE PRECISION NOT NULL,
    "pf" DOUBLE PRECISION NOT NULL,
    "pts" DOUBLE PRECISION NOT NULL,
    "fg_pct" DOUBLE PRECISION NOT NULL,
    "fg3_pct" DOUBLE PRECISION NOT NULL,
    "ft_pct" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SeasonAverages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerGame" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "pts" INTEGER NOT NULL,
    "ast" INTEGER NOT NULL,
    "reb" INTEGER NOT NULL,
    "min" TEXT NOT NULL,
    "fgm" INTEGER NOT NULL,
    "fga" INTEGER NOT NULL,
    "fg3m" INTEGER NOT NULL,
    "fg3a" INTEGER NOT NULL,
    "ftm" INTEGER NOT NULL,
    "fta" INTEGER NOT NULL,
    "stl" INTEGER NOT NULL,
    "blk" INTEGER NOT NULL,
    "turnover" INTEGER NOT NULL,
    "pf" INTEGER NOT NULL,
    "fg_pct" DOUBLE PRECISION NOT NULL,
    "fg3_pct" DOUBLE PRECISION NOT NULL,
    "ft_pct" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PlayerGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "home" BOOLEAN NOT NULL,
    "opponent_id" TEXT NOT NULL,
    "opponent_score" INTEGER NOT NULL,
    "home_score" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeasonAverages_player_id_key" ON "SeasonAverages"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_date_key" ON "Game"("date");

-- AddForeignKey
ALTER TABLE "SeasonAverages" ADD CONSTRAINT "SeasonAverages_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGame" ADD CONSTRAINT "PlayerGame_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGame" ADD CONSTRAINT "PlayerGame_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_opponent_id_fkey" FOREIGN KEY ("opponent_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
