import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### fantasy_matchups

| name      | type                     | format | required |
|-----------|--------------------------|--------|----------|
| id        | uuid                     | string | true     |
| week      | integer                  | number | true     |
| team1_id  | uuid                     | string | false    |
| team2_id  | uuid                     | string | false    |
| winner_id | uuid                     | string | false    |
| created_at| timestamp with time zone | string | false    |
| updated_at| timestamp with time zone | string | false    |

Foreign Key Relationships:
- team1_id references participants.id
- team2_id references participants.id
- winner_id references participants.id

*/

export const useFantasyMatchups = () => useQuery({
  queryKey: ['fantasy_matchups'],
  queryFn: () => fromSupabase(supabase.from('fantasy_matchups').select('*')),
});

export const useAddFantasyMatchup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newMatchup) => fromSupabase(supabase.from('fantasy_matchups').insert([newMatchup])),
    onSuccess: () => {
      queryClient.invalidateQueries('fantasy_matchups');
    },
  });
};

export const useUpdateFantasyMatchup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('fantasy_matchups').update(updateData).eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries('fantasy_matchups');
    },
  });
};

export const useDeleteFantasyMatchup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(supabase.from('fantasy_matchups').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries('fantasy_matchups');
    },
  });
};