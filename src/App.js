import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import 'tailwindcss/tailwind.css';
import './App.css'

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('What is chatbot?');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, user: true }];
      setMessages(newMessages);
      setInput('');

      try {
        setLoading(true);
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.REACT_APP_API_KEY}`,
          {
            "contents": [
              {
                "parts": [
                  {
                    "text": input
                  }
                ]
              }
            ]
          }
        );
        console.log(response);
        const botResponse = response.data.candidates[0].content.parts[0].text;
        setLoading(false);
        setMessages([...newMessages, { text: botResponse, user: false }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setLoading(false);
        setMessages([...newMessages, { text: 'Error: Could not get response from AI', user: false }]);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-cyan-400 to-blue-400 p-4">
      <h1 className="mb-4 font-bold text-[2.5rem] drop-shadow-lg text-blue-50">ChatBot</h1>
      <div className="bg-white w-full max-w-[1000px] shadow-lg rounded-lg overflow-hidden">
        <div className="p-4  h-5/6 min-h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.user? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`rounded-lg p-2 shadow-md overflow-x-hidden flex flex-wrap ${msg.user? 'bg-cyan-500 text-white' : 'bg-gray-100'}`}>
                <ReactMarkdown>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex  h-screen">
            <div className="relative">
              <div className="h-10 w-10 rounded-full border-t-4 border-b-4 border-gray-200"></div>
              <div className="absolute top-0 left-0 h-10 w-10 rounded-full border-t-4 border-b-4 border-cyan-500 animate-spin"></div>
            </div>
          </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 flex">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg outline-none"
            placeholder="Ask your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="ml-2 bg-cyan-500 text-white py-2 px-4 rounded-lg hover:bg-cyan-600 transition-all"
            onClick={handleSendMessage}
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;