const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { fieldParents } from '../../constants';

import fileUploadEdit from "./edit.js";
import fileUploadSave from "./save.js";


registerBlockType("cwp/file-upload", {
    title: __("File"),
    icon: 'upload',
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
