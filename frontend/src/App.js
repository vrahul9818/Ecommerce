import './App.css';
import WebFont from 'webfontloader';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from '../src/components/Home/Home';

function App() {
  
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto', 'Droid Sans'],
      },
    });
  }, []);

  return <div className="App">
  
    <BrowserRouter>
    <Routes>
      <Route path='/' Component={Home}/>
    </Routes>
    </BrowserRouter>
    
  </div>;
}

export default App;
