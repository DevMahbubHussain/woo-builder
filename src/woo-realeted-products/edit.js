import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, RangeControl } from "@wordpress/components";

export default function Edit({ attributes, setAttributes }) {
	const { relatedCount,discountPercentage } = attributes;

	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody title="Bundle Settings">
					<RangeControl
						label="Number of Related Products"
						value={relatedCount}
						onChange={(value) => setAttributes({ relatedCount: value })}
						min={1}
						max={12}
					/>
					<RangeControl
						label="Bundle Discount (%)"
						value={discountPercentage}
						onChange={(val) => setAttributes({ discountPercentage: val })}
						min={0}
						max={100}
						help="Note: You must setup a corresponding Coupon or Automatic Discount in WooCommerce for this to take effect at checkout."
					/>
				</PanelBody>
			</InspectorControls>
			<div className="fbt-placeholder">
				Frequently Bought Together (Preview: showing {relatedCount} items)
			</div>
		</div>
	);
}
