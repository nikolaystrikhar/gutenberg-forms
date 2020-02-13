import React from "react";
import { Button, Icon } from "@wordpress/components";
import { has } from "lodash";
const { MediaUploadCheck, MediaUpload } = wp.blockEditor;

function ImageUpload(props) {
	const { image } = props;

	let value = image ? image : "";

	function getLeastOneSize(s, media) {
		let { sizes } = media;

		for (const size of s) {
			if (has(sizes, size)) {
				return sizes[size];
				break;
			} else continue;
		}
	}

	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={media => {
					let sizes = ["thumbnail", "medium", "large"],
						imageWithDimensions = getLeastOneSize(sizes, media);

					props.onSelect(imageWithDimensions);
				}}
				allowedTypes={["image"]}
				value={value}
				render={({ open }) => (
					<Button isDefault onClick={open}>
						<Icon icon={props.icon} />
					</Button>
				)}
			/>
		</MediaUploadCheck>
	);
}
export default ImageUpload;
