import { MockDataGenerator } from '../data/mockData'
import { database } from '../data/database'
import {
  StoredProcedureRequest,
  StoredProcedureResponse,
  CustomerPhone,
} from '@openauth/core/models'
import { ControllerError } from './errors'

export class DataController {
  private getParam(request: StoredProcedureRequest, index: number): string | undefined {
    return request.Command.Parameters[index]?.value
  }

  public async executeStoredProcedure(
    request: StoredProcedureRequest,
  ): Promise<StoredProcedureResponse> {
    try {
      const procedureName = request.Command.Text
      console.log('Executing stored procedure:', procedureName)

      switch (procedureName) {
        case 'cic_get_url':
          return this.handleGetUrl(request)
        case 'SP_CustomerPhone_Get_ByNationalId':
          return this.handleGetCustomerPhone(request)
        case 'SP_CustomerPhone_Add':
          return this.handleAddCustomerPhone(request)
        case 'SP_CustomerPhone_InvalidReason_Update_ById':
          return this.handleUpdateCustomerPhone(request)
        case 'SP_CustomerPhone_Delete_ById':
          return this.handleDeleteCustomerPhone(request)
        case 'SP_FollowHistory_Get_ByNationalId':
          return this.handleGetFollowHistory(request)
        case 'SP_ContactAmendmentHistory_Get_ByNationalId':
          return this.handleGetContactAmendmentHistory(request)
        case 'SP_CustomerNickname_Get_ByNationalId':
          return this.handleGetNickname(request)
        case 'SP_CustomerNickname_Update':
          return this.handleUpdateNickname(request)
        case 'CIC_ADHOC_SEEK_PKG.cic_get_reminder_his':
          return this.handleGetReminderHistory(request)
        case 'G_CAL_DI_INT':
          return this.handleDICalculator(request)
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
      throw new ControllerError(500, 'Internal server error')
    }
  }

  private handleGetUrl(
    request: StoredProcedureRequest,
  ): StoredProcedureResponse {
    const id = this.getParam(request, 0)
    const shortcutIp = this.getParam(request, 1)
    const nationalId = this.getParam(request, 2)
    const accountNumber = this.getParam(request, 3)
    const loanSequence = this.getParam(request, 4)
    const agentId = this.getParam(request, 5)

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

  private handleGetCustomerPhone(
    request: StoredProcedureRequest,
  ): StoredProcedureResponse {
    const nationalId = this.getParam(request, 2)
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

  private handleAddCustomerPhone(
    request: StoredProcedureRequest,
  ): StoredProcedureResponse {
    const customerId = this.getParam(request, 1)
    const accountNumber = this.getParam(request, 2)
    const loanSequence = this.getParam(request, 3)
    const role = this.getParam(request, 4)
    const phoneType = this.getParam(request, 5)
    const phoneCountryCode = this.getParam(request, 6)
    const phoneNumber = this.getParam(request, 7)
    const phoneExtension = this.getParam(request, 8)
    const phoneInvalidReason = this.getParam(request, 9)

    const phoneId = `PHONE${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(3, '0')}`

    const newPhone: CustomerPhone = {
      PhoneId: phoneId,
      CustomerId: customerId,
      PhoneType: phoneType,
      PhoneCountryCode: phoneCountryCode,
      PhoneNumber: phoneNumber,
      PhoneExtension: phoneExtension || '',
      PhoneInvalidReason: phoneInvalidReason || null,
      AccountNumber: accountNumber || '',
      LoanSequence: loanSequence || '',
      Role: role || '',
    }

    database.addPhone(newPhone)

    return {
      Result: {
        Table: [{ Column1: 1 }],
      },
    }
  }

  private handleUpdateCustomerPhone(
    request: StoredProcedureRequest,
  ): StoredProcedureResponse {
    const accountNumber = this.getParam(request, 2)
    const loanSequence = this.getParam(request, 3)
    const role = this.getParam(request, 4)
    const phoneType = this.getParam(request, 5)
    const phoneCountryCode = this.getParam(request, 6)
    const phoneNumber = this.getParam(request, 7)
    const phoneExtension = this.getParam(request, 8)
    const phoneInvalidReason = this.getParam(request, 9)
    const phoneId = this.getParam(request, 12)

    const success = database.updatePhone(phoneId, {
      PhoneType: phoneType,
      PhoneCountryCode: phoneCountryCode,
      PhoneNumber: phoneNumber,
      PhoneExtension: phoneExtension || '',
      PhoneInvalidReason: phoneInvalidReason || null,
      AccountNumber: accountNumber || '',
      LoanSequence: loanSequence || '',
      Role: role || '',
    })

    return {
      Result: {
        Table: [{ Column1: success ? 1 : 0 }],
      },
    }
  }

  private handleDeleteCustomerPhone(
    request: StoredProcedureRequest,
  ): StoredProcedureResponse {
    const phoneId = this.getParam(request, 0)
    const success = database.deletePhone(phoneId)

    return {
      Result: {
        Table: [{ Column1: success ? 1 : 0 }],
      },
    }
  }

  private handleGetFollowHistory(
    request: StoredProcedureRequest,
  ): StoredProcedureResponse {
    const nationalId = this.getParam(request, 2)
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

  private handleGetContactAmendmentHistory(
    request: StoredProcedureRequest,
  ): StoredProcedureResponse {
    const nationalId = this.getParam(request, 2)
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

  private handleGetNickname(
    request: StoredProcedureRequest,
  ): StoredProcedureResponse {
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

  private handleUpdateNickname(
    request: StoredProcedureRequest,
  ): StoredProcedureResponse {
    return {
      Result: {
        Table: [{ Column1: 1 }],
      },
    }
  }

  private handleGetReminderHistory(
    request: StoredProcedureRequest,
  ): StoredProcedureResponse {
    const accountNumber = this.getParam(request, 0)
    const loanSequence = this.getParam(request, 1)

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

  private handleDICalculator(
    request: StoredProcedureRequest,
  ): StoredProcedureResponse {
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
}
