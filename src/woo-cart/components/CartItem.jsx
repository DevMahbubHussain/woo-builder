import { useDispatch } from "@wordpress/data";
const { CART_STORE_KEY } = window.wc.wcBlocksData;

const formatPrice = (rawPrice, currency) => {
    if (!currency) return `N/A`;
    const priceValue = (parseFloat(rawPrice) / 100).toFixed(currency.currency_minor_unit || 2);
    return `${currency.currency_symbol || '$'}${priceValue}`;
};


const CartItem = ({ item, currency }) => {
    const { changeCartItemQuantity, removeItemFromCart } = useDispatch( CART_STORE_KEY );
    
    // Handle quantity change
    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (newQuantity >= 1) {
            changeCartItemQuantity(item.key, newQuantity);
        }
    };

    return (
        <div className="custom-cart-item" data-cart-key={item.key}>
            {/* Image */}
            <div className="item-image-col">
                {item.images[0] && (
                    <img src={item.images[0].thumbnail} alt={item.name} />
                )}
            </div>

            {/* Details */}
            <div className="item-details-col">
                <a href={item.permalink} target="_blank" rel="noopener noreferrer">
                    {item.name}
                </a>
                <span className="item-sku">{item.sku}</span>
            </div>

            {/* Quantity */}
            <div className="item-qty-col">
                <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={handleQuantityChange}
                    aria-label={`Change quantity for ${item.name}`}
                />
            </div>

            {/* Total Price & Remove Button */}
            <div className="item-price-col">
                <span className="item-subtotal">
                    {formatPrice(item.totals.line_subtotal, currency)}
                </span>
                <button 
                    onClick={() => removeItemFromCart(item.key)}
                    className="remove-button"
                >
                    &times; Remove
                </button>
            </div>
        </div>
    );
};

export default CartItem;