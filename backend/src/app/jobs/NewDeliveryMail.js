import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const {
      delivery: { description, deliveryMan, recipient },
    } = data;

    const {
      name, street, address_number, city, state,
    } = recipient;

    await Mail.sendMail({
      to: `${deliveryMan.name} <${deliveryMan.email}>`,
      subject: 'Nova entrega registrada',
      template: 'newDelivery',
      context: {
        deliveryMan: deliveryMan.name,
        recipient: name,
        address: `${street}, ${address_number}, ${city} - ${state}`,
        description,
      },
    });
  }
}

export default new NewDeliveryMail();
