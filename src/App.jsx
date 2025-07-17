import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import ai_processing_loading from './assets/ai_processing.mp4';
import logo from './assets/logoStars.jpeg'

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state

  async function generateAnswer() {
    setLoading(true);  // Set loading to true when the request starts
    setAnswer('');     // Clear the answer before new request

    try {
      const apiKey = import.meta.env.VITE_GEMIMI_API;
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        method: "post",
        data: {
          contents: [{
            parts: [{ text: question }]
          }]
        }
      });
      const getAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(getAnswer);
    } catch (error) {
      setAnswer('Something went wrong, please try again later.');
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      generateAnswer();
    }
  };

  const classNameForOutputBox = "outPut-container";
  const classNameForOutputBoxHidden = "outPut-container-hidden";
  const classNameForHeadding = "chatbot-header";
  const classNameForHeaddingCenter = "chatbot-header-center";

  return (
    <div className="chatbot-container">
      <div className="heading">
        <img className={answer === "" ? "chatbotLogoCenter" : "chatbotLogo"} src={logo} alt="" />
        <h1 className={answer === "" ? classNameForHeaddingCenter : classNameForHeadding}>Chat Bot</h1>
      </div>

      {/* Conditionally render the video while loading */}
      {loading && (
        <video className='videoProcessingGIF' width="400" autoPlay loop muted playsInline>
          <source src={ai_processing_loading} type="video/mp4" />
        </video>
      )}

      <div className={answer === "" ? classNameForOutputBoxHidden : classNameForOutputBox}>
        <pre className="responseText"><ReactMarkdown>{answer}</ReactMarkdown></pre>

      </div>

      <div className="promptInputAndButton-container">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
          type="text"
          placeholder="What is the capital of India?"
        />
        <button onClick={generateAnswer}>Generate</button>
      </div>
    </div>
  );
}

export default App;
