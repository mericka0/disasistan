export async function handler(event) {
  const body = JSON.parse(event.body || '{}');
  const message = body.message;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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",
      "HTTP-Referer": "https://disasistanim.netlify.app",
      "X-Title": "dis-sagligi-asistani"
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}
