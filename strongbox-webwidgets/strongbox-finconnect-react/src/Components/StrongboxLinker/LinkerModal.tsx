import * as React from 'react';

import StrongboxLinkModalContainer from './StrongboxLinkModal/StrongboxLinkModalContainer';
import { AccountingPackage } from '../../Models/AccountingPackages';
import { IOpenableModal } from '../../Models/IOpenableModal';

import { Theme } from '../../Models/Theme/Theme';

import {
    DisconnectConnection,
    ConnectAccountingSystem,
    FindConnection,
    GetFinancialsConnectionDescriptor,
    StrongboxConnectionDescriptor,
    StrongboxConnectionRequest
} from '../../Utils/ConnectStrongbox';

import { ConnectionRequestDescriptor } from '../../Models/Api/strongbox.models';

import { TextContent } from '../../Text/TextContent';

export enum LinkerModalErrorState {
    FailureFindingExistingConnection = 'FailureFindingExistingConnection',
    FailureCreatingConnectionDescriptor = 'FailureCreatingConnectionDescriptor'
}


/*
 * onCompleted is called if the user clicks the 'x' button to close the window and is dismissing the dialog.
 *      IMPORTANT: onCompleted is not called when a job is created.  That's not an explicit close event.
 * onJobCreated is called when a job is succesfully created.  You may or may not close the dialog down
 *      at that point.
 * checkAuthorizationStatus controls whether there's a check to see if there's an existing authorized
 *      connection.  If there is and this setting is true, the dialog will show an interface to update
 *      financials bypassing any existing authorization and a button to disconnect. If it's true and there's
 *      no extent connection, a UI is shown to them for connecting with their accounting package.
 */

export interface ISBLinkerModalProps {
    cxnRequest: StrongboxConnectionRequest,
    checkAuthorizationStatus?: boolean;
    onError?: (errorState: LinkerModalErrorState) => void,
    onAuthAborted?: () => void,
    onCompleted?: (success: boolean) => void,
    onConnected?: (cxnRequest: StrongboxConnectionRequest, apiRequestParameters?: ConnectionRequestDescriptor) => void,
    onDisconnection?: (success: boolean) => void,
    className?: string;
    disabled?: boolean;
    icon?: string;
    label?: string;
    primary?: boolean;
    rootStyle?: React.CSSProperties;
    showProgress?: boolean;
    secondary?: boolean;
    style?: React.CSSProperties;
    textContent?: TextContent;
    theme?: Theme;
    tooltip?: React.ReactNode;
};

type State = {
    connectionRequestInfo: ConnectionRequestDescriptor | undefined;
    cxnRequestWithId: StrongboxConnectionRequest;    // initialized with the value of props.  Will contain the existing connection id
    errorText: string | undefined;
    gettingConnectionDescriptor: boolean;
    connectingAccountingSystem: boolean;
    isDisconnecting: boolean;
    queryingConnect: boolean;
};

export class LinkerModal extends React.PureComponent<ISBLinkerModalProps, State> {
    public static defaultProps: any = {
        buttonProps: {},
        icon: 'refresh',
        label: 'Link',
        showProgress: true,
        checkAuthorizationStatus: false,
    };

    constructor(props: ISBLinkerModalProps) {
        super(props);

        this.state = {
            connectionRequestInfo: undefined,
            cxnRequestWithId: props.cxnRequest,
            errorText: undefined,
            gettingConnectionDescriptor: false,
            connectingAccountingSystem: false,
            isDisconnecting: false,
            queryingConnect: false,
        };

        this.ExecuteConnect = this.ExecuteConnect.bind(this);
        this.ExecuteDisconnect = this.ExecuteDisconnect.bind(this);
        this.InitState = this.InitState.bind(this);
        this.GetConnection = this.GetConnection.bind(this);
        this.IsDisabledState = this.IsDisabledState.bind(this);
        this.OnImportError = this.OnImportError.bind(this);
        this.OnModalAborted = this.OnModalAborted.bind(this);
        this.onAccountingSystemConnected = this.onAccountingSystemConnected.bind(this);
    }

    private IsDisabledState(): boolean {
        return (
            this.state.gettingConnectionDescriptor ||
            this.state.connectingAccountingSystem ||
            this.state.isDisconnecting ||
            this.state.queryingConnect
        );
    }

    private _modal: IOpenableModal;

    public componentDidMount() {
        this.InitState();
    }

    public render() {
        return (
            <div className={this.props.className} style={this.props.rootStyle}>
                {this.RenderModal()}
            </div>
        );
    }

    public OnClick = (): void => {
        this._modal.OpenModal();
    }

    private GetConnection(): void {
        // We have not retrieved an existing connection id or aren't using the existing one.  That means we need to grab
        // a new connection descriptor for this accounting package 
        GetFinancialsConnectionDescriptor(
            this.state.cxnRequestWithId,
            (msg: string, detailedMsg: string): void => {
                this.props.onError && this.props.onError(LinkerModalErrorState.FailureCreatingConnectionDescriptor);
            }
        )
            .then(crd => {
                // If there was an error, crd will be undefined but the error handler will have been called above.
                this.setState({
                    gettingConnectionDescriptor: false,
                    connectionRequestInfo: crd,
                });
            })
            .catch (error => {
                this.props.onError && this.props.onError(LinkerModalErrorState.FailureFindingExistingConnection);
                this.setState({
                    gettingConnectionDescriptor: false,
                });
            });

        this.setState({
            cxnRequestWithId: {
                ...this.props.cxnRequest,
                existingConnectionId: undefined,
            },
            queryingConnect: false,
            gettingConnectionDescriptor: true,
            connectionRequestInfo: undefined,
            connectingAccountingSystem: false,
            isDisconnecting: false,
        });
    }

    private InitState(): void {
        if (!this.props.checkAuthorizationStatus) {
            this.GetConnection();
        } else {
            FindConnection(
                this.props.cxnRequest.delegatedAccessToken,
                this.props.cxnRequest.strongboxUri,
                this.props.cxnRequest.orgId,
                this.props.cxnRequest.accountingPackage)
                .then(response => {
                    if (!response) {
                        this.GetConnection();
                    } else {
                        this.setState({
                            cxnRequestWithId: {
                                ...this.props.cxnRequest,
                                existingConnectionId: response.id,
                            },
                            queryingConnect: false,
                        })
                    }
                })
                .catch(error => {
                    this.props.onError && this.props.onError(LinkerModalErrorState.FailureFindingExistingConnection);
                    this.setState({
                        queryingConnect: false,
                    });
                });

            this.setState({
                connectionRequestInfo: undefined,
                connectingAccountingSystem: false,
                isDisconnecting: false,
                queryingConnect: true,
            });
        }
    }

    private OnImportError(msg: string, detailedMsg: string): void {
        this.setState({
            errorText: msg,
        });
    }

    // OnModalAborted is different than what happens below when OnLinkCompleted is called.
    // This would happen, if for example, the user aborted from the accounting package 
    // connection dialog by pressing the x button in the upper corner.  
    //
    // OnLinkCompleted is called when the user closes the actual modal dialog that we show
    // in front of the accounting package connection dialog.

    private OnModalAborted(): void {
        this.InitState();
    }

    private onAccountingSystemConnected(cxnRequest: StrongboxConnectionRequest, apiRequestParameters?: ConnectionRequestDescriptor): void {
        this.props.onConnected && this.props.onConnected(cxnRequest, apiRequestParameters);
        this.setState({
            connectingAccountingSystem: false,
        });
    }

    private ExecuteConnect(accountingPackage: AccountingPackage, connectionRequestId: string, connectionWindowHandle: Window | undefined) {
        // If there's no delegated access token OR
        // there is no existing connection id and connectionRequestInfo is not defined then we have an error.

        if ((!this.state.cxnRequestWithId.delegatedAccessToken) || (!(this.state.connectionRequestInfo || this.state.cxnRequestWithId.existingConnectionId))) {
            return;
        }

        ConnectAccountingSystem(
            this.state.cxnRequestWithId,
            this.state.connectionRequestInfo,
            connectionWindowHandle,
            this.OnImportError,
            this.onAccountingSystemConnected,
            this.OnModalAborted,
            () => false,
        );

        this.setState({
            connectingAccountingSystem: true,
        });
    }

    private ExecuteDisconnect(): void {
        if (!!(this.state.cxnRequestWithId && this.state.cxnRequestWithId.existingConnectionId) &&
            !!(this.state.cxnRequestWithId && this.state.cxnRequestWithId.delegatedAccessToken)) {
            DisconnectConnection(this.state.cxnRequestWithId)
                .then(disconnected => {
                    this.props.onDisconnection && this.props.onDisconnection(disconnected);
                    this.InitState();
                })
                .catch(error => {
                    this.props.onDisconnection && this.props.onDisconnection(false);
                    this.setState({
                        isDisconnecting: false,
                    });
                });

            this.setState({
                isDisconnecting: true,
            });
        }
    }

    private RenderModal = (): JSX.Element | false => {
        const {
            accountingPackage,
            delegatedAccessToken,
            orgId,
            strongboxUri,
            submissionId
        } = this.state.cxnRequestWithId;

        let content: JSX.Element | false = false;
        if (
            (accountingPackage === AccountingPackage.QuickBooksOnline) ||
            (accountingPackage === AccountingPackage.QuickBooksDesktop) ||
            (accountingPackage === AccountingPackage.SageIntacct) ||
            (accountingPackage === AccountingPackage.Xero) ||
            (accountingPackage === AccountingPackage.Example) ||
            (accountingPackage === AccountingPackage.FreeAgent) ||
            (accountingPackage === AccountingPackage.NetSuite)
        ) {
            content = (
                <StrongboxLinkModalContainer
                    accountingPackage={accountingPackage}
                    entityId={orgId}
                    strongboxCxnRequestDescriptor={this.state.connectionRequestInfo}
                    cxnRequest={this.state.cxnRequestWithId}
                    strongboxUrl={strongboxUri}
                    submissionId={submissionId}
                    delegatedAccessToken={delegatedAccessToken}
                    theme={this.props.theme}
                    executeConnect={this.ExecuteConnect}
                    executeDisconnect={this.ExecuteDisconnect}
                    onRequestClose={this.props.onCompleted}
                    isAuthorized={!!(this.state.cxnRequestWithId && this.state.cxnRequestWithId.existingConnectionId)}
                    checkAuthorizationStatus={this.props.checkAuthorizationStatus}
                    disabled={this.props.disabled || this.IsDisabledState()}
                    errorMsg={this.state.errorText}
                    isWorking={!this.state.errorText && this.state.queryingConnect}
                    textContent={this.props.textContent}
                    ref={(r: StrongboxLinkModalContainer): any => this._modal = r}
                />
            );
        } else {
            console.error(`Accounting package ${accountingPackage} cannot be handled in LinkerModal:RenderModal`);
        }

        return content;
    }
}
