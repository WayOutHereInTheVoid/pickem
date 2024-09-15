import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### participants

| name           | type                     | format | required |
|----------------|--------------------------|--------|----------|
| id             | uuid                     | string | true     |
| name           | text                     | string | true     |
| email          | text                     | string | true     |
| slack_username | text                     | string | false    |
| created_at     | timestamp with time zone | string | false    |
| updated_at     | timestamp with time zone | string | false    |

*/

export const useParticipants = () => useQuery({
  queryKey: ['participants'],
  queryFn: () => fromSupabase(supabase.from('participants').select('*')),
});

export const useAddParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newParticipant) => fromSupabase(supabase.from('participants').insert([newParticipant])),
    onSuccess: () => {
      queryClient.invalidateQueries('participants');
    },
  });
};

export const useUpdateParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('participants').update(updateData).eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries('participants');
    },
  });
};

export const useDeleteParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(supabase.from('participants').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries('participants');
    },
  });
};