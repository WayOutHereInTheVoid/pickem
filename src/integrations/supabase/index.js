// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';

// Import hooks
import {
  usePicks,
  usePickById,
  useAddPick,
  useUpdatePick,
  useDeletePick
} from './hooks/picks';

import {
  useCumulativeScores,
  useCumulativeScoreById,
  useAddCumulativeScore,
  useUpdateCumulativeScore,
  useDeleteCumulativeScore
} from './hooks/cumulative_scores';

import {
  useGames,
  useGameById,
  useAddGame,
  useUpdateGame,
  useDeleteGame
} from './hooks/games';

import {
  useScores,
  useScoreById,
  useAddScore,
  useUpdateScore,
  useDeleteScore
} from './hooks/scores';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  usePicks,
  usePickById,
  useAddPick,
  useUpdatePick,
  useDeletePick,
  useCumulativeScores,
  useCumulativeScoreById,
  useAddCumulativeScore,
  useUpdateCumulativeScore,
  useDeleteCumulativeScore,
  useGames,
  useGameById,
  useAddGame,
  useUpdateGame,
  useDeleteGame,
  useScores,
  useScoreById,
  useAddScore,
  useUpdateScore,
  useDeleteScore
};
