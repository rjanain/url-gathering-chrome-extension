import React from "react"
import { Button } from "react-bootstrap"

const CopyAllButton = (props) => {

    return (
        <>
            <Button
                size="sm"
                variant={props.variant}
                id={props.id}
                onClick={props.onClick}
            >
                { 
                props.isCopied ? (
                    <i className="bi bi-check-circle-fill text-right"></i> 
                ) : null 
                }

                {" " + props.text} 
            </Button>

            

        </>

    )
}

export default CopyAllButton 