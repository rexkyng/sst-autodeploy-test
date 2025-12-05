import {
  StoredProcedureRequest,
  StoredProcedureResponse,
  CustomerPhone,
} from '../../models'
import { FunctionError } from '../errors'
import { database } from '../mock/database'
import { MockDataGenerator } from '../mock/mockData'
import { ensureDatabaseInitialized } from '../database-init'

function getParam(request: StoredProcedureRequest, index: number): string | undefined {
  return request.Command.Parameters[index]?.value
}

function handleGetUrl(request: StoredProcedureRequest): StoredProcedureResponse {
  const id = getParam(request, 0)
  const shortcutIp = getParam(request, 1)
  const nationalId = getParam(request, 2)
  const accountNumber = getParam(request, 3)
  const loanSequence = getParam(request, 4)
  const agentId = getParam(request, 5)

  return {
    Result: {
      Table: [
        {
          URL: `http://${shortcutIp || 'localhost'}/shortcut/${id}?account=${accountNumber}&loan=${loanSequence}&agent=${agentId}`,
        },
      ],
    },
  }
}

function handleGetCustomerPhone(request: StoredProcedureRequest): StoredProcedureResponse {
  const nationalId = getParam(request, 2) ?? ''
  const phones = database.getPhonesByNationalId(nationalId)

  return {
    Result: {
      Table: phones.map((phone) => ({
        PhoneId: phone.PhoneId,
        CustomerId: phone.CustomerId,
        PhoneType: phone.PhoneType,
        PhoneCountryCode: phone.PhoneCountryCode,
        PhoneNumber: phone.PhoneNumber,
        PhoneExtension: phone.PhoneExtension,
        PhoneInvalidReason: phone.PhoneInvalidReason,
        AccountNumber: phone.AccountNumber,
        LoanSequence: phone.LoanSequence,
        Role: phone.Role,
      })),
    },
  }
}

function handleAddCustomerPhone(request: StoredProcedureRequest): StoredProcedureResponse {
  const customerId = getParam(request, 1)
  const accountNumber = getParam(request, 2)
  const loanSequence = getParam(request, 3)
  const role = getParam(request, 4)
  const phoneType = getParam(request, 5)
  const phoneCountryCode = getParam(request, 6)
  const phoneNumber = getParam(request, 7)
  const phoneExtension = getParam(request, 8)
  const phoneInvalidReason = getParam(request, 9)

  const phoneId = `PHONE${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(3, '0')}`

  const newPhone: CustomerPhone = {
    PhoneId: phoneId,
    CustomerId: customerId ?? '',
    PhoneType: parseInt(phoneType ?? '0', 10),
    PhoneCountryCode: phoneCountryCode ?? '',
    PhoneNumber: phoneNumber ?? '',
    PhoneExtension: phoneExtension ?? '',
    PhoneInvalidReason: phoneInvalidReason ?? null,
    AccountNumber: accountNumber ?? '',
    LoanSequence: loanSequence ?? '',
    Role: role ?? '',
  }

  database.addPhone(newPhone)

  return {
    Result: {
      Table: [{ Column1: 1 }],
    },
  }
}

function handleUpdateCustomerPhone(request: StoredProcedureRequest): StoredProcedureResponse {
  const accountNumber = getParam(request, 2)
  const loanSequence = getParam(request, 3)
  const role = getParam(request, 4)
  const phoneType = getParam(request, 5)
  const phoneCountryCode = getParam(request, 6)
  const phoneNumber = getParam(request, 7)
  const phoneExtension = getParam(request, 8)
  const phoneInvalidReason = getParam(request, 9)
  const phoneId = getParam(request, 12)

  const success = database.updatePhone(phoneId ?? '', {
    PhoneType: parseInt(phoneType ?? '0', 10),
    PhoneCountryCode: phoneCountryCode ?? '',
    PhoneNumber: phoneNumber ?? '',
    PhoneExtension: phoneExtension ?? '',
    PhoneInvalidReason: phoneInvalidReason ?? null,
    AccountNumber: accountNumber ?? '',
    LoanSequence: loanSequence ?? '',
    Role: role ?? '',
  })

  return {
    Result: {
      Table: [{ Column1: success ? 1 : 0 }],
    },
  }
}

function handleDeleteCustomerPhone(request: StoredProcedureRequest): StoredProcedureResponse {
  const phoneId = getParam(request, 0) ?? ''
  const success = database.deletePhone(phoneId)

  return {
    Result: {
      Table: [{ Column1: success ? 1 : 0 }],
    },
  }
}

function handleGetFollowHistory(request: StoredProcedureRequest): StoredProcedureResponse {
  const nationalId = getParam(request, 2) ?? ''
  const history = database.getFollowHistoryByNationalId(nationalId)

  return {
    Result: {
      Table: history.map((h) => ({
        Id: h.Id,
        CustomerId: h.CustomerId,
        AccountNumber: h.AccountNumber,
        LoanSequence: h.LoanSequence,
        StartTime: h.StartTime,
        ActionDateTime: h.ActionDateTime,
        CallResult: h.CallResult,
        CallMemo: h.CallMemo,
        ConnId: h.ConnId,
        AgentId: h.AgentId,
        RecorderLink: h.RecorderLink,
      })),
    },
  }
}

function handleGetContactAmendmentHistory(request: StoredProcedureRequest): StoredProcedureResponse {
  const nationalId = getParam(request, 2) ?? ''
  const history = database.getContactAmendmentsByNationalId(nationalId)

  return {
    Result: {
      Table: history.map((h) => ({
        CustomerId: h.CustomerId,
        AccountNumber: h.AccountNumber,
        LoanSequence: h.LoanSequence,
        Role: h.Role,
        PhoneType: h.PhoneType,
        PhoneNumber: h.PhoneNumber,
        PhoneExtension: h.PhoneExtension,
        PhoneInvalidReason: h.PhoneInvalidReason,
        ActionDatetime: h.ActionDatetime,
        ActionType: h.ActionType,
        AgentId: h.AgentId,
      })),
    },
  }
}

function handleGetNickname(request: StoredProcedureRequest): StoredProcedureResponse {
  const mockCustomer = MockDataGenerator.generateCustomerDetails()
  const nickname = mockCustomer.Customer.Nickname || 'Test Nickname'

  return {
    Result: {
      Table: [
        {
          Nickname: nickname,
        },
      ],
    },
  }
}

function handleUpdateNickname(request: StoredProcedureRequest): StoredProcedureResponse {
  return {
    Result: {
      Table: [{ Column1: 1 }],
    },
  }
}

function handleGetReminderHistory(request: StoredProcedureRequest): StoredProcedureResponse {
  const accountNumber = getParam(request, 0)
  const loanSequence = getParam(request, 1)

  const mockReminders = []
  for (let i = 0; i < 3; i++) {
    mockReminders.push({
      AccountNumber: accountNumber,
      LoanSequence: loanSequence,
      ReminderDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      ReminderType: ['SMS', 'Email', 'Letter'][i],
      Amount: Math.floor(Math.random() * 1000) + 100,
      Status: ['Sent', 'Delivered', 'Pending'][i],
    })
  }

  return {
    Result: {
      Table: mockReminders,
    },
  }
}

function handleDICalculator(request: StoredProcedureRequest): StoredProcedureResponse {
  const noOfDays = Math.floor(Math.random() * 90) + 30
  const diAmount = Math.floor(Math.random() * 1000) + 100
  const lastDueDate = new Date(Date.now() + noOfDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  return {
    Result: {
      Table: [
        {
          ':B1': lastDueDate,
          ':B2': diAmount,
          ':B3': noOfDays,
        },
      ],
    },
  }
}

/**
 * Execute a stored procedure
 */
export async function executeStoredProcedure(
  request: StoredProcedureRequest,
): Promise<StoredProcedureResponse> {
  ensureDatabaseInitialized()

  try {
    const procedureName = request.Command.Text
    console.log('Executing stored procedure:', procedureName)

    switch (procedureName) {
      case 'cic_get_url':
        return handleGetUrl(request)
      case 'SP_CustomerPhone_Get_ByNationalId':
        return handleGetCustomerPhone(request)
      case 'SP_CustomerPhone_Add':
        return handleAddCustomerPhone(request)
      case 'SP_CustomerPhone_InvalidReason_Update_ById':
        return handleUpdateCustomerPhone(request)
      case 'SP_CustomerPhone_Delete_ById':
        return handleDeleteCustomerPhone(request)
      case 'SP_FollowHistory_Get_ByNationalId':
        return handleGetFollowHistory(request)
      case 'SP_ContactAmendmentHistory_Get_ByNationalId':
        return handleGetContactAmendmentHistory(request)
      case 'SP_CustomerNickname_Get_ByNationalId':
        return handleGetNickname(request)
      case 'SP_CustomerNickname_Update':
        return handleUpdateNickname(request)
      case 'CIC_ADHOC_SEEK_PKG.cic_get_reminder_his':
        return handleGetReminderHistory(request)
      case 'G_CAL_DI_INT':
        return handleDICalculator(request)
      default:
        console.warn('Unknown stored procedure:', procedureName)
        return {
          Result: {
            Table: [],
          },
        }
    }
  } catch (error) {
    console.error('Error executing stored procedure:', error)
    throw new FunctionError(500, 'Internal server error')
  }
}
