import React, { useState, useEffect } from "react";
import type { Debtor } from "@openauth/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Phone, Plus, MessageSquare, Edit } from "lucide-react";

interface SpouseInformationProps {
  selectedDebtor?: Partial<Debtor>;
  customerPhone?: any[];
  onPhoneAction?: (phoneType: 'business' | 'mobile', action: 'dial' | 'add' | 'sms' | 'edit', phoneNumber?: string) => void;
}

export function SpouseInformation({ selectedDebtor, customerPhone = [], onPhoneAction }: SpouseInformationProps) {
  const spouseInfo = selectedDebtor?.CustomerInfo;
  const [selectedBusinessPhone, setSelectedBusinessPhone] = useState<string>("");
  const [selectedMobilePhone, setSelectedMobilePhone] = useState<string>("");

  const getBusinessPhoneOptions = () => {
    const options: Array<{ label: string; value: string; type: string }> = [];

    // Add spouse business phone
    if (spouseInfo?.SpouseBusinessPhoneNumber && spouseInfo.SpouseBusinessPhoneNumber !== 'NIL') {
      options.push({
        label: `(${spouseInfo.SpouseBusinessPhoneCountryCode || ''}) ${spouseInfo.SpouseBusinessPhoneNumber}`,
        value: spouseInfo.SpouseBusinessPhoneNumber,
        type: 'SpouseDirectBusinessPhone'
      });
    }

    // Add customer phones with SpouseDirectBusinessPhone type
    customerPhone.forEach(phone => {
      if (phone.PhoneType === 22 && selectedDebtor?.CustomerId === phone.CustomerId) {
        options.push({
          label: `(${phone.PhoneCountryCode}) ${phone.PhoneNumber}${phone.PhoneExtension ? `-${phone.PhoneExtension}` : ''}${phone.PhoneInvalidReason ? ` <${phone.PhoneInvalidReason}>` : ''}`,
          value: phone.PhoneNumber,
          type: 'SpouseDirectBusinessPhone'
        });
      }
    });

    return options;
  };

  const getMobilePhoneOptions = () => {
    const options: Array<{ label: string; value: string; type: string }> = [];

    // Add spouse mobile phone
    if (spouseInfo?.SpouseMobilePhoneNumber && spouseInfo.SpouseMobilePhoneNumber !== 'NIL') {
      options.push({
        label: `(${spouseInfo.SpouseMobilePhoneCountryCode || ''}) ${spouseInfo.SpouseMobilePhoneNumber}`,
        value: spouseInfo.SpouseMobilePhoneNumber,
        type: 'SpouseMobile'
      });
    }

    // Add customer phones with SpouseMobile type
    customerPhone.forEach(phone => {
      if (phone.PhoneType === 24 && selectedDebtor?.CustomerId === phone.CustomerId) {
        options.push({
          label: `(${phone.PhoneCountryCode}) ${phone.PhoneNumber}${phone.PhoneExtension ? `-${phone.PhoneExtension}` : ''}${phone.PhoneInvalidReason ? ` <${phone.PhoneInvalidReason}>` : ''}`,
          value: phone.PhoneNumber,
          type: 'SpouseMobile'
        });
      }
    });

    return options;
  };

  const handlePhoneAction = (phoneType: 'business' | 'mobile', action: 'dial' | 'add' | 'sms' | 'edit', selectedPhone?: string) => {
    if (onPhoneAction) {
      onPhoneAction(phoneType, action, selectedPhone);
    }
  };

  const businessPhoneOptions = getBusinessPhoneOptions();
  const mobilePhoneOptions = getMobilePhoneOptions();

  // Set default selected phones when options change
  useEffect(() => {
    if (businessPhoneOptions.length > 0 && !selectedBusinessPhone) {
      setSelectedBusinessPhone(businessPhoneOptions[0].value);
    } else if (businessPhoneOptions.length === 0) {
      setSelectedBusinessPhone("");
    }
  }, [businessPhoneOptions, selectedBusinessPhone]);

  useEffect(() => {
    if (mobilePhoneOptions.length > 0 && !selectedMobilePhone) {
      setSelectedMobilePhone(mobilePhoneOptions[0].value);
    } else if (mobilePhoneOptions.length === 0) {
      setSelectedMobilePhone("");
    }
  }, [mobilePhoneOptions, selectedMobilePhone]);

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="spouse-name">Name</Label>
          <div className="text-sm whitespace-pre-wrap text-foreground">
            {spouseInfo?.SpouseName || '-'}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="spouse-chinese-name">Chinese Name</Label>
          <div className="text-sm whitespace-pre-wrap text-muted-foreground">
            {spouseInfo?.SpouseNameChinese || '-'}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="spouse-age">Age</Label>
          <div className="text-sm text-foreground">
            {spouseInfo?.SpouseAge || '-'}
          </div>
        </div>
      </div>

      {/* Employment Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="spouse-company">Company Name</Label>
          <div className="text-sm whitespace-pre-wrap text-foreground">
            {spouseInfo?.SpouseCompanyName || '-'}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="spouse-nickname">Nickname</Label>
          <div className="text-sm text-foreground">
            {spouseInfo?.SpouseNickname || '-'}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="spouse-position">Position</Label>
          <div className="text-sm text-foreground">
            {spouseInfo?.SpousePosition || '-'}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="spouse-address">Address</Label>
        <div className="text-sm whitespace-pre-wrap text-foreground">
          {spouseInfo?.SpouseCompanyAddress || '-'}
        </div>
      </div>

      {/* Phone Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Phone */}
        <div className="space-y-2">
          <Label>Business Phone</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              {businessPhoneOptions.length > 0 ? (
                <Select value={selectedBusinessPhone} onValueChange={setSelectedBusinessPhone}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select business phone" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessPhoneOptions.map((option, index) => (
                      <SelectItem key={index} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                  No business phones available
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePhoneAction('business', 'dial', selectedBusinessPhone)}
                disabled={businessPhoneOptions.length === 0}
                title="Dial"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePhoneAction('business', 'add', selectedBusinessPhone)}
                disabled={businessPhoneOptions.length === 0}
                title="Add"
              >
                <Plus className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePhoneAction('business', 'sms', selectedBusinessPhone)}
                disabled={businessPhoneOptions.length === 0}
                title="SMS"
              >
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePhoneAction('business', 'edit', selectedBusinessPhone)}
                disabled={businessPhoneOptions.length === 0}
                title="Edit"
              >
                <Edit className="h-4 w-4 text-yellow-500" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Phone */}
        <div className="space-y-2">
          <Label>Mobile Phone</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              {mobilePhoneOptions.length > 0 ? (
                <Select value={selectedMobilePhone} onValueChange={setSelectedMobilePhone}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select mobile phone" />
                  </SelectTrigger>
                  <SelectContent>
                    {mobilePhoneOptions.map((option, index) => (
                      <SelectItem key={index} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
                  No mobile phones available
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePhoneAction('mobile', 'dial', selectedMobilePhone)}
                disabled={mobilePhoneOptions.length === 0}
                title="Dial"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePhoneAction('mobile', 'add', selectedMobilePhone)}
                disabled={mobilePhoneOptions.length === 0}
                title="Add"
              >
                <Plus className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePhoneAction('mobile', 'sms', selectedMobilePhone)}
                disabled={mobilePhoneOptions.length === 0}
                title="SMS"
              >
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePhoneAction('mobile', 'edit', selectedMobilePhone)}
                disabled={mobilePhoneOptions.length === 0}
                title="Edit"
              >
                <Edit className="h-4 w-4 text-yellow-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
