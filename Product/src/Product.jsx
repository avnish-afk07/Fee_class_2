import "./Product.css";

function Product({ name, price, image, stock }) {
  return (
    <div className="product">
      <img src={image} alt={name} />
      <h2>{name}</h2>
      <div>Price: {price}</div>
      <div>Stock: {stock}</div>
      <button className="cart">Add to Cart</button>
    </div>
  );
}

function App() {

  const products = [
    { name: "iPhone 16", price: 80000, category: "electronics" },
    { name: "Samsung TV", price: 60000, category: "electronics" },
    { name: "Nike Shoes", price: 12000, category: "fashion" },
    { name: "MacBook Pro", price: 150000, category: "electronics" },
    { name: "Watch", price: 55000, category: "fashion" }
  ];

  // Products with price greater than 50,000
  const expensiveProducts = products.filter(
    product => product.price > 50000
  );

  // Products whose category is electronics
  const electronics = products
    .filter(product => product.category === "electronics")
    .map(product => product.name);

  return (
    <>
      <h1>Expensive Products</h1>

      {expensiveProducts.map(product => (
        <div key={product.name}>
          {product.name} - ₹{product.price}
        </div>
      ))}

      <h1>Electronics</h1>

      {electronics.map(name => (
        <div key={name}>{name}</div>
      ))}
    </>
  );
}

export default App;