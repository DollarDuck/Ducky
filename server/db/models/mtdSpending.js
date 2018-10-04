const Sequelize = require('sequelize')
const db = require('../db')

const MtdSpending = db.define('mtdSpending', {
	amount: {
		type: Sequelize.DECIMAL,
		allowNull: false
	},
	month: {
		type: Sequelize.INTEGER,
		validate: {
			min: 1,
			max: 12
		}
	},
	year: {
		type: Sequelize.INTEGER,
		min: 2018
	}
})

module.exports = MtdSpending