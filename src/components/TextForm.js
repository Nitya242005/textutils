import React,{ useState } from "react"



export default function TextForm(props) {
    const [text,setText]=useState('');
    const handleUpClick=()=>{
        console.log("Uppercase was clicked"+text);
        let newText=text.toUpperCase();
        setText(newText);
        props.showAlert("Converted to uppercase","success");
    }
    const handleLoClick=()=>{
        let newtext=text.toLowerCase();
        setText(newtext);
        props.showAlert("Converted to lowercase","success");
    }
    const handleCapitalize=()=>{
        setText(text.split(" ").map((word)=>word.charAt(0).toUpperCase()+word.slice(1)).join(" "));
        props.showAlert("Capitalised","success");
    }
    const handleClear=()=>{
        let newtext1="";
        setText(newtext1);
        props.showAlert("Cleared text","success");
    }
    const handleCopyClick = () => {
  navigator.clipboard.writeText(text);
  props.showAlert("Copied to clipboard","success");
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
  recognition.interimResults = true;   // Show partial results as you speak
  recognition.continuous = false;      // Stop when you stop speaking
  
  recognition.onresult = (e) => {
    let transcript = "";
    for (let i = 0; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript;
    }
    setText(transcript);  // Updating state
  };
  
  recognition.onerror = (e) => {
    console.error("Error occurred in recognition:", e.error);
  };
  
  recognition.start();
};


    const handleOnChange=(event)=>{
        console.log("On Change");
        setText(event.target.value)
    }
return (
<>
<div className="container" style={{color:props.mode==='dark'?'white':'#042743'}}>
<h1>{props.heading}</h1>
<div className="mb-3 my-3">
<textarea className="form-control" id="myBox" rows="8" value={text} onChange={handleOnChange} style={{backgroundColor:props.mode==='dark'?'grey':'white',color:props.mode==='dark'?'white':'#042743'}}></textarea>
</div>
<button className="btn btn-primary" onClick={handleUpClick}>Convert to UpperCase</button>
<button className="btn btn-warning mx-3" onClick={handleLoClick}>Convert to LowerCase</button>
<button className="btn btn-success mx-3" onClick={handleCapitalize}>Capitalize</button>
<button className="btn btn-dark mx-3" onClick={handleClear}>Clear</button>
<button className="btn btn-danger mx-3" onClick={handleCopyClick}>Copy to ClipBoard</button>
<button className="btn btn-info mx-3" onClick={readAloud}>Text to Speech</button>
<button className="btn btn-secondary mx-3" onClick={handleSpeechToText}>🎙️ Voice Input</button>



</div>
<div className="container my-3"  style={{color:props.mode==='dark'?'white':'black'}}>
    <h2>Your Text Summary</h2>
    <p>{text.split(" ").length} words and {text.length} characters</p>
    <p>{0.008*text.split(" ").length} minutes read</p>
</div>

</>

)
}

