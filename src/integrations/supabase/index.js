// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';

// Import hooks
import {
  useNflTeams,
  useAddNflTeam,
  useUpdateNflTeam,
  useDeleteNflTeam
} from './hooks/nfl_teams';

import {
  useParticipants,
  useAddParticipant,
  useUpdateParticipant,
  useDeleteParticipant
} from './hooks/participants';

import {
  useFantasyMatchups,
  useAddFantasyMatchup,
  useUpdateFantasyMatchup,
  useDeleteFantasyMatchup
} from './hooks/fantasy_matchups';

import {
  useResults,
  useAddResult,
  useUpdateResult,
  useDeleteResult
} from './hooks/results';

import {
  useWeeklyPicks,
  useAddWeeklyPick,
  useUpdateWeeklyPick,
  useDeleteWeeklyPick
} from './hooks/weekly_picks';

import {
  useGames,
  useAddGame,
  useUpdateGame,
  useDeleteGame
} from './hooks/games';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useNflTeams,
  useAddNflTeam,
  useUpdateNflTeam,
  useDeleteNflTeam,
  useParticipants,
  useAddParticipant,
  useUpdateParticipant,
  useDeleteParticipant,
  useFantasyMatchups,
  useAddFantasyMatchup,
  useUpdateFantasyMatchup,
  useDeleteFantasyMatchup,
  useResults,
  useAddResult,
  useUpdateResult,
  useDeleteResult,
  useWeeklyPicks,
  useAddWeeklyPick,
  useUpdateWeeklyPick,
  useDeleteWeeklyPick,
  useGames,
  useAddGame,
  useUpdateGame,
  useDeleteGame
};
