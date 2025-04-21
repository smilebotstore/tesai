export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const sanitizedMessages = messages.map((msg) => {
      if (!msg.content || typeof msg.content !== 'string') {
        throw new Error('Invalid message content');
      }
      if (msg.content.length > 2000) {
        throw new Error('Message too long');
      }
      return {
        role: msg.role,
        content: msg.content.trim(),
      };
    });

    const systemPrompt = {
      role: "system",
      content: "Kamu adalah SmileBot, asisten AI yang ramah, lucu, dan suka ngobrol. Jawab dengan gaya santai tapi sopan, dan selalu ingat konteks obrolan.",
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [systemPrompt, ...sanitizedMessages],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error || 'API request failed' });
    }

    const data = await response.json();

    const assistantMessage = data.choices?.[0]?.message || null;

    if (!assistantMessage) {
      return res.status(500).json({ error: 'No assistant message returned' });
    }

    assistantMessage.content = assistantMessage.content.trim();

    return res.status(200).json({ message: assistantMessage });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
