const Sequelize = require('sequelize')
const db = require('../db')

const Balances = db.define('balances', {
	amount: {
		type: Sequelize.DECIMAL,
	},
	amountAvailable: {
		type: Sequelize.DECIMAL
	},
	date: {
		type: Sequelize.DATE
	},
	accountId: {
		type: Sequelize.STRING
	},
	name: {
		type: Sequelize.STRING
  },
  officialName: {
		type: Sequelize.STRING
  },
  subtype: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  }
})

module.exports = Balances
