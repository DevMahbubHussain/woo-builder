import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { 
        logoUrl, logoAlt, logoWidth, minHeight, borderBottomColor, isSticky 
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `custom-site-header ${isSticky ? 'is-sticky-enabled' : ''}`,
        style: {
            minHeight: minHeight,
            borderBottom: borderBottomColor ? `1px solid ${borderBottomColor}` : 'none',
        }
    });

    return (
        <header {...blockProps}>
            <div className="header-logo-area">
                {logoUrl && (
                    <img src={logoUrl} alt={logoAlt} style={{ maxWidth: logoWidth, height: 'auto' }} />
                )}
            </div>

            <div className="header-nav-area">
                <InnerBlocks.Content />
            </div>
            
            <div className="header-utility-area">
            </div>
        </header>
    );
}