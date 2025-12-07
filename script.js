// =========================
// KONFIGURASI API GEMINI
// =========================
const API_KEY = "AlzaSyDbpf_Ymmwrrrr0Ibb6h4XRngmUw027nuf4";

// Fungsi kirim pesan ke Gemini
async function askAI(message) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
    API_KEY;

  const body = {
    contents: [
      {
        parts: [{ text: message }],
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Maaf, AI tidak bisa merespon."
  );
}

// =========================
// EVENT KIRIM PESAN
// =========================
document.getElementById("send-button").addEventListener("click", async () => {
  const input = document.getElementById("user-input");
  const msg = input.value.trim();

  if (!msg) return;

  appendMessage("You", msg);

  input.value = "";
  showTyping(true);

  const reply = await askAI(msg);

  showTyping(false);
  appendMessage("AI", reply);
});

// =========================
// TAMPILKAN PESAN DI CHATBOX
// =========================
function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `
    <div class="chat-message"><strong>${sender}:</strong> ${text}</div>
  `;
  chatBox.scrollTop = chatBox.scrollHeight;
}

// =========================
// INDIKATOR AI MENGETIK
// =========================
function showTyping(show) {
  document.getElementById("typing-indicator").style.display = show
    ? "flex"
    : "none";
}
