import { useState, useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import type { Debtor } from "@openauth/core/models"
import { PhoneType } from "@/types/phone"
import { useTableInteraction } from "@/hooks/use-table-interaction"
import { Button } from "@/components/ui/button"
import { Phone, Plus, MessageSquare, Edit } from "lucide-react"
import { Dial, MediaSmsCreateNewOutboundPageMode } from "@/lib/external-integrations"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/components/data-table"

interface DebtorTableProps {
  debtors: Debtor[];
  selectedDebtor?: Partial<Debtor>;
  onDebtorSelect: (debtor: Debtor) => void;
  customerPhone?: any[];
  onAddPhone?: (phoneType: number, debtor: Debtor, showTypeSelector?: boolean) => void;
  onEditPhone?: (phone: any, debtor: Debtor) => void;
}

interface PhoneOption {
  value: string;
  label: string;
  type: string;
  countryCode?: string;
  extension?: string;
  reason?: string;
  phoneId?: string;
}

export function DebtorTable({
  debtors,
  selectedDebtor,
  onDebtorSelect,
  customerPhone = [],
  onAddPhone,
  onEditPhone,
}: DebtorTableProps) {
  const { handleSingleClick } = useTableInteraction();
  const [selectedPhones, setSelectedPhones] = useState<Record<string, PhoneOption>>({});

  const getPhoneOptions = (debtor: Debtor): PhoneOption[] => {
    const options: PhoneOption[] = [];

    // Add debtor's business phone
    if (debtor.BusinessPhoneNumber && debtor.BusinessPhoneNumber !== 'NIL') {
      options.push({
        value: debtor.BusinessPhoneNumber,
        label: `B: (${debtor.BusinessPhoneCountryCode || ""}) ${debtor.BusinessPhoneNumber}`,
        type: PhoneType.DirectBusinessPhone.toString(),
        countryCode: debtor.BusinessPhoneCountryCode,
      });
    }

    // Add customer phones (filtered to match WebUI logic)
    customerPhone.forEach((phone) => {
      if (phone.PhoneNumber && phone.PhoneNumber !== 'NIL' && phone.CustomerId === debtor.CustomerId && (!phone.AccountNumber || phone.AccountNumber === '')) {
        let prefix = '';
        switch (phone.PhoneType) {
          case 2:
          case 3:
            prefix = 'B: ';
            break;
          case 1:
            prefix = 'H: ';
            break;
          case 4:
            prefix = 'M: ';
            break;
          case 0:
            prefix = 'O: ';
            break;
          case 6:
            prefix = 'P: ';
            break;
        }

        options.push({
          value: phone.PhoneNumber,
          label: `${prefix}(${phone.PhoneCountryCode}) ${phone.PhoneNumber}${phone.PhoneExtension ? `-${phone.PhoneExtension}` : ''}${phone.PhoneInvalidReason ? ` <${phone.PhoneInvalidReason}>` : ''}`,
          type: phone.PhoneType?.toString() || '0',
          countryCode: phone.PhoneCountryCode,
          extension: phone.PhoneExtension,
          reason: phone.PhoneInvalidReason,
          phoneId: phone.Id,
        });
      }
    });

    return options;
  };

  const handleDial = (debtor: Debtor) => {
    const options = getPhoneOptions(debtor);
    const selectedPhoneOption = resolveCurrentPhoneOption(debtor, options);
    if (selectedPhoneOption?.value) {
      Dial(selectedPhoneOption.value);
    }
  };

  const handleSMS = (debtor: Debtor) => {
    const options = getPhoneOptions(debtor);
    const selectedPhoneOption = resolveCurrentPhoneOption(debtor, options);
    if (selectedPhoneOption?.value) {
      MediaSmsCreateNewOutboundPageMode(selectedPhoneOption.value);
    }
  };

  const getDebtorKey = (debtor: Debtor) => `${debtor.NationalId || ""}-${debtor.Role || ""}`;

  const resolveCurrentPhoneOption = (debtor: Debtor, options: PhoneOption[]): PhoneOption | undefined => {
    const debtorKey = getDebtorKey(debtor);
    const storedOption = selectedPhones[debtorKey];

    if (storedOption) {
      const matched = options.find((opt) => opt.value === storedOption.value && opt.type === storedOption.type);
      if (matched) {
        return matched;
      }
    }

    return options[0];
  };

  const handleAddPhone = (debtor: Debtor) => {
    const options = getPhoneOptions(debtor);
    const currentOption = resolveCurrentPhoneOption(debtor, options);
    const defaultPhoneType = currentOption ? parseInt(currentOption.type, 10) || PhoneType.NoContactType : PhoneType.NoContactType;

    onAddPhone?.(defaultPhoneType, debtor, true); // true for showTypeSelector
  };

  const handleEditPhone = (debtor: Debtor) => {
    const options = getPhoneOptions(debtor);
    const selectedPhoneOption = resolveCurrentPhoneOption(debtor, options);

    if (selectedPhoneOption && selectedPhoneOption.phoneId) {
      // Find the actual phone object from customerPhone array
      const phoneData = customerPhone.find((p) => p.Id === selectedPhoneOption.phoneId);
      if (phoneData) {
        onEditPhone?.(phoneData, debtor);
      }
    } else if (selectedPhoneOption) {
      // If it's a debtor's direct phone (no phoneId), we need to create a mock phone object
      // This handles cases like debtor.BusinessPhoneNumber
      const mockPhone = {
        Id: null,
        PhoneNumber: selectedPhoneOption.value,
        PhoneType: parseInt(selectedPhoneOption.type, 10) || PhoneType.NoContactType,
        PhoneCountryCode: selectedPhoneOption.countryCode,
        PhoneExtension: selectedPhoneOption.extension,
        PhoneInvalidReason: selectedPhoneOption.reason,
        CustomerId: debtor.CustomerId,
        AccountNumber: null,
        Role: debtor.Role
      };
      onEditPhone?.(mockPhone, debtor);
    }
  };
  
  const columns = useMemo<ColumnDef<Debtor>[]>(() => [
    {
      accessorKey: "Role",
      header: "Role",
      cell: ({ row }) => row.original.Role || "-",
    },
    {
      id: "FullName",
      accessorFn: (row) => {
        const english = `${row.Surname || ""} ${row.GivenName || ""}`.trim()
        const chinese = `${row.SurnameChinese || ""}${row.GivenNameChinese || ""}`.trim()
        return chinese ? `${english} (${chinese})` : english || "-"
      },
      header: "Name",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "Nickname",
      header: "Nick Name",
      cell: ({ row }) => row.original.Nickname || "-",
    },
    {
      accessorKey: "NationalId",
      header: "ID",
      cell: ({ row }) => row.original.NationalId || "-",
    },
    {
      accessorKey: "Sex",
      header: "Sex",
      cell: ({ row }) => row.original.Sex || "-",
    },
    {
      accessorKey: "Age",
      header: "Age",
      cell: ({ row }) => row.original.Age?.toString() || "-",
    },
    {
      id: "Contact",
      header: "Contact",
      cell: ({ row }) => {
        const debtor = row.original
        const phoneOptions = getPhoneOptions(debtor)
        const currentSelectedPhone = resolveCurrentPhoneOption(debtor, phoneOptions)
        const value = currentSelectedPhone?.value ?? undefined

        return (
          <Select
            value={value}
            onValueChange={(selectedValue) => {
              const selectedOption = phoneOptions.find(opt => opt.value === selectedValue)
              if (selectedOption) {
                setSelectedPhones(prev => ({
                  ...prev,
                  [getDebtorKey(debtor)]: selectedOption
                }))
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {phoneOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      },
    },
    {
      id: "Actions",
      header: "",
      cell: ({ row }) => {
        const debtor = row.original
        return (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleDial(debtor)}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-green-500"
              onClick={() => handleAddPhone(debtor)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-blue-500"
              onClick={() => handleSMS(debtor)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-orange-500"
              onClick={() => handleEditPhone(debtor)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ], [getPhoneOptions, resolveCurrentPhoneOption, getDebtorKey, handleDial, handleAddPhone, handleSMS, handleEditPhone])
  
  return (
    <DataTable
      columns={columns}
      data={debtors}
      selectedRow={selectedDebtor as Debtor}
      getRowId={(debtor) => `${debtor.NationalId || ""}-${debtor.Role || ""}`}
      onRowClick={(debtor) => handleSingleClick(() => onDebtorSelect(debtor))}
      enablePagination={false}
      enableToolbar={false}
    />
  )
}

