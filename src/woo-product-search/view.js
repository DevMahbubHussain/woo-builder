import { createRoot } from "react-dom/client";
import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@wordpress/compose";

const { apiFetch } = window.wp;

const SearchProduct = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	// Function to perform the search
	const performSearch = useCallback((searchValue) => {
		if (!searchValue || searchValue.length < 3) {
			setResults([]);
			return;
		}

		setIsLoading(true);
		console.log("Searching for:", searchValue);

		const path = `/wc/store/v1/products?search=${encodeURIComponent(
			searchValue,
		)}&per_page=5`;

		apiFetch({
			path
		})
			.then((data) => {
				setResults(data);
			})
			.catch((err) => {
				console.error("API Fetch Error:", err);
				setResults([]);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	// Create a debounced version of performSearch
	const debouncedSearch = useDebounce(performSearch, 300);

	// Call debounced search whenever searchTerm changes
	useEffect(() => {
		debouncedSearch(searchTerm);
	}, [searchTerm, debouncedSearch]);

	return (
		<div className="product-search-block">
			<input
				type="search"
				placeholder="Search for products..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="search-input"
			/>

			{searchTerm.length > 0 && searchTerm.length < 3 && (
				<div className="search-hint">Type at least 3 characters...</div>
			)}

			<div className="search-results-area">
				{isLoading && searchTerm.length >= 3 && (
					<div className="loading-spinner">Searching...</div>
				)}

				{!isLoading && results.length > 0 && (
					<ul className="results-list">
						{results.map((product) => (
							<li key={product.id} className="product-result">
								{product.images?.[0]?.thumbnail && (
									<img src={product.images[0].thumbnail} alt={product.name} />
								)}
								<a href={product.permalink}>{product.name}</a>
								<span
									dangerouslySetInnerHTML={{
										__html: product.prices?.price_html,
									}}
								/>
							</li>
						))}
					</ul>
				)}

				{!isLoading && searchTerm.length >= 3 && results.length === 0 && (
					<div className="no-results">
						No products found matching "{searchTerm}"
					</div>
				)}
			</div>
		</div>
	);
};

export default SearchProduct;

// React 18 mount
document.addEventListener("DOMContentLoaded", () => {
	const containers = document.querySelectorAll(
		".wp-block-woo-builder-search-block",
	);

	containers.forEach((container) => {
		const root = createRoot(container);
		root.render(<SearchProduct />);
	});
});
