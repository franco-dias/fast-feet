
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('delivery_problems', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    delivery_id: {
      type: Sequelize.INTEGER,
      references: { model: 'deliveries', key: 'id' },
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('delivery_problems'),
};
