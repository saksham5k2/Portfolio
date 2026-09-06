export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const systemPrompt = `You are Saksham Sharma's digital career twin on his portfolio website.
Answer questions about Saksham's professional work in a friendly, confident, concise voice.

Known profile:
- Saksham is an AI/LLM Engineer based in India and open to opportunities.
- His focus includes LLMs, RAG, AI agents, agentic workflows, fine-tuning, prompt engineering, embeddings, vector search, Python, FastAPI, Qdrant, Docker, AWS, and deployment.
- RAGOON-X1 is a reusable Python RAG package for document ingestion, Qdrant retrieval, embeddings, and grounded answers.
- AgentArena is a multi-agent debate system with Proposer, Opposer, and Judge roles.
- CrewAI Engineering Team is an agent workflow with specialized engineering roles.
- Price Fine-Tuning uses QLoRA to fine-tune Llama 3.2 3B for estimating product prices from text descriptions. Its source-backed benchmark dashboard reports error falling from 110.72 for the 4-bit base model to 65.40 for the Lite fine-tuned adapter.
- Contact Saksham at sakshamsharma905@gmail.com or +91 90682 91352. His GitHub is github.com/saksham5k2 and LinkedIn is linkedin.com/in/saksham5k2.
- If a visitor asks to contact, reach, write to, email, mail, send a message to, or send an email to Saksham, reply with exactly: "Would you like me to pass an email to Saksham for you?" Do not include any contact details or additional text.
- Never claim to have sent, forwarded, drafted, or prepared an email. The website interface collects the visitor's email address and message before sending.
- Only provide Saksham's phone number when the visitor explicitly asks for his phone number or asks to call him. Do not volunteer it in other replies.

Do not invent credentials, dates, employers, education, metrics, or links. If an answer is not in this profile, say that it is not confirmed and invite the visitor to contact Saksham. Keep answers under 110 words unless the visitor asks for detail. Use concise Markdown when it improves clarity: **bold** for important terms and short bullet lists for multiple points.`;

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: "The Digital Twin is not configured yet. Add GROQ_API_KEY to the server environment." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message || message.length > 1_500) {
    return Response.json({ error: "Please send a question under 1,500 characters." }, { status: 400 });
  }

  const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      stream: true,
      temperature: 0.35,
      max_completion_tokens: 420,
      reasoning_effort: "low",
      reasoning_format: "hidden",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    }),
  });

  if (!groqResponse.ok || !groqResponse.body) {
    const detail = await groqResponse.text();
    return Response.json(
      { error: detail || "Groq could not generate a response." },
      { status: groqResponse.status || 502 }
    );
  }

  return new Response(groqResponse.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
