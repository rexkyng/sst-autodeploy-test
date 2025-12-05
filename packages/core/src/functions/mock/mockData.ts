import { faker } from '@faker-js/faker'
import { fakerZH_TW as fakerZH } from '@faker-js/faker'
import {
  CustomerSearchResult,
  CustomerDetails,
  CustomerInfo,
  Loan,
  CustomerAddress,
  MobilePhone,
  CustomerPhone,
  FollowHistory,
  ContactAmendmentHistory,
  CallResultCode,
  FollowStatusCode,
  Debtor,
  Reference,
  SearchRequest,
} from '../../models'

export class MockDataGenerator {
  private static customerCounter = 1
  private static phoneCounter = 1

  static resetCounters(): void {
    this.customerCounter = 1
    this.phoneCounter = 1
  }

  static generateDeterministicNationalId(request: SearchRequest): string {
    const seedParts: string[] = []

    if (request.AccountNumber) seedParts.push(`ACC:${request.AccountNumber}`)
    if (request.LoanSequence) seedParts.push(`SEQ:${request.LoanSequence}`)
    if (request.PhoneNumber) seedParts.push(`PHONE:${request.PhoneNumber}`)
    if (request.ReferencePhoneNumber)
      seedParts.push(`REFPHONE:${request.ReferencePhoneNumber}`)
    if (request.Surname) seedParts.push(`SUR:${request.Surname}`)
    if (request.GivenName) seedParts.push(`GIV:${request.GivenName}`)
    if (request.ReferenceName)
      seedParts.push(`REFNAME:${request.ReferenceName}`)
    if (request.CompanyName) seedParts.push(`COMP:${request.CompanyName}`)
    if (request.AgentId) seedParts.push(`AGENT:${request.AgentId}`)

    seedParts.sort()

    const seed = seedParts.join('|')
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }

    const positiveHash = Math.abs(hash)
    const letter1 = String.fromCharCode(65 + (positiveHash % 26))
    const letter2 = String.fromCharCode(65 + ((positiveHash >> 8) % 26))
    const digits = positiveHash.toString().padStart(6, '0').slice(-6)
    const checkDigit = (positiveHash % 10).toString()

    return `${letter1}${letter2}${digits}(${checkDigit})`
  }

  static generateCompleteCustomer(overrides?: {
    nationalId?: string
    givenName?: string
    surname?: string
    accountNumber?: string
    loanSequence?: string
  }): CustomerDetails {
    const nationalId = overrides?.nationalId || this.generateHKID()
    const customerDbId = `CUST${this.padNumber(this.customerCounter++, 6)}`
    const givenName = overrides?.givenName || this.generateGivenName()
    const surname = overrides?.surname || this.generateSurname()
    const loanCount = 2 + Math.floor(Math.random() * 2)

    const loans = this.generateLoansForCustomer(
      loanCount,
      overrides?.accountNumber,
      overrides?.loanSequence,
    )

    const debtors = this.generateDebtorsFromLoans(customerDbId, loans)

    return {
      Customer: {
        Id: customerDbId,
        NationalId: nationalId,
        NationalIdType: 'HK',
        GivenName: givenName,
        Surname: surname,
        GivenNameChinese: this.generateGivenName(true),
        SurnameChinese: this.generateSurname(true),
        Nickname: this.generateNickname(),
        DateOfBirth: this.generateDateOfBirth(),
        Email: this.generateEmail(givenName, surname),
        MobilePhoneNumber: this.generatePhoneNumber(),
        MobilePhone2Number: this.generatePhoneNumber(),
        OtherPhoneNumber: this.generatePhoneNumber(),
        PagerNumber: this.generatePhoneNumber(),
        Loans: loans,
        CustomerBusinesses: this.generateCustomerAddresses(1, customerDbId),
        CustomerResidentials: this.generateCustomerAddresses(2, customerDbId),
      },
      CustomerBusinessesForEdit: this.generateCustomerAddresses(
        1,
        customerDbId,
      ),
      CustomerResidentialsForEdit: this.generateCustomerAddresses(
        2,
        customerDbId,
      ),
      ActionCodes: this.generateActionCodes(),
      BankAccountCodes: this.generateBankAccountCodes(),
      BankInMethodCodes: this.generateBankInMethodCodes(),
      CallResultCodes: this.generateCallResultCodes(),
      ContactAmendmentHistory: this.generateContactAmendmentHistoryForCustomer(
        customerDbId,
        loans,
        debtors,
      ),
      CustomerPhone: this.generateCustomerPhoneListForCustomer(
        customerDbId,
        loans,
        debtors,
      ),
      FollowHistory: this.generateFollowHistoryForCustomer(customerDbId, loans),
      FollowStatusCodes: this.generateFollowStatusCodes(),
      Debtors: debtors,
      References: this.generateReferences(),
      mobile_phones: this.generateMobilePhones(),
    }
  }

  static generateCustomerSearchResults(
    count: number = 5,
  ): CustomerSearchResult[] {
    const results: CustomerSearchResult[] = []

    for (let i = 0; i < count; i++) {
      const nationalId = this.generateHKID()
      results.push({
        NationalIdType: 'HK',
        NationalId: nationalId,
        Nickname: this.generateNickname(),
        Surname: this.generateSurname(),
        GivenName: this.generateGivenName(),
      })
    }

    return results
  }

  static generateCustomerDetails(nationalId?: string): CustomerDetails {
    return this.generateCompleteCustomer({ nationalId })
  }

  static generateCustomerInfo(debtor: Debtor): CustomerInfo {
    return {
      CustomerBusinesses: this.generateCustomerAddresses(1),
      CustomerResidentials: this.generateCustomerAddresses(2),
      SpouseBusinessPhoneCountryCode: '+852',
      SpouseBusinessPhoneNumber: this.generatePhoneNumber(),
      SpouseCompanyAddress: this.generateAddress(),
      SpouseAge: (25 + Math.floor(Math.random() * 40)).toString(),
      SpouseCompanyName: this.generateCompanyName(),
      SpouseComplain: Math.random() > 0.7 ? 'No major complaints' : null,
      SpouseMobilePhoneCountryCode: '+852',
      SpouseMobilePhoneNumber: this.generatePhoneNumber(),
      SpouseName: this.generateGivenName() + ' ' + debtor.Surname,
      SpouseNameChinese:
        this.generateGivenName(true) + ' ' + this.generateSurname(true),
      SpouseNickname: this.generateNickname(),
      SpousePosition: this.generatePosition(),
      OverseasWorkerLoanAddress: this.generateAddress(),
      OverseasWorkerLoanDependantName: this.generateGivenName(),
      OverseasWorkerLoanEmployerName: this.generateCompanyName(),
      OverseasWorkerLoanEmployerPhone: this.generatePhoneNumber(),
      OverseasWorkerLoanPhoneNumber: this.generatePhoneNumber(),
      OverseasWorkerLoanRelationship: 'Spouse',
      GivenName: debtor.GivenName,
      Surname: debtor.Surname,
      GivenNameChinese: this.generateGivenName(true),
      SurnameChinese: this.generateSurname(true),
      Id: debtor.NationalId,
      NationalIdType: debtor.NationalIdType,
      DateOfMatch: this.generateDateTime(),
      PartialIdMatched: Math.random() > 0.5,
      Nationality: 'Chinese',
      MaritalStatus: 'Married',
      DateOfBirth: this.generateDateOfBirth(),
      Email: this.generateEmail(debtor.GivenName, debtor.Surname),
    }
  }

  private static generateLoansForCustomer(
    count: number,
    accountNumberOverride?: string,
    loanSequenceOverride?: string,
  ): Loan[] {
    const loans: Loan[] = []

    for (let i = 0; i < count; i++) {
      const accountNumber =
        i === 0 && accountNumberOverride
          ? accountNumberOverride
          : this.generateAccountNumber()
      const loanSequence =
        i === 0 && loanSequenceOverride
          ? loanSequenceOverride
          : (1 + i).toString()

      loans.push({
        AccountNumber: accountNumber,
        LoanSequence: loanSequence,
        LoanStatus: this.generateLoanStatus(),
        LoanBalance: Math.floor(Math.random() * 50000) + 1000,
        OverdueDay: Math.floor(Math.random() * 90),
        NetOverdueAmount: Math.floor(Math.random() * 5000),
        LateCharge: Math.floor(Math.random() * 500),
        AdminCharge: Math.floor(Math.random() * 200),
        AnnualCharge: Math.floor(Math.random() * 300),
        NextDueDate: this.generateNextDueDate(),
        SpecialRemarks: this.generateRemark(),
        CenterRemarks: this.generateRemark(),
        TotalNumberOfInstallment: Math.floor(Math.random() * 60) + 12,
        TotalNumberOfPaidInstallment: Math.floor(Math.random() * 30),
        InstallmentAmount: Math.floor(Math.random() * 2000) + 500,
        RepayMethod: this.generateRepayMethod(),
        RejectReason:
          Math.random() > 0.8 ? this.generateRejectReason() : undefined,
        LoanType: this.generateLoanType(),
        Group: this.generateGroup(),
        Role: this.generateRole(),
        CampaignType: this.generateCampaignType(),
        LoanAmount: Math.floor(Math.random() * 100000) + 10000,
        LoanDate: this.generateLoanDate(),
        LoanExpiryDate: this.generateExpiryDate(),
        CutOffDate: this.generateCutOffDate(),
        LastPayDate: this.generateLastPayDate(),
        LastPayAmount: Math.floor(Math.random() * 3000),
        Score: Math.floor(Math.random() * 1000),
        FollowStatus: this.generateFollowStatus(),
        DeferDay: Math.floor(Math.random() * 30),
        C: Math.floor(Math.random() * 100),
        C1: Math.floor(Math.random() * 100),
        C2: Math.floor(Math.random() * 100),
        DirectSalesReferral: 'Online',
        EStatement: 'Y',
        IfAmount: Math.floor(Math.random() * 1000),
        PdStatus: Math.random() > 0.5 ? 'Active' : 'Inactive',
        DiRate: Math.floor(Math.random() * 10),
        ApBankAccountNumber: this.generateAccountNumber(),
        EarlySettleAmount: Math.floor(Math.random() * 10000),
        InstallmentAmountMinPaid: Math.floor(Math.random() * 1500) + 200,
        LastRepayMethod: this.generateRepayMethod(),
        WaivedAdminCharge: Math.floor(Math.random() * 100),
        WaivedLateCharge: Math.floor(Math.random() * 200),
        Debtors: this.generateDebtorsForLoan(accountNumber, loanSequence),
      })
    }

    return loans
  }

  private static generateDebtors(): Debtor[] {
    const debtors: Debtor[] = []

    for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
      debtors.push({
        AccountNumber: this.generateAccountNumber(),
        LoanSequence: (1 + i).toString(),
        Role: this.generateRole(),
        NationalId: this.generateHKID(),
        NationalIdType: 'HK',
        GivenName: this.generateGivenName(),
        Surname: this.generateSurname(),
        MobilePhoneNumber: this.generatePhoneNumber(),
        ResidentialPhoneNumber: this.generatePhoneNumber(),
        BusinessPhoneNumber: this.generatePhoneNumber(),
        OtherPhoneNumber: this.generatePhoneNumber(),
        References: this.generateReferences(),
      })
    }

    return debtors
  }

  private static generateDebtorsFromLoans(
    customerDbId: string,
    loans: any[],
  ): Debtor[] {
    const debtors: Debtor[] = []

    // For each loan, generate 1-2 debtors
    loans.forEach((loan) => {
      const debtorCount = 1 + Math.floor(Math.random() * 2)
      for (let i = 0; i < debtorCount; i++) {
        debtors.push({
          CustomerId: customerDbId,
          AccountNumber: loan.AccountNumber,
          LoanSequence: loan.LoanSequence,
          Role: i === 0 ? 'Borrower' : this.generateRole(),
          NationalId: this.generateHKID(),
          NationalIdType: 'HK',
          GivenName: this.generateGivenName(),
          Surname: this.generateSurname(),
          MobilePhoneNumber: this.generatePhoneNumber(),
          ResidentialPhoneNumber: this.generatePhoneNumber(),
          BusinessPhoneNumber: this.generatePhoneNumber(),
          OtherPhoneNumber: this.generatePhoneNumber(),
          References: this.generateReferences(),
        })
      }
    })

    return debtors
  }

  private static generateDebtorsForLoan(
    accountNumber: string,
    loanSequence: string,
  ): Debtor[] {
    const debtors: Debtor[] = []

    for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
      debtors.push({
        AccountNumber: accountNumber,
        LoanSequence: loanSequence,
        Role: this.generateRole(),
        NationalId: this.generateHKID(),
        NationalIdType: 'HK',
        GivenName: this.generateGivenName(),
        Surname: this.generateSurname(),
        MobilePhoneNumber: this.generatePhoneNumber(),
        ResidentialPhoneNumber: this.generatePhoneNumber(),
        BusinessPhoneNumber: this.generatePhoneNumber(),
        OtherPhoneNumber: this.generatePhoneNumber(),
        References: this.generateReferences(),
      })
    }

    return debtors
  }

  private static generateReferences(): Reference[] {
    const references: Reference[] = []

    for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
      references.push({
        Role: this.generateRole(),
        GivenName: this.generateGivenName(),
        Surname: this.generateSurname(),
        GivenNameChinese:
          Math.random() > 0.5 ? this.generateGivenName(true) : undefined,
        SurnameChinese:
          Math.random() > 0.5 ? this.generateSurname(true) : undefined,
        Age: Math.floor(Math.random() * 60) + 18,
        RelationshipCode: this.generateRelationship(),
        MobilePhoneNumber: this.generatePhoneNumber(),
        MobilePhoneCountryCode: '+852',
        ResidentialPhoneNumber: this.generatePhoneNumber(),
        ResidentialPhoneCountryCode: '+852',
        BusinessPhoneNumber: this.generatePhoneNumber(),
        BusinessPhoneCountryCode: '+852',
        OtherPhoneNumber: this.generatePhoneNumber(),
        OtherPhoneCountryCode: '+852',
        Company: Math.random() > 0.5 ? this.generateCompanyName() : undefined,
        Position: Math.random() > 0.5 ? this.generatePosition() : undefined,
        HasActiveLoans: Math.random() > 0.5,
        CustomerId: `CUST${this.padNumber(Math.floor(Math.random() * 1000), 6)}`,
      })
    }

    return references
  }

  private static generateCustomerAddresses(
    count: number,
    customerDbId?: string,
  ): CustomerAddress[] {
    const addresses: CustomerAddress[] = []
    const custId =
      customerDbId || `CUST${this.padNumber(this.customerCounter, 6)}`

    for (let i = 0; i < count; i++) {
      addresses.push({
        CustomerId: custId,
        AddressType: i === 0 ? 'Business' : 'Residential',
        AddressLine1: this.generateAddressLine(),
        AddressLine2: this.generateAddressLine(),
        AddressLine3: this.generateAddressLine(),
        AddressLine4: this.generateAddressLine(),
        PhoneNumber: this.generatePhoneNumber(),
        Country: 'Hong Kong',
        PostalCode: this.generatePostalCode(),
      })
    }

    return addresses
  }

  static generateCustomerPhoneList(): CustomerPhone[] {
    const phones: CustomerPhone[] = []

    for (let i = 0; i < 3 + Math.floor(Math.random() * 4); i++) {
      phones.push({
        PhoneId: `PHONE${this.padNumber(this.phoneCounter++, 3)}`,
        CustomerId: `CUST${this.padNumber(this.customerCounter, 6)}`,
        PhoneType: Math.floor(Math.random() * 25),
        PhoneCountryCode: '+852',
        PhoneNumber: this.generatePhoneNumber(),
        PhoneExtension: Math.floor(Math.random() * 9999).toString(),
        PhoneInvalidReason: Math.random() > 0.8 ? 'Invalid number' : null,
        AccountNumber: this.generateAccountNumber(),
        LoanSequence: '1',
        Role: this.generateRole(),
      })
    }

    return phones
  }

  static generateCustomerPhoneListForCustomer(
    customerDbId: string,
    loans: any[],
    debtors: Debtor[],
  ): CustomerPhone[] {
    const phones: CustomerPhone[] = []

    debtors.forEach((debtor, idx) => {
      const phoneCount = 1 + Math.floor(Math.random() * 2)
      for (let i = 0; i < phoneCount; i++) {
        phones.push({
          PhoneId: `PHONE${this.padNumber(this.phoneCounter++, 3)}`,
          CustomerId: customerDbId,
          PhoneType: Math.floor(Math.random() * 25),
          PhoneCountryCode: '+852',
          PhoneNumber: this.generatePhoneNumber(),
          PhoneExtension:
            Math.random() > 0.7
              ? Math.floor(Math.random() * 9999).toString()
              : '',
          PhoneInvalidReason: Math.random() > 0.8 ? 'Invalid number' : null,
          AccountNumber: debtor.AccountNumber || '',
          LoanSequence: debtor.LoanSequence || '',
          Role: debtor.Role || '',
        })
      }
    })

    for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
      phones.push({
        PhoneId: `PHONE${this.padNumber(this.phoneCounter++, 3)}`,
        CustomerId: customerDbId,
        PhoneType: Math.floor(Math.random() * 25),
        PhoneCountryCode: '+852',
        PhoneNumber: this.generatePhoneNumber(),
        PhoneExtension: '',
        PhoneInvalidReason: null,
        AccountNumber: '',
        LoanSequence: '',
        Role: '',
      })
    }

    return phones
  }

  static generateFollowHistory(): FollowHistory[] {
    const history: FollowHistory[] = []

    for (let i = 0; i < 5 + Math.floor(Math.random() * 10); i++) {
      history.push({
        Id: `FH${this.padNumber(i + 1, 6)}`,
        CustomerId: `CUST${this.padNumber(this.customerCounter, 6)}`,
        AccountNumber: this.generateAccountNumber(),
        LoanSequence: (1 + Math.floor(Math.random() * 3)).toString(),
        StartTime: this.generateDateTimePast(),
        ActionDateTime: this.generateDateTimePast(),
        CallResult: this.generateCallResult(),
        CallMemo: this.generateCallMemo(),
        ConnId: `CONN${this.padNumber(i + 1, 8)}`,
        AgentId: `AGENT${this.padNumber(Math.floor(Math.random() * 10) + 1, 2)}`,
        RecorderLink: 'http://recorder.example.com/recording',
      })
    }

    return history
  }

  static generateFollowHistoryForCustomer(
    customerDbId: string,
    loans: any[],
  ): FollowHistory[] {
    const history: FollowHistory[] = []

    loans.forEach((loan, loanIdx) => {
      const historyCount = 2 + Math.floor(Math.random() * 5)
      for (let i = 0; i < historyCount; i++) {
        history.push({
          Id: `FH${this.padNumber(history.length + 1, 6)}`,
          CustomerId: customerDbId,
          AccountNumber: loan.AccountNumber,
          LoanSequence: loan.LoanSequence,
          StartTime: this.generateDateTimePast(),
          ActionDateTime: this.generateDateTimePast(),
          CallResult: this.generateCallResult(),
          CallMemo: this.generateCallMemo(),
          ConnId: `CONN${this.padNumber(history.length + 1, 8)}`,
          AgentId: `AGENT${this.padNumber(Math.floor(Math.random() * 10) + 1, 2)}`,
          RecorderLink: 'http://recorder.example.com/recording',
        })
      }
    })

    return history
  }

  static generateContactAmendmentHistory(): ContactAmendmentHistory[] {
    const history: ContactAmendmentHistory[] = []
    const actionTypes = ['Add', 'Update', 'Delete', 'Verify', 'Invalid']
    const invalidReasons = [
      '',
      'Wrong Number',
      'Disconnected',
      'No Answer',
      'Refused',
    ]

    history.push({
      CustomerId: `CUST${this.padNumber(1, 6)}`, // First customer ID
      AccountNumber: this.generateAccountNumber(),
      LoanSequence: '1',
      Role: 'Borrower',
      PhoneType: 1,
      PhoneNumber: '91234567',
      PhoneExtension: '123',
      PhoneInvalidReason: 'Wrong Number',
      ActionDatetime: faker.date.recent({ days: 5 }).toISOString(),
      ActionType: 'Update',
      AgentId: 'AGENT01',
    })

    for (let accountIdx = 0; accountIdx < 2; accountIdx++) {
      const accountNumber = this.generateAccountNumber()
      for (let loanIdx = 1; loanIdx <= 2; loanIdx++) {
        const loanSequence = loanIdx.toString()

        for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
          const phoneType = Math.floor(Math.random() * 25)
          const role = this.generateRole()
          const actionType = faker.helpers.arrayElement(actionTypes)
          const extension = faker.helpers.arrayElement([
            '',
            '123',
            '456',
            '789',
            '101',
          ])

          history.push({
            CustomerId: `CUST${this.padNumber(this.customerCounter, 6)}`,
            AccountNumber: accountNumber,
            LoanSequence: loanSequence,
            Role: role,
            PhoneType: phoneType,
            PhoneNumber: this.generatePhoneNumber(),
            PhoneExtension: extension,
            PhoneInvalidReason: faker.helpers.arrayElement(invalidReasons),
            ActionDatetime: faker.date.past({ years: 1 }).toISOString(),
            ActionType: actionType,
            AgentId: `AGENT${this.padNumber(faker.number.int({ min: 1, max: 50 }), 2)}`,
          })
        }
      }
    }

    return history
  }

  static generateContactAmendmentHistoryForCustomer(
    customerDbId: string,
    loans: any[],
    debtors: Debtor[],
  ): ContactAmendmentHistory[] {
    const history: ContactAmendmentHistory[] = []
    const actionTypes = ['Add', 'Update', 'Delete', 'Verify', 'Invalid']
    const invalidReasons = [
      '',
      'Wrong Number',
      'Disconnected',
      'No Answer',
      'Refused',
    ]

    debtors.forEach((debtor, idx) => {
      const historyCount = 2 + Math.floor(Math.random() * 4)
      for (let i = 0; i < historyCount; i++) {
        const phoneType = Math.floor(Math.random() * 25)
        const actionType = faker.helpers.arrayElement(actionTypes)
        const extension = faker.helpers.arrayElement(['', '123', '456', '789'])

        history.push({
          CustomerId: customerDbId,
          AccountNumber: debtor.AccountNumber || '',
          LoanSequence: debtor.LoanSequence || '',
          Role: debtor.Role || '',
          PhoneType: phoneType,
          PhoneNumber: this.generatePhoneNumber(),
          PhoneExtension: extension,
          PhoneInvalidReason: faker.helpers.arrayElement(invalidReasons),
          ActionDatetime: faker.date.past({ years: 1 }).toISOString(),
          ActionType: actionType,
          AgentId: `AGENT${this.padNumber(faker.number.int({ min: 1, max: 50 }), 2)}`,
        })
      }
    })

    if (debtors.length > 0) {
      const firstDebtor = debtors[0]
      history.unshift({
        CustomerId: customerDbId,
        AccountNumber: firstDebtor.AccountNumber || '',
        LoanSequence: firstDebtor.LoanSequence || '',
        Role: firstDebtor.Role || 'Borrower',
        PhoneType: 1,
        PhoneNumber: '91234567',
        PhoneExtension: '123',
        PhoneInvalidReason: 'Wrong Number',
        ActionDatetime: faker.date.recent({ days: 5 }).toISOString(),
        ActionType: 'Update',
        AgentId: 'AGENT01',
      })
    }

    return history
  }

  private static generateMobilePhones(): MobilePhone[] {
    return [
      { mobile: this.generatePhoneNumber() },
      { mobile: this.generatePhoneNumber() },
    ]
  }

  static generateActionCodes(): Record<string, any> {
    return {
      SendSMS: { Id: '7', Name: 'Send SMS', ActionTypeId: 1, Enabled: true },
      SendReminderLocalAddress: {
        Id: '1',
        Name: 'Send Reminder to Local Address',
        ActionTypeId: 2,
        Enabled: true,
      },
      SendReminderOverseaAddress: {
        Id: '2',
        Name: 'Send Reminder to Oversea Address',
        ActionTypeId: 3,
        Enabled: true,
      },
      SiteVisit: {
        Id: '3',
        Name: 'Site Visit',
        ActionTypeId: 4,
        Enabled: true,
      },
      Other: { Id: '4', Name: 'Other Action', ActionTypeId: 5, Enabled: true },
      ReviewCheck: {
        Id: '5',
        Name: 'Review Check TU',
        ActionTypeId: 6,
        Enabled: true,
      },
      RecommendSendToCCD: {
        Id: '6',
        Name: 'Recommend Send to CCD',
        ActionTypeId: 7,
        Enabled: true,
      },
    }
  }

  static generateBankAccountCodes(): Record<string, any> {
    return {
      HSBC: { Id: '1', Description: 'HSBC' },
      BOC: { Id: '2', Description: 'Bank of China' },
      ICBC: { Id: '3', Description: 'Industrial and Commercial Bank of China' },
    }
  }

  static generateBankInMethodCodes(): Record<string, any> {
    return {
      ATM: { Id: '1', Description: 'ATM Transfer' },
      BankTransfer: { Id: '2', Description: 'Bank Transfer' },
      Cash: { Id: '3', Description: 'Cash Deposit' },
    }
  }

  static generateCallResultCodes(): CallResultCode[] {
    return [
      { Id: '1', Code: 'Finish', Description: 'Call Finished' },
      { Id: '2', Code: 'FWNEXTDAY', Description: 'Follow Up Next Day' },
      { Id: '3', Code: 'PTP', Description: 'Promise to Pay' },
      { Id: '4', Code: 'WrongNumber', Description: 'Wrong Number' },
      { Id: '5', Code: 'NoAnswer', Description: 'No Answer' },
    ]
  }

  static generateFollowStatusCodes(): FollowStatusCode[] {
    return [
      { Id: '1', Code: 'Ongoing', Description: 'Ongoing Follow-up' },
      { Id: '2', Code: 'FWNEXTDAY', Description: 'Follow Up Next Day' },
      { Id: '3', Code: 'Finished', Description: 'Finished' },
      { Id: '4', Code: 'PTP', Description: 'Promise to Pay' },
    ]
  }

  // Helper methods for generating random data
  private static generateHKID(): string {
    const letter1 = faker.string.alpha({ length: 1, casing: 'upper' })
    const letter2 = faker.string.alpha({ length: 1, casing: 'upper' })
    const digits = faker.string.numeric({ length: 6, allowLeadingZeros: true })
    const checkDigit = faker.string.numeric({ length: 1 })
    return `${letter1}${letter2}${digits}(${checkDigit})`
  }

  static generateAccountNumber(): string {
    return faker.finance.accountNumber({ length: 6 })
  }

  private static generateName(
    type: 'first' | 'last' | 'middle',
    chinese: boolean = false,
  ): string {
    const fakerLib = chinese ? fakerZH : faker
    switch (type) {
      case 'first':
        return fakerLib.person.firstName()
      case 'last':
        return fakerLib.person.lastName()
      case 'middle':
        return fakerLib.person.middleName()
    }
  }

  private static generateGivenName(chinese: boolean = false): string {
    return this.generateName('first', chinese)
  }

  private static generateSurname(chinese: boolean = false): string {
    return this.generateName('last', chinese)
  }

  private static generateNickname(chinese: boolean = false): string {
    return this.generateName('middle', chinese)
  }

  private static generateEmail(
    firstName: string = faker.person.firstName(),
    lastName: string = faker.person.lastName(),
  ): string {
    return faker.internet.email({ firstName, lastName })
  }

  static generatePhoneNumber(): string {
    return faker.string.numeric({ length: 8, allowLeadingZeros: false })
  }

  private static generateDateOfBirth(): string {
    return faker.date
      .birthdate({ min: 18, max: 80, mode: 'age' })
      .toISOString()
      .split('T')[0]
  }

  private static generateDateTime(): string {
    return faker.date.recent().toISOString()
  }

  private static generateDateTimePast(): string {
    return faker.date.past({ years: 1 }).toISOString()
  }

  private static generateNextDueDate(): string {
    return faker.date.soon({ days: 90 }).toISOString().split('T')[0]
  }

  private static generateLoanStatus(): string {
    const statuses = ['AC', 'SL', 'RD', 'XX', 'WO']
    return statuses[Math.floor(Math.random() * statuses.length)]
  }

  private static generateRepayMethod(): string {
    const methods = ['Monthly', 'Bi-weekly', 'Weekly', 'Quarterly']
    return methods[Math.floor(Math.random() * methods.length)]
  }

  private static generateRejectReason(): string {
    const reasons = [
      'Insufficient Income',
      'Poor Credit History',
      'Incomplete Documentation',
      'Property Issues',
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  private static generateLoanType(): string {
    const types = ['Personal Loan', 'Mortgage', 'Auto Loan', 'Business Loan']
    return types[Math.floor(Math.random() * types.length)]
  }

  private static generateGroup(): string {
    const groups = ['A', 'B', 'C', 'D', 'E']
    return groups[Math.floor(Math.random() * groups.length)]
  }

  private static generateRole(): string {
    const roles = ['Borrower', 'Guarantor', 'Reference', 'Spouse']
    return roles[Math.floor(Math.random() * roles.length)]
  }

  private static generateCampaignType(): string {
    const campaigns = ['Standard', 'Priority', 'Recovery', 'Special']
    return campaigns[Math.floor(Math.random() * campaigns.length)]
  }

  private static generateLoanDate(): string {
    return faker.date.past({ years: 5 }).toISOString().split('T')[0]
  }

  private static generateExpiryDate(): string {
    return faker.date.future({ years: 5 }).toISOString().split('T')[0]
  }

  private static generateCutOffDate(): string {
    return faker.date.recent({ days: 30 }).toISOString().split('T')[0]
  }

  private static generateLastPayDate(): string {
    return faker.date.recent({ days: 90 }).toISOString().split('T')[0]
  }

  private static generateFollowStatus(): string {
    const statuses = ['Active', 'Inactive', 'Completed', 'Pending']
    return statuses[Math.floor(Math.random() * statuses.length)]
  }

  private static generateRelationship(): string {
    const relationships = ['Friend', 'Colleague', 'Family', 'Neighbor']
    return relationships[Math.floor(Math.random() * relationships.length)]
  }

  static generateCompanyName(): string {
    return faker.company.name()
  }

  static generatePosition(): string {
    const positions = ['Manager', 'Director', 'Supervisor', 'Clerk', 'Analyst']
    return positions[Math.floor(Math.random() * positions.length)]
  }

  static generateAddress(): string {
    return faker.location.streetAddress() + ', Hong Kong'
  }

  private static generateAddressLine(): string {
    return faker.location.secondaryAddress()
  }

  private static generatePostalCode(): string {
    return faker.location.zipCode()
  }

  private static generateCallResult(): string {
    const results = ['Finish', 'FWNEXTDAY', 'PTP', 'WrongNumber', 'NoAnswer']
    return results[Math.floor(Math.random() * results.length)]
  }

  private static generateCallMemo(): string {
    const memos = [
      'Customer promised to pay next week',
      'Wrong number - please update contact info',
      'Customer not available, will call back',
      'Payment arrangement made',
      'Left voicemail message',
    ]
    return memos[Math.floor(Math.random() * memos.length)]
  }

  private static generateRemark(): string | null {
    const remarks = [
      'Special handling required',
      'High risk account',
      'Customer has payment difficulties',
      'Requires supervisor approval',
    ]
    return Math.random() > 0.7
      ? remarks[Math.floor(Math.random() * remarks.length)]
      : null
  }

  private static padNumber(num: number, size: number): string {
    return num.toString().padStart(size, '0')
  }
}

export const mockActionCodes = MockDataGenerator.generateActionCodes()
export const mockBankAccountCodes = MockDataGenerator.generateBankAccountCodes()
export const mockBankInMethodCodes =
  MockDataGenerator.generateBankInMethodCodes()
