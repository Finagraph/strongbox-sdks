/*
 * IMPORTANT: This sample illustrates making calls to the Strongbox service to 
 * generate secure access tokens.  The following constants are defined below: clientId
 * and clientSecret. You will need to provide the values that have been assigned for your
 * organization.    DO NOT EXPOSE THOSE CREDENTIALS AS IS DONE IN THIS DEMONSTRATION APP.
 * THOSE CREDENTIALS SECURE YOUR ACCESS TO STRONGBOX AND ANYONE WHO POSSESSES THEM CAN
 * ACCESS STRONGBOX ON YOUR BEHALF.   THE CODE SHOWN BELOW FOR CREATING SECURITY TOKENS 
 * SHOULD BE EXECUTED ON A SERVER OWNED BY THE PARTNER WHERE SECURE ACCESS TO CREDENTIALS
 * CAN BE PROVIDED SUCH AS THROUGH MICROSOFT AZURE KEYVAULT OR SIMILAR SERVICES.
 * 
 * IMPORTANT: A couple values need to be replaced in this file.  Search for 'TODO'.
 * 
 * This sample code demonstrates how to use the Strongbox FinConnect react component
 * that guides a user through the process of connecting Strongbox to their accounting
 * system such that it can gather their financial information from the accounting 
 * system and provide analysis of that data to a financial institution partnered with
 * Finagraph.
 * 
 * The process is straight-forward and divided in to two parts. The first step is to 
 * generate an access token.  This token is generated for an organization that has partnered
 * with Finagraph and has received a carefully guarded clientId and clientSecret that
 * identifies the partner to Strongbox.
 * 
 * In the code below 'componentDidMount' is devoted exclusively to this first step. Once you
 * add your partner credentials, it uses those to generate an access token and once generated 
 * stores it in state for the App component.  That code has a number of 'console.log' messages 
 * sprinkled throughout so you can follow the progress in the browser developer tools.
 * 
 * The second step is to simply include the React component in your code.  The render method 
 * is devoted to showing what a simple credit application with the Strongbox React component 
 * might look like.  When the user presses the button to connect their financial records they
 * are allowed to choose from the supported accounting packages and connect Strongbox
 * to their financial records.
 * 
 * The majority of the code in render is devoted to showing a sample application.  
 * The 'StrongboxFinConnect' component is imported from the component module and completely contained
 * within <StrongboxFinConnect... in render.
 * 
 * In this sample application the react component is not displayed until a delegated access
 * token has been created and is simply not present. An actual consumer is of course free to 
 * do this as well or show something that indicates it's loading, etc.
 * 
 * ----------------- Branding and Customization ------------------------
 * 
 * These are fully detailed in the ReadMe for the Strongbox React component but warrant a quick
 * mention here.  These are both optional.
 * 
 * You can override most of the colors and appearance of UI elements in the component.  This is
 * accomplished by passing the optional 'theme' property to the component.  It's an object that has
 * a number of members related to the appearance of the component, for example, colors (palette).  
 * An example would be:
 * 
 * theme={{
 *      palette: {
 *          windowBackground: '#d0d0d0',
 *          controlBackground: '#000000',
 *      }
 * }}     
 * 
 * As you might guess, this would result in the main window background being gray and the background
 * of user input controls like buttons being black.
 * 
 * The consumer of the component has some control over most of the colors, font parameters and some 
 * elements of appearance such as the radius of elements like buttons.
 * 
 * For experimenting with appearance, for example color, you can try this sample theme. You can just 
 * be able to cut and paste this as a prop following the strongboxUri prop on <StrongboxFinConnect... 
 * below and see what the effect is:
 * 
                    theme={{
                        palette: {
                            windowBackground: '#d0d0d0',
                            borrowerInteractionBackground: '#d0d0d0',
                            controlBackground: '#000000',
                            controlForeground: '#fff',
                            modalBackground: '#d0d0d0',
                            modalText: '#fff',
                            modalTitle: '#fff',
                            progressBarForeground: '#fff',
                        },
                        font: {
                            family: 'courier',
                            controlSize: '16px',
                            size: '16px',
                            size_h1: '24px',
                            modalFamily: 'courier',
                            modalTitleSize: '24px',
                        },
                        container: {
                            paddingLeft: '100px',
                        },
                        controls: {
                            borderRadius: '10px',
                        }
                    }}

 * All of the fields shown above are optional.  If no value is provided the default value will be
 * provided so fox example the following would be completely valid and only effect the font  family
 * 
 * theme = {{
 *      font: {
 *          family: 'mistral',
 *      }
 * }}
 * 
 * You also have control over some of the content that appears on the various steps in the component.
 * If you notice within the included component below, it has children. In this sample, that is specifically
 *
 * {(props) => {
 *      return undefined;
 * }}
 *
 * 'props' has a member called step that describes what step is being rendered.  If any value other than
 * undefined is returned, that content will replace the default content.
 *
 * For experimenting with content you can try the sample below.  In the sample code where 
 * it returns undefined under <StrongboxFinConnect, you can replace that code with the following snippet.
 * to observe the effect.
 * 
                    {(props) => {
                        if (props.step === BorrowerSteps.choosePackage) {
                            return (
                                <div style={{ marginTop: '15px' }}>
                                    <p>Submitting your documents to us electronically will</p>
                                    <p>really make it faster and easier to process your application</p>
                                </div>
                            );
                        } else if (props.step === BorrowerSteps.progress) {
                            return (
                                <div>
                                    <p>Setting up a secure connection to our servers</p>
                                    <p>We'll be getting back to you shortly</p>
                                </div>
                            )
                        } else if (props.step === BorrowerSteps.congratulations) {
                            return (
                                <p>You're all done.  Thank you for considering us.</p>
                            )
                        } else {
                            return undefined;
                        }
                    }}
 */

import logo from './Images/Banner.svg';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import { v4 as uuidv4 } from 'uuid';

import React from 'react';
import {
    Button,
    Col,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Row,
} from 'reactstrap';

import { FadeLoader } from 'react-spinners';

import StrongboxFinConnect from '@finagraph/strongbox-finconnect-react';

/**
 * TODO Specify a 'partnerName' that identifies your organization to the user of the widget.
 * For example, the 'partnerName' appears in the sentence "{partnerName} uses Strongbox to link your accounting system"
 */
const partnerName = "XYZ Bank";

const loanReasonHiring = 1;
const loanReasonEquipment = 2;
const loanReasonFacilities = 3;
const loanReasonOther = 4;

class App extends React.Component {
    clientIdInputName = "username";
    clientSecretInputName = "password";
    defaultStrongboxAuthUrl = "https://auth.strongbox.link";

    constructor(props) {
        super(props);

        /*
         * TODO - Specify an orgId and orgName
         * 
         * Set initial values for orgId and orgName below for which there are edit fields to enter these values.
         * If you override the default empty values below, whatever you specify will be used as defaults in
         * the edit fields.
         * 
         * The orgId is an identifier for the Organization for which an Accounting System is being connected.
         * The orgName is a friendly name for that organization.
         * 
         * Typically, you would want to use an identifier for the Organization as stored in your own system. 
         * The maximum allowed length for the id is 128 characters, and it may only contain the following characters: 'a-z', 'A-Z', '0-9', '-', '_', '|'.
         * The name for the Organization that is provided to the Widget is the name that will appear in the Strongbox Financial Portal business list.
         */

        /*
         * TODO - provide API credentials (clientId and clientSecret).
         * 
         * As above, you can set initial values for clientId and clientSecret here for which edit fields are provided.
         * If you override the default values here, whatever you use will be used as defaults in the edit fields.
         * 
         * IF YOU MODIFY THE DEFAULT VALUES HERE, THAT'S OKAY FOR THIS SAMPLE APP. HOWEVER, FOR PRODUCTION, THESE
         * VALUES SHOULD BE KEPT ABSOLUTELY SECRET AND NOT EXPOSED IN CLIENT SIDE JAVASCRIPT.
         * 
         * Probably something that is obvious but doesn't hurt to mention it!
         *
         * AGAIN, DO NOT PUT THESE VALUES IN CLIENT-SIDE JAVASCRIPT FOR PRODUCTION USE.
         */

        this.state = {
            authorizationObject: undefined,
            generalAccessToken: "",
            retrievingAuthorization: false,
            failedRetrievingAuthorization: false,
            fundUseShowing: false,
            loanReason: 0,
            reasonText: "Select one",
            importExpanded: false,
            financialRecordId: undefined,
            showSuccessImport: false,
            attemptedSbParameterSubmit: false,
            showPasswordField: false,
            orgName: '',
            orgId: uuidv4(),
            clientId: '',
            clientSecret: '',
            strongboxAuthUrl: this.defaultStrongboxAuthUrl,
            borrowerFirstName: "John",
            borrowerLastName: "Smith",
            borrowerEmailAddress: "johnsmith@mailinator.com",
            borrowerLoanAmount: 1000000,
        };

        this.toggleFundUse = this.toggleFundUse.bind(this);
        this.monitorStatus = this.monitorStatus.bind(this);
        this.submitSBParameters = this.submitSBParameters.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
    }

    retrieveAccessTokens() {
        /*
         * To initialize the React Component <StrongboxFinConnect /> you will first need to obtain an access token that is safe to use from client-side code.
         * Obtaining that access token is a two step process that should be done server-side.  
         * 1) Send a POST request to /v1/token using your ClientId and ClientSecret to obtain an access token. This access token represents your full access to the Strongbox APIs.
         * 2) Send a POST request to /v1/DelegatedAccessTokens in order to exchange the access token that you aquired in step 1) for an access token that has very limited API access, designed specifically for powering this front-end component.
         * 
         * The second request includes an 'ActorId' parameter, which should be the identifier that you've assigned to the Organization for which an Accounting System is being connected.
         * 
         * Both requests are to be sent to 'https://auth.strongbox.link'
         * 
         * The following example code demonstrates the two requests that should be made, server-to-server, to aquire the access token that will be used to initialize the React Components.
         */

        const tokenHeaders = new Headers();

        tokenHeaders.append("Authorization", "Basic " + btoa(this.state.clientId + ":" + this.state.clientSecret));
        tokenHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        tokenHeaders.append("Cache-Control", "no-cache");

        const tokenRequestBody = "grant_type=client_credentials";

        const tokenFetchRequest = {
            method: "POST",
            headers: tokenHeaders,
            body: tokenRequestBody
        }

        try {
            console.log('Executing fetch call to receive access token for use with Strongbox');

            this.setState({
                retrievingAuthorization: true,
            });

            fetch(`${this.state.strongboxAuthUrl.trim()}/v1/token`, tokenFetchRequest)
                .then(r => {
                    if (r.ok) {
                        return r.json()
                    }
                    console.log("An error occurred requesting an access token for Strongbox.");
                    console.log(r.statusText);

                    this.setState({
                        retrievingAuthorization: false,
                        failedRetrievingAuthorization: true,
                    });
                })
                .then(authResponse => {
                    console.log("Response received for requesting a Strongbox access token");
                    console.log(authResponse); // please do NOT log your access tokens. this is just example code. thanks!

                    if (!authResponse) {
                        this.setState({ retrievingAuthorization: false, failedRetrievingAuthorization: true });
                    } else {
                        this.setState({
                            generalAccessToken: authResponse.access_token
                        });

                        /*
                         * At this point authResponse has an access token that can be used to 
                         * retrieve the delegated access token, which is suitable for use within the Strongbox React
                         * component.
                         */

                        const delegatedAuthHeaders = new Headers();
                        delegatedAuthHeaders.append("Authorization", "Bearer " + authResponse.access_token);
                        delegatedAuthHeaders.append("Content-Type", "application/json");
                        delegatedAuthHeaders.append("Cache-Control", "no-cache");
                        delegatedAuthHeaders.append("accept", "application/json");

                        const delegatedAuthRequestBody = {
                            "actorId": this.state.orgId,
                            "purpose": ["ConnectAccountingSystem"],
                        };

                        const delegatedAuthFetchRequest = {
                            method: "POST",
                            headers: delegatedAuthHeaders,
                            body: JSON.stringify(delegatedAuthRequestBody)
                        }
                        try {
                            console.log("Executing fetch call to generate a delegated access token");

                            fetch(`${this.state.strongboxAuthUrl.trim()}/v1/DelegatedAccessTokens`, delegatedAuthFetchRequest)
                                .then(r => {
                                    if (r.ok) {
                                        return r.json();
                                    }
                                    console.log("An error occurred generating a delegated access token");
                                    console.log(r.statusText);

                                    this.setState({
                                        retrievingAuthorization: false,
                                        failedRetrievingAuthorization: true,
                                    });
                                })
                                .then(delegatedTokenResponse => {
                                    console.log("response for delegated access token request received");
                                    console.log(delegatedTokenResponse);// please do NOT log your access tokens. this is just example code. thanks!

                                    /*
                                     * Sets the state variable passed to the Strongbox component that
                                     * allows it to connect with an acccounting package.  In this sample
                                     * application, this will also result in the component being visible.
                                     */

                                    this.setState({
                                        authorizationObject: delegatedTokenResponse,
                                        retrievingAuthorization: false,
                                    });
                                })
                                .catch(exception => {
                                    console.log("Network error generating a delegated access token");
                                    console.log(exception);

                                    this.setState({
                                        retrievingAuthorization: false,
                                        failedRetrievingAuthorization: true,
                                    });
                                });
                        } catch (delegatedAccessException) {
                            console.log('Exception requesting a delegated access token');
                            console.log(delegatedAccessException);
                            this.setState({
                                retrievingAuthorization: false,
                                failedRetrievingAuthorization: true,
                            })
                        }
                    }
                })
                .catch(exception => {
                    console.log("Network error requesting an access token from Strongbox");
                    console.log(exception);
                    this.setState({
                        retrievingAuthorization: false,
                        failedRetrievingAuthorization: true,
                    });
                });
        } catch (authException) {
            console.log("Exception requesting an access token from Strongbox");
            console.log(authException);
            this.setState({
                retrievingAuthorization: false,
                failedRetrievingAuthorization: true,
            })
        }
    }

    toggleFundUse() {
        this.setState({
            fundUseShowing: !this.state.fundUseShowing,
        });
    }

    monitorStatus(financialRecordId) {
        console.log('checking status');

        const tempHeaders = new Headers();

        tempHeaders.append("Authorization", "Bearer " + this.state.generalAccessToken);
        tempHeaders.append("Content-Type", "application/json");
        tempHeaders.append("Cache-Control", "no-cache");
        tempHeaders.append("accept", "application/json");

        const listRequest = {
            method: "GET",
            headers: tempHeaders
        }

        const strongboxApiUrl = this.state.strongboxAuthUrl.trim() === this.defaultStrongboxAuthUrl ?
            "https://api.strongbox.link" : this.state.strongboxAuthUrl.trim();
                                          
        const statusUrl = `${strongboxApiUrl}/Organizations/${this.state.orgId}/FinancialRecords/${financialRecordId}/ImportStatus`;

        fetch(statusUrl, listRequest)
            .then(response => {
                return response.json();
            })
            .then(resultStatus => {
                console.log(`retrieved financial record status ${resultStatus.outcome}`);
                if (resultStatus.outcome === "Success") {
                    this.setState({
                        importExpanded: false,
                        financialRecordId: undefined,
                        showSuccessImport: true,
                    });
                } else {
                    setTimeout(this.monitorStatus, 5000, financialRecordId);
                }
            })
            .catch(() => {
                console.log(`error retrieving status. Retrying in 5 seconds`);
                setTimeout(this.monitorStatus, 5000, financialRecordId);
            })
    }

    handleChange = (event) => {
        const { target } = event;
        let { name } = target;

        // We give the fields common names so password managers can recognize them.  In terms of
        // our state, however, it's more clear to use names that represent more closely what they
        // actual are which are a clientId and clientSecret which effectively are username and
        // password.
        
        if (name === this.clientIdInputName) {
            name = "clientId";
        } else if (name === this.clientSecretInputName) {
            name = "clientSecret";
        }

        this.setState({
            [name]: target.value,
        });
    }

    submitSBParameters = (e) => {
        e.preventDefault();
        if (!(
            this.state.orgId &&
            this.state.orgName &&
            this.state.clientId &&
            this.state.clientSecret
        )) {
            return;
        }

        // Calling retrieveAccessTokens will set a state variable that indicates we are doing so.
        // The UI responds accordingly.

        this.retrieveAccessTokens();
    }

    /*
     * Right on, you've got everything you need to use the React Component (<StrongboxFinConnect />). Example below:
     * 
     * Notice the optional property 'onJobCreated.'  When the user has selected an accounting package, logged in
     * and we have begun extracting their financial information to generate an Excel spreadsheet, this function
     * is invoked, if provided.  It receives an id that you can use to poll the status of the job that has just been started.
     * For instance, if you want to download the spreadsheet from Strongbox storage as soon as it is available,  you 
     * can use this id with the Strongbox APIs to know when the job has finished and thus the spreadsheet is available.
     */

    render() {
        return (
            <>
                <div className="app-header">
                    <img src={logo} className="app-logo" alt="logo" />
                    <h2>Welcome to the XYZ Bank Borrower Portal</h2>
                </div>
                <Container className="app">
                    {this.state.retrievingAuthorization && (
                        <Row style={{ marginTop: '15px' }}>
                            <Col className="content-region">
                                <Row>
                                    <Col xs={3} sm={2} md={1}>
                                        <FadeLoader />
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <p style={{ transform: 'translateY(15px)' }}>Retrieving Strongbox credentials.</p>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    )}
                    {!(!!this.state.authorizationObject || this.state.retrievingAuthorization) && (
                        <Form name="sbParamsForm" onSubmit={(e) => this.submitSBParameters(e) } >
                            <Row style={{ marginTop: '15px' }}>
                                <Col className="content-region warning-region">
                                    <p>None of the information you enter below will be saved. IMPORTANT, make sure that you keep your
                                        strongbox credentials secret. The only web sites where you should be entering these credentials
                                        are the Strongbox Developer Portal, https://developer.strongbox.link and this demo site running at 
                                        widgetdemo.strongbox.link.   These credentials should never be visible in client-side code. 
                                        They should only be used in a server-server context where your keys can be kept secret.
                                    </p>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '15px' }}>
                                <Col className="content-region">
                                    <Row className="input-section-title">
                                        <Col>
                                            <h1>First we need some credentials so Strongbox can be used</h1>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className={"mt-2"} sm={12} md={6}>
                                            <FormGroup row>
                                                <Label for={this.clientIdInputName} xs="12">Client ID (You received this from the Strongbox Developer Portal):</Label>
                                                <Col>
                                                    <Input
                                                        onChange={this.handleChange}
                                                        type="text"
                                                        id={this.clientIdInputName}
                                                        name={this.clientIdInputName}
                                                        autoComplete="username"
                                                        invalid={this.state.failedRetrievingAuthorization || (this.state.attemptedSbParameterSubmit && !this.state.clientId)}
                                                        value={this.state.clientId}
                                                    />
                                                    <FormFeedback>
                                                        {this.state.failedRetrievingAuthorization ?
                                                            "Unable to retrieve credentials, Client ID and/or secret are probably not correct" :
                                                            "You must provide a Client ID"
                                                        }
                                                    </FormFeedback>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col className={"mt-2"} sm={12} md={6}>
                                            <FormGroup row>
                                                <Label for={this.clientSecretInputName} xs="12">Client secret:</Label>
                                                <Col>
                                                    <Row>
                                                        <Col>
                                                        <Input
                                                            onChange={this.handleChange}
                                                            type={this.state.showPasswordField ? "text" : "password"}
                                                            id={this.clientSecretInputName}
                                                            name={this.clientSecretInputName}
                                                            autoComplete="password"
                                                            invalid={this.state.failedRetrievingAuthorization || (this.state.attemptedSbParameterSubmit && !this.state.clientSecret)}
                                                            value={this.state.clientSecret}
                                                        />
                                                        </Col>
                                                        <Col xs="auto">
                                                            <span 
                                                                style={{
                                                                    marginRight: '10px',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        showPasswordField: !this.state.showPasswordField,
                                                                    });
                                                                }}
                                                            >
                                                                {this.state.showPasswordField ? "Hide" : "Show"}
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                    <FormFeedback>
                                                        {this.state.failedRetrievingAuthorization ?
                                                            "Unable to retrieve credentials, Client ID and/or secret are probably not correct" :
                                                            "You must provide a Client secret"
                                                        }
                                                    </FormFeedback>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className={"mt-2"} sm={12} md={6}>
                                            <FormGroup row>
                                                <Label for="orgId" xs="12">Organization ID (Can be anything, we created a GUID for you):</Label>
                                                <Col>
                                                    <Input
                                                        onChange={this.handleChange}
                                                        type="text"
                                                        id="orgId"
                                                        name="orgId"
                                                        invalid={this.state.attemptedSbParameterSubmit && !this.state.orgId}
                                                        value={this.state.orgId}
                                                    />
                                                    <FormFeedback>You must provide an Organization ID</FormFeedback>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col className={"mt-2"} sm={12} md={6}>
                                            <FormGroup row>
                                                <Label for="orgName" xs="12">Organization name (Name of a company associated with financials import):</Label>
                                                <Col>
                                                    <Input
                                                        onChange={this.handleChange}
                                                        type="text"
                                                        id="orgName"
                                                        name="orgName"
                                                        invalid={this.state.attemptedSbParameterSubmit && !this.state.orgName}
                                                        value={this.state.orgName}
                                                    />
                                                    <FormFeedback>You must provide an Organization name</FormFeedback>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className={"mt-2"} sm={12} md={6}>
                                            <FormGroup row>
                                                <Label for="strongboxAuthUrl" xs="12">Strongbox API authorization endpoint:</Label>
                                                <Col>
                                                    <Input
                                                        onChange={this.handleChange}
                                                        type="url"
                                                        id="strongboxAuthUrl"
                                                        name="strongboxAuthUrl"
                                                        value={this.state.strongboxAuthUrl}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: "15px" }}>
                                        <Col
                                            onClick={() => {
                                                this.setState({
                                                    attemptedSbParameterSubmit: true,
                                                    failedRetrievingAuthorization: false,
                                                });
                                            }}
                                        >
                                            <Button>Submit</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    )}
                    {!!this.state.authorizationObject && (
                        <Form>
                            <Row style={{ marginTop: '15px' }}>
                                <Col className="content-region">
                                    <Row className="input-section-title">
                                        <Col>
                                            <h1>Tell us a little about your business</h1>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className={"mt-2"} sm={12} md={6}>
                                            <FormGroup row>
                                                <Label for="borrowerFirstName" xs="12">First name:</Label>
                                                <Col>
                                                    <Input type="text" id="borrowerFirstName" name="borrowerFirstName" value={this.state.borrowerFirstName} onChange={this.handleChange} />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col className={"mt-2"} sm={12} md={6}>
                                            <FormGroup row>
                                                <Label for="borrowerLastName" xs="12">Last name:</Label>
                                                <Col>
                                                    <Input type="text" id="borrowerLastName" name="borrowerLastName" value={this.state.borrowerLastName} onChange={this.handleChange} />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className={"mt-2"} sm={12} md={6}>
                                            <FormGroup row>
                                                <Label for="businessName" xs="12">Business name:</Label>
                                                <Col>
                                                    <Input type="text" id="orgName" name="orgName" value={this.state.orgName} onChange={this.handleChange} />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col className={"mt-2"} sm={12} md={6}>
                                            <FormGroup row>
                                                <Label for="borrowerEmailAddress" xs="12">Email address:</Label>
                                                <Col>
                                                    <Input type="email" id="borrowerEmailAddress" name="borrowerEmailAddress" value={this.state.borrowerEmailAddress} onChange={this.handleChange} />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '15px' }}>
                                <Col className="content-region">
                                    <Row className="input-section-title">
                                        <Col>
                                            <h1>Tell us about your loan request</h1>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className={"mt-2"} sm={12} md={4}>
                                            <FormGroup row>
                                                <Label for="borrowerLoanAmount" xs="12">Loan amount:</Label>
                                                <Col>
                                                    <Input 
                                                       type="number" 
                                                       id="borrowerLoanAmount" 
                                                       name="borrowerLoanAmount" 
                                                       value={this.state.borrowerLoanAmount} 
                                                       onChange={this.handleChange} 
                                                       step={1000} 
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col className={"mt-2"} sm={12} md={8}>
                                            <FormGroup row>
                                                <Label sm={12} md={"12"} for="funduse" xs="auto">What is your primary use for these funds:</Label>
                                                <Col sm={12} md={4} lg={5} xl={7}>
                                                    <Dropdown id="funduse" name="funduse" isOpen={this.state.fundUseShowing} toggle={this.toggleFundUse}>
                                                        <DropdownToggle caret>
                                                            {this.state.reasonText}
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem
                                                                onClick={() => this.setState({ loanReason: loanReasonHiring, reasonText: "Additional hiring" })}
                                                            >
                                                                Additional hiring
                                                        </DropdownItem>
                                                            <DropdownItem
                                                                onClick={() => this.setState({ loanReason: loanReasonEquipment, reasonText: "Equipment" })}
                                                            >
                                                                Equipment
                                                        </DropdownItem>
                                                            <DropdownItem
                                                                onClick={() => this.setState({ loanReason: loanReasonFacilities, reasonText: "Facilities" })}
                                                            >
                                                                Facilities
                                                        </DropdownItem>
                                                            <DropdownItem
                                                                onClick={() => this.setState({ loanReason: loanReasonOther, reasonText: "Other" })}
                                                            >
                                                                Other
                                                        </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {this.state.showSuccessImport && (
                                <Row style={{ marginTop: '15px' }}>
                                    <Col className="content-region">
                                        <Row className="input-section-title">
                                            <Col>
                                                <h1>Financial history</h1>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        <p>All done!  Your financial information has been submitted successfully.</p>
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '1em' }}>
                                                    <Col>
                                                        <Button onClick={() => { this.setState({ showSuccessImport: false }) }}>
                                                            Continue
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            )}
                            {!!this.state.financialRecordId && !this.state.showSuccessImport && (
                                <Row style={{ marginTop: '15px' }}>
                                    <Col className="content-region">
                                        <Row className="input-section-title">
                                            <Col>
                                                <h1>Financial history</h1>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ height: '25px' }} xs={3} sm={2} md={1}>
                                                <FadeLoader />
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        <p>Your financial information is being imported. You can wait for the import to complete or continue.</p>
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '1em' }}>
                                                    <Col>
                                                        <Button onClick={() => { this.setState({ importExpanded: false, financialRecordId: undefined }) }}>
                                                            I'm all done, continue
                                                    </Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            )}
                            {!this.state.financialRecordId && !this.state.showSuccessImport && (
                                <Row style={{ marginTop: '15px' }}>
                                    <Col className="content-region">
                                        <Row className="input-section-title">
                                            <Col>
                                                <h1>Financial history</h1>
                                            </Col>
                                        </Row>
                                        {!this.state.importExpanded && (
                                            <Row>
                                                <Col xs={12}>
                                                    <span>To review your loan application, we require the following:</span>
                                                    <ul style={{ marginTop: '1em' }}>
                                                        <li>Last year's balance sheet and profit & loss statement</li>
                                                        <li>Last month's balance sheet</li>
                                                        <li>This year's (YTD) profit & loss statement</li>
                                                        <li>Last 3 months bank statements</li>
                                                    </ul>
                                                </Col>
                                            </Row>
                                        )}
                                        <Row className={"bottom-grid-region top-grid-region"}>
                                            <Col sm={12} md={this.state.importExpanded ? 12 : 6}>
                                                {!this.state.importExpanded && (
                                                    <Row style={{ marginTop: "1em" }} className={"centered-content-region"}>
                                                        <Col>
                                                            <h2>Automatically import your financial history with a click!</h2>
                                                        </Col>
                                                    </Row>
                                                )}
                                                <Row>
                                                    <Col xs={12} className={"centered-content-region"}>
                                                        <StrongboxFinConnect
                                                            className={'finconnect-button'}
                                                            financialImportOptions={{
                                                                mostRecentMonth: {
                                                                    month: 0,
                                                                    year: new Date().getFullYear(),
                                                                },
                                                                anonymizeCustomersAndVendors: true,
                                                                transactionsPeriod: {
                                                                    reportingPeriod: "FiscalYears",
                                                                    numberOfPeriods: 2,
                                                                },
                                                                payablesPeriod: {
                                                                    reportingPeriod: "FiscalYears",
                                                                    numberOfPeriods: 2,
                                                                },
                                                                receivablesPeriod: {
                                                                    reportingPeriod: "FiscalYears",
                                                                    numberOfPeriods: 2,
                                                                },
                                                                financialStatementsPeriod: {
                                                                    reportingPeriod: "FiscalYears",
                                                                    numberOfPeriods: 2,
                                                                },
                                                            }}
                                                            orgId={this.state.orgId}
                                                            orgName={this.state.orgName}
                                                            partnerName={partnerName}
                                                            accessToken={this.state.authorizationObject}
                                                            onJobCreated={(financialRecordId) => {
                                                                console.log(`An import job has been created, id = ${financialRecordId}`);
                                                                this.setState({
                                                                    financialRecordId,
                                                                });

                                                                this.monitorStatus(financialRecordId);
                                                            }}
                                                            onButtonExpanded={(expanded) => {
                                                                this.setState({
                                                                    importExpanded: expanded,
                                                                });
                                                            }}
                                                            accountingPackages={
                                                                [
                                                                    {
                                                                        package: "QuickBooksOnline",
                                                                        descriptor: "Online"
                                                                    },
                                                                    {
                                                                        package: "QuickBooksDesktop",
                                                                        descriptor: "Desktop"
                                                                    },
                                                                    {
                                                                        package: "SageIntacct"
                                                                    },
                                                                    {
                                                                        package: "Xero"
                                                                    },
                                                                    {
                                                                        package: "Example"
                                                                    },
                                                                ]
                                                            }
                                                            strongboxUrlOverride={this.state.strongboxAuthUrl.trim() === this.defaultStrongboxAuthUrl ? undefined : this.state.strongboxAuthUrl.trim()}
                                                        >
                                                            {(props) => {
                                                                return undefined;
                                                            }}
                                                        </StrongboxFinConnect>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            {!this.state.importExpanded && (
                                                <Col className={"left-grid-region drop-zone centered-content-region"} xs={6}>
                                                    <Row>
                                                        <Col xs={12}>
                                                            <h2 style={{ marginTop: "1em" }} >Manually collect the documentation listed above and drop it here</h2>
                                                        </Col>
                                                        <Col xs={12} className={"centered-content-region"}>
                                                            <Button>
                                                                Browse local computer
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            )}
                                        </Row>
                                    </Col>
                                </Row>
                            )}
                        </Form>
                    )}
                </Container>
            </>
        );
    }
}

export default App;
