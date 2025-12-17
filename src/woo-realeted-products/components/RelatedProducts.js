import React, { useEffect, useState } from "react";
import apiFetch from "@wordpress/api-fetch";

const RelatedProducts = ({ currentProductId, relatedCount, discountPercentage = 0 }) => {
    const [products, setProducts] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    /**
     * Fetch related products
     */
    useEffect(() => {
        apiFetch({
            path: `/wc/store/v1/products?per_page=${relatedCount}&exclude=${currentProductId}&type=simple&stock_status=instock`,
        })
            .then((data) => {
                setProducts(data);
                setSelectedIds(data.map((p) => p.id));
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error", err);
                setLoading(false);
            });
    }, [currentProductId, relatedCount]);

    /**
     * Toggle product checkbox
     */
    const toggleProduct = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        );
    };

    /**
     * Batch add selected products to cart
     */
    const handleBatchAdd = async () => {
        if (!selectedIds.length) return;

        const nonce = window.wcSettings?.nonce;
        setIsAdding(true);

        try {
            await apiFetch({
                path: "/wc/store/v1/batch",
                method: "POST",
                headers: {
                    "X-WP-Nonce": nonce,
                },
                data: {
                    requests: selectedIds.map((id) => ({
                        path: "/wc/store/v1/cart/add-item",
                        method: "POST",
                        body: {
                            id: id,
                            quantity: 1,
                        },
                    })),
                },
            });

            window.location.href = "/cart";
        } catch (error) {
            console.error("Batch add error:", error);
            alert("Could not add all items to cart.");
            setIsAdding(false);
        }
    };

    if (loading) {
        return <div className="bundle-loading">Loading suggestions...</div>;
    }

    if (!products.length) return null;

    /**
     * Calculate Pricing Logic
     */
    const baseTotal = products
        .filter((p) => selectedIds.includes(p.id))
        .reduce(
            (sum, p) =>
                sum + parseFloat(p.prices.price) / 10 ** p.prices.currency_minor_unit,
            0,
        );

    // Discount applies only if ALL products in the suggested bundle are selected
    const hasDiscount = discountPercentage > 0 && selectedIds.length === products.length;
    
    const bundleTotal = hasDiscount
        ? baseTotal * (1 - discountPercentage / 100)
        : baseTotal;

    const currencyPrefix = products[0]?.prices.currency_prefix || '$';

    return (
        <div className="fbt-bundle-wrapper">
            <h3>Frequently Bought Together</h3>
            
            {hasDiscount && (
                <div className="bundle-badge">
                    Save {discountPercentage}% on this bundle!
                </div>
            )}

            <div className="bundle-visuals">
                {products.map((product, index) => (
                    <React.Fragment key={product.id}>
                        <div className="bundle-image-card">
                            <img src={product.images[0]?.src} alt={product.name} />
                        </div>
                        {index < products.length - 1 && (
                            <div className="bundle-plus">+</div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="bundle-list">
                {products.map((product) => (
                    <div key={product.id} className="bundle-check-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(product.id)}
                                onChange={() => toggleProduct(product.id)}
                            />
                            <span className="product-name">{product.name}</span>
                            <span className="product-price">
                                — {product.prices.currency_prefix}
                                {(
                                    parseFloat(product.prices.price) /
                                    10 ** product.prices.currency_minor_unit
                                ).toFixed(2)}
                            </span>
                        </label>
                    </div>
                ))}
            </div>

            <div className="bundle-action">
                <div className="total-label">
                    Total Price:{" "}
                    {hasDiscount && (
                        <span className="old-price" style={{ textDecoration: 'line-through', marginRight: '8px', color: '#888' }}>
                            {currencyPrefix}{baseTotal.toFixed(2)}
                        </span>
                    )}
                    <strong className="current-price" style={{ fontSize: '1.2em', color: hasDiscount ? '#2271b1' : 'inherit' }}>
                        {currencyPrefix}{bundleTotal.toFixed(2)}
                    </strong>
                </div>

                <button
                    onClick={handleBatchAdd}
                    className="button is-primary"
                    style={{ marginTop: '15px' }}
                    disabled={isAdding || !selectedIds.length}
                >
                    {isAdding ? "Adding Items..." : "Add Selected to Cart"}
                </button>
            </div>
        </div>
    );
};

export default RelatedProducts;