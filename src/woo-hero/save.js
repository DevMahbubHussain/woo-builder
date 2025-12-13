import { useBlockProps, RichText } from "@wordpress/block-editor";

export default function save({ attributes }) {
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
					transition: "background-color 0.3s",
				}}
			>
				{text}
			</a>
		);
	};

	// 1. Compile the main block styles
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
	};

	return (
		<div {...useBlockProps.save({ style: blockStyle })}>
			{/* Overlay */}
			{backgroundUrl && (
				<div
					className="hero-overlay"
					style={overlayStyle}
					aria-hidden="true"
				></div>
			)}

			{/* Content Wrapper */}
			<div className="hero-content-wrapper" style={contentStyle}>
				<RichText.Content
					tagName="h1"
					value={heading}
					style={{ fontSize: headingSize }}
				/>

				<RichText.Content
					tagName="p"
					value={content}
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
	);
}
