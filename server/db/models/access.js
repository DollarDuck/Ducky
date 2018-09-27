const Sequelize = require('sequelize')
const db = require('../db')

const AccessToken = db.define('accessToken', {
	itemId: {
		type: Sequelize.STRING,
		allowNull: false
	},
	token: {
		type: Sequelize.STRING,
		allowNull: false
	},
	bank: {
		type: Sequelize.STRING
	}
}
)

module.exports = AccessToken