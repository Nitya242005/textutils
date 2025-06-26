import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
//import About from './components/About';
import TextForm from './components/TextForm';
import Alert from './components/Alert';
import React,{useState} from 'react';
//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";




function App() {
  const [mode,setMode]=useState('light');
  const[switchtext,setSText]=useState('Enable dark mode');
  const [alert,SetAlert]=useState(null);
  const showAlert=(message,type)=>{
    SetAlert({
      msg:message,
      type:type
    })
    setTimeout(() => {
      SetAlert(null);
    }, 3000);
  }

  const toggleMode=()=>{
    if(mode==='light'){
      setMode('dark');
      setSText('Enable light mode');
      document.body.style.backgroundColor='#042743';
      showAlert('Dark mode enabled','success');
    }
    else{
      setMode('light');
      setSText('Enable dark mode');
      document.body.style.backgroundColor='white';
      showAlert('Light mode enabled','success');
    }

  }
  return (
    <>
    <Navbar title="TextUtils2" aboutText="About Us" mode={mode} toggleMode={toggleMode} switchtext={switchtext}/>
    <Alert alert={alert}/>
  
  <TextForm heading="Enter text to analyse" mode={mode} showAlert={showAlert} />
  
   </>
  );
}

export default App;
