### Minimal Viable Checkout

### features of custom block
```
Billing Address 
Must use the setBillingAddress action and ensure state synchronizes correctly with the Store API to calculate VAT/Taxes.

Payment Gateway
Must correctly implement the component for your chosen payment gateway (e.g., Stripe, PayPal). This is the most complex part of a custom checkout.

Order Creation
Must call the submitCheckout action and handle the redirect URL and API errors gracefully.

Error Messaging
Must capture and display all API errors (e.g., invalid card, missing required field, coupon error) right next to the relevant field.
```

### Identify Core Data Stores
Store Key : CHECKOUT_STORE_KEY 
Manages address data, shipping rates, payment method selection, and the final order submission.

Actions/Selects
setBillingAddress,
setSelectedPaymentMethod
submitCheckout
getCheckoutData

Store Key : CART_STORE_KEY
Read-only access to cart items, coupons, and totals.
Actions/Selects 
getCartData


### The Main Component
```
import { useSelect, useDispatch } from '@wordpress/data';
import React, { useState } from 'react';
// Assume these keys are correctly imported or loaded via window.wc.wcBlocksData
const { CHECKOUT_STORE_KEY, CART_STORE_KEY } = window.wc.wcBlocksData;

const CustomCheckout = () => {
    // Get essential checkout actions
    const { 
        setBillingAddress, 
        setSelectedPaymentMethod, 
        submitCheckout 
    } = useDispatch(CHECKOUT_STORE_KEY);

    // Get live data from the stores
    const { checkoutData, cartData, isResolving } = useSelect((select) => {
        return {
            checkoutData: select(CHECKOUT_STORE_KEY).getCheckoutData(),
            cartData: select(CART_STORE_KEY).getCartData(),
            isResolving: select(CHECKOUT_STORE_KEY).isCheckoutDataLoading(),
        };
    }, []);

    // Local state for form inputs before committing to the global store
    const [localBilling, setLocalBilling] = useState(checkoutData.billing_address || {});
    const [isProcessing, setIsProcessing] = useState(false);
    
    // ... Error state logic (recommended)
    
    if (isResolving || !cartData || !checkoutData) return <p>Loading Checkout...</p>;
    if (cartData.itemsCount === 0) return <p>Your cart is empty.</p>;

    // ... (useEffect to sync localBilling to setBillingAddress after debounce) ...

    // ... Rendering (Step 4) ...
}
```

### Building Child Components

BillingAddress.js (The Form)

This component handles data input and uses a debounced function to trigger the setBillingAddress action in the parent.
Logic: Standard React form inputs.

Key Action: On change, it updates localBilling state. After a 300ms delay, the useEffect in the parent calls setBillingAddress(localBilling). This triggers the Store API to recalculate taxes and shipping.


### PaymentMethods.js (Payment Selection)

This component displays payment options provided by the checkoutData.
Logic: Display options from checkoutData.payment_methods.

Key Action: When the user selects a radio button, call setSelectedPaymentMethod(methodId). This tells the store which gateway to prepare for.

Integration: This is where you render the specific component required by the payment gateway (e.g., the Stripe Card Element wrapper).


### OrderSummary.js (Totals Display)
This component is mostly read-only, displaying the calculated totals.
Logic: Renders cartData.totals (subtotal, shipping, tax) and checkoutData.payment_method_data (if any payment fees apply).


### Finalizing the Order (handlePlaceOrder)

```
const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // 1. **PREPARE PAYMENT DATA** (Crucial Step)
    // For most gateways (Stripe, PayPal), you must use their JS SDK here
    // to tokenize the card data, creating a temporary payment token.
    const paymentToken = await preparePaymentData(checkoutData.payment_method); 
    
    const paymentData = {
        payment_method: checkoutData.payment_method, 
        // This is where you pass the token or non-sensitive data
        payment_data: {
            token: paymentToken, 
            // Add any custom fields needed by your SaaS logic
            custom_field_1: 'some_value'
        }
    };
    
    try {
        // 2. **SUBMIT CHECKOUT**
        const result = await submitCheckout(paymentData);
        
        if (result?.hasError) {
            // Handle errors (e.g., card declined, stock change)
            // You must use the VALIDATION_STORE_KEY to display these messages
            console.error('Checkout failed:', result.response.message);
        } else {
            // 3. **REDIRECT TO SUCCESS**
            window.location.href = result.redirectUrl || '/order-received/' + result.orderId;
        }

    } catch (error) {
        console.error('Critical submission error:', error);
    } finally {
        setIsProcessing(false);
    }
};

// Place the button in your JSX:
// <button onClick={handlePlaceOrder} disabled={isProcessing}>...</button>
```

### Rendering the Custom Layout

```
// Inside CustomCheckout return:

return (
    <div className="custom-checkout-wrapper layout-two-column">
        
        {/* LEFT COLUMN: Customer Input */}
        <div className="checkout-form-column">
            <h3>1. Billing Information</h3>
            <BillingAddress 
                localBilling={localBilling} 
                setLocalBilling={setLocalBilling} 
            />
            
            <hr />
            
            <h3>2. Payment</h3>
            <PaymentMethods />
            
            {/* The final submit button */}
            <button onClick={handlePlaceOrder} disabled={isProcessing}>
                {isProcessing ? 'Placing Order...' : 'Place Order'}
            </button>
        </div>

        {/* RIGHT COLUMN: Summary and Totals */}
        <div className="checkout-summary-column">
            <h3>Your Order</h3>
            <OrderSummary cartData={cartData} checkoutData={checkoutData} />
        </div>
    </div>
);
```