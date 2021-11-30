import React, {useState} from 'react'

import { Row, Col, Spinner, Form } from 'react-bootstrap'

export const GenerateDisclaimer = () => {
    const API_ENDPOINT='https://a6vcd09t4c.execute-api.eu-west-2.amazonaws.com/default/generateSignedURL'

    const [selectedFile, setSelectedFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleFileInput = (e) => setSelectedFile(e.target.files[0])

    const uploadFile = (file) => {
        const reqObj = {
            method:'POST',
            body: {
                FileName: file.name,
                FileType: file.type
            }
        }

        fetch(API_ENDPOINT, reqObj)
            .then(res => {
                fetch(res.signedUrl, {
                    method:'PUT',
                    body:file
                })
                .then((res) => {
                    console.log(res)
                })
            })
    }

    return (
        <>
        <GenerateDisclaimerHeader/>
        <Row hidden={!isLoading}>
            <Col className='text-center'>
                <Spinner animation="grow" variant="primary" />
            </Col>
        </Row>
        <div className={"loadedView" + (isLoading ? "" : " fade-in")}>
                <Row>
                    <Col md={4} sm={12}>
                        <Form>
                            <Form.Group controlId="disclaimerForm.previousImages">
                                <Form.Select>
                                    <option>Select previous image</option>
                                    <option>TODO: LOAD IMAGES</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={8} sm={12}>

                    </Col>
                </Row>
        </div>
        </>
    )
}

const GenerateDisclaimerHeader = () => {
    return (
        <Row>
            <Col>
                <div class="jumbotron">
                    <h1>Generate Email Disclaimer</h1>
                    <p>Upload a new email banner or select one I guess idk</p>
                </div>
            </Col>
        </Row>
    )
}