
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('deliveries', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    recipient_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'recipients', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    deliveryman_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'deliverymen', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    signature_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    product: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    canceled_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },

  }),

  down: (queryInterface) => queryInterface.dropTable('deliveries'),
};
