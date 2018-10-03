const Sequelize = require('sequelize')
const db = require('../db')

const Budget = db.define('budgets', {
	amount: {
		type: Sequelize.DECIMAL,
		allowNull: false
	},
	income: {
		type: Sequelize.DECIMAL
	},
	percentIncomeSaved: {
		type: Sequelize.DECIMAL,
		validate: {
			max: 100,
			min: 0
		},
		defaultValue: 15
	},
	mtdSpending: {
		type: Sequelize.DECIMAL,
		allowNull: false
	}
})

module.exports=Budget
