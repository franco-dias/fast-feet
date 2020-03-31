import jwt from 'jsonwebtoken';
import * as yup from 'yup';

import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = yup.object().shape({
      email: yup
        .string()
        .email('the email is invalid.')
        .required('The email field is required.'),
      password: yup
        .string()
        .required('The password field is required.')
        .min(6, 'The password must have at least 6 characters.'),
    });

    try {
      await schema.validate(req.body);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    const { id, name } = user;
    const { secret, expiresIn } = authConfig;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, secret, { expiresIn }),
    });
  }
}

export default new SessionController();
