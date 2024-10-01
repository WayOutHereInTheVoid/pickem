import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

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
        mutationFn: (newGame) => fromSupabase(supabase.from('games').insert([newGame])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
        },
    });
};

export const useUpdateGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('games').update(updateData).eq('id', id)),
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