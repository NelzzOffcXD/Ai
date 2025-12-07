// pages/api/gemini.js

export default async function handler(req, res) {
  // Cuma izinin POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    // ====== ISI API KEY LU DI SINI ======
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    // Atau kalo maksa hardcode (GA DISARANIN):
    // const GEMINI_API_KEY = "AIzaSyB7NkfB3foHuj1UfUhm4aAr_pRQ4PLLqsA";

    if (!GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY belum di-set di Vercel." });
    }

    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Field 'message' wajib string." });
    }

    // Panggil REST API Gemini
    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return res.status(500).json({
        error: "Request ke Gemini gagal.",
        detail: errText,
      });
    }

    const data = await geminiRes.json();

    // Ambil teks jawaban
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, ga ada jawaban dari Gemini.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("API /api/gemini error:", err);
    return res.status(500).json({
      error: "Server error di /api/gemini.",
      detail: err.message,
    });
  }
}
