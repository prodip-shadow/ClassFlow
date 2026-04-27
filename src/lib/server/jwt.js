import { SignJWT, jwtVerify } from 'jose';

const APP_ISSUER = 'classflow-app';
const APP_AUDIENCE = 'classflow-client';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters long');
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(APP_ISSUER)
    .setAudience(APP_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: APP_ISSUER,
      audience: APP_AUDIENCE,
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}
