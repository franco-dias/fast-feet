import * as yup from 'yup';

import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';

class DeliveryProblemController {
  async index(req, res) {
    const { deliveryId } = req.params;

    if (!deliveryId) {
      const deliveries = await Delivery.findAll({
        include: [
          {
            model: DeliveryProblem,
            as: 'problems',
            required: true,
            attributes: ['id', 'description', 'created_at'],
          },
          {
            model: DeliveryMan,
            as: 'deliveryMan',
            attributes: ['id', 'name', 'email'],
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
              'city', 'cep',
            ],
          },
        ],
        attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      });
      return res.json(deliveries);
    }

    const schema = yup.object().shape({ id: yup.number() });
    try {
      await schema.isValid({ id: deliveryId });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const deliveryProblems = await Delivery.findByPk(deliveryId, {
      include: {
        model: DeliveryProblem,
        as: 'problems',
        attributes: ['id', 'description', 'created_at'],
      },
    });

    if (!deliveryProblems) {
      return res.status(400).json({ error: 'The requested delivery does not exist.' });
    }

    return res.json(deliveryProblems.problems);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      delivery_id: yup.number().required('The delivery_id field is required.'),
      description: yup.string().required('The description field is required.'),
    });

    const { description } = req.body;
    const { deliveryId: delivery_id } = req.params;

    const payload = {
      description,
      delivery_id,
    };

    try {
      await schema.validate(payload);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const problem = await DeliveryProblem.create(payload);
    return res.json(problem);
  }

  async delete(req, res) {
    const schema = yup.object().shape({ id: yup.number() });

    const { deliveryId } = req.params;

    try {
      await schema.validate({ id: deliveryId });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) {
      return res.status(400).json({ error: 'The requested delivery does not exist.' });
    }

    if (delivery.end_date) {
      return res.status(400).json({
        error: "The delivery has been finished and can't be canceled.",
      });
    }

    const newDelivery = await delivery.update({ canceled_at: new Date() });

    return res.json(newDelivery);
  }
}

export default new DeliveryProblemController();
