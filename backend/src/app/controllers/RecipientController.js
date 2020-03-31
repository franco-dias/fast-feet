import * as yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { id } = req.query;
    if (!id) {
      const recipients = await Recipient.findAll();
      return res.json(recipients);
    }
    const recipient = await Recipient.findByPk(id);
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found.' });
    }
    return res.json(recipient);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      name: yup
        .string()
        .required('The name field is required.'),
      street: yup
        .string()
        .required('The x field is required.'),
      addressNumber: yup
        .string(),
      complement: yup
        .string(),
      city: yup
        .string()
        .required('The x field is required.'),
      state: yup
        .string()
        .required('The x field is required.'),
      cep: yup
        .string()
        .required('The x field is required.')
        .length(8, 'The cep field must have 8 characters.'),
    });

    try {
      await schema.validate(req.body);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const recipient = await Recipient.create({
      ...req.body,
      address_number: req.body.addressNumber,
    });

    return res.json({ recipient });
  }

  async update(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Recipient ID not provided.' });
    }
    const schema = yup.object().shape({
      name: yup
        .string(),
      street: yup
        .string(),
      addressNumber: yup
        .string(),
      complement: yup
        .string(),
      city: yup
        .string(),
      state: yup
        .string(),
      cep: yup
        .string()
        .length(8, 'The cep field must have 8 characters.'),
    });

    try {
      await schema.validate(req.body);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const recipient = await Recipient.findByPk(id);
    if (!recipient) {
      return res.status(400).json({ error: `Recipient with id ${id} does not exist.` });
    }

    const newRecipient = await recipient.update(req.body);
    return res.json({ recipient: newRecipient });
  }
}

export default new RecipientController();
