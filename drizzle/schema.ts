import {
  pgTable,
  index,
  unique,
  text,
  integer,
  timestamp,
  boolean,
  uniqueIndex,
  foreignKey,
} from "drizzle-orm/pg-core";

export const contestant = pgTable(
  "Contestant",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    teamName: text().notNull(),
    productName: text().notNull(),
    description: text().notNull(),
    category: text().array().notNull(),
    votes: integer().default(0).notNull(),
    logo: text().notNull(),
    headshot: text().notNull(),
    eclipseAddress: text().notNull(),
    onChainId: integer().notNull(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      onChainIdIdx: index("Contestant_onChainId_idx").using(
        "btree",
        table.onChainId.asc().nullsLast()
      ),
      productNameIdx: index("Contestant_productName_idx").using(
        "btree",
        table.productName.asc().nullsLast()
      ),
      teamNameIdx: index("Contestant_teamName_idx").using(
        "btree",
        table.teamName.asc().nullsLast()
      ),
      votesIdx: index("Contestant_votes_idx").using(
        "btree",
        table.votes.asc().nullsLast()
      ),
      contestantOnChainIdUnique: unique("Contestant_onChainId_unique").on(
        table.onChainId
      ),
    };
  }
);

export const contest = pgTable(
  "Contest",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    description: text().notNull(),
    startDate: timestamp({ mode: "string" }).defaultNow().notNull(),
    endDate: timestamp({ mode: "string" }),
    isActive: boolean().default(true).notNull(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      isActiveIdx: index("Contest_isActive_idx").using(
        "btree",
        table.isActive.asc().nullsLast()
      ),
      startDateEndDateIdx: index("Contest_startDate_endDate_idx").using(
        "btree",
        table.startDate.asc().nullsLast(),
        table.endDate.asc().nullsLast()
      ),
    };
  }
);

export const contestParticipant = pgTable(
  "ContestParticipant",
  {
    id: text().primaryKey().notNull(),
    contestId: text().notNull(),
    contestantId: text().notNull(),
    joinedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      contestIdContestantIdKey: uniqueIndex(
        "ContestParticipant_contestId_contestantId_key"
      ).using(
        "btree",
        table.contestId.asc().nullsLast(),
        table.contestantId.asc().nullsLast()
      ),
      contestIdIdx: index("ContestParticipant_contestId_idx").using(
        "btree",
        table.contestId.asc().nullsLast()
      ),
      contestantIdIdx: index("ContestParticipant_contestantId_idx").using(
        "btree",
        table.contestantId.asc().nullsLast()
      ),
      contestParticipantContestIdContestIdFk: foreignKey({
        columns: [table.contestId],
        foreignColumns: [contest.id],
        name: "ContestParticipant_contestId_Contest_id_fk",
      }),
      contestParticipantContestantIdContestantIdFk: foreignKey({
        columns: [table.contestantId],
        foreignColumns: [contestant.id],
        name: "ContestParticipant_contestantId_Contestant_id_fk",
      }),
    };
  }
);
