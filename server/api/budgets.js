// const router = require('express').Router()
// const {Budget} = require('../db/models')
// module.exports = router

// router.get('/', async (req, res, next) => {
//   try {
//     const users = await User.findAll({
//       // explicitly select only the id and email fields - even though
//       // users' passwords are encrypted, it won't help if we just
//       // send everything to anyone who asks!
//       attributes: ['id', 'email']
//     })
//     res.json(users)
//   } catch (err) {
//     next(err)
//   }
// })

// router.post('/', async (req, res, next) => {
//   const {email, password, phoneNumber} = req.body
//   try {
//     const newUser = await User.create({
//       email,
//       password,
//       phoneNumber
//     })
//     res.json(newUser)

//   } catch (err) {
//     next(err)
//   }
// })