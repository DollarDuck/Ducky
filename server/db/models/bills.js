const Sequelize = require('sequelize')
const db = require('../db')

const Bill = db.define('bills', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	type: {
		type: Sequelize.STRING
	},
	dueDate: {
		type: Sequelize.DATEONLY
	},
	recurring: {
		type: Sequelize.STRING,
		validate: {
			isIn: [['quarterly', 'monthly', 'yearly', '']]
		}
	},
	paid: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	amount: {
		type: Sequelize.DECIMAL,
		allowNull: false
	}
}
)

module.exports = Bill
