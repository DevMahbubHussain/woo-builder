// src/edit.js

import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	URLInput,
} from "@wordpress/block-editor";
import {
	PanelBody,
	Button,
	ColorPalette,
	RangeControl,
	SelectControl,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import "./editor.scss";
import { TextControl } from "@wordpress/components";

const COLORS = [
	{ name: "white", color: "#ffffff" },
	{ name: "black", color: "#000000" },
	{ name: "primary", color: "#007cba" },
	{ name: "dark-overlay", color: "#333333" },
];

export default function Edit({ attributes, setAttributes }) {
	const {
		heading,
		content,
		overlayColor,
		overlayOpacity,
		backgroundColor,
		backgroundUrl,
		headingSize,
		contentSize,
		textColor,
		minHeight,
		paddingTop,
		paddingBottom,
		alignment,
	} = attributes;

	const blockStyle = {
		minHeight: minHeight,
		paddingTop: paddingTop,
		paddingBottom: paddingBottom,
		textAlign: alignment,
		backgroundColor: backgroundColor,
		color: textColor,
		backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : "none",
		backgroundSize: "cover",
		backgroundPosition: "center center",
		position: "relative",
	};

	const overlayStyle = {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: overlayColor,
		opacity: overlayOpacity,
		zIndex: 1,
	};

	const contentStyle = {
		position: "relative",
		zIndex: 2,
	};
	const renderButton = (text, url, bgColor, textColor = "#ffffff") => {
		if (!text) return null;
		return (
			<a
				href={url}
				className="hero-cta-button"
				style={{
					backgroundColor: bgColor,
					color: textColor,
					padding: "12px 24px",
					borderRadius: "6px",
					textDecoration: "none",
					display: "inline-block",
					fontWeight: "600",
					margin: "0 10px 10px 0",
				}}
				onClick={(e) => e.preventDefault()}
			>
				{text}
			</a>
		);
	};

	// --- 2. Inspector Controls ---
	return (
		<>
			<InspectorControls>
				{/* --- PANEL 1: Background and Overlay --- */}
				<PanelBody title="Background & Overlay" initialOpen={true}>
					{/* Background Color */}
					<p>
						<strong>Background Color</strong>
					</p>
					<ColorPalette
						colors={COLORS}
						value={backgroundColor}
						onChange={(newColor) =>
							setAttributes({ backgroundColor: newColor })
						}
					/>

					{/* Background Image Upload */}
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) => setAttributes({ backgroundUrl: media.url })}
							allowedTypes={["image"]}
							value={backgroundUrl}
							render={({ open }) => (
								<Button
									onClick={open}
									isSecondary
									style={{ marginTop: "10px" }}
								>
									{backgroundUrl
										? "Change Background Image"
										: "Select Background Image"}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					{backgroundUrl && (
						<Button
							onClick={() => setAttributes({ backgroundUrl: "" })}
							isLink
							isDestructive
						>
							Remove Image
						</Button>
					)}

					{/* Overlay Controls */}
					<p style={{ marginTop: "20px" }}>
						<strong>Overlay Color & Opacity</strong>
					</p>
					<ColorPalette
						colors={COLORS}
						value={overlayColor}
						onChange={(newColor) => setAttributes({ overlayColor: newColor })}
					/>
					<RangeControl
						label="Overlay Opacity"
						value={overlayOpacity}
						onChange={(newOpacity) =>
							setAttributes({ overlayOpacity: newOpacity })
						}
						min={0}
						max={1}
						step={0.05}
					/>
				</PanelBody>

				{/* --- PANEL 2: Typography & Colors --- */}
				<PanelBody title="Typography & Text Color">
					<p>
						<strong>Text Color</strong>
					</p>
					<ColorPalette
						colors={COLORS}
						value={textColor}
						onChange={(newColor) => setAttributes({ textColor: newColor })}
					/>

					<UnitControl
						label="Heading Font Size"
						value={headingSize}
						onChange={(newSize) => setAttributes({ headingSize: newSize })}
					/>
					<UnitControl
						label="Content Font Size"
						value={contentSize}
						onChange={(newSize) => setAttributes({ contentSize: newSize })}
					/>
				</PanelBody>

				{/* --- PANEL 3: Layout and Spacing --- */}
				<PanelBody title="Layout & Spacing">
					<SelectControl
						label="Content Alignment"
						value={alignment}
						options={[
							{ label: "Left", value: "left" },
							{ label: "Center", value: "center" },
						]}
						onChange={(newAlignment) =>
							setAttributes({ alignment: newAlignment })
						}
					/>
					<UnitControl
						label="Minimum Height"
						value={minHeight}
						onChange={(newHeight) => setAttributes({ minHeight: newHeight })}
					/>
					<UnitControl
						label="Padding Top"
						value={paddingTop}
						onChange={(newPadding) => setAttributes({ paddingTop: newPadding })}
					/>
					<UnitControl
						label="Padding Bottom"
						value={paddingBottom}
						onChange={(newPadding) =>
							setAttributes({ paddingBottom: newPadding })
						}
					/>
				</PanelBody>
				<PanelBody title="Call-to-Action Buttons">
					<h4>Button 1 (Primary)</h4>
					<TextControl
						label="Text"
						value={attributes.button1Text}
						onChange={(val) => setAttributes({ button1Text: val })}
					/>
					<URLInput
						label="URL"
						value={attributes.button1Url}
						onChange={(val) => setAttributes({ button1Url: val })}
					/>
					<p>
						<strong>Background Color</strong>
					</p>
					<ColorPalette
						colors={COLORS}
						value={attributes.button1Color}
						onChange={(newColor) => setAttributes({ button1Color: newColor })}
					/>

					<hr style={{ margin: "20px 0" }} />

					<h4>Button 2 (Secondary, Optional)</h4>
					<TextControl
						label="Text"
						value={attributes.button2Text}
						onChange={(val) => setAttributes({ button2Text: val })}
					/>
					<URLInput
						label="URL"
						value={attributes.button2Url}
						onChange={(val) => setAttributes({ button2Url: val })}
					/>
					<p>
						<strong>Background Color</strong>
					</p>
					<ColorPalette
						colors={COLORS}
						value={attributes.button2Color}
						onChange={(newColor) => setAttributes({ button2Color: newColor })}
					/>
					<p>
						<strong>Text Color</strong>
					</p>
					<ColorPalette
						colors={COLORS}
						value={attributes.button2TextColor}
						onChange={(newColor) =>
							setAttributes({ button2TextColor: newColor })
						}
					/>
				</PanelBody>
			</InspectorControls>

			{/* --- 3. Editor Output (The Preview) --- */}
			<div {...useBlockProps({ style: blockStyle })}>
				{backgroundUrl && <div style={overlayStyle} aria-hidden="true"></div>}
				<div style={contentStyle} className="hero-content-wrapper">
					<RichText
						tagName="h1"
						value={heading}
						onChange={(newHeading) => setAttributes({ heading: newHeading })}
						placeholder="Enter your hero heading"
						style={{ fontSize: headingSize }}
					/>
					<RichText
						tagName="p"
						value={content}
						onChange={(newContent) => setAttributes({ content: newContent })}
						placeholder="Enter your hero subheading"
						style={{ fontSize: contentSize }}
					/>
					<div className="hero-button-group">
						{renderButton(
							attributes.button1Text,
							attributes.button1Url,
							attributes.button1Color,
						)}
						{renderButton(
							attributes.button2Text,
							attributes.button2Url,
							attributes.button2Color,
							attributes.button2TextColor,
						)}
					</div>
				</div>
			</div>
		</>
	);
}
