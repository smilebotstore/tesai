import { sanitizeInput } from '../../utils/sanitize';

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

    // Limit message length and sanitize content
    const sanitizedMessages = messages.map(msg => {
      if (!msg.content || typeof msg.content !== 'string') {
        throw new Error('Invalid message content');
      }
      if (msg.content.length > 2000) {
        throw new Error('Message too long');
      }
      return {
        role: msg.role,
        content: sanitizeInput(msg.content),
      };
    });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: sanitizedMessages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error || 'API request failed' });
    }

    const data = await response.json();

    // Return only the latest assistant message
    const assistantMessage = data.choices?.[0]?.message || null;

    if (!assistantMessage) {
      return res.status(500).json({ error: 'No assistant message returned' });
    }

    // Sanitize AI output before sending
    assistantMessage.content = sanitizeInput(assistantMessage.content);

    res.status(200).json({ message: assistantMessage });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
