import Mail from '../../lib/Mail';

class CanceledDeliveryMail {
  get key() {
    return 'CanceledDeliveryMail';
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
      subject: 'Entrega cancelada',
      template: 'canceledDelivery',
      context: {
        deliveryMan: deliveryMan.name,
        recipient: name,
        address: `${street}, ${address_number}, ${city} - ${state}`,
        description,
      },
    });
  }
}

export default new CanceledDeliveryMail();
