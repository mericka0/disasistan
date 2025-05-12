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
