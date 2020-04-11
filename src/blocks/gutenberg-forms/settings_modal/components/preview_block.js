import React from 'react'
import { Button, Card, CardBody, CardHeader, CardFooter, CardMedia, Icon } from '@wordpress/components'
import { get } from 'lodash'
const { createBlock, parse } = wp.blocks;
const { replaceBlock } = wp.data.dispatch("core/block-editor");

function PreviewBlock(props) {

    const { data } = props;

    const { fields } = data;

    const name = get(fields, 'Name'),
        screenshot = get(fields, 'Screenshot[0].thumbnails.large.url'),
        code = get(fields, 'Code');



    const apply_template = () => {


        const [template] = parse(code);


        const { name, attributes, innerBlocks } = template;

        replaceBlock(
            props.clientId,
            createBlock(
                name,
                attributes,
                innerBlocks
            )
        );
        props.onSelect();
    }

    return (
        <Card className="cwp_preview_block">
            <div className="foot">
                <Button isPrimary target="__blank" onClick={apply_template}>Insert Form</Button>
            </div>
            <CardMedia className="cwp-media">
                <img src={screenshot} />
            </CardMedia>

        </Card>
    )
}

export default PreviewBlock;