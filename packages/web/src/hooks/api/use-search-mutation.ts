import { useMutation } from '@tanstack/react-query';
import { crmAPI } from '../../api/crm-api';

interface SearchParams {
  Tenant: string;
  AccountNumber?: string | null;
  LoanSequence?: string | null;
  NationalIdType?: string | null;
  NationalId?: string | null;
  Surname?: string | null;
  GivenName?: string | null;
  ReferenceName?: string | null;
  CompanyName?: string | null;
  PhoneNumber?: string | null;
  ReferencePhoneNumber?: string | null;
  CustomerId?: string | null;
  AgentId?: string;
}

export function useSearchMutation() {
  return useMutation({
    mutationFn: (params: SearchParams) => crmAPI.searchCustomers(params),
  });
}

