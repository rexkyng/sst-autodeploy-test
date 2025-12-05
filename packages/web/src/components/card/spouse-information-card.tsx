import React from "react";
import type { Debtor } from "@openauth/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpouseInformation } from "@/components/custom/spouse-information";

interface SpouseInformationCardProps {
  selectedDebtor?: Partial<Debtor>;
  customerPhone?: any[];
  onPhoneAction?: (phoneType: 'business' | 'mobile', action: 'dial' | 'add' | 'sms' | 'edit', phoneNumber?: string) => void;
  className?: string;
}

export function SpouseInformationCard({
  selectedDebtor,
  customerPhone = [],
  onPhoneAction,
  className
}: SpouseInformationCardProps) {
  return (
    <Card className={className || "w-full"}>
      <CardHeader>
        <CardTitle>Spouse Information</CardTitle>
      </CardHeader>
      <CardContent>
        <SpouseInformation
          selectedDebtor={selectedDebtor}
          customerPhone={customerPhone}
          onPhoneAction={onPhoneAction}
        />
      </CardContent>
    </Card>
  );
}
