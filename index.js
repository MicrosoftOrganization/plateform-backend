const express = require('express')
const mongoose = require('mongoose')
const Instructor = require('./routes/instructor_route')
const Department = require('./routes/department_route')
const chat = require('./routes/chat_route')
const Member = require('./routes/member_route')
const Super_admin = require('./routes/super_admin_route')
const assignment = require('./routes/assignment_route') // Fixed typo
const session = require('./routes/session_route')
const dotenv = require('dotenv')
const response = require('./routes/response_route')
const attachment = require('./routes/attachment_route')
const user = require('./routes/user_route')
const test = require('./routes/test_route')
const helmet = require('helmet')
const rateLimiter = require('./rateLimiter')

dotenv.config()
// Intégration de Swagger à l'URL /api-docs
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger/swaggerConfig')

const app = express()
app.use(helmet())
app.use(rateLimiter)
const PORT = process.env.PORT || 8080

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
// fin Intégration de Swagger

const url = process.env.MONGODB_URL
mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to the database')
  })
  .catch(error => {
    console.error('Error connecting to the database:', error.message)
  })

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

app.use('/api/instructor', Instructor)
app.use('/api/member', Member)
app.use('/api/super_admin', Super_admin)
app.use('/api/session', session)
app.use('/api/assignment', assignment)
app.use('/api/attachment', attachment)
app.use('/api/response', response)
app.use('/api/user', user)
app.use('/api/department', Department)
app.use('/api/test', test)
app.use('/api/chats', chat)
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})
