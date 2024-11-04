import React, { useState } from 'react'
import './App.css'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  async function generateAnswer() {
    setAnswer("Loading...")
    try {
      const apiKey = import.meta.env.VITE_GEMIMI_API
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        method: "post",
        data: {
          "contents":
            [{
              "parts":
                [{ "text": question }]
            }]
        }
      })
      const getAnswer = response['data']['candidates'][0]['content']['parts'][0]['text']
      setAnswer(getAnswer)
    } catch (error) {
      setAnswer("something is worng, please try again later")
    }
  }

  return (
    <div className="chatbot-container">
      <h1 className="chatbot-header">Chat Bot</h1>
      <div className="outPut-container">
        <pre><ReactMarkdown>{answer}</ReactMarkdown></pre>
      </div>
      <div className="promptInputAndButton-container">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} type="text" placeholder='What is the capital of India ?' />
        <button onClick={generateAnswer}>Generate</button>
      </div>
    </div>
  );
}

export default App;
