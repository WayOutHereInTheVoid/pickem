import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

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

export const usePicks = () => useQuery({
    queryKey: ['picks'],
    queryFn: () => fromSupabase(supabase.from('picks').select('*')),
});

export const usePickById = (id) => useQuery({
    queryKey: ['picks', id],
    queryFn: () => fromSupabase(supabase.from('picks').select('*').eq('id', id).single()),
});

export const useAddPick = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newPick) => fromSupabase(supabase.from('picks').insert([newPick])),
        onSuccess: () => {
            queryClient.invalidateQueries('picks');
        },
    });
};

export const useUpdatePick = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('picks').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('picks');
        },
    });
};

export const useDeletePick = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('picks').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('picks');
        },
    });
};