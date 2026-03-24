import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ClerkProvider } from '@clerk/react'
import { BrowserRouter } from 'react-router-dom'
import {dark} from "@clerk/themes"


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')!).render(
  <ClerkProvider appearance={{
    theme: dark,
    Variables: {
        colorPrimary: "#4f39f6",
        colorTextOnPrimaryBackground: "#ffffff"
    }
  }} publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
)