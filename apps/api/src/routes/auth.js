import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { registerSchema, loginSchema } from '../utils/validation.js'

const router = express.Router()
const prisma = new PrismaClient()

router.post('/register', async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.message })
    const exists = await prisma.user.findUnique({ where: { email: value.email } })
    if (exists) return res.status(409).json({ error: 'Email ya registrado' })
    const hash = await bcrypt.hash(value.password, 10)
    const user = await prisma.user.create({
      data: { email: value.email, password: hash, name: value.name, role: 'USER' }
    })
    res.status(201).json({ id: user.id, email: user.email })
  } catch (e) { next(e) }
})

router.post('/login', async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.message })
    const user = await prisma.user.findUnique({ where: { email: value.email } })
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })
    const ok = await bcrypt.compare(value.password, user.password)
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' })
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' })
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch (e) { next(e) }
})

export default router
