// External integration layer for window.external calls
// Ported from wde.js

interface GenericAction {
  Action: string;
  ExtendedInformation: any;
  Parameters: any[];
}

// Safe wrapper to check if window.external method exists
function callExternal(method: string, payload?: string) {
  // SSR-safe: check if window is available
  if (typeof window === 'undefined') {
    console.log(`External call (SSR): ${method}`, payload);
    return;
  }
  
  const external = (window as any).external;
  
  if (typeof external?.[method] === "function") {
    external[method](payload);
  } else if (typeof external?.[method.toLowerCase()] === "function") {
    external[method.toLowerCase()](payload);
  } else {
    console.log(`External call: ${method}`, payload);
  }
}

// Generic event publisher
export function PublishEvent(action: string, args?: any[]): void {
  console.log("PublishEvent", action, args);
  const event: GenericAction[] = [
    {
      Action: action,
      ExtendedInformation: null,
      Parameters: args || [],
    },
  ];
  callExternal("Publish", JSON.stringify(event));
}

// Alert with message
export function Alert(message: string, caption?: string): void {
  const event: GenericAction[] = [
    {
      Action: "Alert",
      ExtendedInformation: null,
      Parameters: [message],
    },
  ];
  if (caption) event[0].Parameters[1] = caption;
  console.log(event);
  callExternal("Publish", JSON.stringify(event));
}

// Set minimum width
export function SetMinWidth(width: number): void {
  const event: GenericAction[] = [
    {
      Action: "SetMinWidth",
      ExtendedInformation: null,
      Parameters: [width],
    },
  ];
  console.log(event);
  callExternal("Publish", JSON.stringify(event));
}

// Set minimum size
export function SetMinSize(width: number, height: number): void {
  const event: GenericAction[] = [
    {
      Action: "SetMinSize",
      ExtendedInformation: null,
      Parameters: [width, height],
    },
  ];
  console.log(event);
  callExternal("Publish", JSON.stringify(event));
}

// Set main minimum width
export function SetMainMinWidth(width: number): void {
  const event: GenericAction[] = [
    {
      Action: "SetMainMinWidth",
      ExtendedInformation: null,
      Parameters: [width],
    },
  ];
  console.log(event);
  callExternal("Publish", JSON.stringify(event));
}

// Set main minimum height
export function SetMainMinHeight(height: number): void {
  const event: GenericAction[] = [
    {
      Action: "SetMainMinHeight",
      ExtendedInformation: null,
      Parameters: [height],
    },
  ];
  console.log(event);
  callExternal("Publish", JSON.stringify(event));
}

// Set main minimum size
export function SetMainMinSize(width: number, height: number): void {
  const event: GenericAction[] = [
    {
      Action: "SetMainMinSize",
      ExtendedInformation: null,
      Parameters: [width, height],
    },
  ];
  console.log(event);
  callExternal("Publish", JSON.stringify(event));
}

// Invoke script
export function InvokeScript(scriptName: string, args: any): void {
  const event: GenericAction[] = [
    {
      Action: "InvokeScript",
      ExtendedInformation: null,
      Parameters: [scriptName, args],
    },
  ];
  callExternal("Publish", JSON.stringify(event));
}

// Navigate to URL
export function Navigate(url: string): void {
  let fullUrl = url;
  if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0) {
    fullUrl = "https://" + url;
  }
  const event: GenericAction[] = [
    {
      Action: "Navigate",
      ExtendedInformation: null,
      Parameters: [fullUrl],
    },
  ];
  callExternal("Publish", JSON.stringify(event));
}

// Refresh
export function Refresh(): void {
  const event: GenericAction[] = [
    {
      Action: "Refresh",
      ExtendedInformation: null,
      Parameters: [],
    },
  ];
  callExternal("Publish", JSON.stringify(event));
}

// Go back
export function GoBack(): void {
  const event: GenericAction[] = [
    {
      Action: "GoBack",
      ExtendedInformation: null,
      Parameters: [],
    },
  ];
  callExternal("Publish", JSON.stringify(event));
}

// Go forward
export function GoForward(): void {
  const event: GenericAction[] = [
    {
      Action: "GoForward",
      ExtendedInformation: null,
      Parameters: [],
    },
  ];
  callExternal("Publish", JSON.stringify(event));
}

// Assign contact
export function AssignContact(contact: any): void {
  console.log("AssignContact", contact);
  PublishEvent("AssignContact", [contact]);
}

// Update with create contact
export function UpdateWithCreateContact(contact: any): void {
  console.log("UpdateWithCreateContact", contact);
  PublishEvent("UpdateWithCreateContact", [contact]);
}

// Call outbound preview record
export function CallOutboundPreviewRecord(phoneNumber: string): void {
  console.log("CallOutboundPreviewRecord: " + phoneNumber);
  MediaVoiceMakeCall(phoneNumber);
}

// Dial phone number
export function Dial(phoneNumber: string): void {
  console.log("Dial: " + phoneNumber);
  MediaVoiceMakeCall(phoneNumber);
}

// Mark done
export function MarkDone(): void {
  console.log("MarkDone");
  PublishEvent("MarkDone", []);
}

// Start IE with URL
export function StartIE(url: string): void {
  console.log("StartIE: " + url);
  PublishEvent("StartIE", [url]);
}

// Media SMS create new outbound page mode
export function MediaSmsCreateNewOutboundPageMode(dnis: string): void {
  console.log("MediaSmsCreateNewOutboundPageMode");
  PublishEvent("MediaSmsCreateNewOutboundPageMode", [dnis]);
}

// Media voice make call
export function MediaVoiceMakeCall(dnis: string): void {
  console.log("MediaVoiceMakeCall");
  PublishEvent("MediaVoiceMakeCall", [dnis]);
}

// Reject mark done
export function RejectMarkDone(): void {
  console.log("RejectMarkDone");
  PublishEvent("RejectMarkDone");
}

// Allow mark done
export function AllowMarkDone(): void {
  console.log("AllowMarkDone");
  PublishEvent("AllowMarkDone");
}

// Reactivate view
export function ReactivateView(): void {
  console.log("ReactivateView");
  PublishEvent("ReactivateView");
}

// Build contact object
export function buildContact(customer: any, customerPhone: any[]): any {
  const PhoneType = [
    "NoContactType",
    "HomePhone",
    "DirectBusinessPhone",
    "BusinessWithExt",
    "Mobile",
    "VacationPhone",
    "Pager",
    "Modem",
    "VoiceMail",
    "PinPager",
    "EmailAddress",
    "InstantMessaging",
  ];

  const contact = {
    CustomerId: customer.Id,
    NationalId: customer.NationalId,
    NationalIdType: customer.NationalIdType,
    FirstName: customer.GivenName,
    LastName: customer.Surname,
    PhoneNumber: [] as any[],
  };

  const phoneNumbers: Record<string, string> = {};

  if (customerPhone) {
    for (let i = 0; i < customerPhone.length; i++) {
      const phone = customerPhone[i];
      phoneNumbers[phone.PhoneNumber] = PhoneType[phone.PhoneType];
    }
  }

  if (customer.MobilePhoneNumber && customer.MobilePhoneNumber !== "NIL") {
    phoneNumbers[customer.MobilePhoneNumber] = PhoneType[4];
  }
  if (customer.MobilePhone2Number && customer.MobilePhone2Number !== "NIL") {
    phoneNumbers[customer.MobilePhone2Number] = PhoneType[4];
  }

  if (customer.CustomerBusinesses) {
    for (let i = 0; i < customer.CustomerBusinesses.length; i++) {
      const phone = customer.CustomerBusinesses[i];
      if (phone.PhoneNumber && phone.PhoneNumber !== "NIL") {
        phoneNumbers[phone.PhoneNumber] = PhoneType[2];
      }
    }
  }

  if (customer.CustomerResidentials) {
    for (let i = 0; i < customer.CustomerResidentials.length; i++) {
      const phone = customer.CustomerResidentials[i];
      if (phone.PhoneNumber && phone.PhoneNumber !== "NIL") {
        phoneNumbers[phone.PhoneNumber] = PhoneType[2];
      }
    }
  }

  for (const phone in phoneNumbers) {
    console.log(phone);
    const phoneType = phoneNumbers[phone];
    const phoneObj: any = {};
    phoneObj[phoneType] = phone;
    contact.PhoneNumber.push(phoneObj);
  }

  console.log(phoneNumbers);
  console.log(contact);
  return contact;
}

