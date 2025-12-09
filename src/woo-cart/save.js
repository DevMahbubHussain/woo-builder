import { useBlockProps } from '@wordpress/block-editor';
export default function save({ attributes }) {

    return (
        <div 
            { ...useBlockProps.save() } 
            data-checkout-url={attributes.checkoutUrl}
        >
            {/* Content will be rendered by view.js */}
        </div>
    );
}