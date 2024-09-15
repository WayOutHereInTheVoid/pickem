import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### nfl_teams

| name         | type                     | format | required |
|--------------|--------------------------|--------|----------|
| id           | uuid                     | string | true     |
| name         | text                     | string | true     |
| abbreviation | text                     | string | true     |
| created_at   | timestamp with time zone | string | false    |
| updated_at   | timestamp with time zone | string | false    |

*/

export const useNflTeams = () => useQuery({
  queryKey: ['nfl_teams'],
  queryFn: () => fromSupabase(supabase.from('nfl_teams').select('*')),
});

export const useAddNflTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newTeam) => fromSupabase(supabase.from('nfl_teams').insert([newTeam])),
    onSuccess: () => {
      queryClient.invalidateQueries('nfl_teams');
    },
  });
};

export const useUpdateNflTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('nfl_teams').update(updateData).eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries('nfl_teams');
    },
  });
};

export const useDeleteNflTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(supabase.from('nfl_teams').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries('nfl_teams');
    },
  });
};