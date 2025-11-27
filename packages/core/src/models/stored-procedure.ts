export interface StoredProcedureRequest {
  Provider: string
  Command: {
    Text: string
    Type: string
    Parameters: any[]
  }
}

export interface StoredProcedureResponse {
  Result?: {
    Table?: any[]
    Table1?: any[]
    Column1?: string
  }
  Parameters?: any[]
  error?: string
}
