// src/save.js

import { useBlockProps, InnerBlocks, RichText } from "@wordpress/block-editor";

export default function save({ attributes }) {
	const {
		logoUrl,
		logoAlt,
		copyrightText,
		copyrightAlignment,
		showDivider,
		dividerColor,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: "custom-site-footer",
		style: {
			"--footer-divider-color": dividerColor,
		},
	});

	return (
		<footer {...blockProps}>
			<div className="footer-top-section">
				{logoUrl && <img src={logoUrl} alt={logoAlt} className="footer-logo" />}
			</div>

			<div className="footer-main-columns">
				<InnerBlocks.Content />
			</div>

			{showDivider && <hr className="footer-divider" />}

			<div
				className="footer-copyright-section"
				style={{ textAlign: copyrightAlignment }}
			>
				<RichText.Content tagName="p" value={copyrightText} />
			</div>
		</footer>
	);
}
