export const learningLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type CurriculumLevel = typeof learningLevels[number];
export const levelEntryTargets: Record<CurriculumLevel, number> = {
  A1: 100, A2: 150, B1: 200, B2: 250, C1: 300, C2: 350,
};
