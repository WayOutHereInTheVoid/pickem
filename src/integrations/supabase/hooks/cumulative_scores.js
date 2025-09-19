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
    if (error) {
        console.error('Supabase query error:', error);
        throw new Error(error.message);
    }
    return data;
};

/**
 * A hook for fetching the cumulative scores.
 * @returns {import('@tanstack/react-query').UseQueryResult} The result of the query.
 */
export const useCumulativeScores = () => useQuery({
    queryKey: ['cumulative_scores'],
    queryFn: async () => {
        try {
            const data = await fromSupabase(supabase.from('cumulative_scores').select('*'));
            console.log('Fetched cumulative scores:', data);
            return data;
        } catch (error) {
            console.error('Error fetching cumulative scores:', error);
            throw error;
        }
    },
});

/**
 * A hook for adding a new cumulative score.
 * @returns {import('@tanstack/react-query').UseMutationResult} The result of the mutation.
 */
export const useAddCumulativeScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newScore) => fromSupabase(supabase.from('cumulative_scores').insert([newScore])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cumulative_scores'] });
        },
    });
};

/**
 * A hook for updating a cumulative score.
 * @returns {import('@tanstack/react-query').UseMutationResult} The result of the mutation.
 */
export const useUpdateCumulativeScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ name, score }) => {
            const { data: existingScore, error: fetchError } = await supabase
                .from('cumulative_scores')
                .select('score')
                .eq('name', name)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            if (existingScore) {
                const newScore = existingScore.score + score;
                const { data, error } = await supabase
                    .from('cumulative_scores')
                    .update({ score: newScore })
                    .eq('name', name);
                
                if (error) throw error;
                return data;
            } else {
                const { data, error } = await supabase
                    .from('cumulative_scores')
                    .insert({ name, score });
                
                if (error) throw error;
                return data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cumulative_scores'] });
        },
    });
};

/**
 * A hook for deleting a cumulative score.
 * @returns {import('@tanstack/react-query').UseMutationResult} The result of the mutation.
 */
export const useDeleteCumulativeScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('cumulative_scores').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cumulative_scores'] });
        },
    });
};