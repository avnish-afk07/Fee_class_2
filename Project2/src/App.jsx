import Demo1 from './components/demo1.jsx'
import Display from './components/display.jsx'
import Form from './components/formHandling.jsx'
import Hooks from './components/hooks.jsx'
import Demo2 from './components/demo2.jsx'
import Navbar from './components/Navbar.jsx'
import About from './components/About.jsx'
import Products from './components/Products.jsx'
import Login from './components/Login.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  const id = 1;
  return (
    <>
      {/* <Demo2 /> */}
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Navbar />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products/:id" element={<Products />} />
        </Routes>
      </BrowserRouter>
      {/* <Hooks />
      <Form />
      <Demo1 />
      <Display /> */}
    </>
  )
}

export default App