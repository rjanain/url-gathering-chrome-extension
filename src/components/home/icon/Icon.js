import React from "react"
import Badge from 'react-bootstrap/Badge'; 
import Figure from 'react-bootstrap/Figure'

function CreateIcon(props) {

    return (
        <>
            <Figure>
                <Figure.Image
                    onMouseEnter={props.onClick}
                    id={props.index}
                    height={40}
                    width={40}
                    src={props.favIconUrl ? props.favIconUrl : "asset/img/favicon.ico"}
                     />

                <Figure.Caption>
                    {
                        props.isCopied ? (
                            <Badge bg="primary" pill>
                                copied
                            </Badge>
                        ) : null
                    }
                </Figure.Caption>

            </Figure>

        </>
    )
}

export default CreateIcon