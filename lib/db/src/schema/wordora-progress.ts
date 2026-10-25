import { pgTable, jsonb, text, timestamp } from "drizzle-orm/pg-core";

export type WordoraProgressData = {
  selectedLanguage: "english" | "french" | "spanish" | "german" | "italian" | null;
  completedLessons: string[];
  savedWords: string[];
  points: number;
  streak: number;
  lastActiveDate: string | null;
  quizAttempts: Record<string, number>;
};

export const wordoraProgressTable = pgTable("wordora_progress", {
  userId: text("user_id").primaryKey(),
  progress: jsonb("progress").$type<WordoraProgressData>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
