import {
	InnerBlocks,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
} from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import "./editor.scss";
import { ColorIndicator, ColorPalette, PanelBody } from "@wordpress/components";
import { Button } from "@wordpress/components";
import { ToggleControl } from "@wordpress/components";
import { SelectControl } from "@wordpress/components";

const COLORS = [
	{ name: "white", color: "#ffffff" },
	{ name: "black", color: "#000000" },
	{ name: "primary", color: "#007cba" },
	{ name: "dark-overlay", color: "#333333" },
];
const ALLOWED_INNER_BLOCKS = [
	"core/columns",
	"core/group",
	"core/list",
	"core/heading",
	"core/paragraph",
	"core/social-links",
];
const TEMPLATE = [
	[
		"core/columns",
		{ templateLock: "all" },
		[
			[
				"core/column",
				{},
				[["core/heading", { level: 4, placeholder: "About Us" }]],
			],
			[
				"core/column",
				{},
				[["core/heading", { level: 4, placeholder: "Services" }]],
			],
			[
				"core/column",
				{},
				[["core/heading", { level: 4, placeholder: "Quick Links" }]],
			],
			[
				"core/column",
				{},
				[["core/heading", { level: 4, placeholder: "Contact" }]],
			],
		],
	],
];

export default function Edit({ attributes, setAttributes }) {
	const {
		logoUrl,
		logoAlt,
		copyrightText,
		copyrightAlignment,
		showDivider,
		dividerColor,
	} = attributes;
	const blockProps = useBlockProps({
		className: "custom-site-footer",
		style: {
			"--footer-divider-color": dividerColor,
		},
	});
	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__("Logo & Introductory", "woo-builder")}
					initialOpen={true}
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({
									logoUrl: media.url,
									logoAlt: media.alt || "'Footer Logo",
								})
							}
							allowedTypes={["image"]}
							render={({ open }) => (
								<Button onClick={open}>
									{logoUrl ? "Change Logo" : "Select Footer Logo"}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					{logoUrl && (
						<div className="br" style={{ margin: "0 10px" }}>
							<Button onClick={() => setAttributes({ logoUrl: "" })}>
								Remove Logo
							</Button>
							<img src={logoUrl} />
						</div>
					)}
				</PanelBody>

				<PanelBody
					title={__("Structure & Divider", "woo-builder")}
					initialOpen={true}
				>
					<ToggleControl
						label="Show Top Divider"
						checked={showDivider}
						onChange={(val) => setAttributes({ showDivider: val })}
						help="Shows a separator line between the main columns and the copyright area."
					/>
					{showDivider && (
						<>
							<p>
								<strong>Divider Color</strong>
							</p>
							<ColorPalette
								colors={COLORS}
								value={dividerColor}
								onChange={(newVal) => setAttributes({ dividerColor: newVal })}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<footer {...blockProps}>
				<div className="footer-top-section">
					{logoUrl && (
						<img src={logoUrl} alt={logoAlt} className="footer-logo" />
					)}
					<p>Build your brand's presence here.</p>
				</div>
				<div className="footer-main-columns">
					<InnerBlocks
						allowedBlocks={ALLOWED_INNER_BLOCKS}
						template={TEMPLATE}
						templateLock={false}
					/>
				</div>
				{showDivider && <hr className="footer-divider" />}
				<div
					className="footer-copyright-section"
					style={{ textAlign: copyrightAlignment }}
				>
					<RichText
						tagName="p"
						value={copyrightText}
						onChange={(newText) => setAttributes({ copyrightText: newText })}
						placeholder="Enter copyright text"
					/>
					<SelectControl
						label="Copyright Alignment"
						value={copyrightAlignment}
						options={[
							{ label: "Left", value: "left" },
							{ label: "Center", value: "center" },
							{ label: "Right", value: "right" },
						]}
						onChange={(newAlignment) =>
							setAttributes({ copyrightAlignment: newAlignment })
						}
					/>
				</div>
			</footer>
		</>
	);
}
