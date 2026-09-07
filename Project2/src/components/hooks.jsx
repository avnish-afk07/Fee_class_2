import { useState, useEffect } from "react";

function Hooks() {

    const [count, setCount] = useState(0);
    // useEffect(()=>{
    //     console.log(count);
    // }, [count]);
    // useEffect(()=>{
    //    alert(1);
    // })
    // useEffect(()=>{
    //    alert(1);
    // }, [])
    // useEffect(() => {
    //     fetch('https://dummyjson.com/products/1')
    //         .then(res => res.json())
    //         .then(console.log);
    // });
    const [products, storeProducts] = useState([]);
    // useEffect(() => {
    //     fetch('https://dummyjson.com/products/')
    //         .then(res => res.json())
    //         .then(console.log);
    // }, []);
    useEffect(() => {
        fetch('https://dummyjson.com/products/')
            .then(res => res.json())
            .then(data => storeProducts(data.products));
    }, []);
    // useEffect(() => {
    //     fetch('https://dummyjson.com/products/')
    //         .then(res => res.json())
    //         .then(data => storeProducts(data.products));
    // }, [count]);
    return (
        <div>
            <h2>Count: {count}</h2>

            <button onClick={() => setCount(count + 1)}>
                Increase
            </button>
            <div>
                {products
                    .slice(count * 10, count * 10 + 10)
                    .map((product) => (
                        <li key={product.id}>
                            {product.title}
                        </li>
                    ))
                }

                <button onClick={() => setCount(count + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default Hooks;