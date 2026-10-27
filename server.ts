import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Server-side Gemini API Route
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const { messages, userRole, memberName } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      const systemInstruction = `You are the TM Sports AI Coach & Club Concierge, an expert martial arts, athletic performance, and membership advisor for TM Sports (USA & Canada Athletics).
Club Information:
- Taekwondo: Led by Master Jin-Woo Park (4th Dan certified Kukkiwon). We offer Youth Taekwondo (Ages 5-12, White to Blue belts) and Adult Sparring & Poomsae.
- Olympic WT Sparring Rules: 1 pt for punch to trunk, 2 pts for kick to trunk protector, 3 pts for high kick to helmet, 4-5 pts for spinning/turning kicks to head, Gam-Jeom penalty awards +1 pt to opponent.
- Tournaments & Events: State Youth & Cadet Taekwondo Championship (Nov 14), Kids Quarterly Belt Exam (Nov 14), Autumn Black Belt Invitational (Nov 21), Cascade Ridge Hike 11.8km (Nov 7), Black Bear Peak Summit 16.4km (Nov 22).
- Other programs: Group Aerobics & HIIT with Coach Elena Ramos ($65/mo), Strength & Barbell Power with Coach Marcus Vance ($85/mo), Open Gym 05:00 AM – 11:00 PM ($50/mo), Outdoor Hikes led by Wilderness EMT David Miller.
- Membership options: Full Access $140/mo, Single Discipline $65-90/mo. Online Stripe payment or in-person cash/debit at the facility desk.
- Active User Context: Role: ${userRole || 'visitor'}, Member: ${memberName || 'Guest'}.

Tone: Encouraging, energetic, disciplined, athletic, and concise. Format with bullet points for readability when explaining rules, schedules, or workouts. Always invite them to reserve a class or check the live leaderboard.`;

      if (!apiKey) {
        // High quality fallback if GEMINI_API_KEY is not configured
        const lastUserMsg = messages[messages.length - 1]?.content || '';
        let fallbackReply = `Welcome to TM Sports! I'm your AI Coach & Club Concierge.\n\n`;
        const lower = lastUserMsg.toLowerCase();
        if (lower.includes('sparring') || lower.includes('taekwondo') || lower.includes('point') || lower.includes('rule')) {
          fallbackReply += `In Olympic World Taekwondo (WT) sparring:\n• **1 pt**: Punch to trunk protector\n• **2 pts**: Turning or roundhouse kick to chest sensor\n• **3 pts**: High kick to headgear\n• **4-5 pts**: Spinning hook or turning kick to head\n• Every tournament match win grants **+25 Sparring Points** on our club leaderboard!`;
        } else if (lower.includes('hike') || lower.includes('mountain') || lower.includes('trail')) {
          fallbackReply += `Our upcoming trail expeditions:\n• **Cascade Ridge & Pine Valley Trail**: Nov 07 at 07:30 AM (11.8 km loop, 540m gain, Moderate, FREE for members)\n• **Black Bear Peak Summit**: Nov 22 at 06:45 AM (16.4 km alpine push, 920m gain, $25 permit)\nBoth award **+15 Event Points** on your member profile!`;
        } else if (lower.includes('schedule') || lower.includes('class') || lower.includes('time')) {
          fallbackReply += `Weekly session highlights:\n• **Youth Taekwondo**: Tue & Thu at 04:15 PM, Sat at 10:00 AM (Master Jin-Woo Park)\n• **Strength & Barbells**: Tue & Thu at 08:00 AM & 05:30 PM (Coach Marcus)\n• **Sunrise Aerobics**: Mon, Wed, Fri at 07:00 AM (Coach Elena Ramos)\nCheck the Tournaments & Calendar tab to reserve your spot!`;
        } else {
          fallbackReply += `How can I help you today? I can guide you through Taekwondo sparring tactics, explain Olympic scoring rules, detail our weekend mountain hikes, or assist with class bookings and memberships!`;
        }
        return res.json({ reply: fallbackReply });
      }

      const ai = new GoogleGenAI({
        apiKey
      });

      // Format multi-turn conversation contents
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "I'm ready to help with your training and schedule!";
      return res.json({ reply });
    } catch (err: any) {
      console.error('Server Gemini Error:', err);
      return res.status(500).json({
        error: err.message || 'Gemini generation error',
        reply: "I'm currently unable to reach the AI Coach cloud service. In the meantime, you can review our full schedule and register for events directly in the Calendar!"
      });
    }
  });

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TM Sports dev server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
