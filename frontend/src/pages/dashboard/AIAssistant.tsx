
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { CSSProperties } from 'react';

import { useAuth } from '../../components/auth/AuthContext';


export default function AIAssistant() {
  const { user } = useAuth();
  if (!user) return null;
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      content: `Hello ${user?.username || ''}! I'm your HappyTails AI Assistant. How can I help you with your pet today?`,
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesContainerRef.current?.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/ai/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          message: inputValue,
          conversationHistory: messages.map(m => ({
            role: m.sender,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      // Add AI response
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: data.response,
        sender: 'assistant',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "Sorry, I encountered an error. Please try again later.",
        sender: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-assistant-container">
      <div className="ai-assistant-header">
        <h1 className="ai-assistant-title">
          <FontAwesomeIcon icon={faRobot} className="ai-icon" />
          HappyTails AI Assistant
        </h1>
        <p className="ai-assistant-subtitle">
          Get instant advice about pet care, health, training, and more
        </p>
      </div>

      <div className="ai-chat-container">
        <div className="ai-messages" ref={messagesContainerRef}>
          {messages.map(message => (
            <div
              key={message.id}
              className={`ai-message ${message.sender}`}
            >
              <div className="message-content">
                <ReactMarkdown
                  children={message.content}
                  components={{
                    code({ node, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !className && match ? (
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {DOMPurify.sanitize(String(children))}
                        </code>
                      );
                    },
                    p: ({ children }) => <p className="message-paragraph">{children}</p>,
                    a: ({ children, href }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="message-link">
                        {DOMPurify.sanitize(String(children))}
                      </a>
                    )
                  }}
                />
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message ai">
              <div className="message-content">
                <FontAwesomeIcon icon={faSpinner} spin />
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-input-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me about pet care, health, training..."
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="ai-send-button"
          >
            <FontAwesomeIcon icon={isLoading ? faSpinner : faPaperPlane} spin={isLoading} />
          </button>
        </div>

        <div className="ai-suggestions">
          <h3>Try asking:</h3>
          <div className="suggestion-buttons">
            {[
              "What should I feed my new puppy?",
              "How do I train my cat to use a scratching post?",
              "What are signs my dog might be sick?",
              "How often should I take my rabbit to the vet?"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputValue(suggestion)}
                className="suggestion-button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

