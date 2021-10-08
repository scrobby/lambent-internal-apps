import React, { Component } from 'react'

import { Row, Col, Jumbotron, Form } from 'react-bootstrap'

export default class GenerateSignature extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fullName: "",
            jobTitle: "",
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
        var signatureHTML = '<p style="font-size:12px;font-family:Calibri, Arial, Sans-Serif;"><strong><span style="color: #333;">' + (this.state.fullName ? this.state.fullName : 'Full Name') + ' |</span>&nbsp;<span style="color: #fd6320;">' + (this.state.jobTitle ? this.state.jobTitle : 'Job Title') + '</span></strong><br /> <span style="color: #555;">The Warehouse,&nbsp;128 Gloucester Road, Brighton, BN1 4AF</span> <br />' + (this.state.showLandline ? '<span style="color: #555;">T:</span>&nbsp;<a href="tel:01273789090" style="color: #1b9ce2;">01273 789090</a><br />' : '') + (this.state.phone ? '<span style="color: #555;">M:</span>&nbsp;<a href="tel:' + this.state.phone.replace(/\s/g, '') + '" style="color: #1b9ce2;">' + this.state.phone + '</a><br />' : '') + '<span style="color: #555;">W:</span>&nbsp;<span style="color: #1b9ce2;"><a style="color: #1b9ce2;" title="Lambent Productions" href="http://lambentproductions.co.uk/" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" data-linkindex="2">lambentproductions.co.uk</a></span></p>'

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