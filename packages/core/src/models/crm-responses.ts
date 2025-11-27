import { CustomerDetails } from './customer'

export interface CustomerSearchResponse {
  Customer: {
    NationalIdType: string
    NationalId: string
    Nickname: string
    Surname: string
    GivenName: string
  }[]
}

export interface WrapupResponse {
  success: boolean
  message: string
  processedAt: string
  accountsProcessed: number
}

export interface CustomerDetailsResponse extends CustomerDetails {
  CustomerNickname: string
}
