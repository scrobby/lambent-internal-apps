import React, { useState, useEffect } from 'react'

import { Row, Col, Form, Spinner, FloatingLabel } from 'react-bootstrap'

import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../authConfig'
import { callMsGraph } from '../graph'

export function GenerateSignature(props) {
    const { accounts, instance } = useMsal()
    const [isLoading, setIsLoading] = useState(true)

    const [fullName, setFullName] = useState("")
    const [jobTitle, setJobTitle] = useState("")
    const [mobile, setMobile] = useState("")
    const [landline, setLandline] = useState("01273 789090")
    const [userEmail, setUserEmail] = useState("")
    const [showLandline, setShowLandline] = useState(true)
    const [showMobile, setShowMobile] = useState(true)
    const [showEmail, setShowEmail] = useState(false)
    const [showWebsite, setShowWebsite] = useState(true)
    const [address, setAddress] = useState(true)
    const [showAddress, setShowAddress] = useState(true)

    let account = accounts && accounts[0]

    useEffect(() => {
        GetGraphData(account, instance, (profileData => {
            setFullName(profileData.displayName ? profileData.displayName : "")
            setAddress("Lambent Productions, 96 Church Street, Brighton, BN1 1UJ")
            setJobTitle(profileData.jobTitle ? profileData.jobTitle : "")
            setMobile(profileData.mobilePhone ? profileData.mobilePhone : "")
            setLandline(profileData.businessPhones ? profileData.businessPhones[0] ? profileData.businessPhones[0] : "" : "")
            setShowMobile(profileData.mobilePhone ? true : false)
            setUserEmail(profileData.mail ? profileData.mail : "")
            setIsLoading(false)
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let sigStart = '<p style="font-size:12px;font-family:Calibri, Arial, Sans-Serif;"><strong><span style="color: #333;">'
    let sigNameTitle = `${fullName ? fullName : 'Full Name'} | </span><span style="color: #fd6320;">${jobTitle ? jobTitle : 'Job Title'}</span></strong>`
    let sigAddress = showAddress ? `<br /> <span style="color: #555;">${address}</span>` : ''
    let sigLandline = showLandline ? `<br /><span style="color: #555;">T: </span><a href="tel:${landline.replace(/\s/g, '')}" style="color: #1b9ce2;">${landline}</a>` : ''
    let sigMobile = mobile && showMobile ? `<br /><span style="color: #555;">M: </span><a href="tel:${mobile.replace(/\s/g, '')}" style="color: #1b9ce2;">${mobile}</a>` : ''
    let sigEmail = showEmail ? `<br /><span style="color: #555;">E:</span>&nbsp;<a href="mailto:${userEmail}" style="color: #1b9ce2;">${userEmail}</a>` : ''
    let sigWebsite = showWebsite ? '<br /><span style="color: #555;">W:</span>&nbsp;<span style="color: #1b9ce2;"><a style="color: #1b9ce2;" title="Lambent Productions" href="https://lambent.tv/" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" data-linkindex="2">lambent.tv</a></span>' : ''
    var signatureHTML = sigStart + sigNameTitle + sigAddress + sigLandline + sigMobile + sigEmail + sigWebsite + '</p>'

    return (
        <>
            <GenerateSignatureHeader />
            <Row hidden={!isLoading}>
                <Col className='text-center'>
                    <Spinner animation="grow" variant="primary" />
                </Col>
            </Row>
            <div className={"loadedView" + (isLoading ? "" : " fade-in")}>
                <Row>
                    <Col md={4} sm={12}>
                        <Form>
                            <Form.Group controlId="signatureForm.FullName">
                                <FloatingLabel
                                    controlId="floatingInput"
                                    className="mb-3"
                                    label="Full Name"
                                >
                                    <Form.Control type="Text" placeholder="Full Name" name="fullName" onChange={e => setFullName(e.target.value)} value={fullName} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group controlId="signatureForm.JobTitle">
                                <   FloatingLabel
                                    controlId="floatingInput"
                                    className="mb-3"
                                    label="Job Title"
                                >
                                    <Form.Control type="Text" placeholder="Job Title" name="jobTitle" onChange={e => setJobTitle(e.target.value)} value={jobTitle} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group controlId="signatureForm.Mobile">
                                <FloatingLabel
                                    controlId="floatingInput"
                                    className="mb-3"
                                    label="Mobile Number"
                                >
                                    <Form.Control type="Tel" placeholder="07123456789" name="mobile" onChange={
                                        (e) => {
                                            setMobile(e.target.value)
                                            setShowMobile(e.target.value.length > 0)
                                        }
                                    } value={mobile} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group controlId="signatureForm.Address">
                                <FloatingLabel
                                    controlId="floatingInput"
                                    className="mb-3"
                                    label="Address"
                                >
                                    <Form.Control type="Text" name="address" size="sm" onChange={
                                        (e) => {
                                            setAddress(e.target.value)
                                            setShowAddress(e.target.value.length > 0)
                                        }
                                    } value={address} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group controlId="signatureForm.Landline">
                                <FloatingLabel
                                    controlId="floatingInput"
                                    className="mb-3"
                                    label="Landline"
                                >
                                    <Form.Control type="Tel" placeholder="01273 789090" name="landline" onChange={
                                        (e) => {
                                            setLandline(e.target.value)
                                            setShowLandline(e.target.value.length > 0)
                                        }
                                    } value={landline} />
                                </FloatingLabel>
                            </Form.Group>
                            <Row>
                                <Form.Group as={Col} lg={6} md={12} sm={6} xs={12} controlId="signatureForm.ShowLandline">
                                    <Form.Check type="Checkbox" name="showLandline" onChange={e => setShowLandline(e.target.checked)} checked={showLandline} label="Show Landline" />
                                </Form.Group>
                                <Form.Group as={Col} lg={6} md={12} sm={6} xs={12} controlId="signatureForm.ShowAddress">
                                    <Form.Check type="Checkbox" name="showAddress" onChange={e => setShowAddress(e.target.checked)} checked={showAddress} label="Show Address" />
                                </Form.Group>
                                <Form.Group as={Col} lg={6} md={12} sm={6} xs={12} controlId="signatureForm.ShowMobile">
                                    <Form.Check type="Checkbox" name="showMobile" onChange={e => setShowMobile(e.target.checked)} checked={showMobile} label="Show Mobile" />
                                </Form.Group>
                                <Form.Group as={Col} lg={6} md={12} sm={6} xs={12} controlId="signatureForm.ShowEmail">
                                    <Form.Check type="Checkbox" name="showEmail" onChange={e => setShowEmail(e.target.checked)} checked={showEmail} label="Show Email" />
                                </Form.Group>
                                <Form.Group as={Col} lg={6} md={12} sm={6} xs={12} controlId="signatureForm.ShowWebsite">
                                    <Form.Check type="Checkbox" name="showWebsite" onChange={e => setShowWebsite(e.target.checked)} checked={showWebsite} label="Show Website" />
                                </Form.Group>
                            </Row>
                        </Form>
                        <hr className="d-md-none d-block" />
                    </Col>
                    <Col md={8} sm={12}>
                        <Row>
                            <Col>
                                <h3>Formatted Text</h3>
                                <div dangerouslySetInnerHTML={{ __html: signatureHTML }} />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>
                                <h3>HTML</h3>
                                <code>
                                    {signatureHTML}
                                </code>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </>
    )
}

function GenerateSignatureHeader() {
    return (
        <Row>
            <Col>
                <div class="jumbotron">
                    <h1>Generate Email Signature</h1>
                    <p>Enter your details below and the signature will automatically update. Copy and paste it into whichever email client you prefer - most will accept the Formatted Text, unless they specifically ask for HTML. For full instructions on how to update your email signature, please use the <a href="https://lambentprods.sharepoint.com/SitePages/Email-Signature.aspx" target="_blank" rel="noreferrer">how-to guide</a>.</p>
                </div>
            </Col>
        </Row>
    )
}

export function GetGraphData(account, instance, callback) {
    const request = {
        ...loginRequest,
        account: account
    }

    // Silently acquire token
    setTimeout(() => {
        instance.acquireTokenSilent(request).then((response) => {
            callMsGraph(response.accessToken).then(response => callback(response))
        }).catch((e) => {
            instance.acquireTokenPopup(request).then((response) => {
                callMsGraph(response.accessToken).then(response => callback(response))
            })
        })
    }, 500)
}