import './StrongboxLinkModal.scss';

import * as React from 'react';

import { AccountingPackage } from '../../../Models/AccountingPackages';
import { IDelegatedAccessToken } from '../../../Models/Api/ClientBase';

import { StrongboxConnectionRequest } from '../../../Utils/ConnectStrongbox';
import { SimpleModal } from '../../StrongboxModal';
import StrongboxLinker, { StrongboxLinkerChildProps } from '../../StrongboxLinker/StrongboxLinker';

import { AccountingPackageConnectPrompt } from '../../../Utils/LinkUtils';

import { OverlayType } from '../../LoadingIndicator/LoadingIndicator';
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';

import { BuildThemeStyle, Theme } from '../../../Models/Theme/Theme';
import { defaultControlFontStyleMap, defaultModalRegularFontStyleMap, defaultModalSecurityFontStyleMap } from '../../../Models/Theme/ThemeFont';
import { defaultControlPaletteStyleMap } from '../../../Models/Theme/ThemePalette';
import { defaultControlStyleMap } from '../../../Models/Theme/ThemeControls';
import { ConnectionRequestDescriptor } from '../../../Models/Api/strongbox.models';

import { TextContent } from '../../../Text/TextContent';
import { translations } from '../../../Text/en/en';

type Props = {
    accountingPackage: AccountingPackage;
    entityId: string;
    strongboxCxnRequestDescriptor?: ConnectionRequestDescriptor,
    cxnRequest?: StrongboxConnectionRequest,
    onConnected?: (cxnRequest: StrongboxConnectionRequest, apiRequestParameters?: ConnectionRequestDescriptor) => void,
    onRequestClose?: ((success: boolean) => void);
    open: boolean;
    strongboxUrl: string;
    submissionId?: string;
    delegatedAccessToken: IDelegatedAccessToken;
    theme?: Theme;
    updateProgress: (progress: number) => void;
    executeConnect: (accountingPackage: AccountingPackage, connectionRequestId: string, connectionWindowHandle: Window | undefined) => void;
    executeDisconnect?: (disconnected: () => void) => void;
    isAuthorized?: boolean;
    checkAuthorizationStatus?: boolean;
    disabled?: boolean;
    errorMsg?: string;
    isWorking?: boolean;
    textContent?: TextContent;
};

type State = {
    descriptionTextQBO: string;
    descriptionTextQBD: string;
    descriptionTextXero: string;
    descriptionTextSageIntacct: string;
    descriptionTextExample: string;
    descriptionTextFreeAgent: string;
    descriptionTextNetSuite: string;
    descriptionTextDynamics365: string;
    descriptionTextMYOBBusiness: string;
    descriptionTextFileUpload: string;
    qbOneWay: string;
    sageIntacctOneWay: string;
    xeroOneWay: string;
    exampleOneWay: string;
    freeAgentOneWay: string;
    netSuiteOneWay: string;
    dynamics365OneWay: string;
    myobBusinessOneWay: string;
    fileUploadOneWay: string;
    working: string;
    updateFinancialsNow: string;
    disconnect: string;
    setAutoFocus: boolean;
};

const idConnectToAccountingSystemButton = 'connectToAccountingSystemButton';

class StrongboxLinkModal extends React.PureComponent<Props, State> {
    public static defaultProps = {
        open: false,
        isAuthorized: false,
        checkAuthorizationStatus: false,
        textContent: new TextContent('en'),
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            descriptionTextQBO: translations.LinkModalDescriptionQBO,
            descriptionTextQBD: translations.LinkModalDescriptionQBD,
            descriptionTextXero: translations.LinkModalDescriptionXero,
            descriptionTextSageIntacct: translations.LinkModalDescriptionSageIntacct,
            descriptionTextExample: translations.LinkModalDescriptionExample,
            descriptionTextFreeAgent: translations.LinkModalDescriptionFreeAgent,
            descriptionTextNetSuite: translations.LinkModalDescriptionNetSuite,
            descriptionTextDynamics365: translations.LinkModalDescriptionDynamics365,
            descriptionTextMYOBBusiness: translations.LinkModalDescriptionMYOBBusiness,
            descriptionTextFileUpload: translations.LinkModalDescriptionFileUpload,
            qbOneWay: translations.LinkModalQBOneWay,
            sageIntacctOneWay: translations.LinkModalSageIntacctOneWay,
            xeroOneWay: translations.LinkModalXeroOneWay,
            exampleOneWay: translations.LinkModalExampleOneWay,
            freeAgentOneWay: translations.LinkModalFreeAgentOneWay,
            netSuiteOneWay: translations.LinkModalNetSuiteOneWay,
            dynamics365OneWay: translations.LinkModalDynamics365OneWay,
            myobBusinessOneWay: translations.LinkModalMYOBBusinessOneWay,
            fileUploadOneWay: translations.LinkModalFileUploadOneWay,
            working: translations.LinkModalWorking,
            updateFinancialsNow: translations.LinkModalUpdateFinancialsNow,
            disconnect: translations.DisconnectFromAccountingPkg,
            setAutoFocus: false,
        }

        this.RenderAccountingPackage = this.RenderAccountingPackage.bind(this);
        this.RenderConnectToQuickBooks = this.RenderConnectToQuickBooks.bind(this);
        this.RenderConnectToXero = this.RenderConnectToXero.bind(this);
        this.RenderConnectToSageIntacct = this.RenderConnectToSageIntacct.bind(this);
        this.RenderConnectToQuickBooksDesktop = this.RenderConnectToQuickBooksDesktop.bind(this);
        this.RenderConnectToExample = this.RenderConnectToExample.bind(this);
        this.RenderConnectWithFileUpload = this.RenderConnectWithFileUpload.bind(this);
    }

    private _regularTextStyle: any = {};
    private _securityTextStyle: any = {};

    public componentDidMount() {
        this._regularTextStyle = BuildThemeStyle(
            {},
            {
                container: 'palette',
                map: [{ containerName: 'modalText', styleName: 'color' }]
            },
            this.props.theme
        );
        this._regularTextStyle = BuildThemeStyle(this._regularTextStyle, defaultModalRegularFontStyleMap, this.props.theme);

        this._securityTextStyle = BuildThemeStyle(
            {},
            {
                container: 'palette',
                map: [{ containerName: 'modalText', styleName: 'color' }]
            },
            this.props.theme
        );
        this._securityTextStyle = BuildThemeStyle(this._securityTextStyle, defaultModalSecurityFontStyleMap, this.props.theme);

        if (this.props.textContent) {
            this.setState({
                descriptionTextQBO: this.props.textContent.TextValue('LinkModalDescriptionQBO'),
                descriptionTextQBD: this.props.textContent.TextValue('LinkModalDescriptionQBD'),
                descriptionTextXero: this.props.textContent.TextValue('LinkModalDescriptionXero'),
                descriptionTextSageIntacct: this.props.textContent.TextValue('LinkModalDescriptionSageIntacct'),
                qbOneWay: this.props.textContent.TextValue('LinkModalQBOneWay'),
                xeroOneWay: this.props.textContent.TextValue('LinkModalXeroOneWay'),
                sageIntacctOneWay: this.props.textContent.TextValue('LinkModalSageIntacctOneWay'),
                descriptionTextExample: this.props.textContent.TextValue('LinkModalDescriptionExample'),
                exampleOneWay: this.props.textContent.TextValue('LinkModalExampleOneWay'),
                working: this.props.textContent.TextValue('LinkModalWorking'),
                updateFinancialsNow: this.props.textContent.TextValue('LinkModalUpdateFinancialsNow'),
                disconnect: this.props.textContent.TextValue('DisconnectFromAccountingPkg'),
                setAutoFocus: true,
            });
        }
    }

    public componentDidUpdate(prevProps) {
        if (this.state.setAutoFocus) {
            const connectButton = document.getElementById(idConnectToAccountingSystemButton);
            if (connectButton !== null) {
                connectButton.focus();
                this.setState({
                    setAutoFocus: false,
                });
            }
        }
    }

    public render() {
        const {
            entityId,
            onRequestClose,
            open,
        } = this.props;

        return open && (
            <StrongboxLinker
                strongboxCxnRequestDescriptor={this.props.strongboxCxnRequestDescriptor}
                cxnRequest={this.props.cxnRequest}
                autoStartOnAuthorized={true}
                datasourceId={this.props.accountingPackage}
                theme={this.props.theme}
                executeConnect={this.props.executeConnect}
                executeDisconnect={() => {
                    this.props.executeDisconnect && this.props.executeDisconnect(() => {
                        this.setState({
                            setAutoFocus: true,
                        })
                    })
                }}
                isAuthorized={this.props.isAuthorized}
                errorMsg={this.props.errorMsg}
                isWorking={this.props.isWorking}
                disabled={this.props.disabled}
                checkAuthorizationStatus={this.props.checkAuthorizationStatus}
            >
                {(props): JSX.Element => {
                    let buttonStyle = BuildThemeStyle({}, defaultControlPaletteStyleMap, props.theme);
                    buttonStyle = BuildThemeStyle(buttonStyle, defaultControlFontStyleMap, props.theme);
                    buttonStyle = BuildThemeStyle(buttonStyle, defaultControlStyleMap, props.theme);

                    const actions = props.authorized ?
                        [
                            <button
                                style={buttonStyle}
                                key={'disconnect-action'}
                                onClick={() => {
                                    props.disconnect();
                                }}
                                disabled={!this.props.errorMsg && this.props.disabled}
                                tabIndex={1}
                            >
                                {this.state.disconnect}
                            </button>,
                        ] :
                        undefined;

                    const GetAuthorizedContent = (): React.ReactNode => {
                        // Really, the only way we would get here is if connectionInfo and existingConnectionId
                        // both exist so the || '' clause below is (or should be) impossible but the compiler
                        // doesn't like it.
                        return (
                            <div>
                                <button
                                    style={buttonStyle}
                                    onClick={() => {
                                        props.connectionInitiated((this.props.cxnRequest && this.props.cxnRequest.existingConnectionId) || (''));
                                    }}
                                    disabled={this.props.disabled}
                                    tabIndex={1}
                                    id={idConnectToAccountingSystemButton}
                                    autoFocus={true}
                                >
                                    {this.state.updateFinancialsNow}
                                </button>
                            </div>
                        );
                    }

                    const RenderErrorState = (): React.ReactNode => {
                        return (
                            <div style={{
                                marginBottom: '20px',
                            }}>
                                <p>Sorry, there has been a problem.</p>
                                {!!props.errorMsg && (<p>Additional information: {props.errorMsg}</p>)}
                            </div>
                        );
                    }

                    const RenderWorkingState = (): React.ReactNode => {
                        return (
                            <div style={{
                                marginTop: '20px',
                                marginBottom: '20px',
                            }}>
                                <h1>{this.state.working}</h1>
                            </div>
                        );
                    }

                    return (
                        <SimpleModal
                            actions={actions}
                            className={`finagraph-strongbox-linker__link-modal ${props.isWorking ? 'loading' : ''}`}
                            contentClassName={''}
                            closeOnOverlayClick={false}
                            onCancelLabel={'Cancel'}
                            onClose={(): void => {
                                onRequestClose && onRequestClose(false);
                            }}
                            theme={props.theme}
                            title={AccountingPackageConnectPrompt(this.props.accountingPackage, this.props.textContent)}
                            disableActions={this.props.disabled}
                        >
                            <div className={'finagraph-strongbox-link-modal__content-container'}>
                                {!props.errorMsg && props.disabled && <LoadingIndicator active={true} overlayType={OverlayType.Dark} />}
                                {!!props.errorMsg && RenderErrorState()}
                                {!props.errorMsg && !!props.isWorking && RenderWorkingState()}
                                {!(props.errorMsg || props.isWorking) && props.authorized && GetAuthorizedContent()}
                                {!(props.errorMsg || props.isWorking) && !props.authorized && this.RenderAccountingPackage(props)}
                            </div>
                        </SimpleModal>
                    );
                }}
            </StrongboxLinker>
        );
    }

    private RenderConnectToQuickBooks = (props: StrongboxLinkerChildProps): React.ReactNode => {
        /*
                <div className={'finagraph-strongbox-linker__connect-graphic'}>
                    <SVG src={'https://booyamiflight.blob.core.windows.net/static/ConnectToQuickBooks.svg'} />
                </div>
         */

        return (
            <>
                <span style={this._regularTextStyle} className={'finagraph-strongbox-linker__description secondary'}>{this.state.descriptionTextQBO}</span>
                <span style={this._securityTextStyle} className={'finagraph-strongbox-linker__connect-graphic-description secondary'}>
                    {this.state.qbOneWay}
                </span>
                {props.renderAuthButton(idConnectToAccountingSystemButton)}
            </>
        );
    }

    private RenderConnectToQuickBooksDesktop = (props: StrongboxLinkerChildProps): React.ReactNode => {
        return (
            <>
                <span style={this._regularTextStyle} className={'finagraph-strongbox-linker__description secondary'}>{this.state.descriptionTextQBD}</span>
                <span style={this._securityTextStyle} className={'finagraph-strongbox-linker__connect-graphic-description secondary'}>
                    {this.state.qbOneWay}
                </span>
                {props.renderAuthButton(idConnectToAccountingSystemButton)}
            </>
        );
    }

    private RenderConnectWithFileUpload = (props: StrongboxLinkerChildProps): React.ReactNode => {
        return (
            <>
                <span style={this._regularTextStyle} className={'finagraph-strongbox-linker__description secondary'}>{this.state.descriptionTextFileUpload}</span>
                <span style={this._securityTextStyle} className={'finagraph-strongbox-linker__connect-graphic-description secondary'}>
                    {this.state.fileUploadOneWay}
                </span>
                {props.renderAuthButton(idConnectToAccountingSystemButton)}
            </>
        );
    }

    private RenderConnectToSageIntacct = (props: StrongboxLinkerChildProps): React.ReactNode => {
        return (
            <>
                <span style={this._regularTextStyle} className={'finagraph-strongbox-linker__description secondary'}>{this.state.descriptionTextSageIntacct}</span>
                <span style={this._securityTextStyle} className={'finagraph-strongbox-linker__connect-graphic-description secondary'}>
                    {this.state.sageIntacctOneWay}
                </span>
                {props.renderAuthButton(idConnectToAccountingSystemButton)}
            </>
        );
    }

    private RenderConnectToXero = (props: StrongboxLinkerChildProps): React.ReactNode => {
        return (
            <>
                <span style={this._regularTextStyle} className={'finagraph-strongbox-linker__description secondary'}>{this.state.descriptionTextXero}</span>
                <span style={this._securityTextStyle} className={'finagraph-strongbox-linker__connect-graphic-description secondary'}>
                    {this.state.xeroOneWay}
                </span>
                {props.renderAuthButton(idConnectToAccountingSystemButton)}
            </>
        );
    }

    private RenderConnectToExample = (props: StrongboxLinkerChildProps): React.ReactNode => {
        return (
            <>
                <span style={this._regularTextStyle} className={'finagraph-strongbox-linker__description secondary'}>{this.state.descriptionTextExample}</span>
                <span style={this._securityTextStyle} className={'finagraph-strongbox-linker__connect-graphic-description secondary'}>
                    {this.state.exampleOneWay}
                </span>
                {props.renderAuthButton(idConnectToAccountingSystemButton)}
            </>
        );
    }
    
    private RenderConnectToFreeAgent = (props: StrongboxLinkerChildProps): React.ReactNode => {
        return (
            <>
                <span style={this._regularTextStyle} className={'finagraph-strongbox-linker__description secondary'}>{this.state.descriptionTextFreeAgent}</span>
                <span style={this._securityTextStyle} className={'finagraph-strongbox-linker__connect-graphic-description secondary'}>
                    {this.state.freeAgentOneWay}
                </span>
                {props.renderAuthButton(idConnectToAccountingSystemButton)}
            </>
        );
    }

    private RenderConnectToNetSuite = (props: StrongboxLinkerChildProps): React.ReactNode => {
        return (
            <>
                <span style={this._regularTextStyle} className={'finagraph-strongbox-linker__description secondary'}>{this.state.descriptionTextNetSuite}</span>
                <span style={this._securityTextStyle} className={'finagraph-strongbox-linker__connect-graphic-description secondary'}>
                    {this.state.netSuiteOneWay}
                </span>
                {props.renderAuthButton(idConnectToAccountingSystemButton)}
            </>
        );
    }

    private RenderConnectToDynamics365 = (props: StrongboxLinkerChildProps): React.ReactNode => {
        return (
            <>
                <span style={this._regularTextStyle} className={'finagraph-strongbox-linker__description secondary'}>{this.state.descriptionTextDynamics365}</span>
                <span style={this._securityTextStyle} className={'finagraph-strongbox-linker__connect-graphic-description secondary'}>
                    {this.state.dynamics365OneWay}
                </span>
                {props.renderAuthButton(idConnectToAccountingSystemButton)}
            </>
        );
    }

    private RenderConnectToMYOBBusiness = (props: StrongboxLinkerChildProps): React.ReactNode => {
        return (
            <>
                <span style={this._regularTextStyle} className={'finagraph-strongbox-linker__description secondary'}>{this.state.descriptionTextMYOBBusiness}</span>
                <span style={this._securityTextStyle} className={'finagraph-strongbox-linker__connect-graphic-description secondary'}>
                    {this.state.myobBusinessOneWay}
                </span>
                {props.renderAuthButton(idConnectToAccountingSystemButton)}
            </>
        );
    }

    private RenderAccountingPackage = (props: StrongboxLinkerChildProps): React.ReactNode => {
        if (this.props.accountingPackage === AccountingPackage.Xero) {
            return this.RenderConnectToXero(props);
        } else if (this.props.accountingPackage === AccountingPackage.QuickBooksDesktop) {
            return this.RenderConnectToQuickBooksDesktop(props);
        } else if (this.props.accountingPackage === AccountingPackage.QuickBooksOnline) {
            return this.RenderConnectToQuickBooks(props);
        } else if (this.props.accountingPackage === AccountingPackage.SageIntacct) {
            return this.RenderConnectToSageIntacct(props);
        } else if (this.props.accountingPackage === AccountingPackage.Example) {
            return this.RenderConnectToExample(props);
        } else if (this.props.accountingPackage === AccountingPackage.FreeAgent) {
            return this.RenderConnectToFreeAgent(props);
        } else if (this.props.accountingPackage === AccountingPackage.NetSuite) {
            return this.RenderConnectToNetSuite(props);
        } else if (this.props.accountingPackage === AccountingPackage.Dynamics365) {
            return this.RenderConnectToDynamics365(props);
        } else if (this.props.accountingPackage === AccountingPackage.MYOBBusiness) {
            return this.RenderConnectToMYOBBusiness(props);
        } else if (this.props.accountingPackage === AccountingPackage.FileUpload) {
            return this.RenderConnectWithFileUpload(props);
        } else {
            return (<span style={this._regularTextStyle} className={'finagraph-strongbox-linker__description secondary'}>Unknown Accounting Package</span>);
        }
    }
}

export default StrongboxLinkModal;


