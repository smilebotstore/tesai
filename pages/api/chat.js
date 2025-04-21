const formidable = require('formidable');
const fs = require('fs');

export const config = {
  api: {
    bodyParser: false, // wajib dimatikan supaya bisa handle FormData (multipart)
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to parse form data' });
      }

      const input = (fields.input || '').toString().trim();
      const image = files.image;

      // Validasi pesan
      if (input.length > 2000) {
        return res.status(400).json({ error: 'Message too long' });
      }

      // Buat array message seperti biasa
      const messages = [
        {
          role: 'user',
          content: input || '[User sent a message]',
        },
      ];

      // Kalau ada gambar, tambahkan info tambahan
      if (image) {
        messages.push({
          role: 'user',
          content: '[User uploaded an image, please describe or respond as if you saw it.]',
        });
      }

      // System prompt (konteks AI SmileBot)
      const systemPrompt = {
        role: 'system',
        content:
          'Kamu adalah SmileBot, asisten AI yang ramah, lucu, dan suka ngobrol. Jawab dengan gaya santai tapi sopan, dan selalu ingat konteks obrolan.',
      };

      // Kirim ke Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [systemPrompt, ...messages],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({
          error: errorData.error || 'API request failed',
        });
      }

      const data = await response.json();
      const assistantMessage = data.choices?.[0]?.message;

      if (!assistantMessage) {
        return res.status(500).json({ error: 'No assistant message returned' });
      }

      assistantMessage.content = assistantMessage.content.trim();

      return res.status(200).json({ message: assistantMessage });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || 'Internal Server Error' });
  }
}
