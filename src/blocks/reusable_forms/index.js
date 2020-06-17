const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;


import reusableEdit from './edit';
import reusableSave from './save';
import { fieldParents } from '../../constants';


/**
 * 
 * This block is used to display the server side render for the saved forms
 * instead of replacing the saved form with short code block
 * this block will be used
 *
 */

registerBlockType('cwp/reusable-form', {
    title: __('Reusable Form'),
    icon: 'index-card',
    category: 'common',
    keywords: [
        __('gutenberg-forms'),
        __('forms'),
        __('reusable'),
        __('reusable forms')
    ],
    attributes: {
        formId: {
            type: "string",
            default: ""
        }, // the attributes of the form that display will be rendered 
    },
    edit: reusableEdit,
    save: reusableSave,
});
