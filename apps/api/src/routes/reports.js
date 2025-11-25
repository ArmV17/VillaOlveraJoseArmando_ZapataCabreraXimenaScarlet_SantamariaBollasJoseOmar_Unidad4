import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authRequired, requireRole } from '../middlewares/auth.js'
import { reportSchema } from '../utils/validation.js'

const prisma = new PrismaClient()
const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { status, category } = req.query
    const where = {}
    if (status) where.status = status
    if (category) where.category = category
    const reports = await prisma.report.findMany({ where, orderBy: { createdAt: 'desc' } })
    res.json(reports)
  } catch (e) { next(e) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const report = await prisma.report.findUnique({ where: { id } })
    if (!report) return res.status(404).json({ error: 'No encontrado' })
    res.json(report)
  } catch (e) { next(e) }
})

router.post('/', authRequired, async (req, res, next) => {
  try {
    const { value, error } = reportSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.message })
    const report = await prisma.report.create({
      data: { ...value, userId: req.user.id }
    })
    res.status(201).json(report)
  } catch (e) { next(e) }
})

router.put('/:id', authRequired, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const { value, error } = reportSchema.validate(req.body, { allowUnknown: true })
    if (error) return res.status(400).json({ error: error.message })
    const exists = await prisma.report.findUnique({ where: { id } })
    if (!exists) return res.status(404).json({ error: 'No encontrado' })
    if (exists.userId !== req.user.id && req.user.role !== 'ADMIN')
      return res.status(403).json({ error: 'Prohibido' })
    const updated = await prisma.report.update({ where: { id }, data: value })
    res.json(updated)
  } catch (e) { next(e) }
})

// ADMIN: cerrar reporte
router.patch('/:id/close', authRequired, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const exists = await prisma.report.findUnique({ where: { id } })
    if (!exists) return res.status(404).json({ error: 'No encontrado' })
    const updated = await prisma.report.update({ where: { id }, data: { status: 'closed' } })
    res.json(updated)
  } catch (e) { next(e) }
})

export default router
