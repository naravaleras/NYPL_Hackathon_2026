import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client lazily / safely
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "NYC Board of Elections Voter Assistant API",
    timestamp: new Date().toISOString(),
  });
});

// Gemini Q&A endpoint for NYC New Voters
app.post("/api/assistant/ask", async (req, res) => {
  try {
    const { question, userContext } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "A valid question is required." });
    }

    const ai = getAIClient();
    if (!ai) {
      // Fallback if no API key is set yet
      return res.json({
        answer: "Welcome to the NYC Board of Elections! As a new voter in New York City: 1) In NY, voters must register at least 10 days before an election. 2) You do NOT need a photo ID to vote if you provided your SSN/DMV number when registering. 3) You can vote Early at your designated Early Voting site or on Election Day (6 AM – 9 PM) at your Election Day poll site. 4) If your name isn't on the list, you have the legal right to cast an Affidavit Ballot. For more assistance, call the NYC BOE Hotline at 1-866-VOTE-NYC (1-866-868-3692).",
        sources: ["NYC Board of Elections Official Guidelines", "New York Election Law § 8-302"],
      });
    }

    const systemInstruction = `You are the official Virtual Assistant for the Board of Elections in the City of New York (NYC BOE / Vote NYC).
Your mission is to provide accurate, warm, reassuring, and completely authoritative guidance specifically for FIRST-TIME and NEW NYC VOTERS.

Key NYC Election facts to uphold:
1. Eligibility: U.S. citizen, 18 years old on or before Election Day (16/17 year olds can pre-register), resident of NYC for at least 30 days prior to election, not in prison for a felony conviction.
2. Voter ID in NY: New York is NOT a strict voter ID state. Most registered voters do NOT need to show any ID. First-time voters who registered by mail without submitting DMV ID or last 4 digits of SSN might be asked for proof of residence (e.g., utility bill, bank statement, government check, or any photo ID).
3. Early Voting vs Election Day: NYC offers 9 days of Early Voting before general and primary elections. A voter's Early Voting site is often DIFFERENT from their Election Day site!
4. Poll Hours: Election Day polls are open 6:00 AM to 9:00 PM across all 5 boroughs. If you are in line by 9:00 PM, you HAVE THE LEGAL RIGHT to vote.
5. Affidavit Ballots: If a voter is told they are not in the poll book, poll workers MUST offer them an Affidavit Ballot under NY State law.
6. Ranked Choice Voting: NYC uses Ranked Choice Voting for municipal primary and special elections (Mayor, Public Advocate, Comptroller, Borough President, City Council). General elections and federal/state races use standard single-choice.
7. Language access: Ballots and interpreter assistance available in Spanish, Chinese, Bengali, Korean, Hindi, and more depending on district.
8. Time off to vote: NY State Election Law § 3-110 allows employees up to 2 hours of paid time off to vote if they do not have 4 consecutive non-working hours between poll opening and closing.

Keep responses concise, clear, encouraging, formatted with readable bullet points, and free of partisan bias.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `User's NYC Voting Question: "${question}"\nContext: ${JSON.stringify(userContext || {})}`,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const answer = response.text || "Thank you for contacting the NYC Board of Elections. Please verify your voter registration or call 1-866-VOTE-NYC for live assistance.";

    res.json({
      answer,
      sources: ["NYC Board of Elections (vote.nyc)", "NYS Board of Elections (elections.ny.gov)"],
    });
  } catch (error: any) {
    console.error("Error in NYC BOE assistant endpoint:", error);
    res.status(500).json({
      error: "Unable to process election query at this moment.",
      fallback: "You can reach the NYC Board of Elections hotline at 1-866-VOTE-NYC (1-866-868-3692) or visit vote.nyc for immediate assistance.",
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NYC BOE Server running on http://localhost:${PORT}`);
  });
}

startServer();
