const nodemailer = require('nodemailer')

const testOptions = async () => {
  const testAccount = await nodemailer.createTestAccount()

  const {
    smtp: {
      host,
      port,
      secure
    },
    user,
    pass
  } = testAccount

  return {
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  }
}

const sendMail = async (transporter, mail) => {
  const info = await transporter.sendMail(mail)

  const testMessageUrl = nodemailer.getTestMessageUrl(info)

  if (testMessageUrl) {
    console.log(`Preview URL: ${testMessageUrl}`)
  }
}

const sendMailNoWait = async (transporter, mail) => {
  try {
    await sendMail(transporter, mail)
  } catch (error) {
    console.error(error)
  }
}

async function mailer (fastify, options) {
  const transport = Object.keys(options).length ? options : await testOptions()

  const transporter = nodemailer.createTransport(transport)

  fastify.decorate('mailer', {
    sendMail: (mail) => sendMail(transporter, mail),
    sendMailNoWait: (mail) => sendMailNoWait(transporter, mail)
  })
}

module.exports = require('fastify-plugin')(mailer)
