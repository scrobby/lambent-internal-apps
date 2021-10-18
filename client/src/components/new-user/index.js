import { Col, Row, Jumbotron, Button, Image } from "react-bootstrap"

import { useLocation, useHistory } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'

import steps from './steps.json'
import ReactMarkdown from "react-markdown"

export function NewUser(props) {
    const currentStep = useLocation().hash
    const history = useHistory()

    if (!currentStep || currentStep.length === 1) {
        history.push('#welcome')
        return ('')
    }

    const stepKeys = Object.keys(steps)
    stepKeys.pop()

    return (
        <>
            <Jumbotron style={{ backgroundColor: "white" }}>
                <NUStep details={steps[currentStep]} />
                <hr />
                <NUNavButtons currentStep={currentStep} stepKeys={stepKeys} prevKey={prevKey(currentStep, stepKeys)} />
            </Jumbotron>
        </>
    )
}

function NUStep(props) {
    let hasSecondaryContent = props.details.image // left this open to having possible other secondary content in the future

    return (
        <>
            <Row>
                <Col lg={hasSecondaryContent ? 6 : 12} md={12}>
                    <Row>
                        <Col>
                            <h1>{props.details.title}</h1>

                            <p>
                                {/* <ReactMarkdown children={props.details.text}/> */}
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        {props.details.links ?
                            props.details.links.map(link => <NULinkButton link={link} />) :
                            null
                        }
                    </Row>
                </Col>
                <Col lg={6} md={12} hidden={!hasSecondaryContent}>
                    {props.details.image ?
                        <Image src={'/new-user-images/' + props.details.image} rounded fluid /> :
                        null
                    }
                </Col>
            </Row>
        </>
    )
}

function NUNavButtons(props) {
    let next = nextKey(props.currentStep, props.stepKeys)
    let prev = prevKey(props.currentStep, props.stepKeys)

    return (
        <>
            <Row>
                <Col xs={4}>
                    <LinkContainer hidden={!prev} to={prev ? prev : ""}>
                        <Button >Previous</Button>
                    </LinkContainer>
                </Col>
                <Col xs={4} className="justify-content-center my-auto d-flex d-sm-none">
                    {Math.abs(props.stepKeys.indexOf(props.currentStep) + 1)} of {props.stepKeys.length}
                </Col>
                <Col xs={4} className="justify-content-center my-auto d-none d-sm-flex">
                    Step {Math.abs(props.stepKeys.indexOf(props.currentStep) + 1)} of {props.stepKeys.length}
                </Col>
                <Col xs={4}>
                    <LinkContainer hidden={!next} to={next ? next : ""}>
                        <Button className="float-right">Next</Button>
                    </LinkContainer>
                </Col>
            </Row>
        </>
    )
}

function NULinkButton(props) {
    const currLink = props.link
    let linkType = currLink.type ? currLink.type : 'external'

    //defaults to an external link
    switch (linkType) {
        case 'internal':
            return('HAVE NOT SET UP INTERNAL LINKS YET')
        default:
            return (<Col className="d-flex justify-content-center"><Button href={currLink.value} target="_blank">{currLink.text}</Button></Col>)
    }
}

function nextKey(currentKey, keys) {
    let index = keys.indexOf(currentKey)

    if (index === keys.length - 1) {
        return null
    } else {
        return keys[index + 1]
    }
}

function prevKey(currentKey, keys) {
    let index = keys.indexOf(currentKey)

    if (index === 0) {
        return null
    } else {
        return keys[index - 1]
    }
}