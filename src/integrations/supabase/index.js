// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';

// Import hooks
import {
  usePick,
  usePicks,
  useAddPick,
  useUpdatePick,
  useDeletePick
} from './hooks/picks.js';

import {
  useCumulativeScore,
  useCumulativeScores,
  useAddCumulativeScore,
  useUpdateCumulativeScore,
  useDeleteCumulativeScore
} from './hooks/cumulative_scores.js';

import {
  useGame,
  useGames,
  useAddGame,
  useUpdateGame,
  useDeleteGame
} from './hooks/games.js';

import {
  useScore,
  useScores,
  useAddScore,
  useUpdateScore,
  useDeleteScore
} from './hooks/scores.js';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  usePick,
  usePicks,
  useAddPick,
  useUpdatePick,
  useDeletePick,
  useCumulativeScore,
  useCumulativeScores,
  useAddCumulativeScore,
  useUpdateCumulativeScore,
  useDeleteCumulativeScore,
  useGame,
  useGames,
  useAddGame,
  useUpdateGame,
  useDeleteGame,
  useScore,
  useScores,
  useAddScore,
  useUpdateScore,
  useDeleteScore
};