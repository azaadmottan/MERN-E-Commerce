import { addProductToCart } from "../actions/cart.actions.js";
import { toast } from "react-toastify";


const AddProductToCart = (e, id) => {

    e.stopPropagation();
    e.preventDefault();

    if (id) {
        addProductToCart(id);
        toast.success("Product added to cart");
    }

}

export { AddProductToCart };