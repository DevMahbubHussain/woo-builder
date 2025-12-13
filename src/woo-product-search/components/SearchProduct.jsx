// import React from "react";
// import { useState, useEffect } from "@wordpress/element";
import React, { useState, useEffect } from "react";
import { useSelect } from "@wordpress/data";
import { useDebounce } from "@wordpress/compose";
const SearchProduct = () => {
	// 1. State for the user's instant input (updates immediately)
	const [searchTerm, setSearchTerm] = useState("");

	// 2. Debounced state (updates only after 300ms of inactivity)
	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	// 3. State for the API results
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	// ... API Fetch Logic (Step B) ...
	useEffect(() => {
		if (!debouncedSearchTerm || debouncedSearchTerm.length < 3) {
			setResults([]);
			return;
		}

		const fetchProducts = async () => {
			setIsLoading(true);
			try {
				const response = await fetch(
					`/wp-json/wc/store/v1/products?search=${debouncedSearchTerm}&per_page=5`,
				);

                console.log(response);

				if (response.ok) {
					const data = await response.json();
                    console.log(data);
					setResults(data);
				} else {
					setResults([]);
					console.error("Error fetching products.");
				}
			} catch (error) {
				setResults([]);
				console.error("Network error:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchProducts();
	}, [debouncedSearchTerm]);

	return (
		<div className="product-search-block">
			<input
				type="search"
				placeholder="Search for products..."
				value={searchTerm}
                name="searchTerm"
				onChange={(e) => setSearchTerm(e.target.value)}
				className="search-input"
			/>
			<div className="search-results-area">
				{isLoading && debouncedSearchTerm.length >= 3 && (
					<div className="loading-spinner">Searching...</div>
				)}
				{!isLoading && results.length > 0 && (
					<ul className="results-list">
						{results.map((product) => (
							<li key={product.id} className="product-result">
								<img src={product.images[0]?.thumbnail} alt={product.name} />
								<a href={product.permalink}>{product.name}</a>
								<span className="price">{product.prices.price_html}</span>
							</li>
						))}
					</ul>
				)}
				{!isLoading &&
					debouncedSearchTerm.length >= 3 &&
					results.length === 0 && (
						<div className="no-results">
							No products found matching "{debouncedSearchTerm}"
						</div>
					)}
			</div>
		</div>
	);
};

export default SearchProduct;
