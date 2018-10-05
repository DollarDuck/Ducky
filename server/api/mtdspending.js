const router = require('express').Router()
const {MtdSpending} = require('../db/models')
module.exports = router

router.post('/:userId', async (req, res, next) => {
	const spending = await MtdSpending.findAll({
		where: {
			month: req.body.currentMonth,
			year: req.body.currentYear,
			userId: req.params.userId
		}
	})
	res.json(spending)
})