const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { fieldParents } from '../../constants';

import fileUploadEdit from "./edit.js";
import fileUploadSave from "./save.js";


registerBlockType("cwp/form-button", {
    title: __("Form Button"),
    icon: __('upload'),
    category: "common",
    keywords: [__("gutenberg-forms"), __("forms"), __("file"), __("file upload")],
    edit: fileUploadEdit,
    save: fileUploadSave,
    attributes: {},
    supports: {
        align: true,
        align: ["wide", "full", "center"]
    },
    parent: fieldParents
});
