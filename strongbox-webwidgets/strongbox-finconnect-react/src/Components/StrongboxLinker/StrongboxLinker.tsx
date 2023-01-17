import * as React from 'react';

import { AccountingPackage } from '../../Models/AccountingPackages';
import { ConnectButton } from '../ConnectButton';

import { LoadConnectWindow, StrongboxConnectionRequest } from '../../Utils/ConnectStrongbox';

import { Theme } from '../../Models/Theme/Theme';

import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import { OverlayType } from '../LoadingIndicator/LoadingIndicator';

import { ConnectionRequestDescriptor } from '../../Models/Api/strongbox.models';

type ConnectButtonProps = {
};

export type StrongboxLinkerChildProps = {
    cxnRequest?: StrongboxConnectionRequest,
    authorized: boolean | undefined;
    disconnect: () => Promise<void>;
    renderAuthButton: (props?: Partial<ConnectButtonProps>) => JSX.Element;
    connectionInitiated: (existingConnectionId: string) => void;
    theme?: Theme;
    disabled?: boolean;
    errorMsg?: string;
    isWorking?: boolean;
};

export type Props = {
    cxnRequest?: StrongboxConnectionRequest,
    strongboxCxnRequestDescriptor?: ConnectionRequestDescriptor,
    onOpen?: (authWindow: Window) => void
    existingConnectionId?: string;
    autoStartOnAuthorized?: boolean;
    autoStartOnIntialized?: boolean;
    children: (props: StrongboxLinkerChildProps) => JSX.Element;
    datasourceId: AccountingPackage;
    executeConnect: (accountingPackage: AccountingPackage, connectionRequestId: string, connectionWindowHandle: Window | undefined) => void;
    executeDisconnect?: () => void;
    theme?: Theme;
    isAuthorized?: boolean;
    checkAuthorizationStatus?: boolean;
    disabled?: boolean;
    errorMsg?: string;
    isWorking?: boolean;
};

export type State = {
};

class StrongboxLinker extends React.PureComponent<Props, State> {
    public static defaultProps = {
        existingConnectionId: undefined,
        autoStartOnAuthorized: false,
        isAuthorized: false,
        checkAuthorizationStatus: false,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
        };
    }

    public render() {
        const authorized = !!this.props.checkAuthorizationStatus && !!this.props.isAuthorized;

        const childrenProps: StrongboxLinkerChildProps = {
            cxnRequest: this.props.cxnRequest,
            authorized,
            disconnect: this.DisconnectConnection,
            renderAuthButton: this.RenderAuthButton,
            connectionInitiated: this.CreateJob,
            theme: this.props.theme,
            disabled: this.props.disabled,
            isWorking: this.props.isWorking,
            errorMsg: this.props.errorMsg,
        };

        return this.props.children(childrenProps);
    }

    private DisconnectConnection = async (): Promise<void> => {
        this.props.executeDisconnect && this.props.executeDisconnect();
    }

    private AuthorizeConnection = (): void => {
        let windowHandle: Window | undefined = undefined;

        if (this.props.cxnRequest && !this.props.existingConnectionId && this.props.strongboxCxnRequestDescriptor) {
            windowHandle = LoadConnectWindow(this.props.strongboxCxnRequestDescriptor);
            if (!windowHandle) {
                return;
            }
        }

        this.props.executeConnect(
            this.props.datasourceId,
            (this.props.strongboxCxnRequestDescriptor && this.props.strongboxCxnRequestDescriptor.id) || '',
            windowHandle
        );
    }

    private CreateJob = (connectionId: string): void => {
        if (this.props.cxnRequest && !this.props.existingConnectionId && this.props.strongboxCxnRequestDescriptor) {
            return;
        }

        this.props.executeConnect(
            this.props.datasourceId,
            connectionId,
            undefined,
        );
    }

    private RenderAuthButton = (props?: Partial<ConnectButtonProps>): JSX.Element => {
        const { datasourceId } = this.props;

        return (
            <div>
                {this.props.isWorking && <LoadingIndicator active={true} overlayType={OverlayType.Dark} />}
                <ConnectButton
                    style={{
                        marginTop: '20px',
                    }}
                    datasourceId={datasourceId}
                    onClick={() => {
                        this.AuthorizeConnection();
                    }}
                />
            </div>
        );
    }
}

export default StrongboxLinker;
