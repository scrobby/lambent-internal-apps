import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'

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
                        <div className="jumbotron">
                            <h1>Logged Out</h1>
                        </div>
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