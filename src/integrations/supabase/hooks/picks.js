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
### picks

| name       | type                     | format    | required |
|------------|--------------------------|-----------|----------|
| id         | integer                  | integer   | true     |
| week       | integer                  | integer   | true     |
| name       | character varying(255)   | string    | true     |
| pick       | character varying(255)   | string    | true     |
| created_at | timestamp with time zone | string    | false    |

No foreign key relationships identified.
*/

/**
 * A hook for fetching a single pick.
 * @param {number} id - The ID of the pick to fetch.
 * @returns {import('@tanstack/react-query').UseQueryResult} The result of the query.
 */
export const usePick = (id) => useQuery({
    queryKey: ['picks', id],
    queryFn: () => fromSupabase(supabase.from('picks').select('*').eq('id', id).single()),
});

/**
 * A hook for fetching all picks.
 * @param {number} [contestId] - The ID of the contest to fetch picks for.
 * @returns {import('@tanstack/react-query').UseQueryResult} The result of the query.
 */
export const usePicks = (contestId) => useQuery({
    queryKey: ['picks', contestId],
    queryFn: () => {
        let query = supabase.from('picks').select('*');
        if (contestId) {
            query = query.eq('contest_id', contestId);
        }
        return fromSupabase(query);
    },
});

/**
 * A hook for adding a new pick.
 * @returns {import('@tanstack/react-query').UseMutationResult} The result of the mutation.
 */
export const useAddPick = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newPick) => fromSupabase(supabase.from('picks').insert([newPick])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['picks'] });
        },
    });
};

/**
 * A hook for updating a pick.
 * @returns {import('@tanstack/react-query').UseMutationResult} The result of the mutation.
 */
export const useUpdatePick = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('picks').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['picks'] });
        },
    });
};

/**
 * A hook for deleting a pick.
 * @returns {import('@tanstack/react-query').UseMutationResult} The result of the mutation.
 */
export const useDeletePick = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('picks').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['picks'] });
        },
    });
};