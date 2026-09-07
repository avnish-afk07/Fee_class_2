import { useState } from "react";
import Display from './display.jsx'
import Form from './formHandling.jsx'


function demo1() {

    // cart count state
    const [count, setCount] = useState(0);
    const [name, setName] = useState("Avnish");
    const [theme, setTheme] = useState("dark");
    const [student, setStudent] = useState({name: "Avnish", age: 19});
    const [fruits, setFruit] = useState(["Strawberry", "Mango", "Litchi", "Avocado"]);
    function handleName() {
        setName(prevName => prevName === "Avnish" ? "xyz" : "Avnish");
    }
    function handleTheme(){
        setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark");
    }
    function handlelName(){
        setStudent(prevStudent => ({ ...prevStudent, lName: "Saini" }));
    }
    function handleFruit(){
        setFruit(prevFruits => [...prevFruits, "Orange"]);
    }
    return (
        <div>
            <Form />

            <div>
                {fruits.map((fruit, index) => (
                    <li key={index}>{fruit}</li>
                ))}
                <button onClick={handleFruit}>Add a fruit</button>
            </div>
            <div>
                <p>Student Name: {student.name}</p>
                {/* <p>Last Name: {student.lName ? student.lName = "Saini" : "Details not found!"}</p> */}
                <p><button onClick={handlelName}>Show Last Name</button>{student.lName && ` LastName: ${student.lName}`}</p>
                {/* <p><button onClick={handlelName}>Show Last Name</button>{student.lName ? `Last Name = ${student.lName}` : "Details not found!" }</p> */}
                <p>Age: {student.age}</p>
            </div>
            <div>
                {/* <h2 className={name === "Avnish" ? "red" : "green"}>
                    Name: {name}
                </h2> */}
                <h2
                    style={{
                        color: name === "Avnish" ? "red" : "green"
                    }}
                >
                    Name: {name}
                </h2>
                <button onClick={handleName}>Change Name</button>
            </div>

            <div style={{}}>
                <button className = {theme} style={{ border: "2px solid red", height: "100px", width: "100px"}} onClick={handleTheme}>Change Theme</button>
            </div>

            <h1>Product Cart</h1>

            <h2>Cart Items: {count}</h2>

            <div>
                <h3>Mobile</h3>
                <p>Price: ₹20,000</p>
                <button onClick={() => setCount(count + 1)}>
                    Add to Cart
                </button>
            </div>

            <div>
                <h3>Laptop</h3>
                <p>Price: ₹50,000</p>
                <button onClick={() => setCount(count + 1)}>
                    Add to Cart
                </button>
            </div>

            <div>
                <h3>Headphones</h3>
                <p>Price: ₹2,000</p>
                <button onClick={() => setCount(count + 1)}>
                    Add to Cart
                </button>
            </div>

            {/* <button onClick={() => setCount(count - 1)}>
                Remove from Cart
            </button> */}
            <button onClick={() => {
                setCount(prev => prev - 1);
                setCount(prev => prev - 1);
                setCount(prev => prev - 1);
            }}>
                Remove from Cart * 3
            </button>
            <Display count={count} />
        </div>
    );
}

export default demo1;