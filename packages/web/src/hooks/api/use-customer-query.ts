import { useQuery } from '@tanstack/react-query';
import { crmAPI } from '../../api/crm-api';

export function useCustomerQuery(
  tenantName: string,
  idType: string,
  nationalId: string,
  forceLatest = false,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['customer', tenantName, idType, nationalId, forceLatest],
    queryFn: () => crmAPI.getCustomer(tenantName, idType, nationalId, forceLatest),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

