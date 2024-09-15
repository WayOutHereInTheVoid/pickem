import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### results

| name                   | type                     | format | required |
|------------------------|--------------------------|--------|----------|
| id                     | uuid                     | string | true     |
| participant_id         | uuid                     | string | false    |
| week                   | integer                  | number | true     |
| game1_correct          | boolean                  | boolean| false    |
| game2_correct          | boolean                  | boolean| false    |
| fantasy_matchup_correct| boolean                  | boolean| false    |
| total_correct          | integer                  | number | false    |
| created_at             | timestamp with time zone | string | false    |
| updated_at             | timestamp with time zone | string | false    |

Foreign Key Relationships:
- participant_id references participants.id

*/

export const useResults = () => useQuery({
  queryKey: ['results'],
  queryFn: () => fromSupabase(supabase.from('results').select('*')),
});

export const useAddResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newResult) => fromSupabase(supabase.from('results').insert([newResult])),
    onSuccess: () => {
      queryClient.invalidateQueries('results');
    },
  });
};

export const useUpdateResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('results').update(updateData).eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries('results');
    },
  });
};

export const useDeleteResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(supabase.from('results').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries('results');
    },
  });
};