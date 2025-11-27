import { useQuery } from '@tanstack/react-query';
import { crmAPI } from '../../api/crm-api';

export function useDebtorQuery(
  tenant: string,
  idType: string,
  nationalId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['debtor', tenant, idType, nationalId],
    queryFn: () => crmAPI.getDebtor(tenant, idType, nationalId),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

