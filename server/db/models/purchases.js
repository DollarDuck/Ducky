const Sequelize = require('sequelize')
const db = require('../db')

const Purchase = db.define('purchases', {
	amount: {
		type: Sequelize.DECIMAL,
		allowNull: false
	},
	name: {
    type: Sequelize.STRING,
    allowNull: false
	},
	eventDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  amountSaved: {
    type: Sequelize.DECIMAL
  },
  imageUrl: {
    type: Sequelize.STRING
  }
})

module.exports = Purchase
