import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crmAPI } from '../../api/crm-api';

interface WrapupParams {
  TenantName: string;
  IsAdhocSearch: boolean;
  CallInfo: any;
}

export function useWrapupMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: WrapupParams) => crmAPI.submitWrapup(params),
    onSuccess: () => {
      // Invalidate customer queries to refresh data after wrapup
      queryClient.invalidateQueries({ queryKey: ['customer'] });
    },
  });
}

