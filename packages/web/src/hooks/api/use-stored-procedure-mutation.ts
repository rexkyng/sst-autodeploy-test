import { useMutation } from '@tanstack/react-query';
import { crmAPI } from '../../api/crm-api';

interface StoredProcedureParams {
  Provider: string;
  Command: {
    Text: string;
    Type: string;
    Parameters: any[];
  };
}

export function useStoredProcedureMutation() {
  return useMutation({
    mutationFn: (params: StoredProcedureParams) => crmAPI.executeStoredProcedure(params),
  });
}

