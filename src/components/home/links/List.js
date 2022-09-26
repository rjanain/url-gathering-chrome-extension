import React from "react"
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

function List(props) {
    
    return (
        <>
            <ListGroup.Item
                onClick={props.onClick}
                key={props.index}
                id={props.index}
                as="li"
                className="d-flex justify-content-between align-items-center"
            >
                
                {props.title}
                

                {
                    props.isCopied ? (
                        <Badge bg="primary" pill>
                            copied
                        </Badge>
                    ) : null
                }

            </ListGroup.Item>
        </>
    )
}

export default List 