const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'task-app@fakenews.com',
    subject: 'Thank you for joining our cult!',
    text: `Welcome to the cult, ${name}.`
  })
}

const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'task-app@fakenews.com',
    subject: `You think you're better than us?`,
    text: `We know where you live, ${name}.`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail
}