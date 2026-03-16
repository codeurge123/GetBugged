import jwt from 'jsonwebtoken';

// Accept a Mongoose user document or an object with _id/id/email/name/picture
export function generateToken(user) {
  const id = user.id ?? user._id;
  const payload = {
    id,
    email: user.email,
    name: user.name,
    picture: user.picture,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}
