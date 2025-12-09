import { __ } from '@wordpress/i18n';
import { useBlockProps,InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody } from '@wordpress/components';
import './editor.scss';

// Static preview data
const mockItems = [
    { name: 'Beanie with Logo', qty: 1, price: '$18.00' },
    { name: 'Belt', qty: 1, price: '$55.00' },
];



export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title="Cart Settings">
                    <TextControl
                        label="Checkout URL"
                        value={attributes.checkoutUrl}
                        onChange={(val) => setAttributes({ checkoutUrl: val })}
                        help="Enter the URL for your checkout page (e.g., /checkout)"
                    />
                </PanelBody>
            </InspectorControls>
            
            <div {...blockProps}>
                <p>🛒 **Custom Cart Block Preview**</p>
                <div style={{ border: '1px solid #ccc', padding: '15px' }}>
                    {mockItems.map((item, index) => (
                        <p key={index} style={{ margin: '5px 0' }}>
                            {item.name} x {item.qty} - **{item.price}**
                        </p>
                    ))}
                    <hr/>
                    <p style={{ fontWeight: 'bold' }}>Total: $73.00 (Mock)</p>
                    <a href={attributes.checkoutUrl} style={{ background: '#007cba', color: 'white', padding: '5px 10px', textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>
                        Proceed to Checkout
                    </a>
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '12px' }}>
                    *Live cart data appears on the front-end.
                </p>
            </div>
        </>
    );
}
