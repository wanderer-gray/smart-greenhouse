const nodemailer = require('nodemailer')

const sendMail = async (mail, transporter) => {
  const info = await transporter.sendMail(mail)

  const testMessageUrl = nodemailer.getTestMessageUrl(info)

  if (testMessageUrl) {
    console.log(`Mailer: Preview URL - ${testMessageUrl}`)
  }
}

const sendMailNoWait = async (mail, transporter) => {
  try {
    await sendMail(mail, transporter)
  } catch (err) {
    console.error(`Mailer: Error - ${err}`)
  }
}

async function mailer (fastify, options) {
  const transporter = nodemailer.createTransport(options)

  fastify.decorate('mailer', {
    sendMail: (mail) => sendMail(mail, transporter),
    sendMailNoWait: (mail) => sendMailNoWait(mail, transporter)
  })
}

module.exports = require('fastify-plugin')(mailer)
