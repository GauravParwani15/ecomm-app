import axios from 'axios';

import { ALL_PRODUCTS_REQUEST, ALL_PRODUCTS_SUCCESS, ALL_PRODUCTS_FAILURE, CLEAR_ERRORS } from '../constants/productConstants';

export const getProducts = ()=> async (dispatch)=> {
    try {
        dispatch({
            type: ALL_PRODUCTS_REQUEST
        });

        const { data } = await axios.get('http://localhost:5000/api/v1/products');
        console.log(data); 

        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: ALL_PRODUCTS_FAILURE,
            payload: error.response.data.message || 'An unexpected error occurred'
        })
    }
}

//clear errors
export const clearErrors = ()=> async (dispatch)=> {
    dispatch({
        type: CLEAR_ERRORS
    })
}
