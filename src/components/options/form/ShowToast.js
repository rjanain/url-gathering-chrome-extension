import React from 'react';
import { ToastContainer } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';

function ShowToast(props) {
    let field = props.notifications.changed
    let value = props.notifications[field]


    return (
        <ToastContainer position="top-end" className="p-3">
            <Toast
                bg="primary"
                onClose={() => props.setShow(false)}
                show={props.show}
                delay={3000}
                autohide
            >
                <Toast.Header>
                    <strong className="me-auto">Settings Updated</strong>
                </Toast.Header>
                <Toast.Body>
                    You have successfully changed <br />
                    <mark>
                        {
                            field + " : " + value
                        }
                    </mark>
                </Toast.Body>
            </Toast>
        </ToastContainer>

    );
}

export default ShowToast;


