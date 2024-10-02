import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useGame = (id) => useQuery({
    queryKey: ['games', id],
    queryFn: () => fromSupabase(supabase.from('games').select('*').eq('id', id).single()),
});

export const useGames = () => useQuery({
    queryKey: ['games'],
    queryFn: () => fromSupabase(supabase.from('games').select('*')),
});

export const useAddGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newGame) => {
            const { data, error } = await supabase.from('games').insert([newGame]).select();
            if (error) throw error;
            return data[0];
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
            return data;
        },
    });
};

export const useUpdateGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updateData }) => {
            const { data, error } = await supabase.from('games').update(updateData).eq('id', id).select();
            if (error) throw error;
            return data[0];
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
    });
};

export const useDeleteGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('games').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
    });
};