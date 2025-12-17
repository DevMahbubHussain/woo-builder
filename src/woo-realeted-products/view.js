import { createRoot } from "react-dom/client";
import RelatedProducts from "./components/RelatedProducts";

document.addEventListener("DOMContentLoaded", () => {
	const blocks = document.querySelectorAll(
		".wp-block-mh-frequently-bought-together",
	);

	blocks.forEach((block) => {
		const productId = block.getAttribute("data-product-id");
		const relatedCount = block.getAttribute("data-related-count") || 6;
		const discountPercentage = block.getAttribute("data-discount") || 0;
		// const productId = parseInt(container.getAttribute("data-product-id"));

		if (productId) {
			const root = createRoot(block);
			root.render(
				<RelatedProducts
					currentProductId={parseInt(productId)}
					relatedCount={parseInt(relatedCount)}
					discountPercentage={parseInt(discountPercentage)}
				/>,
			);
		}
	});
});
