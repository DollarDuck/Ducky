const Sequelize = require('sequelize')
const db = require('../db')

const Transaction = db.define('transactions', {
	amount: {
		type: Sequelize.DECIMAL,
	},
	name: {
		type: Sequelize.STRING
	},
	date: {
		type: Sequelize.DATE
	},
	accountId: {
		type: Sequelize.STRING
	}
})

module.exports = Transaction