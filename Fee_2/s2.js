// const a = ()=>({a:1, b:2});
// console.log(a());
function a(b){
    return b(1,2,3);
}
let b = (...number)=>{ // rest
    return number;
};
console.log(...b(0,1)); // spread operator
console.log(a(b));

