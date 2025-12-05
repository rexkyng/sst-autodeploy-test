import type { Debtor } from "@openauth/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DebtorInformationTableProps {
  debtors: Debtor[];
  className?: string;
  reference?: boolean;
  selectedDebtor?: Debtor | null;
  onDebtorSelect?: (debtor: Debtor) => void;
}

export function DebtorInformationTable({ 
  debtors, 
  className, 
  reference = false,
  selectedDebtor,
  onDebtorSelect
}: DebtorInformationTableProps) {
  return (
    <ScrollArea className={`w-full ${className || ""}`}>
      <div className="min-w-max">
        <div className="rounded-md border">
          <Table className="w-full min-w-max">
            <TableHeader>
              <TableRow>
                {reference && <TableHead>Role</TableHead>}
                <TableHead>ID</TableHead>
                {reference && <TableHead>ID Type</TableHead>}
                <TableHead>English Name</TableHead>
                <TableHead>Chinese Name</TableHead>
                {!reference && <TableHead>Nick Name</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {debtors.map((debtor) => (
                <TableRow
                  key={debtor.NationalId}
                  onClick={() => onDebtorSelect?.(debtor)}
                  className="cursor-pointer"
                  variant={selectedDebtor?.NationalId === debtor.NationalId ? "highlight" : "default"}
                >
                  {reference && <TableCell>
                    {debtor.Role}
                  </TableCell>}
                  <TableCell>
                    {debtor.NationalId}
                  </TableCell>
                  {reference && <TableCell>
                    {debtor.NationalIdType}
                  </TableCell>}
                  <TableCell>
                    {debtor.Surname}{" "}
                    {debtor.GivenName}
                  </TableCell>
                  <TableCell>
                    {debtor.SurnameChinese}{" "}
                    {debtor.GivenNameChinese}
                  </TableCell>
                  {!reference && <TableCell>
                    {debtor.Nickname}
                  </TableCell>}
                </TableRow>
              ))} 
            </TableBody>
          </Table>
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
