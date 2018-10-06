const router = require('express').Router()
const twilio = require('twilio')
const {MessagingResponse} = twilio.twiml
const {User} = require('../db/models')
const {billQuery, budgetQuery, spendingQuery} = require('../services/twilio')

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

//OUTBOUND MESSAGES
client.messages.create({
    body: 'What would you like to ask about today? Please choose bills or budgets, or try typing a business name.',
    to: '+12313604308',  // Text this number
    from: '+13124873258' // our Twilio number
})
.then((message) => console.log(message.sid))


//INBOUND MESSAGES
router.post('/sms', async (req, res) => {
    //this post handles incoming req from twilio
    const userNumber = req.body.From.slice(2)
    const userMessage = req.body.Body

    const user = await User.findOne({where: {phoneNumber: userNumber}}, {
          attributes: ['id', 'firstName']
        })

    if (userMessage.includes('Bills')) {
        var reply = await billQuery(user)
    } else if (userMessage.includes('Budgets')) {
        var reply = await budgetQuery(user)
    } else {
        var reply = await spendingQuery(user, userMessage)
    }
    let message = ''
    reply.forEach(item => {message += item + ' '})

    const twiml = new MessagingResponse()

    twiml.message(message)
    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString())
})

module.exports = router
