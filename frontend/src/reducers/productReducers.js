import {ALL_PRODUCTS_REQUEST, ALL_PRODUCTS_SUCCESS, ALL_PRODUCTS_FAILURE, CLEAR_ERRORS } from '../constants/productConstants';

const initialState = {
    loading: false,
    products: [],
    productsCount: 0,
    error: null
  };

export const porductsReducer = (state = initialState , action)=> {
    switch(action.type) {
        case ALL_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true,
                error:null, //Reset error on new request
                test:" test"
            }
        case ALL_PRODUCTS_SUCCESS:
            console.log("Reducer received payload:", action.payload);
            return {
                ...state,
                loading: false,
                products: action.payload.data || [],
                productsCount: action.payload.productCount || 0,
                count: action.payload.count || 0
            }
        case ALL_PRODUCTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}