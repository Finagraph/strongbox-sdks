import * as React from 'react'
import '../styles.scss'

import ChoosePackage, { AccountingPackageToShow } from './ChoosePackage';
import AcceptTerms from './AcceptTerms';
import LinkProgress from './LinkProgress';
import Congratulations from './Congratulations';
import WorkingStep from './WorkingStep';
import ErrorPage from './ErrorPage';
import { BorrowerSteps } from '../Models/BorrowerState';
import { LinkerModal } from './StrongboxLinker/LinkerModal';
import { ErrorState } from './ErrorPage';

import { TextContent } from '../Text/TextContent';

import {
    ConnectAccountingSystem,
    GetFinancialsConnectionDescriptor,
    ImportFinancials,
    LenderConnectionOptions,
    LoadConnectWindow,
    StrongboxConnectionDescriptor,
    StrongboxConnectionRequest,
    StrongboxImportRequest
} from '../Utils/ConnectStrongbox';

import { ConnectionRequest, ConnectionRequestDescriptor } from '../Models/Api/strongbox.models';

import { Theme } from '../Models/Theme/Theme';
import { AccountingPackage } from '../Models/AccountingPackages';

import {
    IDelegatedAccessToken
} from '../Models/Api/ClientBase';

export type BorrowerContainerProps = {
    accessToken: IDelegatedAccessToken;
    accountingPackages?: AccountingPackageToShow[];
    children: JSX.Element;
    entityId: string;
    financialImportOptions?: LenderConnectionOptions;
    linkPctgComplete: number;
    onJobCreated?: (financialRecordId: string) => void;
    onLinkPctgChange: (pctComplete: number) => void;
    onNextStep: (step: BorrowerSteps, goToStep?: BorrowerSteps) => void;
    onTermsAccepted: () => void;
    partnerName: string;
    showConnectionDialog?: boolean;
    step: BorrowerSteps;
    strongboxUri: string;
    textContent: TextContent;
    theme?: Theme;
}

const BorrowerContainer: React.FC<BorrowerContainerProps> = (props: BorrowerContainerProps): React.ReactElement => {
    const _linkModalRef: React.RefObject<any> = React.createRef();

    let divStyle: any = {};
    if (props.theme && props.theme.palette) {
        divStyle['backgroundColor'] = props.theme.palette.borrowerInteractionBackground;
    }

    const [currentCxnRequest, setCurrentCxnRequest] = React.useState<StrongboxConnectionRequest | undefined>(undefined);
    const [showingAuthWindow, setShowingAuthWindow] = React.useState<boolean>(false);
    const [errorState, setErrorState] = React.useState<ErrorState | undefined>(undefined);

    const OnError = (msg: string, detailedMsg: string): void => {
        setCurrentCxnRequest(undefined);
        setShowingAuthWindow(false);
        setErrorState({
            msg,
            detailedMsg,
        });
    }

    const OnConnected = (cxnRequest: StrongboxConnectionRequest, apiRequestParameters?: ConnectionRequestDescriptor): void => {
        // existingConnectionId won't be null here, it'll be filled in before
        // this callback is invoked.
        const importRequest: StrongboxImportRequest = {
            accountingPackage: cxnRequest.accountingPackage,
            lenderManagedOptions: props.financialImportOptions,
            initiator: 'widget',
            delegatedAccessToken: props.accessToken,
            orgId: props.entityId,
            strongboxUri: props.strongboxUri,
            submissionId: cxnRequest.submissionId,
            connectionId: cxnRequest.existingConnectionId || '',
        };
        setCurrentCxnRequest(undefined);
        props.onNextStep(props.step);

        ImportFinancials(
            importRequest,
            OnError,
            (financialRecordId: string, importRequest: StrongboxImportRequest) => {
                props.onJobCreated && props.onJobCreated(financialRecordId);
                setShowingAuthWindow(false);
                props.onNextStep(props.step);
            }
        )
    }

    const OnAborted = (): void => {
        setCurrentCxnRequest(undefined);
        setShowingAuthWindow(false);
    }

    const ConnectToAccountingPackage = (accountingPackage: AccountingPackage): void => {
        const connectionInfo: StrongboxConnectionDescriptor = {
            accountingPackage,
            delegatedAccessToken: props.accessToken,
            strongboxUri: props.strongboxUri,
            orgId: props.entityId,
            existingConnectionId: undefined,
            submissionId: undefined,
            initiator: 'widget',
            lenderManagedOptions: props.financialImportOptions,
        };

        const cxnRequest: StrongboxConnectionRequest = {
            accountingPackage,
            delegatedAccessToken: props.accessToken,
            strongboxUri: props.strongboxUri,
            orgId: props.entityId,
        };

        if (!!props.showConnectionDialog) {
            setCurrentCxnRequest(cxnRequest);
        } else {
            const cxnWindowHandle = LoadConnectWindow(undefined);
            if (!cxnWindowHandle) {
                setErrorState({
                    msg: props.textContent.TextValue('StartFinancialsCreateWindowSummaryError'),
                    detailedMsg: '',
                });
            } else {
                GetFinancialsConnectionDescriptor(
                    connectionInfo,
                    (msg: string, detailedMsg: string): void => { }
                )
                    .then(cxnDescriptor => {
                        if (cxnDescriptor) {
                            cxnWindowHandle.location.href = cxnDescriptor.connectionEndpoint || '';

                            setShowingAuthWindow(true);

                            ConnectAccountingSystem(
                                cxnRequest,
                                cxnDescriptor,
                                cxnWindowHandle,
                                OnError,
                                OnConnected,
                                OnAborted,
                                () => { return false },
                                props.textContent
                            );
                        }
                    });
            }
        }
    }

    const ProgressComplete = (): void => {
        props.onNextStep(props.step);
    }

    const CongratsComplete = (): void => {
        props.onNextStep(props.step);
    }

    const AbortIntroPages = (): void => {
        props.onNextStep(BorrowerSteps.congratulations);
    }

    const centeredSteps = new Set([BorrowerSteps.progress, BorrowerSteps.congratulations]);

    let containerClassName = 'finagraph-strongbox-main-borrower-container';

    if (centeredSteps.has(props.step)) {
        containerClassName += ' finagraph-strongbox-main-borrower-container-centered';
    }

    if (!!errorState) {
        return (
            <div style={divStyle} className={containerClassName}>
                <ErrorPage
                    abort={AbortIntroPages}
                    onDismiss={() => { setErrorState(undefined); props.onNextStep(props.step, BorrowerSteps.choosePackage); }}
                    textContent={props.textContent}
                    theme={props.theme}
                    errorText={[errorState.msg, errorState.detailedMsg]}
                />
            </div>
        );
    } else {
        return (
            <div style={divStyle} className={containerClassName}>
                {props.step === BorrowerSteps.acceptTerms && (
                    <AcceptTerms
                        abort={AbortIntroPages}
                        onTermsAccepted={props.onTermsAccepted}
                        partnerName={props.partnerName}
                        textContent={props.textContent}
                        theme={props.theme}
                    />
                )}
                {props.step === BorrowerSteps.choosePackage && (
                    <ChoosePackage
                        abort={AbortIntroPages}
                        accountingPackages={props.accountingPackages}
                        theme={props.theme}
                        showLinkDialog={ConnectToAccountingPackage}
                        children={props.children}
                        authWindowActive={!!currentCxnRequest || showingAuthWindow}
                        buttonsDisabled={!!currentCxnRequest || showingAuthWindow}
                        textContent={props.textContent}
                    />
                )}
                {props.step === BorrowerSteps.importingFinancials && (
                    <WorkingStep
                        theme={props.theme}
                        children={props.children}
                        textContent={props.textContent}
                        content={props.textContent.TextValue('ImportingFinancials')}
                    />
                )}
                {props.step === BorrowerSteps.progress && (
                    <LinkProgress
                        theme={props.theme}
                        onProgressComplete={ProgressComplete}
                        children={props.children}
                        linkPctgComplete={props.linkPctgComplete}
                        onLinkPctgChange={props.onLinkPctgChange}
                        textContent={props.textContent}
                    />
                )}
                {props.step === BorrowerSteps.congratulations && (
                    <Congratulations
                        theme={props.theme}
                        onDone={CongratsComplete}
                        children={props.children}
                        textContent={props.textContent}
                    />
                )}
                {props.children}
                {!!currentCxnRequest &&
                    <LinkerModal
                        cxnRequest={currentCxnRequest}
                        theme={props.theme}
                        onCompleted={(success: boolean) => {
                            setCurrentCxnRequest(undefined);
                        }}
                        onConnected={OnConnected}
                        checkAuthorizationStatus={false}
                        textContent={props.textContent}
                    />
                }
            </div>
        );
    }
}

export default BorrowerContainer;

