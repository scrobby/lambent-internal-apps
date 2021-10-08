import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import Jumbotron from 'react-bootstrap/Jumbotron'

export default class Home extends Component {
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
                            <h1>Lambent Tools</h1>
                            <p>There may or may not be more things here in the future. If anything doesn't work, <a href="msteams://teams.microsoft.com/l/chat/0/0?users=chloe@lambent.tv&topicName=Lambent%20Tools">contact Chloë</a></p>
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