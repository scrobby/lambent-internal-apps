import React, { Component } from 'react'

import { Row, Col, Jumbotron, Form } from 'react-bootstrap'

import { useMsal } from '@azure/msal-react'

export default class GenerateSignature extends Component {
    constructor(props) {
        super(props)

        let defaultDetails = UserDetails()
        console.log("Def deets: " + JSON.stringify(defaultDetails))

        this.state = {
            fullName: defaultDetails.name,
            jobTitle: defaultDetails.email,
            phone: "",
            showLandline: true
        }

        this.handleChange = this.handleChange.bind(this)

    }

    handleChange(event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
    
        this.setState({
          [name]: value
        })
      }

    render() {
        

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
                            <Form.Control type="Text" placeholder="Full Name" name="fullName" onChange={this.handleChange} value={this.state.fullName}/>
                        </Form.Group>
                        <Form.Group controlId="signatureForm.JobTitle">
                            <Form.Label>Job Title</Form.Label>
                            <Form.Control type="Text" placeholder="Job Title" name="jobTitle" onChange={this.handleChange} value={this.state.jobTitle}/>
                        </Form.Group>
                        <Form.Group controlId="signatureForm.Phone">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control type="Tel" placeholder="07123456789" name="phone" onChange={this.handleChange} value={this.state.phone}/>
                        </Form.Group>
                        <Form.Group controlId="signatureForm.Landline">
                            <Form.Check type="Checkbox" name="showLandline" onChange={this.handleChange} checked={this.state.showLandline} label="Show Landline"/>
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={8} sm={12}>
                    <Row>
                        <Col>
                            <h3>Formatted Text</h3>
                            <div dangerouslySetInnerHTML={{ __html: signatureHTML}}/>
                        </Col>
                    </Row>
                    <hr/>
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
}

function UserDetails() {
    const { accounts } = useMsal()

    let retVal = {
        name: "Test User",
        email: "email@test.tv"
    }

    console.log("Retval: " + retVal)

    return (retVal)
}