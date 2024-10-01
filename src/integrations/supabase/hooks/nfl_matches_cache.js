import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### nfl_matches_cache

| name       | type                     | format    | required |
|------------|--------------------------|-----------|----------|
| id         | integer                  | integer   | true     |
| week       | integer                  | integer   | true     |
| matches    | jsonb                    | jsonb     | true     |
| updated_at | timestamp with time zone | string    | false    |

No foreign key relationships identified.
*/

export const useNFLMatchesCache = (id) => useQuery({
    queryKey: ['nfl_matches_cache', id],
    queryFn: () => fromSupabase(supabase.from('nfl_matches_cache').select('*').eq('id', id).single()),
});

export const useNFLMatchesCaches = () => useQuery({
    queryKey: ['nfl_matches_cache'],
    queryFn: () => fromSupabase(supabase.from('nfl_matches_cache').select('*')),
});

export const useAddNFLMatchesCache = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newCache) => fromSupabase(supabase.from('nfl_matches_cache').insert([newCache])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nfl_matches_cache'] });
        },
    });
};

export const useUpdateNFLMatchesCache = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('nfl_matches_cache').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nfl_matches_cache'] });
        },
    });
};

export const useDeleteNFLMatchesCache = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('nfl_matches_cache').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nfl_matches_cache'] });
        },
    });
};