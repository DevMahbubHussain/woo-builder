import { createRoot } from "react-dom/client";
import { useSelect,useDispatch } from "@wordpress/data";
import CartItem from "./components/CartItem";
import CouponForm from "../components/CouponForm";
const { CART_STORE_KEY } = window.wc.wcBlocksData;
const formatPrice = (rawPrice, currency) => {
    if (!currency) return `N/A`;
    const priceValue = (parseFloat(rawPrice) / 100).toFixed(currency.currency_minor_unit || 2);
    return `${currency.currency_symbol || '$'}${priceValue}`;
};

const Cart = ({checkoutUrl }) => {
	const { cart, isResolving } = useSelect((select) => {
		return {
			cart: select(CART_STORE_KEY).getCartData(),
			isResolving: select(CART_STORE_KEY).isResolving("getCartData"),
		};
	}, []);

	// Initial Loading State
	if (isResolving)
		return <div className="loading-state">Loading Shopping Cart...</div>;

	// 3. Error/Empty Handling
	if (cart.errors?.length)
		return <div className="error-state">Error loading cart data.</div>;

	if (cart.itemsCount === 0) {
		return (
			<div className="empty-state">
				<h2>Your Cart is Empty</h2>
				<p>Time to find some great products!</p>
				<a href="/" className="return-shop-button">
					Return to Shop
				</a>
			</div>
		);
	}
  
    // 4. Set up currency info once
    const currency = cart.totals;
    const itemsTotal = formatPrice(currency.total_items, currency);
    const shippingTotal = formatPrice(currency.total_shipping, currency);
	const discountTotal = formatPrice(currency.total_discount, currency);
    const finalTotal = formatPrice(currency.total_price, currency);

	// console.log("Cart Data", cart);
	// console.log("Cart Store Key" + CART_STORE_KEY);

	return (
		<div className="cart-block-wrapper">
			<h2>Your Shopping Cart ({cart.itemsCount} items)</h2>
            <div className="cart-items-list">
                {
                    cart.items.map((item)=>(
                        <CartItem key={item.key} item={item} currency={currency} />
                    ))
                }
            </div>

            {/* --- Cart Summary (Totals) --- */}
            <div className="cart-summary">
                <h3>Order Summary</h3>
				<CouponForm currency={currency}/>
                <div className="total-line subtotal">
                    <span>Subtotal</span>
                    {itemsTotal}
                </div>
                <div className="total-line shipping">
                    <span>Shipping</span>
                    <strong>{shippingTotal}</strong>
                </div>
                <div className="total-line final-total">
                    <span>Order Total</span>
                    <strong>{finalTotal}</strong>
                </div>
				{cart.coupons.length > 0 && (
                    <div className="total-line discount-line">
                        <span>Discount ({cart.coupons.length})</span>
                        <strong style={{color: 'green'}}>-{discountTotal}</strong>
                    </div>
                )}
                <a href={checkoutUrl} className="checkout-button">
                    Proceed to Checkout
                </a>
            </div>
		</div>
        
	);
};

// ==============================
//  REACT 18 MOUNTING
// ==============================
document.addEventListener("DOMContentLoaded", () => {
	const containers = document.querySelectorAll(
		".wp-block-my-custom-cart-block",
	);
	containers.forEach((container) => {
		const checkoutUrl =
			container.getAttribute("data-checkout-url") || "/checkout";
		const root = createRoot(container);
		root.render(<Cart checkoutUrl={checkoutUrl} />);
	});
});
