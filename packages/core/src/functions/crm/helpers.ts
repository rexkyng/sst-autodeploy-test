import { faker } from '@faker-js/faker'
import {
  CustomerDetails,
  CustomerAddress,
  Loan,
  Debtor,
  SearchRequest,
} from '../../models'
import { database } from '../mock/database'
import { MockDataGenerator } from '../mock/mockData'
import { FunctionError } from '../errors'

export function generatePhone(): string {
  return `${faker.string.numeric({ length: 1, allowLeadingZeros: false, exclude: ['1'] })}${faker.string.numeric({ length: 7, allowLeadingZeros: false })}`
}

export function generateCompany(): string {
  return faker.company.name()
}

export function generateAddress(): string {
  return `${faker.location.streetAddress()}, Hong Kong`
}

export function generateNickname(): string {
  return faker.person.middleName()
}

export function generatePosition(): string {
  return faker.person.jobTitle()
}

export function generateName(): string {
  return faker.person.firstName()
}

export function buildSearchOverrides(request: SearchRequest, nationalId?: string): any {
  const overrides: any = {}
  if (nationalId) overrides.nationalId = nationalId
  if (request.Surname) overrides.surname = request.Surname
  if (request.GivenName) overrides.givenName = request.GivenName
  if (request.AccountNumber) overrides.accountNumber = request.AccountNumber
  if (request.LoanSequence) overrides.loanSequence = request.LoanSequence
  return overrides
}

export function updateCustomerFromSearchCriteria(customer: CustomerDetails, request: SearchRequest): void {
  if (request.ReferencePhoneNumber) {
    if (customer.References && customer.References.length > 0) {
      customer.References[0].MobilePhoneNumber = request.ReferencePhoneNumber
    } else if (customer.Debtors?.[0]?.References?.[0]) {
      customer.Debtors[0].References[0].MobilePhoneNumber = request.ReferencePhoneNumber
    }
  }

  if (request.PhoneNumber && customer.CustomerPhone?.[0]) {
    customer.CustomerPhone[0].PhoneNumber = request.PhoneNumber
  }
}

export function generateCustomerFromSearch(request: SearchRequest, nationalId?: string): CustomerDetails {
  const overrides = nationalId
    ? buildSearchOverrides(request, nationalId)
    : buildSearchOverrides(request, MockDataGenerator.generateDeterministicNationalId(request))

  const customer = MockDataGenerator.generateCompleteCustomer(overrides)
  updateCustomerFromSearchCriteria(customer, request)
  return customer
}

export function createCustomerFromDebtor(debtor: Debtor): CustomerDetails {
  const customerId = debtor.CustomerId || `CUST${Date.now()}`
  const customer: CustomerDetails['Customer'] = {
    Id: customerId,
    NationalId: debtor.NationalId,
    NationalIdType: debtor.NationalIdType,
    GivenName: debtor.GivenName,
    Surname: debtor.Surname,
    GivenNameChinese: debtor.GivenName,
    SurnameChinese: debtor.Surname,
    Nickname: generateNickname(),
    DateOfBirth: new Date(1985, 0, 1).toISOString().split('T')[0],
    Email: `${debtor.GivenName}.${debtor.Surname}@example.com`,
    MobilePhoneNumber: debtor.MobilePhoneNumber || generatePhone(),
    MobilePhone2Number: debtor.ResidentialPhoneNumber || generatePhone(),
    OtherPhoneNumber: debtor.BusinessPhoneNumber || generatePhone(),
    PagerNumber: debtor.OtherPhoneNumber || generatePhone(),
    Loans: [],
    CustomerBusinesses: [],
    CustomerResidentials: [],
  }

  const loan: Loan = {
    AccountNumber:
      debtor.AccountNumber || MockDataGenerator.generateAccountNumber(),
    LoanSequence: debtor.LoanSequence || '1',
    LoanStatus: 'AC',
    LoanBalance: 10000,
    OverdueDay: 0,
    NetOverdueAmount: 0,
    LateCharge: 0,
    AdminCharge: 0,
    AnnualCharge: 0,
    NextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    SpecialRemarks: null,
    CenterRemarks: null,
    TotalNumberOfInstallment: 12,
    TotalNumberOfPaidInstallment: 0,
    InstallmentAmount: 1000,
    RepayMethod: 'Monthly',
    LoanType: 'Personal Loan',
    Group: 'A',
    Role: debtor.Role || 'Borrower',
    CampaignType: 'Standard',
    LoanAmount: 10000,
    IfAmount: 0,
    LoanDate: new Date().toISOString().split('T')[0],
    LoanExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    CutOffDate: new Date().toISOString().split('T')[0],
    LastPayDate: new Date().toISOString().split('T')[0],
    LastPayAmount: 0,
    Score: 750,
    FollowStatus: 'Active',
    DeferDay: 0,
    C: 0,
    C1: 0,
    C2: 0,
    DirectSalesReferral: 'Online',
    EStatement: 'Y',
    PdStatus: 'Active',
    DiRate: 5,
    ApBankAccountNumber: MockDataGenerator.generateAccountNumber(),
    EarlySettleAmount: 0,
    InstallmentAmountMinPaid: 100,
    LastRepayMethod: 'Monthly',
    WaivedAdminCharge: 0,
    WaivedLateCharge: 0,
    Debtors: [debtor],
  }

  customer.Loans = [loan]

  const businessAddress: CustomerAddress = {
    CustomerId: customerId,
    AddressType: 'Business',
    AddressLine1: generateAddress(),
    AddressLine2: generateAddress(),
    AddressLine3: generateAddress(),
    AddressLine4: generateAddress(),
    PhoneNumber: debtor.MobilePhoneNumber || generatePhone(),
    Country: 'Hong Kong',
    PostalCode: '00000',
  }

  const residentialAddress: CustomerAddress = {
    CustomerId: customerId,
    AddressType: 'Residential',
    AddressLine1: generateAddress(),
    AddressLine2: generateAddress(),
    AddressLine3: generateAddress(),
    AddressLine4: generateAddress(),
    PhoneNumber: debtor.ResidentialPhoneNumber || generatePhone(),
    Country: 'Hong Kong',
    PostalCode: '00000',
  }

  customer.CustomerBusinesses = [businessAddress]
  customer.CustomerResidentials = [residentialAddress]

  const customerDetails: CustomerDetails = {
    Customer: customer,
    CustomerBusinessesForEdit: [businessAddress],
    CustomerResidentialsForEdit: [residentialAddress],
    ActionCodes: MockDataGenerator.generateActionCodes(),
    BankAccountCodes: MockDataGenerator.generateBankAccountCodes(),
    BankInMethodCodes: MockDataGenerator.generateBankInMethodCodes(),
    CallResultCodes: [],
    ContactAmendmentHistory: [],
    CustomerPhone: [],
    FollowHistory: [],
    FollowStatusCodes: [],
    Debtors: [debtor],
    References: debtor.References || [],
    mobile_phones: [],
  }

  return customerDetails
}

export function findOrCreateDebtor(nationalId: string, idType: string): { debtor: Debtor; customerDetails: CustomerDetails } {
  let debtor = database.findDebtorByNationalId(nationalId)
  let customerDetails: CustomerDetails | null = null

  if (!debtor) {
    customerDetails = database.findCustomerByNationalId(nationalId)
    if (!customerDetails) {
      customerDetails = MockDataGenerator.generateCompleteCustomer({ nationalId })
      database.createCustomer(customerDetails)
    }
    debtor = customerDetails.Debtors?.[0] || null
    if (!debtor) {
      debtor = {
        CustomerId: customerDetails.Customer.Id,
        AccountNumber: customerDetails.Customer.Loans?.[0]?.AccountNumber || MockDataGenerator.generateAccountNumber(),
        LoanSequence: customerDetails.Customer.Loans?.[0]?.LoanSequence || '1',
        Role: 'Borrower',
        NationalId: nationalId,
        NationalIdType: idType,
        GivenName: customerDetails.Customer.GivenName,
        Surname: customerDetails.Customer.Surname,
        MobilePhoneNumber: customerDetails.Customer.MobilePhoneNumber,
        ResidentialPhoneNumber: customerDetails.Customer.OtherPhoneNumber,
        BusinessPhoneNumber: customerDetails.Customer.PagerNumber,
        OtherPhoneNumber: customerDetails.Customer.MobilePhone2Number,
        References: [],
      }
      customerDetails.Debtors = [debtor]
    }
  } else {
    if (debtor.CustomerId) {
      customerDetails = database.findCustomerByCustomerId(debtor.CustomerId)
    }
    if (!customerDetails) {
      customerDetails = database.findCustomerByNationalId(debtor.NationalId)
      if (!customerDetails) {
        customerDetails = createCustomerFromDebtor(debtor)
        database.createCustomer(customerDetails)
      }
    }
  }

  if (!debtor || !customerDetails) {
    throw new FunctionError(404, 'Customer not found')
  }

  return { debtor, customerDetails }
}
