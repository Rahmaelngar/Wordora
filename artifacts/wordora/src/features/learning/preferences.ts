export type Preferences = { dailyGoal: number; sound: boolean; darkMode: boolean };
export const preferencesKey = 'wordora-preferences-v1';
const defaults: Preferences = { dailyGoal: 10, sound: true, darkMode: false };
export const goalOptions = [5, 10, 15, 20] as const;
export const readPreferences = (): Preferences => {
  try { const p = { ...defaults, ...JSON.parse(localStorage.getItem(preferencesKey) || '{}') }; return { ...p, dailyGoal: goalOptions.includes(p.dailyGoal) ? p.dailyGoal : 10 }; } catch { return { ...defaults }; }
};
/** Merge-write so sound/darkMode are never lost. */
export const writePreferences = (patch: Partial<Preferences>): Preferences => {
  const next = { ...readPreferences(), ...patch };
  try { localStorage.setItem(preferencesKey, JSON.stringify(next)); } catch { /* storage unavailable */ }
  return next;
};
