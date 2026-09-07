import { useState, useEffect } from "react";

function formHandling(){
    // const [k, setK] = useState(0);
    const [name, setName] = useState("");
    const [lName, setLName] = useState("");

    // use prevName or prevVar when the new State depend on th eold State
    function handleNameChange(e){
        // setName(prevName => prevName = e.target.value);
        setName(e.target.value);
        // console.log(name);
    }
    function handleName(){
        setName(prevName => prevName === "Avnish" ? "xyz" : "Avnish");
    }
    useEffect(()=>{
        console.log(name);
    }, [name]);

    function handleLNameChange(e){
        // setLName(prevLName => prevLName = e.target.value);
        setLName(e.target.value);
    }
    return (
        <div>
            <div>
                <input type="text" placeholder="Enter name" onChange={handleNameChange} value = {name}/>
                <p>{name}</p>
                <button onClick={handleName}>Change name</button>
                <div></div>
                <input type="text" placeholder="Enter last name" onChange={handleLNameChange} value={lName}/>
                <p>{lName}</p>
            </div>
        </div>
    );
}

export default formHandling;