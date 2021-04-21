import React, { useEffect } from "react";
import { useMutation } from '@apollo/react-hooks';
import Jumbotron from "../components/Jumbotron";
import { ADD_ORDER } from "../utils/mutations"
import { idbPromise } from "../utils/helpers";


function Success() {
    const [addOrder] = useMutation(ADD_ORDER);
    
    useEffect(() => {
        async function saveOrder() {
            // get all of the cart items
            const cart = await idbPromise('cart', 'get');
            // maps the cart items into an array of product IDs.
            const products = cart.map(item => item._id);

            if (products.length) {
                // Once you have the product IDs, you can pass them to the addOrder() mutation. 
                const { data } = await addOrder({ variables: { products } });
                const productData = data.addOrder.products;
                
                // After the mutation executes, you can then delete all of the IDs from the IndexedDB store.
                productData.forEach((item) => {
                    idbPromise('cart', 'delete', item);
                });
            }
            setTimeout(function(){window.location.assign('/');}, 3000);
        }
      
        saveOrder();
    }, [addOrder]);

    return (
      <div>
        <Jumbotron>
          <h1>Success!</h1>
          <h2>
            Thank you for your purchase!
          </h2>
          <h2>
            You will now be redirected to the homepage
          </h2>
        </Jumbotron>
      </div>
    );
  };
  
  export default Success;