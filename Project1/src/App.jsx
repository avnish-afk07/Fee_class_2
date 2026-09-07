import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Cart from './cart.jsx';
// import Product from '../../Product/src/Product.jsx';
// import Counter from './Counter.jsx';

function App() {
  const [count, setCount] = useState(0)
  const a = "Avnish";
  const fruits = ["Strawwberryy", "Mango", "Apple"];
  const colors = ["#FF1493", "#FFD700", "#228B22"];
  return (
    <>
      <h1>Chitkara University</h1>
      <h2>G1</h2>
      <h2>hillo</h2>
      <h1>{a}</h1>
      <input type="text" />
      {/* <ul>
        <li style={{color: colors[0]}}>{fruits[0]}</li>
        <li style={{color: colors[1]}}>{fruits[1]}</li>
        <li style={{color: colors[2]}}>{fruits[2]}</li>
      </ul> */}
      {/* <ul>
        {fruits.map((fruit, index) => (
          <li key={index} style={{color: colors[index]}}>{fruit}</li>
        ))}
      </ul> */}
      <ul>
        {fruits.map((fruit, index) => (
          <li key={index}>{fruit}</li>
        ))}
      </ul>
      <Cart />
      {/* <Product /> */}
      {/* <Counter /> */}
    </>
  )
}

export default App;
// import Cart from './cart';