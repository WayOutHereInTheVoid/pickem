import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useCumulativeScores = () => useQuery({
    queryKey: ['cumulative_scores'],
    queryFn: () => fromSupabase(supabase.from('cumulative_scores').select('*')),
});

export const useCumulativeScoreById = (id) => useQuery({
    queryKey: ['cumulative_scores', id],
    queryFn: () => fromSupabase(supabase.from('cumulative_scores').select('*').eq('id', id).single()),
    enabled: !!id, // Only run the query if id is provided
});

export const useAddCumulativeScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newScore) => fromSupabase(supabase.from('cumulative_scores').insert([newScore])),
        onSuccess: () => {
            queryClient.invalidateQueries('cumulative_scores');
        },
    });
};

export const useUpdateCumulativeScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ name, score }) => {
            const { data: existingScore, error: fetchError } = await supabase
                .from('cumulative_scores')
                .select('*')
                .eq('name', name)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            if (existingScore) {
                const { data, error } = await supabase
                    .from('cumulative_scores')
                    .update({ score: existingScore.score + score })
                    .eq('name', name);
                if (error) throw error;
                return data;
            } else {
                const { data, error } = await supabase
                    .from('cumulative_scores')
                    .insert([{ name, score }]);
                if (error) throw error;
                return data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries('cumulative_scores');
        },
    });
};

export const useDeleteCumulativeScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('cumulative_scores').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('cumulative_scores');
        },
    });
};
