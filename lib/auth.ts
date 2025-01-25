import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { signJWT } from '@/lib/jwt';

export async function authenticate(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Please enter an email and password');
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      image: true,
      is_admin: true,
    }
  });

  if (!user || !user.password) {
    throw new Error('No user found');
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  // Remove password from user object
  const { password: _, ...userWithoutPassword } = user;

  // Create JWT token with necessary claims
  const token = await signJWT(
    {
      sub: user.id,
      email: user.email,
      is_admin: user.is_admin,
      type: 'access'
    },
    { expiresIn: '1d' }
  );

  return {
    token,
    user: userWithoutPassword
  };
} 