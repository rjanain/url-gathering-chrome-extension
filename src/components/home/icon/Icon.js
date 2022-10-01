import React from "react"
import Badge from 'react-bootstrap/Badge'; 
import Figure from 'react-bootstrap/Figure'

function CreateIcon(props) {

    return (
        <>
            <Figure>
                <Figure.Image
                    onClick={props.onClick}
                    id={props.index}
                    height={props.active ? "60" : "40"}
                    width={props.active ? "60" : "40"}
                    src={props.favIconUrl ? props.favIconUrl : "asset/img/favicon.ico"}
                    style={{borderRadius: "100px"}}
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