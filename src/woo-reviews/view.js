import { createRoot } from "react-dom/client";
import ReviewForm from "./components/ReviewForm";

// React 18 mount
const mountReviewForm = (container) => {
	const productId = parseInt(container.getAttribute("data-product-id"));
	const userData = window.wcReviewContext;
	// console.log(userData);
	// console.log("Product ID",productId);

	if (productId) {
		const root = createRoot(container);
		root.render(
			<ReviewForm
				productId={productId}
				userId={userData.userId}
				userName={userData.userName}
				userEmail={userData.userEmail}
			/>,
		);
	}
};
document.addEventListener("DOMContentLoaded", () => {
	document
		.querySelectorAll(".wp-block-woo-reviews-block")
		.forEach(mountReviewForm);
});
