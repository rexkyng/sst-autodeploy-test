import { useState } from "react";
import { useCRMStore } from "../store/crm-store";
import { crmAPI } from "../api/crm-api";
import { getQueryStringObject } from "../lib/query-string";
import { getDate } from "../lib/formatters";
import { checkSLAccount } from "../lib/utils/array-extensions";
import type { ActionList } from "../types/action";
import { useDebtorSelection } from "./use-debtor-selection";

export function useCustomerData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const store = useCRMStore();
  const { selectDebtor } = useDebtorSelection();
  
  const loadCustomer = async (nationalIdType: string, nationalId: string, isAdhocSearch = false) => {
    setLoading(true);
    setError(null);

    try {
      const querystring = getQueryStringObject();
      const tenantName = querystring.TenantName || "uaf_dc";

      const json_data = await crmAPI.getCustomer(tenantName, nationalIdType, nationalId, isAdhocSearch);

      if (!json_data.Customer) {
        console.error("No customer found in response");
        setError("No customer found");
        return;
      }
      
      // Port of getCRMCustomerJSONObject logic
      const customer = json_data.Customer;
      
      // Set basic customer data
      store.setCustomerData(json_data);

      // Initialize action lists for each loan
      const loans = customer.Loans || [];
      const actionLists: ActionList[] = [];
      
      if (loans.length > 0) {
        for (let i = 0; i < loans.length; i++) {
          const loan = loans[i];
          actionLists.push({
            AccountNo: loan.AccountNumber,
            AccountLoanSequence: loan.LoanSequence,
            SpecialRemark: loan.SpecialRemarks,
            isClickSpecialRemarkKey: null,
            isClickSpecialRemarkSave: null,
            CentreRemark: loan.CenterRemarks,
            isClickCentreRemarkKey: null,
            isClickCentreRemarkSave: null,
            FollowStatusCodeId: null,
            CallMemo: null,
            BankInAmount: null,
            BankInMethodCodeId: null,
            BankAccountId: null,
            BankInDate: getDate(),
            BankInRecepitNumber: null,
            BankInRemark: null,
            SendReminderLocalAddressActionCode: null,
            SendReminderOverseaAddressActionCode: null,
            SiteVisitActionCode: null,
            OtherActionCode: null,
            ReviewCheckActionCode: null,
            RecommendSendToCCDCode: null,
            SendSMSCode: null,
            SMSPhoneNumber: customer.MobilePhoneNumber,
          });
        }
      } else {
        actionLists.push({
          AccountNo: null,
          AccountLoanSequence: null,
          SpecialRemark: null,
          isClickSpecialRemarkKey: null,
          isClickSpecialRemarkSave: null,
          CentreRemark: null,
          isClickCentreRemarkKey: null,
          isClickCentreRemarkSave: null,
          FollowStatusCodeId: null,
          CallMemo: null,
          BankInAmount: null,
          BankInMethodCodeId: null,
          BankAccountId: null,
          BankInDate: getDate(),
          BankInRecepitNumber: null,
          BankInRemark: null,
          SendReminderLocalAddressActionCode: null,
          SendReminderOverseaAddressActionCode: null,
          SiteVisitActionCode: null,
          OtherActionCode: null,
          ReviewCheckActionCode: null,
          RecommendSendToCCDCode: null,
          SendSMSCode: null,
          SMSPhoneNumber: customer.MobilePhoneNumber,
        });
      }
      
      store.setSearchCriteria({ totalActionList: actionLists });
      
      // Select default account (highest OD day logic)
      if (loans.length > 0) {
        let selectedAccountNo = "";
        let selectedLoanSequence = "";
        
        let accountMaxODDay = loans[0].OverdueDay;
        for (let i = 0; i < loans.length; i++) {
          const odDay = loans[i].OverdueDay;
          accountMaxODDay = odDay < accountMaxODDay ? accountMaxODDay : odDay;
        }
        
        if (accountMaxODDay === 0) {
          const display = loans.filter((x: any) => checkSLAccount(x));
          if (display.length > 0) {
            selectedAccountNo = display[0].AccountNumber;
            selectedLoanSequence = display[0].LoanSequence;
          } else {
            const sl = loans.filter((x: any) => x.LoanStatus && x.LoanStatus.indexOf("SL") === -1);
            const rd = loans.filter((x: any) => x.LoanStatus && x.LoanStatus.indexOf("RD") === -1);
            const xx = loans.filter((x: any) => x.LoanStatus && x.LoanStatus.indexOf("XX") === -1);
            
            if (sl.length > 0) {
              selectedAccountNo = sl[0].AccountNumber;
              selectedLoanSequence = sl[0].LoanSequence;
            } else if (rd.length > 0) {
              selectedAccountNo = rd[0].AccountNumber;
              selectedLoanSequence = rd[0].LoanSequence;
            } else if (xx.length > 0) {
              selectedAccountNo = xx[0].AccountNumber;
              selectedLoanSequence = xx[0].LoanSequence;
            } else {
              selectedAccountNo = loans[0].AccountNumber;
              selectedLoanSequence = loans[0].LoanSequence;
            }
          }
        } else {
          const maxODLoans = loans.filter((a: any) => a.OverdueDay === accountMaxODDay);
          selectedAccountNo = maxODLoans[0].AccountNumber;
          selectedLoanSequence = maxODLoans[0].LoanSequence;
        }
        
        store.setSearchCriteria({
          selectedAccountNo,
          selectedAccountLoanSequence: selectedLoanSequence,
          selectedAccountNoForFollowHistory: selectedAccountNo,
          selectedAccountLoanSequenceForFollowHistory: selectedLoanSequence,
        });
        
        // Select default debtor
        const selectedLoan = loans.find(
          (l: any) => l.AccountNumber === selectedAccountNo && l.LoanSequence === selectedLoanSequence
        );

        if (selectedLoan && selectedLoan.Debtors && selectedLoan.Debtors.length > 0) {
          const firstDebtor = selectedLoan.Debtors[0];

          store.setSearchCriteria({
            debtors: selectedLoan.Debtors,
            selectedDebtor: firstDebtor,
            references: firstDebtor.References || [],
          });

          // Ensure detailed debtor information (including spouse info) is loaded
          await selectDebtor(firstDebtor);
        }
        
        // Set action list for selected account
        const actionList = actionLists.find(
          (x) => x.AccountNo === selectedAccountNo && x.AccountLoanSequence === selectedLoanSequence
        );
        if (actionList) {
          store.setSearchCriteria({ actionList });
        }
      }

    } catch (err) {
      console.error("Failed to load customer:", err);
      setError(err instanceof Error ? err.message : "Failed to load customer");
      throw err; // Re-throw so caller can handle
    } finally {
      setLoading(false);
    }
  };
  
  return { loadCustomer, loading, error };
}

