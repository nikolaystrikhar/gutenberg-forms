import React from 'react'
import { Button, Card, CardBody, CardHeader, CardFooter, CardMedia, Icon } from '@wordpress/components'
const { createBlock, parse } = wp.blocks;
const { replaceBlock } = wp.data.dispatch("core/block-editor");


function PostTypeBlock(props) {

    const { form: { post_title, ID } } = props;

    const apply_template = () => {
        replaceBlock(
            props.clientId,
            createBlock(
                'cwp/reusable-form',
                {
                    formId: ID.toString()
                }
            )
        );

        props.onSelect();
    }

    return (
        <Card className="cwp-post-type">
            <CardHeader className="cwp_post_type_header">
                <div>
                    <Icon icon="feedback" />
                    <h3>{post_title}</h3>
                </div>
                <Button isPrimary target="__blank" onClick={apply_template}>Insert</Button>
            </CardHeader>
        </Card>
    )
}


export default PostTypeBlock;