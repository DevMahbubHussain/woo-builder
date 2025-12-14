// src/edit.js

import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	MediaUpload,
	MediaUploadCheck,
	__experimentalLinkControl as LinkControl,
} from "@wordpress/block-editor";
import {
	PanelBody,
	Button,
	ToggleControl,
	ColorPalette,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import "./editor.scss";

const ALLOWED_INNER_BLOCKS = ["core/navigation"];
const TEMPLATE = [["core/navigation", {}]];

const COLORS = [
	{ name: "white", color: "#ffffff" },
	{ name: "black", color: "#000000" },
	{ name: "primary", color: "#007cba" },
	{ name: "dark-overlay", color: "#333333" },
];

export default function Edit({ attributes, setAttributes }) {
	const {
		logoUrl,
		logoAlt,
		logoWidth,
		minHeight,
		borderBottomColor,
		isSticky,
	} = attributes;

	const blockProps = useBlockProps({
		className: `custom-site-header ${isSticky ? "is-sticky-enabled" : ""}`,
		style: {
			minHeight: minHeight,
			borderBottom: borderBottomColor
				? `1px solid ${borderBottomColor}`
				: "none",
		},
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title="Logo & Dimensions" initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({
									logoUrl: media.url,
									logoAlt: media.alt || "Site Logo",
								})
							}
							allowedTypes={["image"]}
							render={({ open }) => (
								<Button
									onClick={open}
									isSecondary
									style={{ marginBottom: "10px" }}
								>
									{logoUrl ? "Change Logo" : "Select Site Logo"}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					<UnitControl
						label="Logo Width"
						value={logoWidth}
						onChange={(newWidth) => setAttributes({ logoWidth: newWidth })}
					/>
					<UnitControl
						label="Header Minimum Height"
						value={minHeight}
						onChange={(newHeight) => setAttributes({ minHeight: newHeight })}
					/>
				</PanelBody>

				<PanelBody title="Design & Layout">
					<p>
						<strong>Bottom Border Color</strong>
					</p>
					<ColorPalette
						colors={COLORS}
						value={borderBottomColor}
						onChange={(newColor) =>
							setAttributes({ borderBottomColor: newColor })
						}
					/>
				</PanelBody>

				<PanelBody title="Advanced Behavior">
					<ToggleControl
						label="Enable Sticky Header"
						checked={isSticky}
						onChange={(val) => setAttributes({ isSticky: val })}
						help="The header will remain fixed at the top of the viewport when scrolling."
					/>
				</PanelBody>
			</InspectorControls>

			<header {...blockProps}>
				{/* Logo Area */}
				<div className="header-logo-area" style={{ flexGrow: 0 }}>
					{logoUrl ? (
						<img
							src={logoUrl}
							alt={logoAlt}
							style={{ maxWidth: logoWidth, height: "auto" }}
						/>
					) : (
						<span style={{ fontSize: "1.5em", fontWeight: "bold" }}>
							[Site Logo]
						</span>
					)}
				</div>

				{/* Navigation Area (Inner Blocks) */}
				<div className="header-nav-area">
					<InnerBlocks
						allowedBlocks={ALLOWED_INNER_BLOCKS}
						template={TEMPLATE}
						templateLock="all"
					/>
				</div>

				{/* Placeholder for CTA/Search*/}
				<div className="header-utility-area">
					<Button>CTA</Button>
				</div>
			</header>
		</>
	);
}
