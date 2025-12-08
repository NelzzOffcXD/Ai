export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Ambil pesan dari body
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Ambil API KEY
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY not found in environment" });
    }

    // Fetch ke Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=API_KEY_LU" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: message }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // Cek apakah API beneran ngasih jawaban
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, tidak ada respon dari API.";

    res.status(200).json({ reply });

  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
}
