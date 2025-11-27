import { faker } from '@faker-js/faker'
import { MockDataGenerator } from '../data/mockData'
import { database } from '../data/database'
import {
  CustomerDetails,
  CustomerInfo,
  Debtor,
  CustomerSearchResponse,
  WrapupResponse,
  CustomerDetailsResponse,
  DebtorRequest,
  SearchRequest,
  CustomerRequest,
  WrapupRequest,
  Loan,
  CustomerAddress,
} from '@openauth/core/models'
import { ControllerError } from './errors'

export class CrmController {
  private generatePhone(): string {
    return `${faker.string.numeric({ length: 1, allowLeadingZeros: false, exclude: ['1'] })}${faker.string.numeric({ length: 7, allowLeadingZeros: false })}`
  }

  private generateCompany(): string {
    return faker.company.name()
  }

  private generateAddress(): string {
    return `${faker.location.streetAddress()}, Hong Kong`
  }

  private generateNickname(): string {
    return faker.person.middleName()
  }

  private generatePosition(): string {
    return faker.person.jobTitle()
  }

  private generateName(): string {
    return faker.person.firstName()
  }

  private buildSearchOverrides(request: SearchRequest, nationalId?: string): any {
    const overrides: any = {}
    if (nationalId) overrides.nationalId = nationalId
    if (request.Surname) overrides.surname = request.Surname
    if (request.GivenName) overrides.givenName = request.GivenName
    if (request.AccountNumber) overrides.accountNumber = request.AccountNumber
    if (request.LoanSequence) overrides.loanSequence = request.LoanSequence
    return overrides
  }

  private updateCustomerFromSearchCriteria(customer: CustomerDetails, request: SearchRequest): void {
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

  private generateCustomerFromSearch(request: SearchRequest, nationalId?: string): CustomerDetails {
    const overrides = nationalId
      ? this.buildSearchOverrides(request, nationalId)
      : this.buildSearchOverrides(request, MockDataGenerator.generateDeterministicNationalId(request))
    
    const customer = MockDataGenerator.generateCompleteCustomer(overrides)
    this.updateCustomerFromSearchCriteria(customer, request)
    return customer
  }

  private createCustomerFromDebtor(debtor: Debtor): CustomerDetails {
    const customerId = debtor.CustomerId || `CUST${Date.now()}`
    const customer: CustomerDetails['Customer'] = {
      Id: customerId,
      NationalId: debtor.NationalId,
      NationalIdType: debtor.NationalIdType,
      GivenName: debtor.GivenName,
      Surname: debtor.Surname,
      GivenNameChinese: debtor.GivenName,
      SurnameChinese: debtor.Surname,
      Nickname: this.generateNickname(),
      DateOfBirth: new Date(1985, 0, 1).toISOString().split('T')[0],
      Email: `${debtor.GivenName}.${debtor.Surname}@example.com`,
      MobilePhoneNumber: debtor.MobilePhoneNumber || this.generatePhone(),
      MobilePhone2Number: debtor.ResidentialPhoneNumber || this.generatePhone(),
      OtherPhoneNumber: debtor.BusinessPhoneNumber || this.generatePhone(),
      PagerNumber: debtor.OtherPhoneNumber || this.generatePhone(),
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
      AddressLine1: this.generateAddress(),
      AddressLine2: this.generateAddress(),
      AddressLine3: this.generateAddress(),
      AddressLine4: this.generateAddress(),
      PhoneNumber: debtor.MobilePhoneNumber || this.generatePhone(),
      Country: 'Hong Kong',
      PostalCode: '00000',
    }

    const residentialAddress: CustomerAddress = {
      CustomerId: customerId,
      AddressType: 'Residential',
      AddressLine1: this.generateAddress(),
      AddressLine2: this.generateAddress(),
      AddressLine3: this.generateAddress(),
      AddressLine4: this.generateAddress(),
      PhoneNumber: debtor.ResidentialPhoneNumber || this.generatePhone(),
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
  private findOrCreateDebtor(nationalId: string, idType: string): { debtor: Debtor; customerDetails: CustomerDetails } {
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
          customerDetails = this.createCustomerFromDebtor(debtor)
          database.createCustomer(customerDetails)
        }
      }
    }

    if (!debtor || !customerDetails) {
      throw new ControllerError(404, 'Customer not found')
    }

    return { debtor, customerDetails }
  }

  public async getDebtorInfo(
    request: DebtorRequest,
  ): Promise<CustomerInfo> {
    try {
      const { debtor, customerDetails } = this.findOrCreateDebtor(request.NationalId, request.IdType)
      const customer = customerDetails.Customer
      if (!customer) {
        throw new ControllerError(404, 'Customer not found')
      }

      const customerEmail = customer.Email || `${debtor.GivenName}.${debtor.Surname}@example.com`
      const customerBirthDate = customer.DateOfBirth || new Date(1985, 0, 1).toISOString()

      return {
        CustomerBusinesses: customerDetails.CustomerBusinessesForEdit || [],
        CustomerResidentials: customerDetails.CustomerResidentialsForEdit || [],
        SpouseBusinessPhoneCountryCode: '+852',
        SpouseBusinessPhoneNumber: spousePhone,
        SpouseCompanyAddress:
          customerDetails.CustomerBusinessesForEdit?.[0]?.AddressLine1 ||
          `${this.generateAddress()}`,
        SpouseAge: '35',
        SpouseCompanyName: spouseCompany,
        SpouseComplain: null,
        SpouseMobilePhoneCountryCode: '+852',
        SpouseMobilePhoneNumber: debtor.MobilePhoneNumber || spousePhone,
        SpouseName: `${debtor.Surname} ` + this.generateName(),
        SpouseNameChinese: `${debtor.Surname} ` + this.generateName(),
        SpouseNickname: this.generateNickname(),
        SpousePosition: this.generatePosition(),
        OverseasWorkerLoanAddress: this.generateAddress(),
        OverseasWorkerLoanDependantName: this.generateName(),
        OverseasWorkerLoanEmployerName: this.generateCompany(),
        OverseasWorkerLoanEmployerPhone: this.generatePhone(),
        OverseasWorkerLoanPhoneNumber:
          debtor.OtherPhoneNumber || this.generatePhone(),
        OverseasWorkerLoanRelationship: 'Spouse',
        GivenName: debtor.GivenName,
        Surname: debtor.Surname,
        GivenNameChinese: debtor.GivenName,
        SurnameChinese: debtor.Surname,
        Id: debtor.NationalId,
        NationalIdType: debtor.NationalIdType,
        DateOfMatch: new Date().toISOString(),
        PartialIdMatched: false,
        Nationality: 'Chinese',
        MaritalStatus: 'Married',
        DateOfBirth: customerBirthDate,
        Email: customerEmail,
      }
    } catch (error) {
      if (error instanceof ControllerError) {
        throw error
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new ControllerError(400, errorMessage)
    }
  }

  public async searchCustomers(
    request: SearchRequest,
  ): Promise<CustomerSearchResponse> {
    try {
      let results = database.findCustomerBySearch(request)

      if (request.NationalId) {
        const existingCustomer = database.findCustomerByNationalId(request.NationalId)
        if (existingCustomer) {
          results = [existingCustomer]
        } else {
          const newCustomer = this.generateCustomerFromSearch(request, request.NationalId)
          database.createCustomer(newCustomer)
          results = [newCustomer]
        }
      } else {
        const hasSearchCriteria = !!(
          request.AccountNumber ||
          request.LoanSequence ||
          request.Surname ||
          request.GivenName ||
          request.ReferenceName ||
          request.CompanyName ||
          request.PhoneNumber ||
          request.ReferencePhoneNumber ||
          request.AgentId
        )

        if (results.length === 0 && hasSearchCriteria) {
          const newCustomer = this.generateCustomerFromSearch(request)
          database.createCustomer(newCustomer)
          results = [newCustomer]
        }
      }

      if (results.length === 0) {
        return { Customer: [] }
      }

      return {
        Customer: results.map((customerDetails) => ({
          NationalIdType: customerDetails.Customer.NationalIdType,
          NationalId: customerDetails.Customer.NationalId,
          Nickname: customerDetails.Customer.Nickname,
          Surname: customerDetails.Customer.Surname,
          GivenName: customerDetails.Customer.GivenName,
        })),
      }
    } catch (error) {
      if (error instanceof ControllerError) {
        throw error
      }
      throw new ControllerError(400, 'Invalid search parameters')
    }
  }

  public async getCustomerDetails(
    request: CustomerRequest,
  ): Promise<CustomerDetailsResponse> {
    try {
      let customerDetails = database.findCustomerByNationalId(request.NationalId)

      if (!customerDetails) {
        customerDetails = MockDataGenerator.generateCompleteCustomer({
          nationalId: request.NationalId,
        })
        database.createCustomer(customerDetails)
      }

      if (!customerDetails.Customer) {
        throw new ControllerError(404, 'Customer not found')
      }

      return {
        ...customerDetails,
        CustomerNickname: customerDetails.Customer.Nickname || 'Test Nickname',
      }
    } catch (error) {
      if (error instanceof ControllerError) {
        throw error
      }
      throw new ControllerError(400, 'Invalid request parameters')
    }
  }

  public async submitWrapup(
    request: WrapupRequest,
  ): Promise<WrapupResponse> {
    try {
      if (!request.CallInfo.CallResultCodeId) {
        throw new ControllerError(400, 'CallResultCodeId is required')
      }

      return {
        success: true,
        message: 'Wrap-up data processed successfully',
        processedAt: new Date().toISOString(),
        accountsProcessed: request.CallInfo.Accounts.length,
      }
    } catch (error) {
      if (error instanceof ControllerError) {
        throw error
      }
      throw new ControllerError(400, 'Invalid wrap-up data')
    }
  }
}
