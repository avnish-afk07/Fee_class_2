import { useState } from "react";
import "./counter.css";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <h1>Counter</h1>

      <p>{count}</p>

      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>

      <button onClick={() => setCount(count - 1)}>
        Decrease
      </button>
    </div>
  );
}

export default Counter;