import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### weekly_picks

| name                 | type                     | format | required |
|----------------------|--------------------------|--------|----------|
| id                   | uuid                     | string | true     |
| participant_id       | uuid                     | string | false    |
| week                 | integer                  | number | true     |
| game1_id             | uuid                     | string | false    |
| game1_pick           | uuid                     | string | false    |
| game2_id             | uuid                     | string | false    |
| game2_pick           | uuid                     | string | false    |
| fantasy_matchup_id   | uuid                     | string | false    |
| fantasy_matchup_pick | uuid                     | string | false    |
| created_at           | timestamp with time zone | string | false    |
| updated_at           | timestamp with time zone | string | false    |

Foreign Key Relationships:
- participant_id references participants.id
- game1_id references games.id
- game1_pick references nfl_teams.id
- game2_id references games.id
- game2_pick references nfl_teams.id
- fantasy_matchup_id references fantasy_matchups.id
- fantasy_matchup_pick references participants.id

*/

export const useWeeklyPicks = () => useQuery({
  queryKey: ['weekly_picks'],
  queryFn: () => fromSupabase(supabase.from('weekly_picks').select('*')),
});

export const useAddWeeklyPick = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPick) => fromSupabase(supabase.from('weekly_picks').insert([newPick])),
    onSuccess: () => {
      queryClient.invalidateQueries('weekly_picks');
    },
  });
};

export const useUpdateWeeklyPick = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('weekly_picks').update(updateData).eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries('weekly_picks');
    },
  });
};

export const useDeleteWeeklyPick = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(supabase.from('weekly_picks').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries('weekly_picks');
    },
  });
};