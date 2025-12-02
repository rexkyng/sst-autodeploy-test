import { database, initializeDatabase } from '../../mock/data/database'
import { MockDataGenerator } from '../../mock/data/mockData'

let isInitialized = false

export function ensureDatabaseInitialized(): void {
  if (isInitialized) return

  initializeDatabase()
  console.log('Seeding initial customers...')
  MockDataGenerator.resetCounters()
  for (let i = 0; i < 5; i++) {
    const customer = MockDataGenerator.generateCompleteCustomer()
    database.createCustomer(customer)
  }
  console.log('Database seeded with initial data')
  console.log('Database stats:', database.getStats())
  
  isInitialized = true
}

