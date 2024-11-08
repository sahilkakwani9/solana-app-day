import { relations } from "drizzle-orm/relations";
import { contest, contestParticipant, contestant } from "./schema";

export const contestParticipantRelations = relations(contestParticipant, ({one}) => ({
	contest: one(contest, {
		fields: [contestParticipant.contestId],
		references: [contest.id]
	}),
	contestant: one(contestant, {
		fields: [contestParticipant.contestantId],
		references: [contestant.id]
	}),
}));

export const contestRelations = relations(contest, ({many}) => ({
	contestParticipants: many(contestParticipant),
}));

export const contestantRelations = relations(contestant, ({many}) => ({
	contestParticipants: many(contestParticipant),
}));