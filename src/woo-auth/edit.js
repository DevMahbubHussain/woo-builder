import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { redirectUrl } = attributes;

    return (
        <div { ...useBlockProps() }>
            <InspectorControls>
                <PanelBody title="Redirect Settings">
                    <TextControl
                        label="Redirect URL after Login"
                        value={ redirectUrl }
                        onChange={ ( val ) => setAttributes( { redirectUrl: val } ) }
                        help="Where should users go after a successful login?"
                    />
                </PanelBody>
            </InspectorControls>

            <div className="auth-block-placeholder">
                <h3>Guest Auth Block</h3>
                <p>Login / Registration form will appear here on the frontend.</p>
                <div className="auth-tabs-preview">
                    <span>Login</span> | <span>Register</span>
                </div>
            </div>
        </div>
    );
}