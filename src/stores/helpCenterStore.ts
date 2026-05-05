import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HelpCenterState {
  bookmarks: string[];
  completed: string[];
  recent: string[];
  feedback: Record<string, 'up' | 'down'>;
  toggleBookmark: (id: string) => void;
  toggleCompleted: (id: string) => void;
  addRecent: (id: string) => void;
  setFeedback: (id: string, v: 'up' | 'down') => void;
}

export const useHelpCenterStore = create<HelpCenterState>()(
  persist(
    (set) => ({
      bookmarks: [],
      completed: [],
      recent: [],
      feedback: {},
      toggleBookmark: (id) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(id)
            ? s.bookmarks.filter((x) => x !== id)
            : [...s.bookmarks, id],
        })),
      toggleCompleted: (id) =>
        set((s) => ({
          completed: s.completed.includes(id)
            ? s.completed.filter((x) => x !== id)
            : [...s.completed, id],
        })),
      addRecent: (id) =>
        set((s) => ({
          recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 8),
        })),
      setFeedback: (id, v) =>
        set((s) => ({ feedback: { ...s.feedback, [id]: v } })),
    }),
    { name: 'somitee-help-center' }
  )
);
