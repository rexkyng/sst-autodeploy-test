import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCRMStore } from "@/store/crm-store";
import { AccountCard } from "@/components/card/account-card";
import { DebtorTable } from "@/components/tables/debtor-table";
import { CustomerInfoPanel } from "@/pages/crm/wrapup/customer-info-panel";
import { ActionPanels } from "@/pages/crm/wrapup/action-panels";
import { FollowHistoryDialog } from "@/components/dialogs/alert-dialogs";
import { AddPhoneDialog } from "@/components/dialogs/add-phone-dialog";
import { EditPhoneDialog } from "@/components/dialogs/edit-phone-dialog";
import { HistoryCard } from "@/components/card/history-card";
import type { FollowHistory } from "@openauth/core/models";
import { StartIE } from "@/lib/external-integrations";
import { crmAPI } from "@/api/crm-api";
import { getQueryStringObject } from "@/lib/query-string";
import { getDate } from "@/lib/formatters";
import { KeyIcon, SaveIcon } from "lucide-react";

interface WrapupPageProps {
  onNavigateToAccountDetail?: () => void;
}

export function WrapupPage({ onNavigateToAccountDetail }: WrapupPageProps) {
  const store = useCRMStore();
  const [showAllFollowHistory, setShowAllFollowHistory] = useState(true);
  const [selectedRemark, setSelectedRemark] = useState("");
  const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
  const [addPhoneDialogOpen, setAddPhoneDialogOpen] = useState(false);
  const [editPhoneDialogOpen, setEditPhoneDialogOpen] = useState(false);
  const [addPhoneType, setAddPhoneType] = useState(0);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  // If no customer data is loaded, show loading or message
  if (!store.customer.Id) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">No Customer Data</h2>
          <p className="text-muted-foreground">Please search and select a customer first.</p>
        </div>
      </div>
    );
  }
  
  const handleAccountSelect = (account: any) => {
    store.setSelectedAccount(
      account.AccountNumber,
      account.LoanSequence,
      account
    );
    
    // Update selected debtor
    if (account.Debtors && account.Debtors.length > 0) {
      store.setSelectedDebtor(account.Debtors[0]);
      store.setSearchCriteria({
        debtors: account.Debtors,
        references: account.Debtors[0].References || [],
      });
    }
  };
  
  const handleAccountDoubleClick = (account: any) => {
    handleAccountSelect(account);
    onNavigateToAccountDetail?.();
  };
  
  const handleDebtorSelect = (debtor: any) => {
    store.setSelectedDebtor(debtor);
    store.setSearchCriteria({
      references: debtor.References || [],
    });
  };
  
  const handleLoanLedger = async (account: any) => {
    const querystring = getQueryStringObject();
    const tenantName = querystring.TenantName || "uaf_dc";
    
    try {
      const storedProcName = tenantName === "uaf_cs" ? "cic_cs_get_url" : "cic_get_url";
      
      const result = await crmAPI.executeStoredProcedure({
        Provider: tenantName,
        Command: {
          Text: storedProcName,
          Type: "StoredProcedure",
          Parameters: [
            { value: "loan_ledger" },
            { value: account.AccountNumber },
            { value: account.LoanSequence },
          ],
        },
      });
      
      if (result.Result?.Table?.[0]?.URL) {
        StartIE(result.Result.Table[0].URL);
      }
    } catch (error) {
      console.error("Failed to get loan ledger URL:", error);
    }
  };
  
  const handleAccountSort = (field: string) => {
    store.updateSort(field, "account");
  };

  const handleFollowHistorySort = (field: string) => {
    store.updateSort(field, "follow");
  };

  const handleRemarkKey = (field: "SpecialRemark" | "CentreRemark") => {
    const date = getDate();
    const currentValue = store.actionList[field] || "";
    const newValue = `${date}\n${currentValue}`;
    store.updateActionList({ [field]: newValue });
  };

  const handleRemarkSave = (field: "SpecialRemark" | "CentreRemark") => {
    // In the WebUI, this would save the remark to the server
    // For now, we'll just mark it as saved
    const saveField = field === "SpecialRemark" ? "isClickSpecialRemarkSave" : "isClickCentreRemarkSave";
    store.updateActionList({ [saveField]: false });
  };

  const handleRemarkClick = (remark: string) => {
    setSelectedRemark(remark);
    setRemarkDialogOpen(true);
  };

  const handleAddPhone = (phoneType: number, debtor: any, showTypeSelector: boolean = false) => {
    // Set the selected debtor role for phone management
    store.setPhoneState({
      selectedRole: debtor.Role,
      selectedCustomerId: debtor.CustomerId,
      selectedAccountNo: store.selectedAccountNo,
      selectedAccountLoanSequence: store.selectedAccountLoanSequence,
    });
    setAddPhoneType(phoneType);
    setShowTypeSelector(showTypeSelector);
    setAddPhoneDialogOpen(true);
  };

  const handleEditPhone = (phone: any, debtor: any) => {
    // Set the selected debtor role and phone data for editing
    store.setPhoneState({
      selectedPhoneId: phone.Id,
      selectedPhoneNo: phone.PhoneNumber,
      selectedPhoneType: phone.PhoneType?.toString(),
      selectedPhoneCountryCode: phone.PhoneCountryCode,
      selectedPhoneExtension: phone.PhoneExtension,
      selectedRole: debtor.Role,
      selectedCustomerId: debtor.CustomerId,
      selectedAccountNo: store.selectedAccountNo,
      selectedAccountLoanSequence: store.selectedAccountLoanSequence,
      editPhoneInvalidReason: phone.PhoneInvalidReason,
    });
    setEditPhoneDialogOpen(true);
  };

  // Filter and sort follow history based on selected account or show all
  let displayedFollowHistory = showAllFollowHistory
    ? store.followHistory
    : store.followHistory.filter(
        (h) =>
          h.AccountNumber === store.selectedAccountNo &&
          h.LoanSequence === store.selectedAccountLoanSequence
      );

  // Apply sorting if sort field is set
  if (store.currentSort) {
    displayedFollowHistory = [...displayedFollowHistory].sort((a, b) => {
      const aValue = a[store.currentSort as keyof FollowHistory];
      const bValue = b[store.currentSort as keyof FollowHistory];

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return store.currentSortDir === 'desc' ? -comparison : comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return store.currentSortDir === 'desc' ? -comparison : comparison;
      }

      // For dates, convert to timestamps
      if (aValue && typeof (aValue as any).getTime === 'function' && bValue && typeof (bValue as any).getTime === 'function') {
        const comparison = (aValue as any).getTime() - (bValue as any).getTime();
        return store.currentSortDir === 'desc' ? -comparison : comparison;
      }

      // For string dates, try to parse as dates
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          const comparison = aDate.getTime() - bDate.getTime();
          return store.currentSortDir === 'desc' ? -comparison : comparison;
        }
      }

      // Fallback to string comparison
      const aStr = String(aValue || '');
      const bStr = String(bValue || '');
      const comparison = aStr.localeCompare(bStr);
      return store.currentSortDir === 'desc' ? -comparison : comparison;
    });
  }

  // Get selected account object
  const selectedAccount = store.loans.find(
    (l) => l.AccountNumber === store.selectedAccountNo && l.LoanSequence === store.selectedAccountLoanSequence
  );


  return (
    <div className="grid grid-cols-[65%_35%] gap-3 p-3">
      {/* Left Column */}
      <div className="space-y-3">
        <CustomerInfoPanel />

        <AccountCard
          accounts={store.loans}
          selectedAccount={selectedAccount}
          onAccountSelect={handleAccountSelect}
          onAccountDoubleClick={handleAccountDoubleClick}
          currentSort={store.currentAccountSort}
          currentSortDir={store.currentAccountDir}
          onSort={handleAccountSort}
          showAll={store.showAllAccount}
          displayShowAllButton={store.displayShowAllAccountButton}
          onToggleShowAll={() => store.toggleShowAllAccount()}
          onShortcutClick={handleLoanLedger}
        />
        <Card>
          <CardHeader>
            <CardTitle>Debtors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DebtorTable
              debtors={store.debtors}
              selectedDebtor={store.selectedDebtor}
              onDebtorSelect={handleDebtorSelect}
              customerPhone={store.customerPhone}
              onAddPhone={handleAddPhone}
              onEditPhone={handleEditPhone}
            />

            <div className="border-t pt-3 flex gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Special Remarks</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemarkKey("SpecialRemark")}
                    >
                      <KeyIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!store.actionList.isClickSpecialRemarkSave}
                      onClick={() => handleRemarkSave("SpecialRemark")}
                    >
                      <SaveIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={store.actionList.SpecialRemark || ""}
                  onChange={(e) => store.updateActionList({ SpecialRemark: e.target.value })}
                  rows={3}
                  placeholder="Enter special remarks..."
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Centre Remarks</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemarkKey("CentreRemark")}
                    >
                      <KeyIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!store.actionList.isClickCentreRemarkSave}
                      onClick={() => handleRemarkSave("CentreRemark")}
                    >
                      <SaveIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={store.actionList.CentreRemark || ""}
                  onChange={(e) => store.updateActionList({ CentreRemark: e.target.value })}
                  rows={3}
                  placeholder="Enter centre remarks..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <ActionPanels />
      </div>

      {/* Right Column - Follow History */}
      <div className="space-y-3 pr-3">
        <HistoryCard
          // title="Follow History"
          showAll={showAllFollowHistory}
          onToggleShowAll={() => setShowAllFollowHistory(!showAllFollowHistory)}
          history={displayedFollowHistory}
          currentSort={store.currentSort}
          currentSortDir={store.currentSortDir}
          onSort={handleFollowHistorySort}
          onRemarkClick={handleRemarkClick}
          // readOnly={true}
        />
      </div>

      {/* Right Column - Other Info & Actions */}
      {/* <div className="space-y-6">

        
        {store.selectedDebtor.CustomerInfo?.SpouseName && (
          <Card>
            <CardHeader>
              <CardTitle>Spouse Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Name: </span>
                <span>
                  {store.selectedDebtor.CustomerInfo.SpouseName}
                  {store.selectedDebtor.CustomerInfo.SpouseNameChinese && 
                    ` (${store.selectedDebtor.CustomerInfo.SpouseNameChinese})`
                  }
                </span>
              </div>
              {store.selectedDebtor.CustomerInfo.SpouseAge && (
                <div>
                  <span className="font-medium">Age: </span>
                  <span>{store.selectedDebtor.CustomerInfo.SpouseAge}</span>
                </div>
              )}
              {store.selectedDebtor.CustomerInfo.SpousePosition && (
                <div>
                  <span className="font-medium">Position: </span>
                  <span>{store.selectedDebtor.CustomerInfo.SpousePosition}</span>
                </div>
              )}
              {store.selectedDebtor.CustomerInfo.SpouseCompanyName && (
                <div>
                  <span className="font-medium">Company: </span>
                  <span>{store.selectedDebtor.CustomerInfo.SpouseCompanyName}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <ActionPanels />
      </div> */}

      <FollowHistoryDialog
        open={remarkDialogOpen}
        onOpenChange={setRemarkDialogOpen}
        remark={selectedRemark}
      />

      <AddPhoneDialog
        open={addPhoneDialogOpen}
        onOpenChange={setAddPhoneDialogOpen}
        phoneType={addPhoneType}
        showTypeSelector={showTypeSelector}
      />

      <EditPhoneDialog
        open={editPhoneDialogOpen}
        onOpenChange={setEditPhoneDialogOpen}
      />
    </div>
  );
}

