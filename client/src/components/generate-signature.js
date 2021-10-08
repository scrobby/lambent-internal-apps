import React, { useState } from 'react'

import { Row, Col, Jumbotron, Form } from 'react-bootstrap'

import { useMsal } from '@azure/msal-react'

export function GenerateSignature(props) {
    const [fullName, setFullName] = useState("")
    const [jobTitle, setJobTitle] = useState("")
    const [phone, setPhone] = useState("")
    const [showLandline, setShowLandline] = useState(true)

    var signatureHTML = '<p style="font-size:12px;font-family:Calibri, Arial, Sans-Serif;"><strong><span style="color: #333;">' + (fullName ? fullName : 'Full Name') + ' |</span>&nbsp;<span style="color: #fd6320;">' + (jobTitle ? jobTitle : 'Job Title') + '</span></strong><br /> <span style="color: #555;">The Warehouse,&nbsp;128 Gloucester Road, Brighton, BN1 4AF</span> <br />' + (showLandline ? '<span style="color: #555;">T:</span>&nbsp;<a href="tel:01273789090" style="color: #1b9ce2;">01273 789090</a><br />' : '') + (phone ? '<span style="color: #555;">M:</span>&nbsp;<a href="tel:' + phone.replace(/\s/g, '') + '" style="color: #1b9ce2;">' + phone + '</a><br />' : '') + '<span style="color: #555;">W:</span>&nbsp;<span style="color: #1b9ce2;"><a style="color: #1b9ce2;" title="Lambent Productions" href="http://lambentproductions.co.uk/" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" data-linkindex="2">lambentproductions.co.uk</a></span></p>'

    return (
        <>
            <Row>
                <Col>
                    <Jumbotron>
                        <h1>Generate Email Signature</h1>
                        <p>Enter your details below and press "Generate" to create a signature, either as formatted text or as raw HTML.</p>
                    </Jumbotron>
                </Col>
            </Row>
            <Row>
                <Col md={4} sm={12}>
                    <Form>
                        <Form.Group controlId="signatureForm.FullName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="Text" placeholder="Full Name" name="fullName" onChange={e => setFullName(e.target.value)} value={fullName} />
                        </Form.Group>
                        <Form.Group controlId="signatureForm.JobTitle">
                            <Form.Label>Job Title</Form.Label>
                            <Form.Control type="Text" placeholder="Job Title" name="jobTitle" onChange={e => setJobTitle(e.target.value)} value={jobTitle} />
                        </Form.Group>
                        <Form.Group controlId="signatureForm.Phone">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control type="Tel" placeholder="07123456789" name="phone" onChange={e => setPhone(e.target.value)} value={phone} />
                        </Form.Group>
                        <Form.Group controlId="signatureForm.Landline">
                            <Form.Check type="Checkbox" name="showLandline" onChange={e => setShowLandline(e.target.checked)} checked={showLandline} label="Show Landline" />
                        </Form.Group>
                    </Form>
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
                            <h3>Raw HTML</h3>
                            <code>
                                {signatureHTML}
                            </code>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}