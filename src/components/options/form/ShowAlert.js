import React, { useRef, useState } from "react"
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';


const ShowAlert = (props) => {
    const numberOfNotifications = Object.keys(props.notifications).length
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);

    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    };

    const popover = () => {
        return (
            <Popover className="bg-info" id="popover-contained">
                <Popover.Header as="h3">Notifications</Popover.Header>
                <Popover.Body>
                     <p>Need to be added</p>
                </Popover.Body>
            </Popover>
        )
    };

    return (
        <>



            <div ref={ref} className="d-flex flex-row-reverse mb-2">

                <Button size="sm" onClick={handleClick}>
                    <img src="asset/img/bell.svg" /> 
                    {numberOfNotifications > 0 ? numberOfNotifications : null}
                </Button>

                <Overlay
                    show={show}
                    target={target}
                    placement="left"
                    container={ref}
                    containerPadding={20}
                >
                    {popover()}
                </Overlay>
            </div>







        </>
    )
}

export default ShowAlert