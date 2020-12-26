-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sentence" (
    "uuid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("uuid")
);
INSERT INTO "new_Sentence" ("uuid", "content") SELECT "uuid", "content" FROM "Sentence";
DROP TABLE "Sentence";
ALTER TABLE "new_Sentence" RENAME TO "Sentence";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
