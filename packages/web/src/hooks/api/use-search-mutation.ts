import { useMutation } from '@tanstack/react-query';
import { crmAPI, type SearchRequest } from '../../api/crm-api';

export function useSearchMutation() {
  return useMutation({
    mutationFn: (params: SearchRequest) => crmAPI.searchCustomers(params),
  });
}

