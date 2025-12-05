import {
  CustomerSearchResponse,
  SearchRequest,
} from '../../models'
import { FunctionError } from '../errors'
import { database } from '../mock/database'
import { ensureDatabaseInitialized } from '../database-init'
import { generateCustomerFromSearch } from './helpers'

/**
 * Search customers by various criteria
 */
export async function searchCustomers(request: SearchRequest): Promise<CustomerSearchResponse> {
  ensureDatabaseInitialized()

  try {
    let results = database.findCustomerBySearch(request)

    if (request.NationalId) {
      const existingCustomer = database.findCustomerByNationalId(request.NationalId)
      if (existingCustomer) {
        results = [existingCustomer]
      } else {
        const newCustomer = generateCustomerFromSearch(request, request.NationalId)
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
        const newCustomer = generateCustomerFromSearch(request)
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
    if (error instanceof FunctionError) {
      throw error
    }
    throw new FunctionError(400, 'Invalid search parameters')
  }
}
