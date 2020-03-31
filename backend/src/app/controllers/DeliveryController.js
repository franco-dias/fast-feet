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
        attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
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
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
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

    const { deliveryman_id, recipient_id } = req.body;

    const deliveryMan = await DeliveryMan.findByPk(deliveryman_id);
    if (!deliveryMan) {
      return res.status(400).json({ error: 'The delivery man does not exist.' });
    }
    const recipient = await Recipient.findByPk(recipient_id);
    if (!recipient) {
      return res.status(400).json({ error: 'The recipient does not exist.' });
    }

    const delivery = await Delivery.create(req.body);
    return res.json(delivery);
  }

  async update(req, res) {
    return res.json({ ok: true });
  }

  async delete(req, res) {
    return res.json({ ok: true });
  }
}

export default new DeliveryController();
