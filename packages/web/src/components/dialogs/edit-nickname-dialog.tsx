import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { crmAPI } from "@/api/crm-api";
import { getQueryStringObject } from "@/lib/query-string";
import { useCRMStore } from "@/store/crm-store";

interface EditNicknameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditNicknameDialog({ open, onOpenChange }: EditNicknameDialogProps) {
  const store = useCRMStore();
  const [nickname, setNickname] = useState(store.editCRMNickName || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setNickname(store.editCRMNickName || "");
  }, [store.editCRMNickName, open]);
  
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const querystring = getQueryStringObject();
      const tenantName = querystring.TenantName || "uaf_dc";
      const nationalIdType = store.customer.NationalIdType;
      const nationalId = store.customer.NationalId;
      const agentId = querystring["Agent.ExternalID"] || querystring["Agent.UserName"];
      const isAdhocSearch = store.isSearch;
      
      const result = await crmAPI.executeStoredProcedure({
        Provider: tenantName,
        Command: {
          Text: "SP_CustomerNickname_Update",
          Type: "StoredProcedure",
          Parameters: [
            { value: tenantName },
            { value: nationalIdType },
            { value: nationalId },
            { value: nickname },
            { value: agentId },
            { value: isAdhocSearch },
          ],
        },
      });
      
      if (result.Result?.Table?.[0]?.Column1 === 1) {
        store.setNicknameState({ 
          crmNickName: nickname,
          editCRMNickName: nickname 
        });
        onOpenChange(false);
      } else {
        alert("Failed to update nickname");
      }
    } catch (error) {
      console.error("Failed to update nickname:", error);
      alert("Failed to update nickname");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Nickname</DialogTitle>
          <DialogDescription>Update the nickname for this customer</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter nickname"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

