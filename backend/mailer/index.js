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
  const transport = Object.keys(options).length ? options : await testOptions()

  const transporter = nodemailer.createTransport(transport)

  fastify.decorate('mailer', {
    sendMail: (mail) => sendMail(mail, transporter),
    sendMailNoWait: (mail) => sendMailNoWait(mail, transporter)
  })
}

module.exports = require('fastify-plugin')(mailer)
