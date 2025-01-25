import * as jose from 'jose';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signJWT(payload: any, options: { expiresIn: string }) {
  try {
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(options.expiresIn)
      .sign(secret);
    
    return jwt;
  } catch (error) {
    console.error('Error signing JWT:', error);
    throw error;
  }
}

export async function verifyJWT<T>(token: string): Promise<T> {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as T;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    throw error;
  }
} 