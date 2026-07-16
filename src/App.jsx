import React, { useMemo, useState, useEffect, useRef } from 'react';
import { defaultMerchants, analyzeMerchant } from './data';
import './App.css';

// Mock AI Logic
const getAIResponse = (input) => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('risk') || lowerInput.includes('signal') || lowerInput.includes('churn') || lowerInput.includes('calculate')) {
    return "Merchants are flagged based on 3 signals: >=14 days no login, >=5% API errors, or >=3 open tickets. 1 signal = Medium Risk. 2+ signals = High Risk.";
  }
  if (lowerInput.includes('action') || lowerInput.includes('what to do') || lowerInput.includes('prevent')) {
    return "High risk triggers immediate CSM intervention. Medium risk suggests tactical actions based on the specific signal (like an email or tech support check).";
  }
  if (lowerInput.includes('add') || lowerInput.includes('new') || lowerInput.includes('create')) {
    return "You can add a new merchant using the '+ New Company' button at the top. Your entries are saved to localStorage automatically.";
  }
  if (lowerInput.includes('theme') || lowerInput.includes('dark') || lowerInput.includes('light') || lowerInput.includes('mode') || lowerInput.includes('color')) {
    return "You can toggle light and dark mode using the moon/sun icon in the top right corner!";
  }
  if (lowerInput.includes('feature') || lowerInput.includes('work') || lowerInput.includes('help') || lowerInput.includes('website') || lowerInput.includes('dashboard') || lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return "This dashboard tracks merchant health! Features include: 1) Real-time risk scoring. 2) Light/Dark mode toggle. 3) Adding custom merchants (which saves locally). 4) Filtering by risk level. Try asking me 'how is risk calculated?'";
  }
  
  return "I'm not quite sure! Try asking about the 'features', 'how risk is calculated', or how to 'add a merchant'.";
};

function App() {
  const [filter, setFilter] = useState('All');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  // Persistence
  const [merchants, setMerchants] = useState(() => {
    const saved = localStorage.getItem('merchantsData');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultMerchants;
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({
    name: '', planTier: 'Startup', daysSinceLastLogin: 0, apiErrorRate: 0, openSupportTickets: 0, monthlyRevenue: 0
  });

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hi! I can explain the churn logic or help you navigate the dashboard. What do you need?", sender: "ai" }
  ]);
  const chatBodyRef = useRef(null);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persist Merchants
  useEffect(() => {
    localStorage.setItem('merchantsData', JSON.stringify(merchants));
  }, [merchants]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleAddMerchant = (e) => {
    e.preventDefault();
    const newRecord = {
      id: `m${Date.now()}`,
      name: newForm.name,
      planTier: newForm.planTier,
      daysSinceLastLogin: Number(newForm.daysSinceLastLogin),
      apiErrorRate: Number(newForm.apiErrorRate),
      openSupportTickets: Number(newForm.openSupportTickets),
      monthlyRevenue: Number(newForm.monthlyRevenue)
    };
    setMerchants([...merchants, newRecord]);
    setShowAddForm(false);
    setNewForm({ name: '', planTier: 'Startup', daysSinceLastLogin: 0, apiErrorRate: 0, openSupportTickets: 0, monthlyRevenue: 0 });
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMessages = [...messages, { text: chatInput, sender: "user" }];
    setMessages(newMessages);
    setChatInput("");
    
    // Simulate AI delay
    setTimeout(() => {
      setMessages(prev => [...prev, { text: getAIResponse(chatInput), sender: "ai" }]);
    }, 600);
  };

  const analyzedMerchants = useMemo(() => merchants.map(analyzeMerchant), [merchants]);
  const filteredMerchants = useMemo(() => {
    if (filter === 'All') return analyzedMerchants;
    return analyzedMerchants.filter(m => m.riskLevel === filter);
  }, [analyzedMerchants, filter]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Analytics</h1>
          <p>Monitor your merchants and take proactive steps.</p>
        </div>
        <div className="header-controls">
          <button className="btn-icon" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="controls">
          <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Close' : '+ New Company'}
          </button>
          
          <div className="filter-wrapper">
            <span style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Filter:</span>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="risk-filter">
              <option value="All">All</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Safe">Safe</option>
            </select>
          </div>
        </div>

        {showAddForm && (
          <form className="add-merchant-form" onSubmit={handleAddMerchant}>
            <h3>Add New Company</h3>
            <div className="form-grid">
              <input required placeholder="Company Name" value={newForm.name} onChange={e => setNewForm({...newForm, name: e.target.value})} />
              <select value={newForm.planTier} onChange={e => setNewForm({...newForm, planTier: e.target.value})}>
                <option value="Startup">Startup</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              <label>Days Since Last Login:
                <input type="number" required min="0" value={newForm.daysSinceLastLogin} onChange={e => setNewForm({...newForm, daysSinceLastLogin: e.target.value})} />
              </label>
              <label>API Error Rate (%):
                <input type="number" required min="0" step="0.1" value={newForm.apiErrorRate} onChange={e => setNewForm({...newForm, apiErrorRate: e.target.value})} />
              </label>
              <label>Open Support Tickets:
                <input type="number" required min="0" value={newForm.openSupportTickets} onChange={e => setNewForm({...newForm, openSupportTickets: e.target.value})} />
              </label>
              <label>Monthly Revenue ($):
                <input type="number" required min="0" value={newForm.monthlyRevenue} onChange={e => setNewForm({...newForm, monthlyRevenue: e.target.value})} />
              </label>
            </div>
            <button type="submit" className="btn-primary" style={{marginTop: '1.5rem'}}>Save Company</button>
          </form>
        )}

        <div className="merchant-grid">
          {filteredMerchants.map((merchant, idx) => (
            <div 
              key={merchant.id} 
              className={`merchant-card risk-${merchant.riskLevel.toLowerCase()}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="card-header">
                <h2>{merchant.name}</h2>
                <span className={`badge badge-${merchant.riskLevel.toLowerCase()}`}>{merchant.riskLevel}</span>
              </div>
              
              <div className="card-body">
                <div className="metric">
                  <span className="metric-label">Plan Tier</span>
                  <span className="metric-value">{merchant.planTier}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">MRR</span>
                  <span className="metric-value">${merchant.monthlyRevenue}</span>
                </div>
                
                {merchant.signals.length > 0 && (
                  <div className="signals-container">
                    <h3>Risk Signals ({merchant.signals.length})</h3>
                    <ul className="signals-list">
                      {merchant.signals.map((signal, sIdx) => (
                        <li key={sIdx}>
                          <span className="signal-dot"></span>
                          {signal.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="action-container">
                  <h3>Action</h3>
                  <p className="action-text">{merchant.recommendedAction}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredMerchants.length === 0 && (
            <div className="merchant-card" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem'}}>
              <h3 style={{color: 'var(--text-secondary)'}}>No merchants match the selected filter.</h3>
            </div>
          )}
        </div>
      </main>

      {/* AI Chat Widget */}
      <div className="ai-chat-widget">
        {isChatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <span>🤖 Dashboard AI</span>
              <button className="close-btn" onClick={() => setIsChatOpen(false)}>×</button>
            </div>
            <div className="chat-body" ref={chatBodyRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <form className="chat-input-area" onSubmit={handleChatSubmit}>
              <input 
                type="text" 
                placeholder="Ask about churn logic..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
        {!isChatOpen && (
          <button className="chat-toggle-btn" onClick={() => setIsChatOpen(true)}>
            ✨
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
