import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Navbar, Nav, Row, NavDropdown, Col } from 'react-bootstrap'

import Home from './components/home.js'
import { GenerateDisclaimer } from './components/generate-disclaimer.js'
import { GenerateSignature } from './components/generate-signature.js'
import { NewUser } from './components/new-user/index.js'


import { useIsAuthenticated, useMsal } from "@azure/msal-react"
import { SignInButton } from "./components/azure/SignInButton"
import LoggedOut from './components/loggedout.js'

const allowedDisclaimerUserIDs = [
  "c722462b-51ce-446f-a9a5-37ff474323f0", // Alice's ID
  "3145a069-f9c1-4240-9434-385498de8f33" // Chloë's ID
]

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
  }

  render() {

    return (
      <Router>
        <PageLayout lpName={this.state.lpName} lpHomeAccountID={this.state.lpHomeAccountID}/>
      </Router>
    )
  }
}

const PageLayout = (props) => {
  const isAuthenticated = useIsAuthenticated()


  return (
    <Container fluid className="lp-mainContainer">
      <LPNavBar isLoggedIn={isAuthenticated} userName={props.lpName} lpHomeAccountID={props.lpHomeAccountID}/>
      <Container className="lp-contentContainer">
        <LPRouter isLoggedIn={isAuthenticated} />
      </Container>
    </Container>
  )
}

function LPNavBar(props) {
  const { accounts } = useMsal()

  let accountID = accounts[0] && accounts[0].localAccountId

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="lp-navbarBrand">Lambent Tools</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="new-user">
              <Nav.Link>New User Setup</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/signature-generator" hidden={!props.isLoggedIn}>
              <Nav.Link>Signature Generator</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/disclaimer-generator" hidden={allowedDisclaimerUserIDs.indexOf(accountID) >= 0 ? false : true}>
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
        <NavDropdown id="userDropdown" menuVariant="dark" title={GetUserName()}>
          <NavDropdown.Header><GetUserEmail /></NavDropdown.Header>
          {/* <NavDropdown.Divider/> */}
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
  if (props.isLoggedIn) {
    return (
      <>
        <Route path="/" exact><Home /></Route>
        <Switch>
          <Route path="/new-user"><NewUser /></Route>
          <Route path="/signature-generator"><GenerateSignature /></Route>
          <Route path="/disclaimer-generator"><GenerateDisclaimer /></Route>
          <Route path="/logged-out"><LoggedOut /></Route>
        </Switch>
      </>
    )
  } else {
    return (
      <>
        <Switch>
          <Route path="/new-user"><NewUser /></Route>
          <Route><NotLoggedInHome /></Route>
        </Switch>
      </>
    )
  }

}

function NotLoggedInHome() {
  return (
    <>
      <Row style={{ textAlign: "center" }}>
        <Col>
          <div className="jumbotron" style={{ height: "90%" }}>
            <h1>Not Signed In</h1>
            <p>You must be logged in if you want to view this page.</p>
            <br />
            <SignInButton />
          </div>
        </Col>
      </Row>
    </>
  )
}

function GetUserName() {
  const { accounts } = useMsal()

  const name = accounts[0] && accounts[0].name

  return name
}

function GetUserEmail() {
  const { accounts } = useMsal()

  console.log(JSON.stringify(accounts[0]))

  const email = accounts[0] && accounts[0].username

  return email ? email : null
}

function handleLogout(instance) {
  instance.logoutPopup().catch(e => {
    console.error(e);
  });
}

// function PrivateRoute ({component: Component, authed, ...rest}) {
//   return (
//     <Route
//       {...rest}
//       render={(props) => authed === true
//         ? <Component {...props} />
//         : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
//     />
//   )
// }