// In-memory relational database for CRM mock API
import {
  CustomerDetails,
  Loan,
  CustomerPhone,
  FollowHistory,
  ContactAmendmentHistory,
  Debtor,
  Reference,
  SearchRequest,
} from '@openauth/core/models'

interface DatabaseSchema {
  customers: Map<string, CustomerDetails> // key: NationalId
  loans: Map<string, Loan> // key: AccountNumber+LoanSequence
  debtorsByLoan: Map<string, Debtor[]> // key: AccountNumber+LoanSequence
  debtorsByNationalId: Map<string, Debtor> // key: NationalId
  references: Map<string, Reference[]> // key: DebtorNationalId
  phones: Map<string, CustomerPhone> // key: PhoneId
  phonesByCustomer: Map<string, string[]> // key: CustomerId -> PhoneIds
  followHistory: Map<string, FollowHistory[]> // key: CustomerId
  contactAmendments: Map<string, ContactAmendmentHistory[]> // key: CustomerId
  loansByCustomer: Map<string, string[]> // key: CustomerId -> Loan keys
}

class Database {
  private data: DatabaseSchema

  constructor() {
    this.data = {
      customers: new Map(),
      loans: new Map(),
      debtorsByLoan: new Map(),
      debtorsByNationalId: new Map(),
      references: new Map(),
      phones: new Map(),
      phonesByCustomer: new Map(),
      followHistory: new Map(),
      contactAmendments: new Map(),
      loansByCustomer: new Map(),
    }
  }

  clear(): void {
    this.data.customers.clear()
    this.data.loans.clear()
    this.data.debtorsByLoan.clear()
    this.data.debtorsByNationalId.clear()
    this.data.references.clear()
    this.data.phones.clear()
    this.data.phonesByCustomer.clear()
    this.data.followHistory.clear()
    this.data.contactAmendments.clear()
    this.data.loansByCustomer.clear()
  }

  createCustomer(customerDetails: CustomerDetails): void {
    const customer = customerDetails.Customer
    const customerId = customer.Id
    const nationalId = customer.NationalId

    this.data.customers.set(nationalId, customerDetails)

    const loanKeys: string[] = []
    customer.Loans.forEach((loan) => {
      const loanKey = this.getLoanKey(loan.AccountNumber, loan.LoanSequence)
      this.data.loans.set(loanKey, loan)
      loanKeys.push(loanKey)

      if (loan.Debtors && loan.Debtors.length > 0) {
        this.data.debtorsByLoan.set(loanKey, loan.Debtors)

        loan.Debtors.forEach((debtor) => {
          this.data.debtorsByNationalId.set(debtor.NationalId, debtor)

          if (debtor.References && debtor.References.length > 0) {
            this.data.references.set(debtor.NationalId, debtor.References)
          }
        })
      }
    })
    this.data.loansByCustomer.set(customerId, loanKeys)

    const phoneIds: string[] = []
    if (customerDetails.CustomerPhone) {
      customerDetails.CustomerPhone.forEach((phone) => {
        this.data.phones.set(phone.PhoneId, phone)
        phoneIds.push(phone.PhoneId)
      })
    }
    this.data.phonesByCustomer.set(customerId, phoneIds)

    if (customerDetails.FollowHistory) {
      this.data.followHistory.set(customerId, customerDetails.FollowHistory)
    }

    if (customerDetails.ContactAmendmentHistory) {
      this.data.contactAmendments.set(
        customerId,
        customerDetails.ContactAmendmentHistory,
      )
    }

    if (customerDetails.Debtors) {
      customerDetails.Debtors.forEach((debtor) => {
        if (!this.data.debtorsByNationalId.has(debtor.NationalId)) {
          this.data.debtorsByNationalId.set(debtor.NationalId, debtor)
        }
        if (debtor.References) {
          this.data.references.set(debtor.NationalId, debtor.References)
        }
      })
    }
  }

  findCustomerByNationalId(nationalId: string): CustomerDetails | null {
    return this.data.customers.get(nationalId) || null
  }

  findCustomerByCustomerId(customerId: string): CustomerDetails | null {
    for (const [nationalId, customerDetails] of this.data.customers.entries()) {
      if (customerDetails.Customer.Id === customerId) {
        return customerDetails
      }
    }
    return null
  }

  findCustomerBySearch(request: SearchRequest): CustomerDetails[] {
    const results: CustomerDetails[] = []

    this.data.customers.forEach((customerDetails, nationalId) => {
      const customer = customerDetails.Customer
      let matches = true

      if (
        request.NationalId &&
        !customer.NationalId.toLowerCase().includes(
          request.NationalId.toLowerCase(),
        )
      ) {
        matches = false
      }

      if (
        request.Surname &&
        !customer.Surname.toLowerCase().includes(request.Surname.toLowerCase())
      ) {
        matches = false
      }

      if (
        request.GivenName &&
        !customer.GivenName.toLowerCase().includes(
          request.GivenName.toLowerCase(),
        )
      ) {
        matches = false
      }

      if (request.AccountNumber) {
        const hasAccount = customer.Loans.some((loan) =>
          loan.AccountNumber.includes(request.AccountNumber!),
        )
        if (!hasAccount) matches = false
      }

      if (request.LoanSequence) {
        const hasLoan = customer.Loans.some((loan) =>
          loan.LoanSequence.includes(request.LoanSequence!),
        )
        if (!hasLoan) matches = false
      }

      if (request.PhoneNumber) {
        const hasPhone = this.customerHasPhone(customer.Id, request.PhoneNumber)
        if (!hasPhone) matches = false
      }

      if (request.ReferenceName) {
        const hasReference = this.customerHasReference(
          customerDetails,
          request.ReferenceName,
        )
        if (!hasReference) matches = false
      }

      if (request.ReferencePhoneNumber) {
        const hasRefPhone = this.customerHasReferencePhone(
          customerDetails,
          request.ReferencePhoneNumber,
        )
        if (!hasRefPhone) matches = false
      }

      if (
        request.CustomerId &&
        !customer.NationalId.includes(request.CustomerId)
      ) {
        matches = false
      }

      if (matches) {
        results.push(customerDetails)
      }
    })

    return results
  }

  getAllCustomers(): CustomerDetails[] {
    return Array.from(this.data.customers.values())
  }

  findDebtorByNationalId(nationalId: string): Debtor | null {
    return this.data.debtorsByNationalId.get(nationalId) || null
  }

  addPhone(phone: CustomerPhone): void {
    this.data.phones.set(phone.PhoneId, phone)

    const customerId = phone.CustomerId
    if (!this.data.phonesByCustomer.has(customerId)) {
      this.data.phonesByCustomer.set(customerId, [])
    }
    const phoneIds = this.data.phonesByCustomer.get(customerId)!
    if (!phoneIds.includes(phone.PhoneId)) {
      phoneIds.push(phone.PhoneId)
    }

    const customer = Array.from(this.data.customers.values()).find(
      (c) => c.Customer.Id === customerId,
    )
    if (customer) {
      if (!customer.CustomerPhone) {
        customer.CustomerPhone = []
      }
      const existingIndex = customer.CustomerPhone.findIndex(
        (p) => p.PhoneId === phone.PhoneId,
      )
      if (existingIndex >= 0) {
        customer.CustomerPhone[existingIndex] = phone
      } else {
        customer.CustomerPhone.push(phone)
      }
    }
  }

  updatePhone(phoneId: string, updates: Partial<CustomerPhone>): boolean {
    const phone = this.data.phones.get(phoneId)
    if (!phone) return false

    const updatedPhone = { ...phone, ...updates }
    this.data.phones.set(phoneId, updatedPhone)

    const customer = Array.from(this.data.customers.values()).find(
      (c) => c.Customer.Id === phone.CustomerId,
    )
    if (customer && customer.CustomerPhone) {
      const index = customer.CustomerPhone.findIndex(
        (p) => p.PhoneId === phoneId,
      )
      if (index >= 0) {
        customer.CustomerPhone[index] = updatedPhone
      }
    }

    return true
  }

  deletePhone(phoneId: string): boolean {
    const phone = this.data.phones.get(phoneId)
    if (!phone) return false

    this.data.phones.delete(phoneId)

    const phoneIds = this.data.phonesByCustomer.get(phone.CustomerId)
    if (phoneIds) {
      const index = phoneIds.indexOf(phoneId)
      if (index >= 0) {
        phoneIds.splice(index, 1)
      }
    }

    const customer = Array.from(this.data.customers.values()).find(
      (c) => c.Customer.Id === phone.CustomerId,
    )
    if (customer && customer.CustomerPhone) {
      const index = customer.CustomerPhone.findIndex(
        (p) => p.PhoneId === phoneId,
      )
      if (index >= 0) {
        customer.CustomerPhone.splice(index, 1)
      }
    }

    return true
  }

  getPhonesByCustomerId(customerId: string): CustomerPhone[] {
    const phoneIds = this.data.phonesByCustomer.get(customerId) || []
    return phoneIds.map((id) => this.data.phones.get(id)!).filter(Boolean)
  }

  getPhonesByNationalId(nationalId: string): CustomerPhone[] {
    const customer = this.findCustomerByNationalId(nationalId)
    if (!customer) return []
    return this.getPhonesByCustomerId(customer.Customer.Id)
  }

  addFollowHistory(customerId: string, history: FollowHistory): void {
    if (!this.data.followHistory.has(customerId)) {
      this.data.followHistory.set(customerId, [])
    }
    this.data.followHistory.get(customerId)!.push(history)

    const customer = Array.from(this.data.customers.values()).find(
      (c) => c.Customer.Id === customerId,
    )
    if (customer) {
      if (!customer.FollowHistory) {
        customer.FollowHistory = []
      }
      customer.FollowHistory.push(history)
    }
  }

  getFollowHistoryByCustomerId(customerId: string): FollowHistory[] {
    return this.data.followHistory.get(customerId) || []
  }

  getFollowHistoryByNationalId(nationalId: string): FollowHistory[] {
    const customer = this.findCustomerByNationalId(nationalId)
    if (!customer) return []
    return this.getFollowHistoryByCustomerId(customer.Customer.Id)
  }

  addContactAmendment(
    customerId: string,
    amendment: ContactAmendmentHistory,
  ): void {
    if (!this.data.contactAmendments.has(customerId)) {
      this.data.contactAmendments.set(customerId, [])
    }
    this.data.contactAmendments.get(customerId)!.push(amendment)

    const customer = Array.from(this.data.customers.values()).find(
      (c) => c.Customer.Id === customerId,
    )
    if (customer) {
      if (!customer.ContactAmendmentHistory) {
        customer.ContactAmendmentHistory = []
      }
      customer.ContactAmendmentHistory.push(amendment)
    }
  }

  getContactAmendmentsByCustomerId(
    customerId: string,
  ): ContactAmendmentHistory[] {
    return this.data.contactAmendments.get(customerId) || []
  }

  getContactAmendmentsByNationalId(
    nationalId: string,
  ): ContactAmendmentHistory[] {
    const customer = this.findCustomerByNationalId(nationalId)
    if (!customer) return []
    return this.getContactAmendmentsByCustomerId(customer.Customer.Id)
  }

  private getLoanKey(accountNumber: string, loanSequence: string): string {
    return `${accountNumber}:${loanSequence}`
  }

  private customerHasPhone(customerId: string, phoneNumber: string): boolean {
    const phones = this.getPhonesByCustomerId(customerId)
    return phones.some((phone) => phone.PhoneNumber.includes(phoneNumber))
  }

  private customerHasReference(
    customerDetails: CustomerDetails,
    referenceName: string,
  ): boolean {
    const searchName = referenceName.toLowerCase()

    // Check debtors' references
    if (customerDetails.Debtors) {
      for (const debtor of customerDetails.Debtors) {
        if (debtor.References) {
          for (const ref of debtor.References) {
            const fullName = `${ref.GivenName} ${ref.Surname}`.toLowerCase()
            if (fullName.includes(searchName)) {
              return true
            }
          }
        }
      }
    }

    // Check references at customer level
    if (customerDetails.References) {
      for (const ref of customerDetails.References) {
        const fullName = `${ref.GivenName} ${ref.Surname}`.toLowerCase()
        if (fullName.includes(searchName)) {
          return true
        }
      }
    }

    return false
  }

  private customerHasReferencePhone(
    customerDetails: CustomerDetails,
    phoneNumber: string,
  ): boolean {
    // Check debtors' references
    if (customerDetails.Debtors) {
      for (const debtor of customerDetails.Debtors) {
        if (debtor.References) {
          for (const ref of debtor.References) {
            if (
              ref.MobilePhoneNumber?.includes(phoneNumber) ||
              ref.ResidentialPhoneNumber?.includes(phoneNumber) ||
              ref.BusinessPhoneNumber?.includes(phoneNumber) ||
              ref.OtherPhoneNumber?.includes(phoneNumber)
            ) {
              return true
            }
          }
        }
      }
    }

    // Check references at customer level
    if (customerDetails.References) {
      for (const ref of customerDetails.References) {
        if (
          ref.MobilePhoneNumber?.includes(phoneNumber) ||
          ref.ResidentialPhoneNumber?.includes(phoneNumber) ||
          ref.BusinessPhoneNumber?.includes(phoneNumber) ||
          ref.OtherPhoneNumber?.includes(phoneNumber)
        ) {
          return true
        }
      }
    }

    return false
  }

  getStats() {
    return {
      customers: this.data.customers.size,
      loans: this.data.loans.size,
      debtors: this.data.debtorsByNationalId.size,
      phones: this.data.phones.size,
      followHistory: Array.from(this.data.followHistory.values()).reduce(
        (sum, arr) => sum + arr.length,
        0,
      ),
      contactAmendments: Array.from(
        this.data.contactAmendments.values(),
      ).reduce((sum, arr) => sum + arr.length, 0),
    }
  }
}

export const database = new Database()

export function initializeDatabase(): void {
  console.log('Initializing in-memory database...')
  database.clear()
  console.log('Database initialized successfully')
  console.log('Database stats:', database.getStats())
}
