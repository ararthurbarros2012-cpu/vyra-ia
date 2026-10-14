
const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Vyra está online!");
});

app.post("/chat", async (req, res) => {
  try {
    const mensagem = req.body.message;

    if (!mensagem) {
      return res.status(400).json({ error: "Envie uma mensagem." });
    }

    const resposta = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Você é Vyra, uma assistente de IA amigável, inteligente e prestativa. Responda em português brasileiro, de forma natural, clara e útil."
            },
            { role: "user", content: mensagem }
          ]
        })
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      console.error(dados);
      return res.status(502).json({
        error: "Não consegui gerar uma resposta agora."
      });
    }

    res.json({ reply: dados.choices[0].message.content });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Vyra online na porta " + PORT);
});
