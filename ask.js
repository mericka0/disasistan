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
