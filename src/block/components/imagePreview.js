import React from "react";
import { Icon, Button } from "@wordpress/components";
import ImageUpload from "../components/imageUpload";

function ImagePreview(props) {
	const { url, height, width } = props.image, //with dimensions;
		dimensions = {
			height,
			width
		};

	const { isSelected } = props;

	return (
		<div className="cwp-image-preview">
			<div className="cwp-img" style={dimensions}>
				{isSelected && (
					<div className="cwp-close-image">
						<Button isDefault onClick={() => props.onRemove()}>
							<Icon icon="no-alt" />
						</Button>
						<ImageUpload
							icon="edit"
							value={props.image}
							onSelect={img => props.onEdit(img)}
						/>
					</div>
				)}
				<img src={url} />
			</div>
		</div>
	);
}

export default ImagePreview;
