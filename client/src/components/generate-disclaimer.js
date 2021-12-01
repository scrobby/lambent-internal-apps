import React, { useState, useEffect } from 'react'

import { Row, Col, Spinner, Form, Button, Modal } from 'react-bootstrap'

import axios from 'axios'

export const GenerateDisclaimer = () => {
    const LIST_IMAGES_ENDPOINT = 'https://dptam09r3a.execute-api.eu-west-2.amazonaws.com/dev/list-signature-images'
    const ASSETS_BASE_URL = 'http://assets.lambent.tv/'

    const [isLoading, setIsLoading] = useState(true)
    const [imageOptions, setImageOptions] = useState([])
    const [disableSelect, setDisableSelect] = useState(false)
    const [showUpload, setShowUpload] = useState(false)
    const [selectedFile, setSelectedFile] = useState('select')
    const [disclaimerText, setDisclaimerText] = useState('')

    const [htmlToLoad, setHtmlToLoad] = useState('')

    useEffect(() => {

        setDisclaimerText("Lambent Productions Ltd | Registered in England no. 3067281 | Registered office: 48 St Leonards Road, Bexhill-on-Sea, East Sussex, TN40 1JB | VAT Reg: 690 5460 24 \n\nFor our Privacy Notice please see https://lambentproductions.co.uk/privacy/")
        loadImages().then((res) => {
            setIsLoading(false)
        })
    }, [])

    const loadImages = () => {
        return new Promise((resolve, reject) => {
            axios.get(LIST_IMAGES_ENDPOINT)
                .then((res) => {
                    let imageData = res.data.objects.Contents
                    var newImages = []

                    imageData.forEach(element => {
                        let key = element.Key
                        if (key !== "sig-img/") {
                            let image = {
                                name: key.substring(key.lastIndexOf('/') + 1).split('.')[0],
                                url: ASSETS_BASE_URL + key
                            }
                            newImages.push(image)
                        }
                    })

                    newImages.sort().reverse()

                    setImageOptions(newImages)

                    // console.log(newImages)

                    setImageOptions(newImages)

                    resolve()
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    const imageSelectedChanged = (e) => {
        setSelectedFile(e.target.value)
        if (e.target.value === "upload") {
            console.log("showing")
            setShowUpload(true)
        }
    }

    const imageUploadOnCompete = (imageValue) => {
        console.log(imageValue)
        loadImages()
            .then((res) => {
                setSelectedFile(imageValue)
                setShowUpload(false)
            })
    }

    // Updating HTML
    useEffect(() => {
        const LINK_DETECTION_REGEX = /(([a-z]+:\/\/)?(([a-z0-9-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-.~]+)*(\/([a-z0-9_\-.]*)(\?[a-z0-9+_\-.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi

        let imageToUse = imageOptions.filter(i => i.name.includes(selectedFile))[0]

        let discImage = imageToUse ? `<p><img style="max-width:95%;" src="${imageToUse.url}"></p>` : '<p>No Image Selected</p>'

        let discTextStart = '<p style="font-size:10px;font-family:Helvetica,Arial,Sans-Serif;color:#999">'

        let linkedDisclaimer = disclaimerText.replace(LINK_DETECTION_REGEX, (url) => {
            let address = /[a-z]+:\/\//.test(url) ? url : `http://${url}`
            // url = url.replace(/^https?:\/\//, '')
            return `<a href="${address}" target="_blank">${url}</a>`
        })
        let discEnd = '<p/>'

        setHtmlToLoad(discImage + discTextStart + linkedDisclaimer + discEnd)
    }, [selectedFile, disclaimerText, imageOptions])

    return (
        <>
            <GenerateDisclaimerHeader />
            <UploadNewImageModal
                setShowUpload={setShowUpload}
                showUpload={showUpload}
                onComplete={imageUploadOnCompete}
            />
            <Row hidden={!isLoading}>
                <Col className='text-center'>
                    <Spinner animation="grow" variant="primary" />
                </Col>
            </Row>
            <div className={"loadedView" + (isLoading ? "" : " fade-in")}>
                <Row>
                    <Col md={4} sm={12}>
                        <Form>
                            <Form.Group controlId="disclaimerForm.previousFiles">
                                <Form.Label>
                                    Disclaimer Image
                                </Form.Label>
                                <Form.Select
                                    value={selectedFile}
                                    key={imageOptions.length}
                                    onFocus={() => setDisableSelect(true)}
                                    onChange={imageSelectedChanged}
                                >
                                    <option disabled={disableSelect} key="select" value="select" defaultValue>Select Image</option>
                                    <option disabled key="-1">–––––––––</option>
                                    <option key="upload" value="upload">Upload New…</option>
                                    <option disabled key="-2">–––––––––</option>
                                    {imageOptions.map((option) => {
                                        return (<option value={option.name} key={option.name}>{option.name}</option>)
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Form.Label>
                                    Disclaimer Text
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={disclaimerText}
                                    rows={8}
                                    onChange={(e) => setDisclaimerText(e.target.value)}
                                    style={{ fontSize: "12px" }}
                                >

                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={8} sm={12}>
                        <Row>
                            <Col>
                                <hr className="d-sm-block d-md-none"/>
                                <h3>Preview</h3>
                                <div dangerouslySetInnerHTML={{ __html: htmlToLoad }} />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>
                                <h3>HTML to Copy</h3>
                                <code>
                                    {htmlToLoad}
                                </code>
                            </Col>
                        </Row>
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
                    <p>Upload a new email banner or select one below, then copy and paste the HTML code into Exchange Admin</p>
                </div>
            </Col>
        </Row>
    )
}

const UploadNewImageModal = (props) => {
    return (
        <Modal
            size="md"
            show={props.showUpload}
            onHide={() => props.setShowUpload(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>Upload new image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <UploadNewImageForm onComplete={props.onComplete} />
            </Modal.Body>
        </Modal>
    )
}

const UploadNewImageForm = (props) => {
    const API_ENDPOINT = 'https://dptam09r3a.execute-api.eu-west-2.amazonaws.com/dev/generate-url'

    const [selectedFile, setSelectedFile] = useState(null)
    const [imageName, setImageName] = useState("")
    const [shouldValidate, setShouldValidate] = useState(false)
    const [imageErrorType, setImageErrorType] = useState('Please select a valid image')
    const [isUploading, setIsUploading] = useState(false)

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
        proposedName = proposedName.replace(/[^\w\s-]/gi, '')
        proposedName = proposedName.split(' ').join('-')

        setImageName(proposedName)
    }

    const uploadFile = (e) => {
        setShouldValidate(true)
        e.preventDefault()
        e.stopPropagation()

        const form = e.currentTarget

        if (form.checkValidity() === false || selectedFile.size > 100000) {
            return
        }

        const date = new Date()
        const datePrefix = String(date.getFullYear()).substr(2, 2) + String(date.getMonth() + 1).padStart(2, '0') + String(date.getDate()).padStart(2, '0')

        console.log("Date:")
        console.log(date)

        var finalName = datePrefix + '_' + imageName

        setIsUploading(true)

        let extension = selectedFile.name.split('.').pop()

        const reqObj = {
            FileName: finalName + '.' + extension,
            FileType: "image"
        }

        axios.post(API_ENDPOINT, { reqObj })
            .then(res => {
                console.log("Reached 1")
                axios.put(res.data.fileURL, selectedFile)
                    .then(res => {
                        console.log(res)
                })
                console.log(res.data.fileURL)
                fetch(res.data.fileURL, {
                    method: 'PUT',
                    body: selectedFile
                })
                    .then(res => {
                        setIsUploading(false)
                        props.onComplete(finalName)
                    })
            })

    }

    return (
        <>
            <Form noValidate validated={shouldValidate} onSubmit={uploadFile}>
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
                        placeholder="e.g. royals-promo"
                        value={imageName}
                        onChange={handleImageNameChange}
                        required />
                    <Form.Control.Feedback type="invalid">Please enter a valid name</Form.Control.Feedback>
                    <Form.Text className="text-muted">
                        Please enter a short filename with no spaces or special characters. Today's date in reverse order will be prepended to the file name, so if you upload "royals-promo" it will become "211206-royals-promo.png"
                    </Form.Text>
                </Form.Group>
                <br />
                <Row>
                    <Col>
                        <Button disabled={isUploading} className="float-left" type="submit">Upload Image</Button>
                    </Col>
                    <Col>
                        <Spinner hidden={!isUploading} className="float-right" animation="grow" variant="primary" float-left="true" />
                    </Col>
                </Row>
            </Form>
        </>
    )
}