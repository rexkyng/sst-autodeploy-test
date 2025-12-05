// CRM functions
export {
  getDebtorInfo,
  searchCustomers,
  getCustomerDetails,
  submitWrapup,
} from './crm'

// Data functions
export { executeStoredProcedure } from './data'

// Main/System functions
export { getHealth, getMe } from './main'
export type { HealthResponse, UserResponse } from './main'

// Errors
export { FunctionError } from './errors'
export type { ErrorResponse } from './errors'

// Database initialization
export { ensureDatabaseInitialized, resetDatabaseInitialization } from './database-init'

// Mock data (for use by functions package)
export { database, initializeDatabase } from './mock/database'
export { MockDataGenerator } from './mock/mockData'
