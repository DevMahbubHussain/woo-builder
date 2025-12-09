import { registerBlockType } from "@wordpress/blocks";
import "./style.scss";
import "./editor.js";
/**
 * Internal dependencies
 */
import Edit from "./edit";
import metadata from "./block.json";
registerBlockType(metadata.name, {
	edit: Edit,
});
