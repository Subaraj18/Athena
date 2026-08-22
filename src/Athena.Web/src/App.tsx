import { FormEvent, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setMessages((current) => [...current, { role: 'user', content: message }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Unable to contact Athena API.');

      const data = await response.json();
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: data.message },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Something went wrong.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">Athena</div>
        <button className="new-chat" onClick={() => setMessages([])}>
          + New chat
        </button>
        <div className="sidebar-footer">AI assistant · foundation</div>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <div>
            <h1>Athena AI</h1>
            <span>Open-weight AI assistant</span>
          </div>
        </header>

        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome">
              <h2>How can I help?</h2>
              <p>Athena's chat foundation is ready. The LLM integration comes next.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <article key={`${message.role}-${index}`} className={`message ${message.role}`}>
              <div className="message-role">{message.role === 'user' ? 'You' : 'Athena'}</div>
              <div>{message.content}</div>
            </article>
          ))}
        </div>

        <form className="composer" onSubmit={sendMessage}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Message Athena..."
            rows={1}
            disabled={loading}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </section>
    </main>
  );
}
