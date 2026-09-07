import { useState, useRef } from "react";

function demo2() {

    const count = useRef(0);
    const renderCount = useRef(0);
    const clickCount = useRef(0);

    const [, setRender] = useState(0);

    renderCount.current++;

    function increase() {
        count.current++;
        setRender(prev => prev + 1);
    }

    function inputClick() {
        clickCount.current++;
        console.log("Input clicks:", clickCount.current);
    }

    return (
        <div>

            <h2>Count: {count.current}</h2>

            <h2>Render Count: {renderCount.current}</h2>

            <button onClick={increase}>
                Increase
            </button>

            <input
                type="text"
                onClick={inputClick}
            />

        </div>
    );
}

export default demo2;