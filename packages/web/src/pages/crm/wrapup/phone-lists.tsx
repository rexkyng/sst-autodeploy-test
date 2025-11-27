import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Edit, Plus } from "lucide-react";
import { useCRMStore } from "@/store/crm-store";
import { AddPhoneDialog } from "@/components/dialogs/add-phone-dialog";
import { EditPhoneDialog } from "@/components/dialogs/edit-phone-dialog";
import { Dial, MediaSmsCreateNewOutboundPageMode } from "@/lib/external-integrations";

export function PhoneLists() {
  const store = useCRMStore();
  const [addPhoneDialogOpen, setAddPhoneDialogOpen] = useState(false);
  const [addPhoneType, setAddPhoneType] = useState(0);
  const [editPhoneDialogOpen, setEditPhoneDialogOpen] = useState(false);
  
  const customer = store.customer;
  const customerPhone = store.customerPhone;
  const mobilePhones = store.mobilePhones;
  const customerBusinesses = store.customerBusinessesForEdit || [];
  const customerResidentials = store.customerResidentialsForEdit || [];
  
  const handleDial = (phoneNumber: string) => {
    Dial(phoneNumber);
  };
  
  const handleSMS = (phoneNumber: string) => {
    MediaSmsCreateNewOutboundPageMode(phoneNumber);
  };
  
  const handleEditPhone = (phone: any) => {
    store.setPhoneState({
      selectedPhoneId: phone.Id,
      selectedPhoneNo: phone.PhoneNumber,
      selectedPhoneType: phone.PhoneType?.toString(),
      selectedPhoneCountryCode: phone.PhoneCountryCode,
      selectedPhoneExtension: phone.PhoneExtension,
      selectedRole: phone.Role,
      editPhoneInvalidReason: phone.PhoneInvalidReason,
    });
    setEditPhoneDialogOpen(true);
  };
  
  const handleAddPhone = (phoneType: number) => {
    setAddPhoneType(phoneType);
    setAddPhoneDialogOpen(true);
  };
  
  // Group phones by type
  const mobileNumbers = [
    ...mobilePhones.filter((m) => m.mobile).map((m) => ({ PhoneNumber: m.mobile, source: "customer" })),
    ...customerPhone.filter((p) => p.PhoneType === 4),
  ];
  
  const businessPhones = [
    ...customerBusinesses.filter((b: any) => b.PhoneNumber).map((b: any) => ({ PhoneNumber: b.PhoneNumber, source: "business" })),
    ...customerPhone.filter((p) => p.PhoneType === 2 || p.PhoneType === 3),
  ];
  
  const residentialPhones = [
    ...customerResidentials.filter((r: any) => r.PhoneNumber).map((r: any) => ({ PhoneNumber: r.PhoneNumber, source: "residential" })),
    ...customerPhone.filter((p) => p.PhoneType === 1),
  ];
  
  const pagerNumbers = [
    customer.PagerNumber ? { PhoneNumber: customer.PagerNumber, source: "customer" } : null,
    ...customerPhone.filter((p) => p.PhoneType === 6),
  ].filter(Boolean);
  
  const otherPhones = [
    customer.OtherPhoneNumber ? { PhoneNumber: customer.OtherPhoneNumber, source: "customer" } : null,
    ...customerPhone.filter((p) => p.PhoneType === 0),
  ].filter(Boolean);
  
  const PhoneList = ({ title, phones, phoneType }: { title: string; phones: any[]; phoneType: number }) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAddPhone(phoneType)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {phones.length === 0 ? (
          <div className="text-sm text-muted-foreground">No phones</div>
        ) : (
          <div className="space-y-2">
            {phones.map((phone, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="flex-1">{phone.PhoneNumber}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDial(phone.PhoneNumber)}
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSMS(phone.PhoneNumber)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                {phone.Id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditPhone(phone)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
  
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <PhoneList title="Mobile" phones={mobileNumbers} phoneType={4} />
        <PhoneList title="Business" phones={businessPhones} phoneType={2} />
        <PhoneList title="Residential" phones={residentialPhones} phoneType={1} />
        <PhoneList title="Pager" phones={pagerNumbers} phoneType={6} />
        <PhoneList title="Other" phones={otherPhones} phoneType={0} />
        {/* Empty cell to fill the 3x2 grid */}
        <div></div>
      </div>
      
      <AddPhoneDialog
        open={addPhoneDialogOpen}
        onOpenChange={setAddPhoneDialogOpen}
        phoneType={addPhoneType}
      />
      
      <EditPhoneDialog
        open={editPhoneDialogOpen}
        onOpenChange={setEditPhoneDialogOpen}
      />
    </>
  );
}

