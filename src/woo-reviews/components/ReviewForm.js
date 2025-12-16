import React, { useState } from "react";
import StartRating from "../../components/StartRating";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";

const ReviewForm = ({ productId, userId, userName, userEmail }) => {
	const [rating, setRating] = useState(0);
	const [reviewContent, setReviewContent] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage(null);

		if (rating === 0 || reviewContent.length < 5) {
			setMessage({
				type: "error",
				text: "Please select a rating and write a review of at least 5 characters.",
			});
			return;
		}

		setIsLoading(true);
		const reviewData = {
			product_id: productId,
			review: reviewContent,
			rating: rating,
			reviewer: userName,
			reviewer_email: userEmail,
		};

		console.log(reviewData);

		try {
			const response = await apiFetch({
				// path: "/wc/store/v1/products/reviews",
				path: "/wc/v3/products/reviews",
				method: "POST",
				data: reviewData,
			});
			console.log(response);
			if (response.code === "woocommerce_product_review_error") {
				throw new Error(response.message);
			}
			setMessage({
				type: "success",
				text: "Review submitted successfully! It is now awaiting moderation.",
			});

			setRating(0);
			setReviewContent("");
		} catch (error) {
			console.error("Review submission error:", error);
			setMessage({
				type: "error",
				text:
					error.message || "Failed to submit review due to an unknown error.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// --- Conditional Rendering Check ---
	if (!userId) {
		return (
			<div className="review-form-guest-prompt">
				<p>You must be logged in to post a review.</p>
				<a
					href={window.wp.url.addQueryArgs(window.location.href, {
						login: true,
					})}
					className="button"
				>
					Login to Review
				</a>
			</div>
		);
	}

	return (
		<>
			<form onSubmit={handleSubmit} className="product-review-form">
				{message && (
					<div className={`form-message message-${message.type}`}>
                    {message.text}
                </div>
				)}
				<div className="form-group rating-group">
					<label>
						{" "}
						Your Rating <span className="required-start">*</span>
					</label>
					<StartRating rating={rating} setRating={setRating} />
				</div>

				<div className="form-group">
					<label htmlFor="reviewContent">
						{" "}
						Your Review <span className="required-start">*</span>
					</label>
					<textarea
						id="reviewContent"
						value={reviewContent}
						onChange={(e) => setReviewContent(e.target.value)}
						rows={5}
						maxLength={500}
						placeholder="Enter your Review"
						disabled={isLoading}
						required
					></textarea>
					<button type="submit" className="submit">
						{isLoading ? "Submitting Review..." : "Submit Review"}
					</button>
					<p className="form-note">
						Your Name is <strong>{userName}</strong>
					</p>
				</div>
			</form>
		</>
	);
};

export default ReviewForm;
