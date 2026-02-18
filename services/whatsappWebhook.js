
/**
 * Prescription WhatsApp Webhook (Express.js Example)
 * This would run on a separate Node.js server to handle Twilio/Meta webhooks.
 */
const express = require('express');
const { GoogleGenAI } = require("@google/genai");
const axios = require('axios');

const app = express();
app.use(express.urlencoded({ extended: false }));

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

app.post('/whatsapp-webhook', async (req, res) => {
  const from = req.body.From;
  const mediaUrl = req.body.MediaUrl0;

  if (!mediaUrl) {
    return res.status(200).send('No media detected.');
  }

  try {
    // 1. Download image from WhatsApp
    const imageResponse = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(imageResponse.data).toString('base64');

    // 2. Call Gemini for WhatsApp-optimized summary
    const model = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: "Analyze this medical document. Provide a short WhatsApp message (max 500 chars) explaining: 1. What it is. 2. Jargon explained simply. 3. Cheaper generic medicines if prescription. 4. Overcharge warning if bill. Use Emojis." }
        ]
      }
    });

    const aiResponse = await model;
    const messageText = aiResponse.text;

    // 3. Send response back to user via Twilio
    // twilioClient.messages.create({ from: 'whatsapp:+14155238886', to: from, body: messageText });

    res.status(200).send('Processed');
  } catch (error) {
    console.error('WhatsApp Process Error:', error);
    res.status(200).send('Error');
  }
});

module.exports = app;