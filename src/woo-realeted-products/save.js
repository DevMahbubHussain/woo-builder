import { useBlockProps } from '@wordpress/block-editor';
export default function save({ attributes }) {
    return (
        <div 
            { ...useBlockProps.save() } 
            data-related-count={ attributes.relatedCount }
            data-product-id={ attributes.productId }
        >
        </div>
    );
}