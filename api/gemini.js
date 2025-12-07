export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: "API Key tidak ditemukan." });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    // Panggil REST API Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "Gagal request ke Gemini.",
        detail: data,
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Tidak ada respon dari Gemini.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({
      error: "Server error.",
      detail: error.message,
    });
  }
}
