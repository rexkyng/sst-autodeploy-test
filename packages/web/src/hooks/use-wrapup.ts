import { useState } from "react";
import { useCRMStore } from "../store/crm-store";
import { crmAPI } from "../api/crm-api";
import { getQueryStringObject } from "../lib/query-string";
import { MarkDone, AllowMarkDone } from "../lib/external-integrations";

export function useWrapup(onShowMessage?: (message: string) => void) {
  const [loading, setLoading] = useState(false);
  const store = useCRMStore();
  
  const validateFinish = (): { valid: boolean; message?: string } => {
    const totalActionList = store.totalActionList;
    const loans = store.loans;

    // Check if there are any loans
    if (!loans || loans.length === 0) {
      return {
        valid: false,
        message: "No any loans account.",
      };
    }

    // Check if any OD account doesn't have follow status
    for (const loan of loans) {
      if (loan.OverdueDay > 0) {
        const actionList = totalActionList.find(
          (x) => x.AccountNo === loan.AccountNumber && x.AccountLoanSequence === loan.LoanSequence
        );
        
        if (!actionList?.FollowStatusCodeId) {
          return {
            valid: false,
            message: `Please select follow status for account ${loan.AccountNumber}-${loan.LoanSequence}`,
          };
        }
      }
    }
    
    // Validate bank-in information
    for (const actionList of totalActionList) {
      if (actionList.BankInMethodCodeId) {
        if (!actionList.BankAccountId) {
          return {
            valid: false,
            message: "Please select bank account when bank-in method is selected",
          };
        }
      }
      
      if (actionList.BankAccountId) {
        if (!actionList.BankInMethodCodeId) {
          return {
            valid: false,
            message: "Please select bank-in method when bank account is selected",
          };
        }
      }
    }
    
    return { valid: true };
  };
  
  const validateFollow = (): { valid: boolean; message?: string } => {
    // Check if next follow date is set
    if (!store.nextFollowDateTime) {
      return {
        valid: false,
        message: "Please set next follow date/time",
      };
    }

    // Check if follow status is selected
    if (!store.followStatusId) {
      return {
        valid: false,
        message: "Please select follow status",
      };
    }

    // Run finish validation too
    return validateFinish();
  };
  
  const submitWrapup = async (isFinish: boolean): Promise<boolean> => {
    setLoading(true);
    try {
      const querystring = getQueryStringObject();
      const tenantName = querystring.TenantName || "uaf_dc";
      const agentId = querystring["Agent.ExternalID"] || querystring["Agent.UserName"];
      const interactionId = querystring["Interaction.InteractionId"];
      const isAdhocSearch = store.isSearch;
      
      // Build accounts array
      const accounts = store.totalActionList.map((actionList) => {
        return {
          AccountNumber: actionList.AccountNo,
          LoanSequence: actionList.AccountLoanSequence,
          SpecialRemarks: actionList.SpecialRemark,
          CenterRemarks: actionList.CentreRemark,
          FollowStatusCodeId: actionList.FollowStatusCodeId,
          CallMemo: actionList.CallMemo,
          BankInInfo: actionList.BankInMethodCodeId ? {
            Amount: actionList.BankInAmount,
            MethodCodeId: actionList.BankInMethodCodeId,
            AccountId: actionList.BankAccountId,
            Date: actionList.BankInDate,
            ReceiptNumber: actionList.BankInRecepitNumber,
            Remark: actionList.BankInRemark,
          } : null,
          Actions: {
            SendReminderLocalAddress: actionList.SendReminderLocalAddressActionCode,
            SendReminderOverseaAddress: actionList.SendReminderOverseaAddressActionCode,
            SiteVisit: actionList.SiteVisitActionCode,
            Other: actionList.OtherActionCode,
            ReviewCheck: actionList.ReviewCheckActionCode,
            RecommendSendToCCD: actionList.RecommendSendToCCDCode,
            SendSMS: actionList.SendSMSCode,
            SMSPhoneNumber: actionList.SMSPhoneNumber,
          },
        };
      });
      
      // Calculate duration
      const duration = store.startTime 
        ? Math.floor((new Date().getTime() - store.startTime.getTime()) / 1000)
        : 0;
      
      const payload = {
        TenantName: tenantName,
        IsAdhocSearch: isAdhocSearch,
        CallInfo: {
          CustomerId: store.selectedCustomerId,
          NationalIdType: store.customer.NationalIdType,
          NationalId: store.customer.NationalId,
          AgentId: agentId,
          InteractionId: interactionId,
          StartTime: store.startTime?.toISOString(),
          Duration: duration,
          IsFinish: isFinish,
          NextFollowDateTime: store.nextFollowDateTime,
          Accounts: accounts,
        },
      };
      
      await crmAPI.submitWrapup(payload);
      
      // Allow and trigger MarkDone
      AllowMarkDone();
      MarkDone();
      
      return true;
    } catch (error) {
      console.error("Failed to submit wrapup:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const finish = async (): Promise<boolean> => {
    const validation = validateFinish();
    if (!validation.valid) {
      if (onShowMessage && validation.message) {
        onShowMessage(validation.message);
      } else {
        alert(validation.message);
      }
      return false;
    }

    return await submitWrapup(true);
  };
  
  const follow = async (): Promise<boolean> => {
    const validation = validateFollow();
    if (!validation.valid) {
      if (onShowMessage && validation.message) {
        onShowMessage(validation.message);
      } else {
        alert(validation.message);
      }
      return false;
    }

    return await submitWrapup(false);
  };
  
  return {
    loading,
    finish,
    follow,
    validateFinish,
    validateFollow,
  };
}

