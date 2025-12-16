import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';
export default function Edit() {
	return (
		<div className="rfb-editor">
            <strong>Product Review Form</strong>
            <p>Displayed on single product pages.</p>
        </div>
	);
}
