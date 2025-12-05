import { createApp } from './app'

const PORT = process.env.PORT || 3000

const app = createApp()

app.listen(PORT, () => {
  console.log(`TSOA server running on http://localhost:${PORT}`)
  console.log(`API docs available at http://localhost:${PORT}/api/doc/ui`)
})

