import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { redirectUrl } = attributes;

    return (
        <div 
            { ...useBlockProps.save() } 
            data-redirect={ redirectUrl }
        >
            {/* This content is replaced by React in view.tsx */}
            <div className="auth-block-loading">Loading form...</div>
        </div>
    );
}