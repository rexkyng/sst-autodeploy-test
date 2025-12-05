import {
  CustomerDetailsResponse,
  CustomerRequest,
} from '../../models'
import { FunctionError } from '../errors'
import { database } from '../mock/database'
import { MockDataGenerator } from '../mock/mockData'
import { ensureDatabaseInitialized } from '../database-init'

/**
 * Get full customer details by national ID
 */
export async function getCustomerDetails(request: CustomerRequest): Promise<CustomerDetailsResponse> {
  ensureDatabaseInitialized()

  try {
    let customerDetails = database.findCustomerByNationalId(request.NationalId)

    if (!customerDetails) {
      customerDetails = MockDataGenerator.generateCompleteCustomer({
        nationalId: request.NationalId,
      })
      database.createCustomer(customerDetails)
    }

    if (!customerDetails.Customer) {
      throw new FunctionError(404, 'Customer not found')
    }

    return {
      ...customerDetails,
      CustomerNickname: customerDetails.Customer.Nickname || 'Test Nickname',
    }
  } catch (error) {
    if (error instanceof FunctionError) {
      throw error
    }
    throw new FunctionError(400, 'Invalid request parameters')
  }
}
