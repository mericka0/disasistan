let voiceEnabled = true;

function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  const button = document.getElementById("toggle-voice");
  button.textContent = voiceEnabled ? "🔈 Sesi Kapat" : "🔇 Sesi Aç";
}

function addMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(sender === "Kullanıcı" ? "user" : "bot");
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (sender === "Asistan" && voiceEnabled) {
    speakText(text);
  }
}

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "tr-TR";
  utterance.rate = 1;
  utterance.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  const turkishVoice = voices.find(v => v.lang === "tr-TR");
  if (turkishVoice) {
    utterance.voice = turkishVoice;
  }

  window.speechSynthesis.speak(utterance);
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage("Kullanıcı", message);
  input.value = "";

  const chatBox = document.getElementById("chat-box");
  const loading = document.createElement("div");
  loading.classList.add("bot");
  loading.textContent = "Asistan yazıyor...";
  chatBox.appendChild(loading);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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",  // OpenRouter API Key'in
        "HTTP-Referer": "https://disasistanim.netlify.app",
        "X-Title": "dis-sagligi-asistani"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Sen bir diş sağlığı uzmanısın. Kullanıcının ağız ve diş sağlığıyla ilgili sorularına açık, doğru ve anlaşılır şekilde yanıt ver."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    loading.remove();

    if (data.choices && data.choices.length > 0) {
      const reply = data.choices[0].message.content;
      addMessage("Asistan", reply);
    } else if (data.error) {
      addMessage("Asistan", "API Hatası: " + data.error.message);
    } else {
      addMessage("Asistan", "Cevap alınamadı.");
    }
  } catch (error) {
    loading.remove();
    addMessage("Asistan", "Bir hata oluştu: " + error.message);
  }
}
