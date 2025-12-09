const { CART_STORE_KEY } = window.wc.wcBlocksData;
import { select, useSelect,useDispatch } from '@wordpress/data'
import React from 'react'

const Cart = () => {
    const {cart,isResolving} = useSelect((select)=>{
        return {
            cart:select(CART_STORE_KEY).getCartData(),
            isResolving:select(CART_STORE_KEY).isCartDataLoading(),
        }
    },[])

    console.log(cart);
    console.log(CART_STORE_KEY);


  return (
    <div>Cart</div>

  )
}

export default Cart