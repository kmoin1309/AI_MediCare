const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendMessage = async (to, body) => {
  await client.messages.create({
    body,
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${to}`,
  });
};

module.exports = { sendMessage };