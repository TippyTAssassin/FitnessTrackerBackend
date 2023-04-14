import React, { useState, useEffect }  from 'react';
import {createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes} from 'react-router-dom';
import Header from './header.js';
import Footer from './footer.js';


const App = () => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(window.localStorage.getItem('token'));

  return (
    <>
      <Header isLoggedIn={isLoggedIn}/>
      <Routes>

      </Routes>
      <Footer />
    </>
  )
}


const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <HashRouter>
       <App />
    </HashRouter>
);

