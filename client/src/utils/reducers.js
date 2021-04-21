import { useReducer } from 'react';

import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY,
    ADD_TO_CART,
    ADD_MULTIPLE_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART,
    TOGGLE_CART
  } from './actions';

export const reducer = (state, action) => {
    switch (action.type) {
        // if action type value is the value of `UPDATE_PRODUCTS`, return a new state object with
        // an updated products array
        case UPDATE_PRODUCTS:
            return {
                ...state,
                products: [...action.products],
            };
        
        // if action type value is the value of `UPDATE_CATEGORIES`, return a new state object with an updated categories array
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.categories]
        };
        // we are updating the state of currentCategory to a new string value
        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.currentCategory
            };
        // Do not forget to include the ...state operator to preserve everything else on state.
        // Then we can update the cart property to add action.product to the end of the array. 
        case ADD_TO_CART:
            return {
                ...state,
                cartOpen: true,
                cart: [...state.cart, action.product]
            };
        
        case ADD_MULTIPLE_TO_CART:
            return {
                ...state,
                cart: [...state.cart, ...action.products],
            };

        // Note the use of the filter() method that only keeps the items that don't match the provided
        // _id property. In the return statement, we also check the length of the array to set cartOpen
        // to false when the array is empty.    
        case REMOVE_FROM_CART:
            let newState = state.cart.filter(product => {
                return product._id !== action._id;
            });
            
            return {
                ...state,
                cartOpen: newState.length > 0,
                cart: newState
            };

        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                cartOpen: true,

                // Use the map() method to create a new array instead of updating state.cart directly
                // because the original state should be treated as immutable.
                cart: state.cart.map(product => {
                    if (action._id === product._id) {
                        product.purchaseQuantity = action.purchaseQuantity;
                    }
                    return product;
                })
            };

        case CLEAR_CART:
            return {
                ...state,
                cartOpen: false,
                cart: []
            };
        
        case TOGGLE_CART:
            return {
                ...state,
                cartOpen: !state.cartOpen
            };

        // if it's none of these actions, do not update state at all and keep things the same!
        default:
            return state;
    }
};

export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
  }