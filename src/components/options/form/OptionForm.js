import React, { useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import { saveToChromeStorage } from "../../api/handlerStorage"
import ShowAlert from "./ShowAlert"
import ShowToast from "./ShowToast"


const OptionForm = (props) => {
    const [optionform, setOptionform] = useState({})
    const [errors, setErrors] = useState({})
    const [notifications, setNotifications] = useState({})
    const [show, setShow] = useState(false);

    useEffect(() => {
        chrome.storage.sync.get(null, result => {
            setOptionform(result)
            console.log("Fetched result from storage", result)
        })
    }, [])

    const setField = (field, value) => {
        console.log(field, value)
        saveToChromeStorage(field, value)
        setNotifications({
            ...notifications,
            "changed": field,
            [field]: value
        })
        setOptionform({
            ...optionform,
            [field]: value
        })
        setShow(true)

        if (!!errors[field]) {
            setErrors({
                ...errors,
                [field]: null
            })
        }
    }



    return (
        <>

            {/* <ShowAlert notifications={notifications}/>*/}

            <ShowToast notifications={notifications} show={show} setShow={setShow} />

            <Form id="optionForm">
                <Form.Group className="mb-3">
                    <Form.Label>Select Output Format</Form.Label>
                    <Form.Select
                        id="format"
                        value={optionform?.format}
                        aria-label="Choose your preferred format type"
                        onChange={e => { setField(e.target.id, e.target.value) }}

                    >
                        <option value="plaintext">PlainText</option>
                        <option value="json">JSON</option>
                        <option value="csv">CSV</option>
                        <option value="markdown">Markdown</option>
                        <option value="html">HTML</option>
                    </Form.Select>

                </Form.Group>

                <Form.Group>
                    <Form.Check
                        type="switch"
                        id="includeName"
                        label="Do you want include Page Title?"
                        onChange={e => { setField(e.target.id, e.target.checked) }}
                        checked={optionform?.includeName != undefined ? optionform.includeName : false}
                    />
                    <Form.Text id="helptext" muted>

                    </Form.Text>
                </Form.Group>

            </Form>
        </>
    )
}
export default OptionForm