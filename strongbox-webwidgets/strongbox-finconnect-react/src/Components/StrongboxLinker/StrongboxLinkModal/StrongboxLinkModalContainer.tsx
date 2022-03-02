import * as React from 'react';

import { AccountingPackage } from '../../../Models/AccountingPackages';
import { IOpenableModal } from '../../../Models/IOpenableModal';
import { LinkState } from '../../../Models/LinkerSession';

import { StrongboxConnectionRequest } from '../../../Utils/ConnectStrongbox';

import StrongboxLinkModal from './StrongboxLinkModal';
import { Theme } from '../../../Models/Theme/Theme';
import { IDelegatedAccessToken } from '../../../Models/Api/ClientBase';
import { ConnectionRequestDescriptor } from '../../../Models/Api/strongbox.models';

import { TextContent } from '../../../Text/TextContent';

export interface IStrongboxLinkModalContainerProps {
    accountingPackage: AccountingPackage;
    entityId: string;
    strongboxCxnRequestDescriptor?: ConnectionRequestDescriptor;
    cxnRequest?: StrongboxConnectionRequest;
    strongboxUrl: string;
    submissionId?: string;
    delegatedAccessToken: IDelegatedAccessToken;
    theme?: Theme;
    isAuthorized?: boolean;
    checkAuthorizationStatus?: boolean;
    executeConnect: (accountingPackage: AccountingPackage, connectionRequestId: string, connectionWindowHandle: Window | undefined) => void;
    executeDisconnect?: () => void;
    onRequestClose?: (success: boolean) => void;
    disabled?: boolean;
    errorMsg?: string;
    isWorking?: boolean;
    textContent?: TextContent;
}

type Props = IStrongboxLinkModalContainerProps;

type State = {
};

class StrongboxLinkModalContainer extends React.PureComponent<Props, State> implements IOpenableModal {
    constructor(props: Props) {
        super(props);

        this.state = {
        };
    }

    public render() {
        const {
            accountingPackage,
            entityId,
            cxnRequest,
            delegatedAccessToken,
            strongboxUrl,
            submissionId,
            theme
        } = this.props;

        if (!entityId) {
            return false;
        }

        return (
            <StrongboxLinkModal
                accountingPackage={accountingPackage}
                entityId={entityId}
                strongboxCxnRequestDescriptor={this.props.strongboxCxnRequestDescriptor}
                cxnRequest={this.props.cxnRequest}
                onRequestClose={this.props.onRequestClose}
                executeConnect={this.props.executeConnect}
                executeDisconnect={this.props.executeDisconnect}
                open={true}
                strongboxUrl={strongboxUrl}
                submissionId={submissionId}
                delegatedAccessToken={delegatedAccessToken}
                theme={theme}
                updateProgress={this.UpdateProgress}
                isAuthorized={this.props.isAuthorized}
                checkAuthorizationStatus={this.props.checkAuthorizationStatus}
                disabled={this.props.disabled}
                errorMsg={this.props.errorMsg}
                isWorking={this.props.isWorking}
                textContent={this.props.textContent}
            />
        );
    }

    public CloseModal = (): void => {
        this.props.onRequestClose && this.props.onRequestClose(false);
    }

    public OpenModal = (): void => {
    }

    private UpdateLinkState = (jobId: string, linkState: LinkState): void => {
    }

    private UpdateProgress = (progress: number): void => {
    }
}

export default StrongboxLinkModalContainer;

