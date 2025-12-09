import React, { useEffect, useState } from "react";
import { useDispatch, useSelect } from "@wordpress/data";
const { CART_STORE_KEY } = window.wc.wcBlocksData;

const CouponForm = ({ currency }) => {
	const [couponCode, setCouponCode] = useState("");
	const [localMessage, setLocalMessage] = useState(null);
	const { applyCoupon, removeCoupon } = useDispatch(CART_STORE_KEY);
    

	const { appliedCoupons, isApplyingCoupon, notices  } = useSelect((select) => {
		return {
			appliedCoupons: select(CART_STORE_KEY).getCartData()?.coupons || [],
			isApplyingCoupon: select(CART_STORE_KEY).isApplyingCoupon(),
			notices: select(CART_STORE_KEY).getCartErrors() || [],
		};
	}, []);

	useEffect(() => {
		setLocalMessage(null);
	}, [appliedCoupons]);

	// const handleApply = (e) => {
	//     e.preventDefault();
	//     if (couponCode.trim()) {
	//         applyCoupon(couponCode.trim());
	//         setCouponCode('');
	//     }
	// };

	const handleApply = async (e) => {
		e.preventDefault();
		setLocalMessage(null);

		const code = couponCode.trim();
		if (!code) return;

		try {
			const result = await applyCoupon(code);
			if (result?.response?.errors?.length) {
				setLocalMessage({
					type: "error",
					text:
						result.response.errors[0].message ||
						"An unknown validation error occurred.",
				});
			} else if (result?.response?.message) {
				setLocalMessage({
					type: "error",
					text: result.response.message.replace(/&quot;/g, '"'),
				});
			} else {
				setLocalMessage({
					type: "success",
					text: `Coupon "${code}" applied successfully!`,
				});
				setCouponCode("");
			}
		} catch (error) {
			console.error("API Error during coupon application:", error);
			setLocalMessage({
				type: "error",
				text: "A network error occurred while applying the coupon.",
			});
		}
	};

	const handleRemove = (code) => {
		removeCoupon(code);
	};

	const formatDiscount = (amount, currency) => {
		const symbol = currency.currency_symbol || "$";
		const value = (parseFloat(amount) / 100).toFixed(
			currency.currency_minor_unit || 2,
		);
		return `${symbol}${value}`;
	};

	return (
		<div className="coupon-container">
			{/* 1. Coupon Input Form */}
			{localMessage && (
				<div className={`coupon-message message-${localMessage.type}`}>
					{localMessage.text}
				</div>
			)}
			{notices.map((notice, index) => (
				<div key={index} className={`coupon-message message-${notice.status}`}>
					{notice.content}
				</div>
			))}
			<form onSubmit={handleApply} className="coupon-form">
				<input
					type="text"
					placeholder="Enter coupon code"
					value={couponCode}
					onChange={(e) => setCouponCode(e.target.value)}
					disabled={isApplyingCoupon}
				/>
				<button type="submit" disabled={isApplyingCoupon}>
					{isApplyingCoupon ? "Applying..." : "Apply"}
				</button>
			</form>

			{/* 2. Applied Coupons Display */}
			<div className="applied-coupons">
				{appliedCoupons.map((coupon) => (
					<div key={coupon.code} className="applied-coupon-tag">
						<span>{coupon.code}</span>
						{/* Displaying discount amount */}
						<span className="discount-amount">
							-{formatDiscount(coupon.totals.total_discount, currency)}
						</span>
						{/* Remove Action */}
						<button
							onClick={() => handleRemove(coupon.code)}
							className="coupon-remove-btn"
							aria-label={`Remove coupon ${coupon.code}`}
						>
							&times;
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default CouponForm;
