import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages([...newMessages, { sender: 'ai', text: data.response }]);
    } catch (err) {
      console.error('Error fetching AI response:', err);
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
      <h3>AI Tutor Chat</h3>
      <div style={{ height: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '5px', marginBottom: '10px' }}>
        {messages.length === 0 ? <p>Ask a Python-related question...</p> : messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <p><strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a question..."
        disabled={loading}
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Thinking...' : 'Send'}
      </button>
    </div>
  );
};

export default ChatBox;
