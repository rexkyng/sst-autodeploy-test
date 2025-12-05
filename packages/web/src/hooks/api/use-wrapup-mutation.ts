import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crmAPI, type WrapupRequest } from '../../api/crm-api';

export function useWrapupMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: WrapupRequest) => crmAPI.submitWrapup(params),
    onSuccess: () => {
      // Invalidate customer queries to refresh data after wrapup
      queryClient.invalidateQueries({ queryKey: ['customer'] });
    },
  });
}

