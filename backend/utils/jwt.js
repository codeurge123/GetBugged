import jwt from 'jsonwebtoken';

export function generateToken(user) {
  // user should contain at least id and email
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}
