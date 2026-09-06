"use client";

import { FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import CareerTwinAvatar, { AvatarGesture } from "../components/CareerTwinAvatar";
import {
  ArrowDownRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Send,
  Sparkles,
  Sun,
} from "lucide-react";

const projects = [
  {
    number: "01",
    name: "RAGOON-X1",
    type: "RAG ENGINE",
    description:
      "A modular, extensible Retrieval-Augmented Generation (RAG) framework for building and experimenting with production-oriented RAG pipelines. RAGoon-X1 provides a modular architecture for document ingestion, chunking, embedding, hybrid retrieval, reranking, context compression, and LLM-based generation.",
    docsUrl: "https://github.com/saksham5k2/RAGOON-X1",
  },
  {
    number: "02",
    name: "AgentArena",
    type: "MULTI-AGENT DEBATE",
    description:
      "AgentArena is a multi-agent debate game with guardrails, evals, telemetry, logging and production-ready architecture. where Proposer and Opposer agents argue across up to 3 rounds, retain context, rebut prior points, and are scored by an LLM Judge.",
    docsUrl: "https://github.com/saksham5k2/AgentArena",
    demoUrl: "https://agentarena-il5m.onrender.com/",
  },
  {
    number: "03",
    name: "CrewAI Engineering Team",
    type: "AGENT WORKFLOW",
    description:
      "A resumable, rate-limited, multi-model CrewAI workflow that coordinates design, backend, frontend, and testing agents to build a trading simulation account manager. It generates a Python backend, Gradio dashboard, and tests for deposits, withdrawals, share trading, portfolios, P&L, and transaction history.",
    docsUrl: "https://github.com/saksham5k2/CrewAI_Engineering_Team",
  },
  {
    number: "04",
    name: "Price Fine-Tuning",
    type: "FINE-TUNING · IN PROGRESS",
    description:
      "Fine-tuning Llama 3.2 3B with QLoRA to estimate product prices from text descriptions. Includes a source-backed benchmark dashboard, showing reported error falling from 110.72 for the 4-bit base model to 65.40 for the Lite fine-tuned adapter.",
    stack: ["Llama 3.2", "QLoRA", "Evaluation"],
    docsUrl: "https://github.com/saksham5k2/Price-Fine-Tuning",
    demoUrl: "https://price-fine-tuning.vercel.app/",
  },
];

const skillGroups = [
  [
    "LLMs",
    "Generative AI",
    "RAG",
    "AI Agents",
    "Agentic Workflows",
    "Fine-Tuning",
    "Prompt Engineering",
    "Embeddings",
    "Vector Search",
    "Semantic Search",
    "Hybrid Retrieval",
    "Reranking",
    "LLM Evaluation",
    "LoRA",
    "PEFT",
    "Quantization",
    "Transformers",
    "Context Engineering",
    "Prompt Chaining",
    "MCP",
  ],

  [
    "Python",
    "SQL",
    "PyTorch",
    "Hugging Face",
    "SentenceTransformers",
    "Qdrant",
    "CrewAI",
    "FastAPI",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "REST APIs",
    "JSON",
    "Git",
    "GitHub",
    "Data Processing",
    "Feature Engineering",
    "Model Inference",
    "API Integration",
    "CLI Development",
  ],

  [
    "Docker",
    "AWS",
    "Kubernetes",
    "Jenkins",
    "GitHub Actions",
    "CI/CD",
    "Linux",
    "Vercel",
    "Render",
    "Cloud Deployment",
    "Containerization",
    "API Deployment",
    "Monitoring",
    "Production Support",
    "AS400",
    "IBM i",
    "COBOL Debugging",
    "UAT",
    "System Integration",
    "Enterprise Systems",
  ],
];

function formatInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function formatResponse(text: string) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^#{1,3}\s+(.+)/);
    if (heading) {
      blocks.push(<h4 key={`heading-${index}`}>{formatInline(heading[1])}</h4>);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      blocks.push(<ul key={`list-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{formatInline(item)}</li>)}</ul>);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(<ol key={`ordered-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{formatInline(item)}</li>)}</ol>);
      continue;
    }

    blocks.push(<p key={`paragraph-${index}`}>{formatInline(line)}</p>);
    index += 1;
  }

  return blocks;
}

async function sendPortfolioEmail(replyTo: string, message: string, fromName = "Digital Twin visitor") {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("Email delivery has not been configured yet.");
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        from_name: fromName,
        reply_to: replyTo,
        message,
        to_email: "sakshamsharma905@gmail.com",
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Your message could not be sent. Please try again shortly.");
  }
}

function DigitalTwin() {
  const [isTalking, setIsTalking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [gesture, setGesture] = useState<AvatarGesture>("idle");
  const [nextReplyGesture, setNextReplyGesture] = useState<AvatarGesture>("talk-energetic");
  const [message, setMessage] = useState("");
  const [isCollectingEmail, setIsCollectingEmail] = useState(false);
  const [isAwaitingEmailConsent, setIsAwaitingEmailConsent] = useState(false);
  const [inactivityCycle, setInactivityCycle] = useState(0);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [responses, setResponses] = useState([
    { id: 1, text: "Hi, I’m Saksham’s AI twin." },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const waveTimer = window.setTimeout(() => setGesture("wave"), 550);
    const idleTimer = window.setTimeout(() => setGesture("idle"), 2150);
    return () => {
      window.clearTimeout(waveTimer);
      window.clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [responses, isThinking]);

  useEffect(() => {
    if (isTalking || isThinking) return;

    const sleepyTimer = window.setTimeout(() => {
      setGesture("sleepy");
    }, 30_000);
    const wakeTimer = window.setTimeout(() => {
      setGesture("idle");
      setInactivityCycle((current) => current + 1);
    }, 35_000);

    return () => {
      window.clearTimeout(sleepyTimer);
      window.clearTimeout(wakeTimer);
    };
  }, [inactivityCycle, isTalking, isThinking]);

  async function previewResponse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim() || isTalking || isThinking) return;

    const question = message.trim();
    const replyId = Date.now();
    let replyStarted = false;
    let queuedText = "";
    let flushTimer: number | null = null;

    const startReply = () => {
      if (replyStarted) return;
      replyStarted = true;
      setIsThinking(false);
      setIsTalking(true);
      setGesture(nextReplyGesture);
      setNextReplyGesture((current) =>
        current === "talk-energetic" ? "present" : "talk-energetic"
      );
      setResponses((current) => [...current, { id: replyId, text: "" }]);
    };

    const flushQueue = () => {
      const visibleChunk = queuedText.slice(0, 4);
      queuedText = queuedText.slice(4);
      setResponses((current) =>
        current.map((item) =>
          item.id === replyId ? { ...item, text: item.text + visibleChunk } : item
        )
      );

      if (queuedText) {
        flushTimer = window.setTimeout(flushQueue, 18);
      } else {
        flushTimer = null;
      }
    };

    const queueToken = (token: string) => {
      queuedText += token;
      if (flushTimer === null) flushQueue();
    };

    const waitForQueue = () =>
      new Promise<void>((resolve) => {
        const checkQueue = () => {
          if (!queuedText && flushTimer === null) resolve();
          else window.setTimeout(checkQueue, 20);
        };
        checkQueue();
      });

    setMessage("");
    setInactivityCycle((current) => current + 1);

    const emailIntent = /\b(?:write|send|compose|leave)\b[\s\S]{0,40}\b(?:email|mail|message)\b|\b(?:email|mail)\b[\s\S]{0,25}\b(?:saksham|him|you)\b/i.test(question);
    const contactIntent = /\b(?:contact|reach|connect|speak|talk|hire|collaborat(?:e|ion)|opportunit(?:y|ies))\b/i.test(question);

    if ((emailIntent || contactIntent) && !isCollectingEmail && !isAwaitingEmailConsent) {
      setIsAwaitingEmailConsent(true);
      setResponses((current) => [
        ...current,
        { id: replyId, text: "Would you like me to pass an email to Saksham for you?" },
      ]);
      return;
    }

    const emailPromptIsVisible = /would you like me to pass an email to saksham for you\?/i.test(responses.at(-1)?.text ?? "");

    if (isAwaitingEmailConsent || emailPromptIsVisible) {
      const agreesToEmail = /^(?:yes|yeah|yep|sure|okay|ok|please|i would|i'd like)/i.test(question);
      setIsAwaitingEmailConsent(false);

      setResponses((current) => [
        ...current,
        {
          id: replyId,
          text: agreesToEmail
            ? "Please type your email address and the message you’d like me to pass on, and I’ll let Saksham know."
            : "No problem. You can contact Saksham directly by email or phone whenever you’re ready.",
        },
      ]);

      if (agreesToEmail) setIsCollectingEmail(true);
      return;
    }

    if (isCollectingEmail) {
      const emailMatch = question.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
      const forwardedMessage = emailMatch
        ? question
            .replace(emailMatch[0], "")
            .replace(/(?:my\s+)?email(?:\s+is)?\s*:?/i, "")
            .replace(/^(?:and\s+)?message\s*:\s*/i, "")
            .trim()
        : "";

      if (!emailMatch || !forwardedMessage) {
        setResponses((current) => [
          ...current,
          { id: replyId, text: "Please include both your email address and the message in the same reply so I can send it to Saksham." },
        ]);
        return;
      }

      setIsThinking(true);
      try {
        await sendPortfolioEmail(emailMatch[0], forwardedMessage);
        setIsCollectingEmail(false);
        setResponses((current) => [
          ...current,
          { id: replyId, text: "Done — I’ve sent your message to Saksham. He can reply directly to your email." },
        ]);
      } catch (error) {
        setResponses((current) => [
          ...current,
          { id: replyId, text: error instanceof Error ? error.message : "Your message could not be sent. Please try again shortly." },
        ]);
      } finally {
        setIsThinking(false);
      }
      return;
    }

    setIsThinking(true);

    try {
      const response = await fetch("/api/twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      if (!response.ok || !response.body) {
        throw new Error("The Digital Twin could not respond.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const data = event
            .split("\n")
            .filter((line) => line.startsWith("data: "))
            .map((line) => line.slice(6))
            .join("");

          if (!data || data === "[DONE]") continue;

          const chunk = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
          const token = chunk.choices?.[0]?.delta?.content;
          if (!token) continue;

          startReply();
          queueToken(token);
        }
      }

      if (!replyStarted) {
        throw new Error("The Digital Twin returned an empty response.");
      }

      await waitForQueue();
    } catch {
      setIsThinking(false);
      setResponses((current) => [
        ...current,
        { id: replyId, text: "I’m unable to respond right now. Please try again shortly." },
      ]);
    } finally {
      setIsTalking(false);
      setGesture("idle");
    }
  }

  return (
    <div className="character-stage twin-stage">
      <div className="twin-chat-header">
        <span className="twin-header-avatar" aria-hidden="true">SS</span>
        <span className="twin-header-copy">
          <strong>Saksham&apos;s Twin</strong>
          <small>{isThinking ? "typing…" : isTalking ? "online · replying" : "online"}</small>
        </span>
        <span className="twin-header-actions">
          <a href="tel:+919068291352" aria-label="Call Saksham at +91 90682 91352">Call</a>
          <a href="#contact">Email</a>
        </span>
      </div>
      <div className="orb orb-one" /><div className="orb orb-two" /><div className="grid-fade" />
      <span className="stage-tag tag-one">LLMs</span><span className="stage-tag tag-two">RAG</span><span className="stage-tag tag-three">Agents</span>
      <div className="twin-shadow" />
      <CareerTwinAvatar gesture={gesture} isThinking={isThinking} isSpeaking={isTalking} />
      <div className={`twin-avatar ${isTalking ? "is-talking" : ""}`} aria-label="Digital twin of Saksham">
        <img src="/digital-twin.png" alt="Stylized digital twin of Saksham Sharma" />
        <svg viewBox="0 0 360 430" role="img" aria-hidden="true">
          <defs><linearGradient id="twin-shirt" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#31483e" /><stop offset="1" stopColor="#14221c" /></linearGradient><linearGradient id="twin-skin" x1="0" x2="1"><stop stopColor="#b9784c" /><stop offset="1" stopColor="#e1a16c" /></linearGradient></defs>
          <path className="twin-body" d="M97 424c6-82 39-119 83-119s79 37 84 119H97Z" fill="url(#twin-shirt)" /><path d="M154 297h53v39c-8 13-42 13-53 0v-39Z" fill="url(#twin-skin)" /><path className="twin-neck-shadow" d="M155 299c13 15 35 20 52 4v24c-12 18-40 18-52 0v-28Z" />
          <path className="twin-head" d="M117 168c0-71 31-112 69-112s72 40 72 112v58c0 58-36 90-72 90s-69-32-69-90v-58Z" fill="url(#twin-skin)" /><path className="twin-ear" d="M120 191c-22-8-29 19-16 42 5 10 12 17 21 18" /><path className="twin-ear twin-ear-right" d="M252 191c22-8 29 19 16 42-5 10-12 17-21 18" />
          <path className="twin-hair" d="M119 179c-4-63 25-109 67-111 40-2 72 30 72 91-18-7-29-26-36-44-29 20-60 27-103 25v39Z" /><path className="twin-hair-shine" d="M142 104c18-23 52-31 77-13" /><path className="twin-brow" d="M141 190c11-7 24-7 34-1M201 189c10-6 23-6 33 1" /><ellipse className="twin-eye" cx="158" cy="206" rx="5" ry="7" /><ellipse className="twin-eye" cx="217" cy="206" rx="5" ry="7" /><path className="twin-nose" d="M189 207l-4 27 10 1" /><path className="twin-mouth" d="M165 260c14 11 29 11 43 0" />
          <path className="twin-collar" d="m148 318 37 27 35-27 15 24-50 49-51-49 14-24Z" />
          <g className="twin-wave"><path className="twin-arm" d="M253 340c20-7 31-2 38-20l15-104c2-17 10-26 22-23 12 3 15 15 11 30l-15 108c-5 35-25 55-67 60l-4-51Z" fill="url(#twin-shirt)" /><path className="twin-hand" d="M306 214c-1-24 7-48 15-59 5-8 13-6 13 3l-2 23 6-27c3-10 13-8 12 2l-4 27 8-19c4-9 13-5 10 4l-13 35c-6 16-12 25-24 26l-21-15Z" fill="url(#twin-skin)" /></g>
        </svg>
      </div>
      <div className="twin-response" aria-live="polite">
        <span className="twin-chat-name"><Sparkles size={12} /> DIGITAL TWIN</span>
        <div className="twin-message-list">
          {responses.map((response) => (
            <div className="twin-message" key={response.id}>
              <div className="twin-message-content">{formatResponse(response.text)}</div>
              <small>now <b>✓✓</b></small>
            </div>
          ))}
          {isThinking && (
            <div className="twin-message twin-thinking-message">
              <p><span className="thinking-dot" /> Thinking…</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      <form className="twin-input" onSubmit={previewResponse}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder={isCollectingEmail ? "Your email and message…" : "Ask Saksham’s twin…"} aria-label="Message Saksham's digital twin" /><button type="submit" aria-label="Send message" disabled={!message.trim() || isTalking || isThinking}><Send size={15} /></button></form>
      <div className="stage-bottom twin-status-bar">
        <span>{currentTime ? currentTime.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }) : "Loading time…"}</span>
        <span className="twin-online"><span className="green-dot" /> <span>ONLINE</span></span>
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [notice, setNotice] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setNotice("");

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("The contact form has not been configured yet.");
      }

      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: form.name,
            reply_to: form.email,
            message: form.message,
            to_email: "sakshamsharma905@gmail.com",
          },
        }),
      });

      if (!response.ok) throw new Error("Your message could not be sent. Please try again shortly.");

      setForm({ name: "", email: "", message: "" });
      setNotice("Message sent. Saksham will get back to you soon.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Your message could not be sent.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={sendMessage}>
      <div className="contact-form-head">
        <span>START A CONVERSATION</span>
        <small>Send a message directly to Saksham.</small>
      </div>
      <div className="contact-form-row">
        <label>
          Name
          <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" />
        </label>
        <label>
          Email
          <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
        </label>
      </div>
      <label>
        Message
        <textarea required rows={4} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Tell me about the opportunity or project." />
      </label>
      <div className="contact-form-action">
        <button type="submit" disabled={isSending}>{isSending ? "Sending…" : "Send message"} <ArrowUpRight size={15} /></button>
        {notice && <span role="status">{notice}</span>}
      </div>
    </form>
  );
}

function ScrollGlow() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="scroll-ambient" aria-hidden="true">
      <span
        className="scroll-ambient-primary"
        style={{ transform: `translate3d(${54 - progress * 108}vw, ${-5 + progress * 78}vh, 0) rotate(${-24 + progress * 32}deg)` }}
      />
      <span
        className="scroll-ambient-secondary"
        style={{ transform: `translate3d(${72 - progress * 105}vw, ${8 + progress * 72}vh, 0)` }}
      />
    </div>
  );
}

export default function Home() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = isLightMode ? "light" : "dark";
  }, [isLightMode]);

  return (
    <main data-theme={isLightMode ? "light" : "dark"}>
      <ScrollGlow />
      <header className="nav-wrap">
        <nav className="nav shell">
          <a href="#home" className="brand">
            saksham<span>@</span>dev
          </a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="nav-actions">
            <button className="theme-toggle" type="button" onClick={() => setIsLightMode((current) => !current)} aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}>
              {isLightMode ? <Moon size={14} /> : <Sun size={14} />}
              <span>{isLightMode ? "Dark" : "Light"}</span>
            </button>
            <a href="#contact" className="nav-cta">
              Let&apos;s talk <ArrowUpRight size={14} />
            </a>
          </div>
        </nav>
      </header>

      <section id="home" className="hero shell">
        <div className="hero-copy">
          <p className="role-availability">AVAILABLE FOR AI ENGINEERING ROLES</p>
          <h1>
            Saksham Sharma
            <br />
            <em>AI Engineer</em>
          </h1>
          <p className="hero-summary">
            I&apos;m Saksham Sharma, an AI/LLM Engineer focused on turning
            language models, retrieval, and agentic workflows into thoughtful
            real-world products.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="primary-button">
              Explore my work <ArrowDownRight size={17} />
            </a>
            <a href="#contact" className="text-button">
              Get in touch <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="hero-availability">
            <span className="pulse" /> Based in India · Open to opportunities
          </div>
        </div>
        <DigitalTwin />
        {/*
        <div className="character-stage">
          <div className="stage-top">
            <span>SAKSHAM&apos;S DIGITAL TWIN</span>
            <span>01 / 01</span>
          </div>
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="grid-fade" />
          <span className="stage-tag tag-one">LLMs</span>
          <span className="stage-tag tag-two">RAG</span>
          <span className="stage-tag tag-three">Agents</span>
          <div className="character-shadow" />
          <Image
            src="/saksham-avatar.png"
            alt="Stylized digital character representing Saksham Sharma"
            fill
            priority
            sizes="(max-width: 780px) 90vw, 46vw"
            className="hero-character"
          />
          <div className="character-card">
            <span className="character-icon">
              <Sparkles size={15} />
            </span>
            <span>
              <b>Hello, I&apos;m Saksham.</b>
              <small>AI Engineer · Product builder</small>
            </span>
            <ArrowUpRight size={15} />
          </div>
          <div className="stage-bottom">
            <span>HUMAN THINKING · AI CRAFT</span>
            <span className="green-dot" /> ONLINE
          </div>
        </div>
        */}
      </section>

      <section id="about" className="intro-section">
        <div className="shell intro-grid">
          <p className="section-label">01 / ABOUT ME</p>
          <div>
            <h2>
              Curious by default.
              <br />
              Practical by design.
            </h2>
            <p className="intro-text">
              I’m an AI-focused Software Engineer with a strong foundation in
              product development, AI models and enterprise systems. I work
              across LLMs, RAG, AI agents, fine-tuning, deployment and
              data-driven applications, with an emphasis on building solutions
              that are practical, reliable, and production-ready.
            </p>
            <p className="intro-text">
              I approach AI as an engineering problem. I build systems that are
              grounded in real-world constraints, and I focus on creating
              solutions that are not just innovative, but also maintainable and
              scalable.
            </p>
            <p className="intro-text">
              My background gives me a strong understanding of how real systems
              are designed, tested, deployed, and maintained—so I approach AI
              not just as experimentation, but as an engineering problem. I
              bring a production mindset to AI engineering. My background in
              product development, enterprise systems, and deployment helps me
              build AI work that is clear, grounded, and made to last.
            </p>
            <div className="domains">
              <span>PYTHON</span>
              <span>LARGE LANGUAGE MODELS</span>
              <span>RAG</span>
              <span>GENERATIVE AI</span>
              <span>AI AGENTS</span>
              <span>FINE-TUNING</span>
              <span>PROMPT ENGINEERING</span>
              <span>EMBEDDINGS</span>
              <span>VECTOR DATABASES</span>
              <span>HUGGING FACE</span>
              <span>TRANSFORMERS</span>
              <span>LLM EVALUATION</span>
              <span>LORA / PEFT</span>
              <span>PYTORCH</span>
              <span>FASTAPI</span>
              <span>MCP</span>
              <span>SQL</span>
              <span>DOCKER</span>
              <span>AWS</span>
              <span>AGENTIC WORKFLOWS</span>
            </div>
          </div>
          <div className="about-note">
            <MapPin size={16} />
            <p>
              Building from
              <br />
              <b>India, for anywhere.</b>
            </p>
          </div>
        </div>
      </section>

      <section id="skills" className="skills-section shell">
        <div className="section-head">
          <p className="section-label">02 / SKILLS &CAPABILITIES</p>
          <h2>
            A focused toolkit
            <br />
            for <em>intelligent products.</em>
          </h2>
        </div>
        <div className="skills-rows">
          {skillGroups.map((group, index) => (
            <div className="skill-row" key={index}>
              <span>0{index + 1}</span>
              <div className="ticker-window">
                <div className={`ticker-track ticker-${index + 1}`}>
                  {[...group, ...group].map((skill, skillIndex) => (
                    <i
                      key={`${skill}-${skillIndex}`}
                      aria-hidden={skillIndex >= group.length}
                    >
                      {skill}
                    </i>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="project-section">
        <div className="shell">
          <div className="section-head project-heading">
            <p className="section-label">03 / SELECTED WORK</p>
            <h2>
              Things I&apos;ve
              <br />
              <em>made real.</em>
            </h2>
            <p>
              Small systems. Large questions.
              <br />
              Always learning by building.
            </p>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article
                className={`project-card card-${index + 1}`}
                key={project.name}
              >
                <div className="project-visual">
                  <span className="project-number">{project.number}</span>
                  <div className="visual-shape">
                    <span />
                    <span />
                    <span />
                  </div>
                  <p>{project.type}</p>
                </div>
                <div className="project-content">
                  <h3>
                    {project.name}
                    <ArrowUpRight size={18} />
                  </h3>
                  <p>{project.description}</p>
                  <div className="project-actions">
                    <a href={project.docsUrl} target="_blank" rel="noreferrer">
                      Docs <Github size={13} />
                    </a>
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noreferrer">
                        Live demo <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="shell contact-content">
          <p className="section-label">04 / CONTACT</p>
          <div className="contact-grid">
            <div>
              <h2>
                Let&apos;s make something
                <br />
                <em>thoughtful.</em>
              </h2>
              <p>Have an AI project, opportunity, or idea worth discussing?</p>
              <a className="contact-email" href="mailto:sakshamsharma905@gmail.com">
                sakshamsharma905@gmail.com <ArrowUpRight size={20} />
              </a>
              <div className="socials">
                <a
                  href="https://github.com/saksham5k2"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={17} /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/saksham5k2/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin size={17} /> LinkedIn
                </a>
                <a href="mailto:sakshamsharma905@gmail.com">
                  <Mail size={17} /> Email
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
      <footer className="shell footer">
        <span>© 2026 Saksham Sharma</span>
        <span>
          Built with curiosity <i>✦</i>
        </span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </main>
  );
}
