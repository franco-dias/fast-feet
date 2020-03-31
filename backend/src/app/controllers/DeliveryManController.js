import * as yup from 'yup';

import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryManController {
  async index(req, res) {
    const { id } = req.query;

    if (!id) {
      const deliveryMen = await DeliveryMan.findAll({
        attributes: ['id', 'name', 'email', 'avatar_id'],
        include: {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      });
      return res.json(deliveryMen);
    }

    const deliveryMen = await DeliveryMan.findByPk(id, {
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: {
        model: File,
        as: 'avatar',
        attributes: ['id', 'name', 'path', 'url'],
      },
    });

    if (!deliveryMen) {
      return res.status(400).json({ error: 'Delivery man not found.' });
    }
    return res.json(deliveryMen);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required('The name field is required.'),
      email: yup
        .string()
        .email('The provided email is not valid.')
        .required('The email field is required.'),
      avatar_id: yup.number(),
    });

    try {
      await schema.validate(req.body);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const { email, avatar_id } = req.body;

    const alreadyExists = await DeliveryMan.findOne({
      where: {
        email,
      },
    });

    if (alreadyExists) {
      return res.status(400).json({
        error: 'There is already a delivery man with this email address.',
      });
    }

    const file = await File.findByPk(avatar_id);

    if (!file) {
      return res.status(400).json({ error: 'The avatar does not exist.' });
    }

    const deliveryMan = await DeliveryMan.create(req.body);

    return res.json(deliveryMan);
  }

  async update(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Delivery man ID not provided.' });
    }

    const schema = yup.object().shape({
      id: yup.number(),
      email: yup.string().email('The provided email is not valid.'),
    });

    const { email } = req.body;

    try {
      await schema.validate({
        id,
        email,
      });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const deliveryMan = await DeliveryMan.findByPk(id);

    if (!deliveryMan) {
      return res.status(400).json({ error: `Delivery man with id ${id} does not exist.` });
    }

    const emailExists = await DeliveryMan.findOne({
      where: {
        email,
      },
    });

    if (emailExists && emailExists.id !== Number(id)) {
      return res.status(400).json({
        error: 'There is already a delivery man with this email address.',
      });
    }

    const newDeliveryMan = await deliveryMan.update(req.body);

    return res.json(newDeliveryMan);
  }

  async delete(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Delivery man ID not provided.' });
    }

    const schema = yup.object().shape({
      id: yup.number(),
    });

    try {
      await schema.validate({ id });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const deliveryMan = await DeliveryMan.findByPk(id);
    if (!deliveryMan) {
      return res.status(400).json({ error: `Delivery man with id ${id} does not exist.` });
    }

    await deliveryMan.destroy();

    return res.json({ message: 'The delivery man has been deleted.' });
  }
}

export default new DeliveryManController();
