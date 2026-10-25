import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";
import { db, wordoraProgressTable } from "@workspace/db";
import {
  GetWordoraProgressResponse,
  SaveWordoraProgressBody,
  SaveWordoraProgressResponse,
} from "@workspace/api-zod";
import type { Request, Response } from "express";

const router: IRouter = Router();

const emptyProgress = {
  selectedLanguage: null,
  completedLessons: [],
  savedWords: [],
  points: 0,
  streak: 0,
  lastActiveDate: null,
  quizAttempts: {},
} as const;

function authenticatedUserId(req: Request, res: Response): string | null {
  const userId = getAuth(req).userId;
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
  return userId;
}

router.get("/wordora/progress", async (req, res): Promise<void> => {
  const userId = authenticatedUserId(req, res);
  if (!userId) return;

  const [record] = await db
    .select({ progress: wordoraProgressTable.progress })
    .from(wordoraProgressTable)
    .where(eq(wordoraProgressTable.userId, userId));

  res.json(GetWordoraProgressResponse.parse(record?.progress ?? emptyProgress));
});

router.put("/wordora/progress", async (req, res): Promise<void> => {
  const userId = authenticatedUserId(req, res);
  if (!userId) return;

  const parsed = SaveWordoraProgressBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [record] = await db
    .insert(wordoraProgressTable)
    .values({ userId, progress: parsed.data })
    .onConflictDoUpdate({
      target: wordoraProgressTable.userId,
      set: { progress: parsed.data, updatedAt: new Date() },
    })
    .returning({ progress: wordoraProgressTable.progress });

  res.json(SaveWordoraProgressResponse.parse(record.progress));
});

export default router;
