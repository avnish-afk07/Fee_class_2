import { useParams } from "react-router-dom";

function Products() {

    const { id } = useParams();

    return (
        <div>
            <h1>Products</h1>

            <p>Product ID: {id}</p>
        </div>
    );
}

export default Products;