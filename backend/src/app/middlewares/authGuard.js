import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

export default async function authGuard(req, res, next) {
  const {
    headers: {
      authorization,
    },
  } = req;

  if (!authorization) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  const [, token] = authorization.split(' ');
  const { secret } = authConfig;
  try {
    const data = jwt.verify(token, secret);
    req.body.userId = data.id;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
}
