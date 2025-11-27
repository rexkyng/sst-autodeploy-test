import React from "react";
import type { Debtor } from "@openauth/core/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ReferenceListDebtorTableProps {
  debtors: Debtor[];
  selectedDebtor?: Partial<Debtor>;
  onDebtorSelect: (debtor: Debtor) => void;
}

export function ReferenceListDebtorTable({
  debtors,
  selectedDebtor,
  onDebtorSelect,
}: ReferenceListDebtorTableProps) {
  const handleRowClick = (debtor: Debtor) => {
    onDebtorSelect(debtor);
  };

  const isSelected = (debtor: Debtor) => {
    return selectedDebtor?.Role === debtor.Role &&
           selectedDebtor?.NationalId === debtor.NationalId;
  };

  return (
    <ScrollArea className="w-full">
      <div className="min-w-max">
        <Table className="w-full min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Role</TableHead>
            <TableHead className="w-32">ID</TableHead>
            <TableHead className="w-40">English Name</TableHead>
            <TableHead className="w-40">Chinese Name</TableHead>
            <TableHead className="w-32">Nick Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debtors.map((debtor, index) => (
            <TableRow
              key={`${debtor.Role}-${debtor.NationalId}-${index}`}
              className="cursor-pointer"
              variant={isSelected(debtor) ? "highlight" : "default"}
              onClick={() => handleRowClick(debtor)}
            >
              <TableCell className="font-medium">{debtor.Role}</TableCell>
              <TableCell>{debtor.NationalId || '-'}</TableCell>
              <TableCell>{`${debtor.Surname || ''} ${debtor.GivenName || ''}`.trim() || '-'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {debtor.SurnameChinese || debtor.GivenNameChinese ?
                  `${debtor.SurnameChinese || ''}${debtor.GivenNameChinese || ''}` : '-'}
              </TableCell>
              <TableCell>{debtor.Nickname || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
      <ScrollBar orientation="horizontal" />
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
