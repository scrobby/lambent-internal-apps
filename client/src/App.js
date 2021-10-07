import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { LinkContainer } from 'react-router-bootstrap'

import './scss/App.scss'

import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap'

import Home from './components/home.js'
import GenerateDisclaimer from './components/generate-disclaimer.js'
import GenerateSignature from './components/generate-signature.js'

console.log("Got here!")
console.log(Home)

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      exampleVariable: true
    }

    this.myFunction = this.myFunction.bind(this)
  }

  myFunction() {
    console.log("Hello there")
  }

  render() {
    return (
      <Router>
        <Container fluid className="lp-mainContainer">
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand className="lp-navbarBrand">Lambent Tools</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav >
                  <LinkContainer exact="true" to="/">
                    <Nav.Link>Home</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/signature-generator">
                    <Nav.Link>Signature Generator</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/disclaimer-generator">
                    <Nav.Link>Disclaimer Generator</Nav.Link>
                  </LinkContainer>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Container className="lp-contentContainer">
            <Route path="/" exact><Home /></Route>
            <Switch>
              <Route path="/signature-generator"><GenerateSignature /></Route>
              <Route path="/disclaimer-generator"><GenerateDisclaimer /></Route>
            </Switch>
          </Container>
        </Container>
      </Router>

    )
  }
}
