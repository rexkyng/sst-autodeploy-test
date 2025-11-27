
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DICalculatorProps {
  children: React.ReactNode;
}

export const DICalculator = ({ children }: DICalculatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [daysNo, setDaysNo] = useState("");
  const [amount, setAmount] = useState("");

  const calculateDI = () => {
    if (fromDate && toDate) {
      const timeDiff = toDate.getTime() - fromDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      setDaysNo(daysDiff.toString());
      // Calculate interest amount (simplified calculation)
      const interestAmount = (daysDiff * 0.01).toFixed(2); // 1% per day for demo
      setAmount(interestAmount);
    }
  };

  const resetCalculator = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setDaysNo("");
    setAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>DI Calculator</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* From Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="from-date" className="text-right">
              From Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
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
          </div>

          {/* To Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="to-date" className="text-right">
              To Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
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
          </div>

          {/* Number of Days */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="days-no" className="text-right">
              No. of Days
            </Label>
            <div className="col-span-3">
              <Input
                id="days-no"
                value={daysNo}
                onChange={(e) => setDaysNo(e.target.value)}
                placeholder="Calculated days"
                readOnly
              />
            </div>
          </div>

          {/* DI Amount */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="di-amount" className="text-right">
              DI Amount
            </Label>
            <div className="col-span-3">
              <Input
                id="di-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Calculated amount"
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={resetCalculator}>
            Clear
          </Button>
          <Button onClick={calculateDI} disabled={!fromDate || !toDate}>
            Calculate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
