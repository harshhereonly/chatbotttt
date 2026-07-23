import { useState, useRef, useEffect, useCallback } from 'react';
import Admin from './Admin.jsx';
import AdminLogin from './AdminLogin.jsx';

// ── Constants ─────────────────────────────────────────────────────────────────
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL = 'llama-3.3-70b-versatile';
const MODEL_LABEL = 'Groq · Llama 3.3 70B';
const MAX_TOKENS = 512;
const USER_MESSAGE_LIMIT = 2000;
const HISTORY_TOKEN_LIMIT = 9000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SYSTEM_PROMPT = `You are a helpful assistant for Houston Systems (houstonsystems.in / housysit.com).
Answer questions about the company clearly and professionally.
If you don't know something, direct the user to contact the team directly.

COMPANY OVERVIEW

Company Name: Houston Systems (Houston Systems Private Limited / "Housys")
Website: https://www.houstonsystems.in
Founded: 2016
Tagline: Delivering End-to-End IT Solutions for a Digital-First World / "Our Vision, Your Future"

Houston Systems is a full-spectrum technology company operating across two connected fronts:
(1) IT Solutions - software, mobile apps, AI, IoT, and embedded systems for businesses, and
(2) Security & Safety Automation - physical access control, perimeter security, and traffic/parking
automation hardware. Design work is led by a team based in California, USA ("Designed in USA, Built
for Excellence"), with manufacturing and headquarters in Greater Noida, India.

CONTACT INFORMATION

- Phone: +91 99991 26885
- WhatsApp: +91 99991 26881
- Email: sk@houstonsystem.com
- Address: D-148, EPIP, Kasna, Surajpur Site V, Greater Noida, Uttar Pradesh 201310, India
- LinkedIn: https://www.linkedin.com/company/houstonsystems/
- YouTube: https://youtube.com/@houstonsystems952
- Facebook: https://www.facebook.com/HoustonSystem

SERVICES

1. Web Development - Responsive, secure, high-performing websites.
2. Custom Software Development - Tailored software to streamline operations and boost productivity.
3. Mobile App Development - User-friendly mobile apps for iOS and Android.
4. UI/UX Design - User-centric interface and experience design.
5. Embedded Systems - Automation, efficiency, and operational control solutions.
6. AI & Machine Learning - Custom LLMs, real-time data processing, predictive engines.
7. Cloud & Cyber Security - SOC2-compliant security, cloud optimization, zero-trust architecture.
8. Staff Augmentation / Hiring - Access to top developers ready to integrate into your team.
9. IoT & Automation - Smart city solutions, ANPR, Parking Management Systems.
10. Access Control & VMS - Visitor Management Systems with biometric and turnstile integration.
11. E-Ticketing & Event Tech - Stadium-grade ticketing bridging digital sales with physical gates.
12. UVSS & AI Threat Detection - Under Vehicle Surveillance using computer vision and neural networks.
13. Toll & Revenue Management - RFID and sensor-integrated highway automation software.
14. Legacy Modernization & Cloud Migration - Transitioning old infrastructure to cloud-ready environments.

PRODUCTS

Security & Automation Hardware (houstonsystems.in):
1. Entrance Automation System - automatic boom barriers, road blockers, swing/sliding gate operators, door and shutter automation.
2. Pedestrian Access Gates - tripod turnstiles, flap barriers for controlled foot traffic.
3. Perimeter Security System - security bollards, hydraulic rising bollards, perimeter protection systems.
4. Indoor Security System - access control (RFID/biometric), visitor management, queue management, footfall management.

Solutions (bundled use-case offerings):
1. Parking Solutions - parking management and real-time guidance systems.
2. Access Management - integrated entry/exit and identity verification systems.
3. Traffic Solutions - electronic toll management, ANPR, weigh-in-motion, traffic signal and lane display systems.

IT Products & Platforms:
1. Web Development - responsive, secure, high-performing websites.
2. Custom Software Development - tailored software to streamline operations and boost productivity.
3. Mobile App Development - user-friendly mobile apps for iOS and Android.
4. Embedded Systems - automation, efficiency, and operational control solutions.
5. AI & Machine Learning - custom LLMs, real-time data processing, predictive engines.
6. Cloud & Cyber Security - SOC2-compliant security, cloud optimization, zero-trust architecture.
7. IoT & Automation - smart city solutions, ANPR, Parking Management Systems.
8. Access Control & VMS - Visitor Management Systems with biometric and turnstile integration.
9. E-Ticketing & Event Tech - stadium-grade ticketing bridging digital sales with physical gates.
10. UVSS & AI Threat Detection - under vehicle surveillance using computer vision and neural networks.
11. Toll & Revenue Management - RFID and sensor-integrated highway automation software.
12. Legacy Modernization & Cloud Migration - transitioning old infrastructure to cloud-ready environments.

TECHNOLOGIES USED

Frontend: React, Next.js, Angular, Vue
Backend: Node.js, Python, Java, .NET
Mobile: Flutter, Swift, Kotlin
Cloud & DevOps: AWS, Docker, Kubernetes
Databases: MongoDB, PostgreSQL
Other: Embedded firmware, RFID, Biometrics, Computer Vision, AI/ML

KEY STATS

- Founded/Launched: 2016
- 300+ Projects delivered
- 10+ Countries served
- 10+ Sectors served
- 50+ Technologies mastered
- 300+ Enterprise partners and startups

INDUSTRIES SERVED

Finance, Healthcare, Education, Real Estate, E-commerce, Hospitality, Logistics, Startups, Smart Cities,
Security & Surveillance, Transportation & Toll Management, Corporate Offices, Government Buildings &
Embassies, Airports & Transport Hubs, Stadiums & Sports Venues, Railway Stations, Residential Communities.

CORE VALUES

- Integrity and transparency in every action
- Innovation-driven approach to solving problems ("Evolving with You")
- Accountability and ownership at all levels
- Respect for people, ideas, and diversity
- Empathy towards clients, users, and teammates ("Partnership, Not Sales")
- Excellence Uncompromised - going beyond industry standards in reliability and performance

PROCESS / METHODOLOGY

1. Discovery - Mapping hardware-software landscape and understanding goals
2. Prototyping - Simulating automation flows and UX
3. Engineering - Building core logic and API integrations
4. Validation - Stress testing hardware compatibility
5. Launch - Deployment with 24/7 infrastructure support

FAQS

Q: What industries do you serve?
A: Finance, healthcare, education, real estate, ecommerce, hospitality, logistics, startups, smart cities, and transportation/toll management.

Q: Can you build custom solutions from scratch?
A: Yes. End-to-end development from ideation and design to deployment and long-term support.

Q: How do you ensure quality and timelines?
A: Structured workflows, code reviews, regular updates, strong QA, dedicated teams, and clear milestones.

Q: Do you offer post-launch support?
A: Yes. Houston Systems offers ongoing maintenance, performance monitoring, feature upgrades, and technical support.

Q: What does onboarding look like?
A: It starts with a discovery phase, then project plan, wireframes, and prototypes before development begins.

Q: What tech stacks do you use?
A: React, Next.js, Node.js, AWS/GCP and more, chosen based on the client's specific needs while prioritizing stability, security, and long-term scalability.

Q: Where is Houston Systems based?
A: Headquarters and manufacturing are in Greater Noida, Uttar Pradesh, India, with a product design team based in California, USA.

Q: What year was Houston Systems founded?
A: 2016.

LINKS

- About: https://housysit.com/about
- Services: https://housysit.com/services
- Blog: https://housysit.com/blog
- Contact: https://housysit.com/contact
- Privacy Policy: https://housysit.com/privacy-policy
- Security/Automation site: https://www.houstonsystems.in
- Security/Automation Contact: https://www.houstonsystems.in/contact

RESPONSE RULES - follow strictly every reply:
- Short answers such as contact info, yes/no answers, or a single fact must be a plain 1-2 sentence paragraph with no bullets.
- List answers such as services, products, technologies, industries, values, or process steps must use "•" bullet points, max 6 bullets unless the user asks for the full list.
- If the user asks for all services or all products, include every item from the SERVICES or PRODUCTS section as separate "•" bullets.
- Each bullet must be concise and focused on one item.
- Never write a long paragraph with multiple items separated by commas; convert those into bullets instead.
- Never add extra information that was not asked; answer only what was asked.
- For pricing, quotes, project estimates, or uncertain details, say: "Please contact the Houston Systems team at +91 99991 26885 or sk@houstonsystem.com for the most accurate information."
- For technical issues or project-specific questions, offer to connect the user with the team.
- Politely redirect questions unrelated to Houston Systems.`;

const QUICK_REPLIES = [
  'What services do you offer?',
  'How do I get a project quote?',
  'how to contact your team?',
  'Where are you located?',
  'What technologies do you use?',
];

const EMAIL_VALIDATION_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function totalTokens(messages) {
  return messages.reduce((total, message) => total + estimateTokens(message.content || ''), 0);
}

function trimHistoryToTokenLimit(history) {
  const limitedHistory = [...history];
  const messagesWithSystemPrompt = () => [
    { role: 'system', content: SYSTEM_PROMPT },
    ...limitedHistory,
  ];

  while (limitedHistory.length > 1 && totalTokens(messagesWithSystemPrompt()) > HISTORY_TOKEN_LIMIT) {
    limitedHistory.shift();
  }

  return limitedHistory;
}

function makeWelcome() {
  return {
    id: 'welcome',
    role: 'bot',
    text: "👋 Welcome to Houston Systems! I'm your virtual support assistant. I can help you with our security & access management products, pricing inquiries, and more. How can I assist you today?",
    time: formatTime(new Date()),
  };
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function BotAvatarIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="8" width="18" height="13" rx="4" fill="white" fillOpacity="0.92" />
      <rect x="8.5" y="11" width="2.5" height="2.5" rx="1" fill="#1D9E75" />
      <rect x="13" y="11" width="2.5" height="2.5" rx="1" fill="#1D9E75" />
      <rect x="9.5" y="16" width="5" height="1.5" rx="0.75" fill="#1D9E75" fillOpacity="0.6" />
      <line x1="12" y1="8" x2="12" y2="5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="4.5" r="1" fill="white" />
      <line x1="3" y1="13" x2="1" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="21" y1="13" x2="23" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="send-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GroqBolt() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      style={{ display: 'inline', verticalAlign: 'middle' }}>
      <path d="M13 2L4.5 13.5H11.5L10 22L20 10H13L13 2Z" fill="currentColor" />
    </svg>
  );
}

// ── Typing Indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="typing-row" aria-label="Support Assistant is typing">
      <div className="bot-avatar"><BotAvatarIcon size={15} /></div>
      <div className="typing-bubble">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

function normalizeBotText(text) {
  return text.replace(/^\s*[*-]\s+/gm, '• ');
}

function linkifyText(text) {
  const linkPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|https?:\/\/[^\s]+|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?|\+?\d[\d\s().-]{7,}\d)/g;
  const parts = [];
  let lastIndex = 0;

  for (const match of text.matchAll(linkPattern)) {
    const rawValue = match[0];
    const start = match.index;
    const trailingMatch = rawValue.match(/[.,!?;:)]+$/);
    const trailing = trailingMatch?.[0] || '';
    const value = trailing ? rawValue.slice(0, -trailing.length) : rawValue;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    let href = value;
    if (/^[a-zA-Z0-9._%+-]+@/.test(value)) {
      href = `mailto:${value}`;
    } else if (/^\+?\d[\d\s().-]{7,}\d$/.test(value)) {
      href = `tel:${value.replace(/[^\d+]/g, '')}`;
    } else if (!/^https?:\/\//i.test(value)) {
      href = `https://${value}`;
    }

    parts.push(
      <a key={`${start}-${value}`} href={href} target="_blank" rel="noreferrer">
        {value}
      </a>
    );

    if (trailing) {
      parts.push(trailing);
    }

    lastIndex = start + rawValue.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

// ── Render text with newlines & bullets preserved ─────────────────────────────
function renderText(text) {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    const isBullet = trimmed.startsWith('• ');
    const content = isBullet ? trimmed.slice(2) : trimmed;
    return (
      <span key={i} style={{ display: 'block', marginBottom: isBullet ? '4px' : '2px' }}>
        {isBullet && (
          <span style={{ color: 'var(--accent)', marginRight: '6px', fontWeight: 700 }}>•</span>
        )}
        {linkifyText(content)}
      </span>
    );
  });
}

// ── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`message-row ${isUser ? 'user' : 'bot'}`}>
      {!isUser && (
        <div className="bot-avatar" aria-hidden="true">
          <BotAvatarIcon size={15} />
        </div>
      )}
      <div className="bubble">
        {isUser ? message.text : renderText(message.text)}
        <span className="bubble-time">{message.time}</span>
      </div>
    </div>
  );
}

function LeadFormBubble({
  leadName,
  leadPhone,
  leadEmail,
  leadRegarding,
  leadPhoneError,
  leadEmailError,
  leadError,
  leadSubmitting,
  onChangeName,
  onChangePhone,
  onChangeEmail,
  onChangeRegarding,
  onSubmit,
}) {
  return (
    <div className="message-row bot">
      <div className="bot-avatar" aria-hidden="true">
        <BotAvatarIcon size={15} />
      </div>
      <div className="bubble lead-form-bubble">
        <form className="lead-form" onSubmit={onSubmit}>
          <label>
            Full Name
            <input
              type="text"
              value={leadName}
              onChange={onChangeName}
              placeholder="Enter your full name"
              required
            />
          </label>
          <label>
            Phone Number
            <input
              type="tel"
              value={leadPhone}
              onChange={onChangePhone}
              placeholder="Enter your phone number"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              aria-invalid={leadPhoneError ? 'true' : 'false'}
              aria-describedby={leadPhoneError ? 'lead-phone-error' : undefined}
              required
            />
            {leadPhoneError && (
              <span className="lead-field-error" id="lead-phone-error" role="alert">
                {leadPhoneError}
              </span>
            )}
          </label>
          <label>
            Email Address
            <input
              type="email"
              value={leadEmail}
              onChange={onChangeEmail}
              placeholder="Enter your email"
              aria-invalid={leadEmailError ? 'true' : 'false'}
              aria-describedby={leadEmailError ? 'lead-email-error' : undefined}
            />
            {leadEmailError && (
              <span className="lead-field-error" id="lead-email-error" role="alert">
                {leadEmailError}
              </span>
            )}
          </label>
          <label>
            Regarding
            <select value={leadRegarding} onChange={onChangeRegarding} required>
              <option>Product Inquiry</option>
              <option>Pricing</option>
              <option>Technical Support</option>
              <option>General Query</option>
            </select>
          </label>
          {leadError && <div className="lead-error" role="alert">{leadError}</div>}
          <button type="submit" className="lead-submit-btn" disabled={leadSubmitting}>
            {leadSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}


// ── API Key Setup Screen ───────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [error, setError] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadRegarding, setLeadRegarding] = useState('Product Inquiry');
  const [leadPhoneError, setLeadPhoneError] = useState('');
  const [leadEmailError, setLeadEmailError] = useState('');
  const [leadError, setLeadError] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('chat');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('adminToken') !== null;
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://chatbotttt-6ory.onrender.com';

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // ── Auto-scroll on new messages / typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [inputText]);

  // NOTE: welcome message will be shown when user opens the chat (user gesture)

  // ── Call Groq API
  const callGroq = useCallback(async (history) => {
    const res = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history,
        ],
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody?.error?.message || `Groq API error ${res.status}`);
    }

    const data = await res.json();
    return (
      data.choices?.[0]?.message?.content?.trim() ||
      "I'm sorry, I couldn't generate a response. Please try again."
    );
  }, []);

  // ── Send a message
  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    if (trimmed.length > USER_MESSAGE_LIMIT) {
      setError(`Please keep your message under ${USER_MESSAGE_LIMIT} characters.`);
      return;
    }

    setError('');
    setShowChips(false);

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      time: formatTime(new Date()),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Build history for API — exclude welcome msg, map roles
    const history = trimHistoryToTokenLimit([...messages, userMsg]
      .filter(m => m.id !== 'welcome')
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })));

    try {
      const replyText = normalizeBotText(await callGroq(history));
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: replyText,
        time: formatTime(new Date()),
      }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, callGroq]);

  // ── Keyboard: Enter sends, Shift+Enter adds newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const resetLeadForm = useCallback(() => {
    setLeadName('');
    setLeadPhone('');
    setLeadEmail('');
    setLeadRegarding('Product Inquiry');
    setLeadPhoneError('');
    setLeadEmailError('');
    setLeadError('');
    setLeadSubmitting(false);
  }, []);

  const handleLeadPhoneChange = useCallback((e) => {
    setLeadPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
    setLeadPhoneError('');
  }, []);

  const handleLeadEmailChange = useCallback((e) => {
    setLeadEmail(e.target.value);
    setLeadEmailError('');
  }, []);

  const handleLeadButtonClick = useCallback(() => {
    if (showLeadForm) return;
    setShowChips(false);
    setShowLeadForm(true);
    setLeadError('');
    setMessages(prev => [
      ...prev,
      {
        id: `bot-lead-${Date.now()}`,
        role: 'bot',
        text: 'Sure! Please share your details and our team will contact you shortly.',
        time: formatTime(new Date()),
      },
    ]);
  }, [showLeadForm]);

  const submitLead = useCallback(async (e) => {
    e.preventDefault();
    setLeadError('');
    setLeadPhoneError('');
    setLeadEmailError('');

    if (!leadName.trim() || !leadPhone.trim() || !leadRegarding.trim()) {
      setLeadError('Please fill all required fields before submitting.');
      return;
    }

    if (!/^\d{10}$/.test(leadPhone)) {
      setLeadPhoneError('Invalid number — please enter a valid 10 digit number');
      return;
    }

    if (leadEmail.trim() && !EMAIL_VALIDATION_REGEX.test(leadEmail.trim())) {
      setLeadEmailError('Invalid email — please enter a valid email address');
      return;
    }

    setLeadSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName.trim(),
          phone: leadPhone.trim(),
          email: leadEmail.trim(),
          regarding: leadRegarding,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not save lead.');
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-thanks-${Date.now()}`,
          role: 'bot',
          text: 'Thank you! Our team will contact you within 24 hours. 😊',
          time: formatTime(new Date()),
        },
      ]);
      setShowLeadForm(false);
      resetLeadForm();
    } catch (err) {
      setLeadError(err.message || 'Unable to send lead right now.');
    } finally {
      setLeadSubmitting(false);
    }
  }, [BACKEND_URL, leadEmail, leadName, leadPhone, leadRegarding, resetLeadForm]);

  // ── Init page based on URL hash (for direct navigation)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#/admin' || hash.startsWith('#/admin/')) {
      if (isAdminAuthenticated) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('admin-login');
      }
    } else if (hash === '#/admin-login') {
      setCurrentPage('admin-login');
    } else {
      setCurrentPage('chat');
    }
  }, []);

  // ── Navigate to admin login (instantly, no refresh)
  const goToAdminLogin = () => {
    setCurrentPage('admin-login');
    window.history.replaceState(null, '', '/#/admin-login');
  };

  // ── Navigate to admin dashboard (instantly, no refresh)
  const goToAdmin = () => {
    setCurrentPage('admin');
    window.history.replaceState(null, '', '/#/admin');
  };

  // ── Navigate to chat (instantly, no refresh)
  const goToChat = () => {
    setCurrentPage('chat');
    window.history.replaceState(null, '', '/#/');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('adminToken', 'authenticated');
    localStorage.setItem('adminLoginTime', Date.now().toString());
    goToAdmin();
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoginTime');
    setIsAdminAuthenticated(false);
    goToChat();
  };

  // ── Route rendering based on state (no page refresh)
  if (currentPage === 'admin-login') {
    return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} onBackToChat={goToChat} />;
  }

  if (currentPage === 'admin') {
    if (!isAdminAuthenticated) {
      return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} onBackToChat={goToChat} />;
    }
    return <Admin onLogout={handleAdminLogout} onBackToChat={goToChat} />;
  }

  // ── Render: Chat UI
  return (
    <div className="page-wrapper">
      {isOpen && (
        <div className="chat-widget">

        {/* ── Header ── */}
        <header className="chat-header">
          <div className="header-avatar-wrap">
            <div className="header-avatar" aria-hidden="true">
              <BotAvatarIcon size={22} />
            </div>
            <div className="online-dot" aria-label="Online" />
          </div>

          <div className="header-info">
            <div className="header-name">Support Assistant</div>
            <div className="header-meta">
              <div className="header-status"><span>●</span> Online</div>
              <div className="model-badge" title="Model in use">{MODEL_LABEL}</div>
              <button
                className="close-chat"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                style={{ marginLeft: 8 }}
              >
                ✕
              </button>
              <button
                className="admin-toggle"
                onClick={goToAdminLogin}
                aria-label="Open admin panel"
                title="Admin Dashboard"
              >
                ⚙️
              </button>
            </div>
          </div>
        </header>

        {/* ── Messages ── */}
        <main
          className="messages-area"
          id="messages-container"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </main>

        {/* ── Quick Reply Chips ── */}
        {showChips && (
          <div className="chips-section" role="list" aria-label="Quick reply suggestions">
            {QUICK_REPLIES.map(chip => (
              <button
                key={chip}
                id={`chip-${chip.replace(/\W+/g, '-').toLowerCase()}`}
                className="chip"
                role="listitem"
                onClick={() => sendMessage(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {showLeadForm && (
          <div className="lead-form-wrapper">
            <LeadFormBubble
              leadName={leadName}
              leadPhone={leadPhone}
              leadEmail={leadEmail}
              leadRegarding={leadRegarding}
              leadPhoneError={leadPhoneError}
              leadEmailError={leadEmailError}
              leadError={leadError}
              leadSubmitting={leadSubmitting}
              onChangeName={e => setLeadName(e.target.value)}
              onChangePhone={handleLeadPhoneChange}
              onChangeEmail={handleLeadEmailChange}
              onChangeRegarding={e => setLeadRegarding(e.target.value)}
              onSubmit={submitLead}
            />
          </div>
        )}

        {/* ── Error Banner ── */}
        {error && (
          <div className="error-banner" role="alert">⚠ {error}</div>
        )}

        {/* ── Input ── */}
        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              id="chat-input"
              className="chat-textarea"
              placeholder="Type a message…"
              value={inputText}
              rows={1}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              aria-label="Type your message"
            />
          </div>
          <button
            id="send-btn"
            className="send-btn"
            onClick={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>

        <div className="lead-action-bar">
          <button className="lead-action-btn" onClick={handleLeadButtonClick} type="button">
            <span className="lead-action-icon">📞</span>
            Talk to our team
          </button>
        </div>

      </div>

      )}

      {/* Floating launcher button */}
      {!isOpen && (
        <button
          className="chat-launcher"
          aria-label="Open chat"
          onClick={() => {
            // user gesture: open chat and show welcome
            if (!isOpen) {
              setIsOpen(true);
              const welcome = makeWelcome();
              setMessages([welcome]);
            }
          }}
        >
          💬
        </button>
      )}

      {/* ── Footer ── */}
      <div className="powered-by" aria-label="Powered by Groq">
        <span className="powered-by-spark"><GroqBolt /></span>
        Powered by Groq — ultra-fast AI inference
      </div>
    </div>
  );
}
