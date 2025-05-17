interface Product{
    _id: string;
    productName: string;
    productDescription: string;
    price: number;
    inStock: number;
    createdAt: string;
    updatedAt: string;
}
interface ProductDetailsProps{
    product: Product;
}
export const ProductDetails: React.FC< ProductDetailsProps > = ({ product })=>{
    return(
        <div className="product-details">
            <h4>Product Name: Mouse</h4>
            <p>Product Description: Test</p>
            <p>price: 200</p>
            <p>Instock: yes</p>
        </div>
    )
}