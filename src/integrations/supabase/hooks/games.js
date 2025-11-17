import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

/**
 * A helper function to execute a Supabase query and handle errors.
 * @param {Promise} query - The Supabase query to execute.
 * @returns {Promise<any>} A promise that resolves with the data from the query.
 * @throws {Error} If the query returns an error.
 */
const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### games

| name       | type                     | format    | required |
|------------|--------------------------|-----------|----------|
| id         | integer                  | integer   | true     |
| week       | integer                  | integer   | true     |
| home_team  | character varying(255)   | string    | true     |
| away_team  | character varying(255)   | string    | true     |
| winner     | character varying(255)   | string    | false    |
| created_at | timestamp with time zone | string    | false    |

No foreign key relationships identified.
*/

/**
 * A hook for fetching a single game.
 * @param {number} id - The ID of the game to fetch.
 * @returns {import('@tanstack/react-query').UseQueryResult} The result of the query.
 */
export const useGame = (id) => useQuery({
    queryKey: ['games', id],
    queryFn: () => fromSupabase(supabase.from('games').select('*').eq('id', id).single()),
});

/**
 * A hook for fetching all games.
 * @param {number} [contestId] - The ID of the contest to fetch games for.
 * @returns {import('@tanstack/react-query').UseQueryResult} The result of the query.
 */
export const useGames = (contestId) => useQuery({
    queryKey: ['games', contestId],
    queryFn: () => {
        let query = supabase.from('games').select('*');
        if (contestId) {
            query = query.eq('contest_id', contestId);
        }
        return fromSupabase(query);
    },
});

/**
 * A hook for adding a new game.
 * @returns {import('@tanstack/react-query').UseMutationResult} The result of the mutation.
 */
export const useAddGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newGame) => fromSupabase(supabase.from('games').insert([newGame])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
    });
};

/**
 * A hook for updating a game.
 * @returns {import('@tanstack/react-query').UseMutationResult} The result of the mutation.
 */
export const useUpdateGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('games').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
    });
};

/**
 * A hook for deleting a game.
 * @returns {import('@tanstack/react-query').UseMutationResult} The result of the mutation.
 */
export const useDeleteGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('games').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
    });
};