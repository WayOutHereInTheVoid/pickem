import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) {
        console.error('Supabase query error:', error);
        throw new Error(error.message);
    }
    return data;
};

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

export const useAddCumulativeScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newScore) => fromSupabase(supabase.from('cumulative_scores').insert([newScore])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cumulative_scores'] });
        },
    });
};

export const useUpdateCumulativeScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('cumulative_scores').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cumulative_scores'] });
        },
    });
};

export const useDeleteCumulativeScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('cumulative_scores').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cumulative_scores'] });
        },
    });
};