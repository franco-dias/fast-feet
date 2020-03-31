import * as yup from 'yup';
import { Op } from 'sequelize';
import {
  isBefore, startOfDay, endOfDay,
} from 'date-fns';

import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryHandlingController {
  async index(req, res) {
    const { deliveryManId } = req.params;

    const schema = yup.object().shape({
      id: yup.number(),
    });
    try {
      await schema.isValid({ deliveryManId });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const deliveryMan = await DeliveryMan.findByPk(deliveryManId);
    if (!deliveryMan) {
      return res.status(400).json({ error: 'The delivery man does not exist.' });
    }

    const { delivered } = req.query;

    let whereObject = {};

    if (Number(delivered) === 1) {
      whereObject = {
        end_date: {
          [Op.not]: null,
        },
      };
    } else {
      whereObject = {
        canceled_at: null,
        end_date: null,
      };
    }

    const includeObject = [
      {
        model: DeliveryMan,
        as: 'deliveryMan',
        attributes: ['id', 'name', 'email'],
      },
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
    ];

    const deliveries = await Delivery.findAll({
      where: {
        ...whereObject,
        deliveryman_id: deliveryManId,
      },
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: includeObject,
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = yup.object().shape({
      deliveryManId: yup.number(),
      deliveryId: yup.number(),
      setStart: yup.boolean(),
      setEnd: yup.boolean(),
      cancel: yup.boolean(),
    });

    const schemaTest = {
      ...req.params,
      ...req.body,
    };

    try {
      await schema.validate(schemaTest);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const { deliveryManId, deliveryId } = req.params;

    // basic verifications

    const deliveryMan = await DeliveryMan.findByPk(deliveryManId);
    if (!deliveryMan) {
      return res.status(400).json({ error: 'There is no delivery man with the requested id.' });
    }

    const delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) {
      return res.status(400).json({ error: 'There is no delivery with the requested id.' });
    }

    if (delivery.deliveryman_id !== Number(deliveryManId)) {
      return res.status(400).json({
        error: `Delivery ${deliveryId} is not assigned to delivery man ${deliveryManId}.`,
      });
    }

    // cancelation verifications

    if (delivery.canceled_at || delivery.end_date) {
      return res.status(400).json({
        error: "The delivery has been canceled or finished, and can't be edited.",
      });
    }

    const { setStart, setEnd, cancel } = req.body;
    const currentDate = new Date();

    if (cancel) {
      await delivery.update({ canceled_at: new Date() });
      return res.json(delivery);
    }


    // set start verifications

    if (setStart) {
      if (delivery.start_date) {
        return res.status(400).json({ error: 'The package has already been collected.' });
      }
      const deliveryManDeliveries = await Delivery.findAll({
        where: {
          deliveryman_id: deliveryManId,
          start_date: {
            [Op.between]: [startOfDay(currentDate), endOfDay(currentDate)],
          },
        },
      });
      if (deliveryManDeliveries.length >= 5) {
        return res.status(401).json({ error: 'You have collected the daily limit of packages.' });
      }
      const newDelivery = await delivery.update({ start_date: new Date() });
      return res.json(newDelivery);
    }

    // set end verifications

    if (setEnd && !delivery.start_date) {
      return res.status(401).json({
        error: "Can't set the delivery as finished, because the package was not collected yet.",
      });
    }

    if (isBefore(new Date(), delivery.start_date)) {
      return res.status(401).json({
        error: "The delivery end date can't be lower than the start date.",
      });
    }

    const { filename: path, originalname: name } = req.file;
    const file = await File.create({
      name,
      path,
    });

    const newDelivery = await delivery.update({
      end_date: new Date(),
      signature_id: file.id,
    });


    return res.json(newDelivery);
  }
}

export default new DeliveryHandlingController();
