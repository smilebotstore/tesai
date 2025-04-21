# Next.js Groq GPT-4 Chatbot

This is a fullstack AI chatbot built with Next.js (Pages Router), React, and Tailwind CSS. It uses the Groq GPT-4 API for AI responses and is fully deployable on Vercel.

## Features

- ChatGPT-style UI with left/right aligned chat bubbles
- AI messages in white bubbles, user messages in green bubbles
- Typing animation when AI is responding
- Regenerate Response and Clear Chat buttons
- Input sanitization and XSS prevention
- Responsive design for mobile and desktop
- Uses Inter font for modern look
- Backend API route calling Groq GPT-4 API
- Environment variables for API key management
- Fully deployable on Vercel

## Setup

1. Clone the repository

2. Install dependencies

```bash
npm install
```

3. Create `.env.local` file based on `.env.example` and add your Groq API key

```
GROQ_API_KEY=your_groq_api_key_here
```

4. Run the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app

## Deployment

This app is ready to deploy on Vercel. Simply push your code to a Git repository and import the project in Vercel. Set the `GROQ_API_KEY` environment variable in Vercel dashboard.

The frontend and backend API run on the same domain, no additional setup needed.

## Security

- All user inputs are sanitized and escaped to prevent XSS
- Message length is limited to prevent spam
- `.env.local` is ignored by git to keep API keys safe

## License

MIT
