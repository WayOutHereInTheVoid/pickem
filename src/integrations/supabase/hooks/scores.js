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
### scores

| name       | type                     | format    | required |
|------------|--------------------------|-----------|----------|
| id         | integer                  | integer   | true     |
| week       | integer                  | integer   | true     |
| name       | character varying(255)   | string    | true     |
| score      | integer                  | integer   | true     |
| created_at | timestamp with time zone | string    | false    |

No foreign key relationships identified.
*/

/**
 * A hook for fetching a single score.
 * @param {number} id - The ID of the score to fetch.
 * @returns {import('@tanstack/react-query').UseQueryResult} The result of the query.
 */
export const useScore = (id) => useQuery({
    queryKey: ['scores', id],
    queryFn: () => fromSupabase(supabase.from('scores').select('*').eq('id', id).single()),
});

/**
 * A hook for fetching all scores.
 * @returns {import('@tanstack/react-query').UseQueryResult} The result of the query.
 */
export const useScores = () => useQuery({
    queryKey: ['scores'],
    queryFn: () => fromSupabase(supabase.from('scores').select('*')),
});

/**
 * A hook for adding a new score.
 * @returns {import('@tanstack/react-query').UseMutationResult} The result of the mutation.
 */
export const useAddScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newScore) => fromSupabase(supabase.from('scores').insert([newScore])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scores'] });
        },
    });
};

/**
 * A hook for updating a score.
 * @returns {import('@tanstack/react-query').UseMutationResult} The result of the mutation.
 */
export const useUpdateScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('scores').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scores'] });
        },
    });
};

/**
 * A hook for deleting a score.
 * @returns {import('@tanstack/react-query').UseMutationResult} The result of the mutation.
 */
export const useDeleteScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('scores').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scores'] });
        },
    });
};