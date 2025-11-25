import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

import authRouter from './routes/auth.js'
import reportsRouter from './routes/reports.js'
import utilsRouter from './routes/utils.js'
import adminRouter from './routes/admin.js'

const app = express()
const swaggerDocument = YAML.load('./swagger.yaml')

app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin: CORS_ORIGIN }))

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 })
app.use('/api/auth/login', loginLimiter)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api/auth', authRouter)
app.use('/api/reports', reportsRouter)
app.use('/api/utils', utilsRouter)
app.use('/api/admin', adminRouter)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
