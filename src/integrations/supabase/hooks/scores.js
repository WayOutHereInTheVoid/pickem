import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

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

export const useScore = (id) => useQuery({
    queryKey: ['scores', id],
    queryFn: () => fromSupabase(supabase.from('scores').select('*').eq('id', id).single()),
});

export const useScores = () => useQuery({
    queryKey: ['scores'],
    queryFn: () => fromSupabase(supabase.from('scores').select('*')),
});

export const useAddScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newScore) => fromSupabase(supabase.from('scores').insert([newScore])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scores'] });
        },
    });
};

export const useUpdateScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('scores').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scores'] });
        },
    });
};

export const useDeleteScore = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('scores').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scores'] });
        },
    });
};