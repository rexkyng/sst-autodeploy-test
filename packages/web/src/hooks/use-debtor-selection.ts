import { useState } from "react";
import type { Debtor } from "@openauth/core/models";
import { crmAPI } from "../api/crm-api";
import { useCRMStore } from "../store/crm-store";
import { getQueryStringObject } from "../lib/query-string";

export function useDebtorSelection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const store = useCRMStore();

  const selectDebtor = async (debtor: Debtor) => {
    try {
      setLoading(true);
      setError(null);

      // First set the basic debtor info
      store.setSelectedDebtor(debtor);

      // Try to load detailed debtor info including CustomerInfo
      // Check both NationalId and CustomerId as fallback
      const hasNationalId = debtor.NationalId && debtor.NationalIdType;
      const hasCustomerId = debtor.CustomerId;

      if (hasNationalId || hasCustomerId) {
        const querystring = getQueryStringObject();
        const tenantName = querystring.TenantName || "uaf_dc";

        // Use NationalId if available, otherwise try CustomerId
        const idType = debtor.NationalIdType || "HKID";
        const idValue = debtor.NationalId || debtor.CustomerId || "";

        const debtorData = await crmAPI.getDebtor(tenantName, idType, idValue);

        if (debtorData) {
          // Update the selected debtor with the detailed CustomerInfo
          const updatedDebtor = {
            ...debtor,
            CustomerInfo: debtorData.CustomerInfo || debtorData
          };

          store.setSelectedDebtor(updatedDebtor);
        }
      }

    } catch (err) {
      console.error("Error loading debtor details:", err);
      setError(err instanceof Error ? err.message : "Failed to load debtor details");

      // Still set the basic debtor info even if detailed loading fails
      store.setSelectedDebtor(debtor);
    } finally {
      setLoading(false);
    }
  };

  return {
    selectDebtor,
    loading,
    error
  };
}

