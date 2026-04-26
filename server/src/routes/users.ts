import { Role } from '@prisma/client';
import { Router } from 'express';
import { hashPassword } from 'better-auth/crypto';
import { createUserSchema } from 'core';
import prisma from '../db';
import { requireAdmin } from '../middleware/requireAdmin';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  res.json({ users });
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body ?? {});

  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message || 'Invalid user data.' });
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return res.status(409).json({ message: 'Email already exists.' });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        role: Role.agent,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    await tx.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: createdUser.id,
        providerId: 'credential',
        userId: createdUser.id,
        password: hashedPassword,
      },
    });

    return createdUser;
  });

  res.status(201).json({ user });
});

export default router;
