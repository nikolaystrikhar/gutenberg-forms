import { iconInsert } from "./icon-insert/index";
const { registerFormatType } = wp.richText;

const formats = [iconInsert];

// registering all formats
formats.forEach(({ name, ...settings }) => registerFormatType(name, settings));
