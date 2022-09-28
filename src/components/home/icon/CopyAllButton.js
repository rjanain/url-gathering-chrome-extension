import React from "react"
import { Button } from "react-bootstrap"
import Badge from 'react-bootstrap/Badge';

const CopyAllButton = (props) => {

    return (
        <>
            <Button
                size="sm"
                variant="outline-warning"
                id={props.id}
                onClick={props.onClick}
            >
                Go somewhere
            </Button>

            {
                props.isCopied ? (
                    <div className="mt-1">
                        <Badge bg="success" pill>
                            All Url has been copied
                        </Badge>
                    </div>
                ) : null
            }

        </>

    )
}

export default CopyAllButton 