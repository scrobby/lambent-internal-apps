import React, { useState } from 'react'

import { Row, Col, Spinner, Form, Button } from 'react-bootstrap'

import axios from 'axios'

export const GenerateDisclaimer = () => {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <>
            <GenerateDisclaimerHeader />
            <Row hidden={!isLoading}>
                <Col className='text-center'>
                    <Spinner animation="grow" variant="primary" />
                </Col>
            </Row>
            <div className={"loadedView" + (isLoading ? "" : " fade-in")}>
                <Row>
                    <Col md={6} sm={12}>
                        <Form>
                            <Form.Group controlId="disclaimerForm.previousFiles">
                                <Form.Label>
                                    Disclaimer Image
                                </Form.Label>
                                <Form.Select>
                                    <option>Select Image</option>
                                    <option value="upload">Upload New…</option>
                                </Form.Select>
                            </Form.Group>

                        </Form>
                    </Col>
                    <Col md={6} sm={12}>
                        <UploadNewImageForm />
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
                <div className="jumbotron">
                    <h1>Generate Email Disclaimer</h1>
                    <p>Upload a new email banner or select one I guess idk</p>
                </div>
            </Col>
        </Row>
    )
}

const UploadNewImageForm = () => {
    const API_ENDPOINT = 'https://dptam09r3a.execute-api.eu-west-2.amazonaws.com/dev/generate-url'

    const [selectedFile, setSelectedFile] = useState(null)
    const [imageName, setImageName] = useState("")
    const [isValidated, setIsValidated] = useState(false)
    const [imageErrorType, setImageErrorType] = useState('Please select a valid image')

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0])
        console.log("File size: " + e.target.files[0].size)
        if (e.target.files[0] && e.target.files[0].size > 100000) {
            e.target.setCustomValidity('too-big')
            setImageErrorType('The image you selected is too big')
        } else {
            e.target.setCustomValidity('')
            setImageErrorType('Please select a valid image')
        }
    }

    const handleImageNameChange = (e) => {
        var proposedName = e.target.value

        //strip out whitespace and remove extra characters
        proposedName = proposedName.replace(/[^\w\s]/gi, '')
        proposedName = proposedName.split(' ').join('')

        setImageName(proposedName)
    }

    const uploadFile = (e) => {
        // if (!selectedFile || imageName.length === 0) {
        //     return
        // }
        const form = e.currentTarget
        if (form.checkValidity() === false || selectedFile.size > 10000) {
            setIsValidated(false)

            e.preventDefault()
            e.stopPropagation()
        }

        setIsValidated(true)

        let extension = selectedFile.name.split('.').pop()

        const reqObj = {
            FileName: imageName + '.' + extension,
            FileType: "image"
        }

        axios.post(API_ENDPOINT, {reqObj})
            .then(res => {
                // axios.put(res.data.fileURL, selectedFile)
                //     .then(res => {
                //         console.log(res)
                    // })
                    console.log(res.data.fileURL)
                    fetch(res.data.fileURL, {
                        method: 'PUT',
                        body: selectedFile
                    })
                        .then(res => {
                            console.log(res)
                        })
            })

        // console.log("About to fetch: " + API_ENDPOINT)

        // fetch(API_ENDPOINT, reqObj)
        //     .then(res => {
        //         console.log(res.body.message)
                // fetch(res.signedUrl, {
                //     method: 'PUT',
                //     body: selectedFile
                // })
                //     .then((res) => {
                //         console.log(res)
                //     })
            // })
    }

    return (
        <>
            <Form noValidate validated={isValidated} onSubmit={uploadFile}>
                <Form.Group controlId="disclaimerForm.fileInput">
                    <Form.Label>Disclaimer Image</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleFileInput}
                        accept=".png,.jpg,.jpeg"
                        isValid={false}
                        required />
                    <Form.Control.Feedback type="invalid">{imageErrorType}</Form.Control.Feedback>
                    <Form.Text className="text-muted">
                        File should be a .png or .jpeg file, shrunk with ImageOptim and less than 100KB in size
                    </Form.Text>
                </Form.Group>
                <br />
                <Form.Group controlId="disclaimerForm.fileName">
                    <Form.Label>Image Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="e.g. royalspromo"
                        value={imageName}
                        onChange={handleImageNameChange}
                        required />
                    <Form.Control.Feedback type="invalid">Please enter a valid name</Form.Control.Feedback>
                    <Form.Text className="text-muted">
                        Please enter a short filename with no spaces or special characters. Today's date in reverse order will be prepended to the file name, so if you upload "royalspromo" it will become "211206-royalspromo.png"
                    </Form.Text>
                </Form.Group>
                <br/>
                <Button type="submit">Upload Image</Button>
            </Form>
        </>
    )
}