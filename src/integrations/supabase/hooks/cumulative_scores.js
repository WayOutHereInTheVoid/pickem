import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### cumulative_scores

| name       | type                     | format    | required |
|------------|--------------------------|-----------|----------|
| id         | integer                  | integer   | true     |
| name       | character varying(255)   | string    | true     |
| score      | integer                  | integer   | true     |
| created_at | timestamp with time zone | string    | false    |
| updated_at | timestamp with time zone | string    | false    |

No foreign key relationships identified.
*/

export const useCumulativeScores = () => useQuery({
    queryKey: ['cumulative_scores'],
    queryFn: () => fromSupabase(supabase.from('cumulative_scores').select('*')),
});

export const useCumulativeScoreById = (id) => useQuery({
    queryKey: ['cumulative_scores', id],
    queryFn: () => fromSupabase(supabase.from('cumulative_scores').select('*').eq('id', id).single()),
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
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('cumulative_scores').update(updateData).eq('id', id)),
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