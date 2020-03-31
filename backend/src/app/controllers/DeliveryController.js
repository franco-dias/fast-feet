import * as yup from 'yup';

import Delivery from '../models/Delivery';

import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryController {
  async index(req, res) {
    const { id } = req.query;

    const include = [
      {
        model: File,
        as: 'signature',
        attributes: ['id', 'name', 'path', 'url'],
      },
      {
        model: Recipient,
        as: 'recipient',
        attributes: [
          'id',
          'name',
          'street',
          'complement',
          'address_number',
          'state',
          'city',
          'cep',
        ],
      },
      {
        model: DeliveryMan,
        as: 'deliveryMan',
        attributes: [
          'id',
          'name',
          'email',
        ],
      },
    ];

    if (!id) {
      const deliveries = await Delivery.findAll({
        include,
      });
      return res.json(deliveries);
    }

    const schema = yup.object().shape({ id: yup.number() });

    try {
      await schema.isValid({ id });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const delivery = await Delivery.findByPk(id, {
      include,
    });

    return res.json(delivery);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      recipient_id: yup.number().required('The recipient_id field is required.'),
      deliveryman_id: yup.number().required('The deliveryman_id field is required.'),
      product: yup.string().required('The product field is required.'),
    });

    try {
      await schema.isValid(req.body);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    return res.json({ ok: true });
  }

  async update(req, res) {
    return res.json({ ok: true });
  }

  async delete(req, res) {
    return res.json({ ok: true });
  }
}

export default new DeliveryController();
