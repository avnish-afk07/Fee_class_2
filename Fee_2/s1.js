// var is function scoped and can be redeclared and reinitialised.
// var a = 1;
// var a = 5;

// function s(){
//     var b = 10;
//     console.log(a);
// }
// s()
// console.log(b)

// if(true) var c = 15;
// console.log(c)

// let can be reassigned but cannot be redeclared and it is block scoped{}
// if(true){
//     let a = 10;
// }
// console.log(a)

// const cannot be redeclared and reassigned and it is block scoped{}

// console.log(a);
// var a = 10;
// console.log(a);

// function sum(){
//     console.log(arguments);
//     return arguments[0] + arguments[1];
// }
// console.log(sum(5,6));

let a = [1,2,2,3,4, "Avnish"];
console.log(a.at(-1));
// a.shift();
console.log(a)
console.log(a.findIndex(x=>x==1));



const btn = document.createElement("button");
btn.textContent = "Delete";
btn.addEventListener("click", () => {
    console.log("delete");
});
document.body.appendChild(btn);