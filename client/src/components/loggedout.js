import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import Jumbotron from 'react-bootstrap/Jumbotron'

export default class LoggedOut extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }

    }

    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Jumbotron>
                            <h1>Logged Out</h1>
                        </Jumbotron>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        
                    </Col>
                </Row>
            </>
        )
    }
}