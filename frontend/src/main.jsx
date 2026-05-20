import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import App from './App.jsx'
// import { AppContextProvider } from './context/AppContext.jsx'
import {BrowserRouter} from "react-router-dom";
import { AppContextProvider } from './context/AppContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppContextProvider>
    <App />
  </AppContextProvider>
  </BrowserRouter>,
)


// sudo nano /etc/nginx/sites-available/zooolna.com