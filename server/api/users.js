const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email', 'firstName', 'lastName', 'phoneNumber']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  console.log('req body', req.body)
  const {firstName, lastName, email, password, phoneNumber} = req.body
  try {
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber
    })
    res.json(newUser)
  }
  catch(err) {
    next(err)
  }
})

router.put('/userInfo/:userId', async (req, res, next) => {
  try {
    const user = await User.update({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber
    }, {
      where: {
        id: req.params.userId
    },
    returning: true })
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.put('/:userId', async (req, res, next) => {
  try {
    const user = await User.update({ lastUpdated: Date.now()}, { where: {id: req.params.userId}, returning: true
    })
    res.json(user)
  } catch (err) {
    next(err)
  }
})
