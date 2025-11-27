import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { crmAPI } from "@/api/crm-api";
import { getQueryStringObject } from "@/lib/query-string";
import { useCRMStore } from "@/store/crm-store";

interface DICalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountNumber: string;
  loanSequence: string;
}

export function DICalculatorDialog({ open, onOpenChange, accountNumber, loanSequence }: DICalculatorDialogProps) {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const store = useCRMStore();
  
  const handleCalculate = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both dates");
      return;
    }
    
    setLoading(true);
    try {
      const querystring = getQueryStringObject();
      const tenantName = querystring.TenantName || "uaf_dc";
      
      const result = await crmAPI.executeStoredProcedure({
        Provider: tenantName,
        Command: {
          Text: "G_CAL_DI_INT",
          Type: "StoredProcedure",
          Parameters: [
            { value: accountNumber },
            { value: loanSequence },
            { value: format(fromDate, "MM/dd/yyyy") },
            { value: format(toDate, "MM/dd/yyyy") },
          ],
        },
      });
      
      if (result.Result?.Table?.[0]) {
        const data = result.Result.Table[0];
        store.setDICalculation(data.NoOfDay || null, data.DIAmount || null);
      }
    } catch (error) {
      console.error("Failed to calculate DI:", error);
      alert("Failed to calculate DI");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>DI Calculator</DialogTitle>
          <DialogDescription>Calculate deferred interest for the selected account</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "MM/dd/yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "MM/dd/yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {store.diNoOfDay !== null && store.diAmount !== null && (
            <div className="rounded-lg border p-2 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Number of Days:</span>
                <span>{store.diNoOfDay}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">DI Amount:</span>
                <span>${store.diAmount?.toLocaleString()}</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCalculate} disabled={loading}>
              {loading ? "Calculating..." : "Calculate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

