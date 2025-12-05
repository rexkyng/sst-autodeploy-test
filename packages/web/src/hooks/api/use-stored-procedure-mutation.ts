import { useMutation } from '@tanstack/react-query';
import { crmAPI, type StoredProcedureRequest } from '../../api/crm-api';

export function useStoredProcedureMutation() {
  return useMutation({
    mutationFn: (params: StoredProcedureRequest) => crmAPI.executeStoredProcedure(params),
  });
}

