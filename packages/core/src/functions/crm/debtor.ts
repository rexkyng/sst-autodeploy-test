import {
  CustomerInfo,
  DebtorRequest,
} from '../../models'
import { FunctionError } from '../errors'
import { ensureDatabaseInitialized } from '../database-init'
import {
  findOrCreateDebtor,
  generatePhone,
  generateCompany,
  generateAddress,
  generateNickname,
  generatePosition,
  generateName,
} from './helpers'

/**
 * Get debtor information by national ID
 */
export async function getDebtorInfo(request: DebtorRequest): Promise<CustomerInfo> {
  ensureDatabaseInitialized()

  try {
    const { debtor, customerDetails } = findOrCreateDebtor(request.NationalId, request.IdType)
    const customer = customerDetails.Customer
    if (!customer) {
      throw new FunctionError(404, 'Customer not found')
    }

    const spousePhone = generatePhone()
    const spouseCompany = generateCompany()
    const customerEmail = customer.Email || `${debtor.GivenName}.${debtor.Surname}@example.com`
    const customerBirthDate = customer.DateOfBirth || new Date(1985, 0, 1).toISOString()

    return {
      CustomerBusinesses: customerDetails.CustomerBusinessesForEdit || [],
      CustomerResidentials: customerDetails.CustomerResidentialsForEdit || [],
      SpouseBusinessPhoneCountryCode: '+852',
      SpouseBusinessPhoneNumber: spousePhone,
      SpouseCompanyAddress:
        customerDetails.CustomerBusinessesForEdit?.[0]?.AddressLine1 ||
        `${generateAddress()}`,
      SpouseAge: '35',
      SpouseCompanyName: spouseCompany,
      SpouseComplain: null,
      SpouseMobilePhoneCountryCode: '+852',
      SpouseMobilePhoneNumber: debtor.MobilePhoneNumber || spousePhone,
      SpouseName: `${debtor.Surname} ` + generateName(),
      SpouseNameChinese: `${debtor.Surname} ` + generateName(),
      SpouseNickname: generateNickname(),
      SpousePosition: generatePosition(),
      OverseasWorkerLoanAddress: generateAddress(),
      OverseasWorkerLoanDependantName: generateName(),
      OverseasWorkerLoanEmployerName: generateCompany(),
      OverseasWorkerLoanEmployerPhone: generatePhone(),
      OverseasWorkerLoanPhoneNumber:
        debtor.OtherPhoneNumber || generatePhone(),
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
    if (error instanceof FunctionError) {
      throw error
    }
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    throw new FunctionError(400, errorMessage)
  }
}
