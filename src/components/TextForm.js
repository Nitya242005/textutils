import React, { useState, useEffect } from "react";

export default function TextForm(props) {
  const [text, setText] = useState('');
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [remainingTime, setRemainingTime] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const savedText = localStorage.getItem("text");
    if (savedText) setText(savedText);
  }, []);

  useEffect(() => {
    localStorage.setItem("text", text);
  }, [text]);

  const handleOnChange = (event) => {
    const newText = event.target.value;
    setHistory([...history, text]);
    setText(newText);
    setFuture([]);
  };

  const handleUpClick = () => {
    setHistory([...history, text]);
    let newText = text.toUpperCase();
    setText(newText);
    props.showAlert("Converted to uppercase", "success");
  };

  const handleLoClick = () => {
    setHistory([...history, text]);
    let newText = text.toLowerCase();
    setText(newText);
    props.showAlert("Converted to lowercase", "success");
  };

  const handleCapitalize = () => {
    setHistory([...history, text]);
    setText(
      text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
    props.showAlert("Capitalised", "success");
  };

  const handleClear = () => {
    setHistory([...history, text]);
    setText("");
    props.showAlert("Cleared text", "success");
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
    props.showAlert("Copied to clipboard", "success");
  };

  const readAloud = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeechToText = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (e) => {
      let transcript = "";
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setText(transcript);
    };

    recognition.onerror = (e) => {
      console.error("Error in recognition:", e.error);
    };

    recognition.start();
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture([text, ...future]);
    setText(prev);
    setHistory(history.slice(0, history.length - 1));
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory([...history, text]);
    setText(next);
    setFuture(future.slice(1));
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "TextUtils-Note.txt";
    document.body.appendChild(element);
    element.click();
    props.showAlert("Downloaded as .txt", "success");
  };

  const handleRemoveExtraSpaces = () => {
    let newText = text.replace(/\s+/g, " ").trim();
    setHistory([...history, text]);
    setText(newText);
    props.showAlert("Extra spaces removed", "success");
  };

  const startReadingCountdown = () => {
    const wordCount = text.trim().split(/\s+/).filter((e) => e.length !== 0).length;
    const totalSeconds = Math.ceil((wordCount / 125) * 60);

    if (totalSeconds === 0) {
      props.showAlert("Not enough text to estimate reading time", "warning");
      return;
    }

    setRemainingTime(totalSeconds);

    const id = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(id);
  };

  const stopCountdown = () => {
    clearInterval(intervalId);
    setRemainingTime(null);
  };

  return (
    <>
      <div className="container" style={{ color: props.mode === "dark" ? "white" : "#042743" }}>
        <h1>{props.heading}</h1>
        <div className="mb-3 my-3">
          <textarea
            className="form-control"
            id="myBox"
            rows="8"
            value={text}
            onChange={handleOnChange}
            style={{
              backgroundColor: props.mode === "dark" ? "#13466e" : "white",
              color: props.mode === "dark" ? "white" : "#042743",
            }}
          ></textarea>
        </div>

        {/* Buttons */}
        <button className="btn btn-primary mx-1 my-1" onClick={handleUpClick}>Uppercase</button>
        <button className="btn btn-warning mx-1 my-1" onClick={handleLoClick}>Lowercase</button>
        <button className="btn btn-success mx-1 my-1" onClick={handleCapitalize}>Capitalize</button>
        <button className="btn btn-dark mx-1 my-1" onClick={handleClear}>Clear</button>
        <button className="btn btn-danger mx-1 my-1" onClick={handleCopyClick}>Copy</button>
        <button className="btn btn-info mx-1 my-1" onClick={readAloud}>🔊 Speak</button>
        <button className="btn btn-secondary mx-1 my-1" onClick={handleSpeechToText}>🎙️ Voice Input</button>
        <button className="btn btn-outline-secondary mx-1 my-1" onClick={handleUndo}>↩️ Undo</button>
        <button className="btn btn-outline-secondary mx-1 my-1" onClick={handleRedo}>↪️ Redo</button>
        <button className="btn btn-dark mx-1 my-1" onClick={handleDownload}>⬇️ Download</button>
        <button className="btn btn-warning mx-1 my-1" onClick={handleRemoveExtraSpaces}>🧹 Remove Extra Spaces</button>
      </div>

      <div className="container my-3" style={{ color: props.mode === "dark" ? "white" : "black" }}>
        <h2>Your Text Summary</h2>
        {text.trim().length > 0 ? (
          <>
            <p>
              {text.trim().split(/\s+/).filter((e) => e.length !== 0).length} words and{" "}
              {text.trim().length} characters
            </p>
            <div className="my-2">
              <button className="btn btn-outline-primary mx-1" onClick={startReadingCountdown}>
                ⏱️ Start Reading Timer
              </button>
              <button className="btn btn-outline-danger mx-1" onClick={stopCountdown}>
                ⏹️ Stop
              </button>
            </div>
            {remainingTime !== null && (
              <p>
                ⏳ Time Remaining: {Math.floor(remainingTime / 60)} min {remainingTime % 60} sec
              </p>
            )}
          </>
        ) : (
          <p>0 words and 0 characters</p>
        )}
      </div>
    </>
  );
}
