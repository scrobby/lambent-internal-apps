import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Navbar, Nav, Row, Jumbotron, NavDropdown, Col } from 'react-bootstrap'

import Home from './components/home.js'
import GenerateDisclaimer from './components/generate-disclaimer.js'
import { GenerateSignature } from './components/generate-signature.js'

import { useIsAuthenticated, useMsal } from "@azure/msal-react"
import { SignInButton } from "./components/azure/SignInButton"

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      isLoggedIn: false,
      lpUsername: null,
      lpName: null,
      lpHomeAccountID: null,
      lpIdTokenClaims: null
    }

    this.onAuthenticated = this.onAuthenticated.bind(this)
  }

  onAuthenticated(userAccountInfo) {
    console.log(userAccountInfo)
    this.setState({
      isLoggedIn: true,
      lpUsername: userAccountInfo.username,
      lpName: userAccountInfo.name,
      lpHomeAccountID: userAccountInfo.homeAccountId,
      lpIdTokenClaims: userAccountInfo.lpIdTokenClaims
    })
  }

  render() {

    return (
      <Router>
        <PageLayout lpName={this.state.lpName} />
      </Router>
    )
  }
}

const PageLayout = (props) => {
  const isAuthenticated = useIsAuthenticated()

  console.log('Authenticated: ' + isAuthenticated)

  return (
    <Container fluid className="lp-mainContainer">
      <LPNavBar isLoggedIn={isAuthenticated} userName={props.lpName} />
      <Container className="lp-contentContainer">
        <LPRouter isLoggedIn={isAuthenticated} />
      </Container>
    </Container>
  )
}

function LPNavBar(props) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="lp-navbarBrand">Lambent Tools</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" hidden={!props.isLoggedIn}>
            <LinkContainer exact to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/signature-generator">
              <Nav.Link>Signature Generator</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/disclaimer-generator">
              <Nav.Link>Disclaimer Generator</Nav.Link>
            </LinkContainer>
          </Nav>
          <LPNavBarUser key={'IsLogged' + props.isLoggedIn} {...props} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

const LPNavBarUser = (props) => {
  const { instance } = useMsal()

  if (props.isLoggedIn) {
    return (
      <Nav>
        <NavDropdown title={GetUserName()}>
          <NavDropdown.Item onClick={() => handleLogout(instance)}>Log Out</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    )
  } else {
    return (
      <Nav className="ml-auto">
        <Nav.Item>
          <SignInButton />
        </Nav.Item>
      </Nav>
    )
  }
}

function LPRouter(props) {
  console.log('Is logged: ' + props.isLoggedIn)
  console.log('Is logged tho: ' + props.isLoggedInTho)
  if (props.isLoggedIn) {
    return (
      <>
        <Route path="/" exact><Home /></Route>
        <Switch>
          <Route path="/signature-generator"><GenerateSignature /></Route>
          <Route path="/disclaimer-generator"><GenerateDisclaimer /></Route>
        </Switch>
      </>
    )
  } else {
    return (
      <>
        <Jumbotron>
          <Row style={{ textAlign: "center" }}>
            <Col>
              <h1>Login Needed</h1>
              <p>You must be logged in if you want to view this page.</p>
              <br />
              <SignInButton />
            </Col>
          </Row>
        </Jumbotron>
      </>
    )
  }

}

function GetUserName() {
  const { accounts } = useMsal()

  const name = accounts[0] && accounts[0].name

  return name
}

function handleLogout(instance) {
  instance.logoutPopup().catch(e => {
    console.error(e);
  });
}