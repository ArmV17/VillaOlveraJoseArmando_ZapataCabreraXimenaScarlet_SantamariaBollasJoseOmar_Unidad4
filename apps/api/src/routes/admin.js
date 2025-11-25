import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authRequired, requireRole } from '../middlewares/auth.js'

const prisma = new PrismaClient()
const router = express.Router()

// Listar usuarios (ADMIN)
router.get('/users', authRequired, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({ select: { id:true, email:true, name:true, role:true, createdAt:true } })
    res.json(users)
  } catch (e) { next(e) }
})

// Eliminar usuario (ADMIN)
router.delete('/users/:id', authRequired, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    // borrar primero reportes del usuario para mantener FK en SQLite
    await prisma.report.deleteMany({ where: { userId: id } })
    await prisma.user.delete({ where: { id } })
    res.json({ ok: true })
  } catch (e) { next(e) }
})

export default router
