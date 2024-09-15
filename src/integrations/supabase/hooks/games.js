import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### games

| name         | type                     | format | required |
|--------------|--------------------------|--------|----------|
| id           | uuid                     | string | true     |
| week         | integer                  | number | true     |
| home_team_id | uuid                     | string | false    |
| away_team_id | uuid                     | string | false    |
| winner_id    | uuid                     | string | false    |
| game_date    | date                     | string | true     |
| created_at   | timestamp with time zone | string | false    |
| updated_at   | timestamp with time zone | string | false    |

Foreign Key Relationships:
- home_team_id references nfl_teams.id
- away_team_id references nfl_teams.id
- winner_id references nfl_teams.id

*/

export const useGames = () => useQuery({
  queryKey: ['games'],
  queryFn: () => fromSupabase(supabase.from('games').select('*')),
});

export const useAddGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newGame) => fromSupabase(supabase.from('games').insert([newGame])),
    onSuccess: () => {
      queryClient.invalidateQueries('games');
    },
  });
};

export const useUpdateGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('games').update(updateData).eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries('games');
    },
  });
};

export const useDeleteGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(supabase.from('games').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries('games');
    },
  });
};