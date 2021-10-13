import * as React from 'react'
import '../styles.scss'

import ChoosePackage, { AccountingPackageToShow } from './ChoosePackage';
import AcceptTerms from './AcceptTerms';
import LinkProgress from './LinkProgress';
import Congratulations from './Congratulations';
import { BorrowerSteps } from '../Models/BorrowerState';
import { LinkerModal } from './StrongboxLinker/LinkerModal';

import { TextContent } from '../Text/TextContent';

import {
    GetFinancialsConnectionDescriptor,
    LenderConnectionOptions,
    LoadConnectWindow,
    StartFinancialsImport,
    StrongboxConnectionDescriptor
} from '../Utils/ConnectStrongbox';

import { ConnectionRequestDescriptor } from '../Models/Api/strongbox.models';

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

type ErrorState = {
    msg: string | undefined;
    detailedMsg: string | undefined;
}

const BorrowerContainer: React.FC<BorrowerContainerProps> = (props: BorrowerContainerProps): React.ReactElement => {
    const _linkModalRef: React.RefObject<any> = React.createRef();

    let divStyle: any = {};
    if (props.theme && props.theme.palette) {
        divStyle['backgroundColor'] = props.theme.palette.borrowerInteractionBackground;
    }

    const [connectionInfo, setConnectionInfo] = React.useState<StrongboxConnectionDescriptor | undefined>(undefined);
    const [showingAuthWindow, setShowingAuthWindow] = React.useState<boolean>(false);
    const [errorState, setErrorState] = React.useState<ErrorState>({
        msg: undefined,
        detailedMsg: undefined,
    });

    const OnJobCreated = (financialRecordId: string): void => {
        props.onJobCreated && props.onJobCreated(financialRecordId);
        setConnectionInfo(undefined);
        setShowingAuthWindow(false);
        props.onNextStep(props.step);
    }

    const OnError = (msg: string, detailedMsg: string): void => {
        setConnectionInfo(undefined);
        setShowingAuthWindow(false);
        setErrorState({
            msg,
            detailedMsg,
        });
    }

    const OnAborted = (): void => {
        setConnectionInfo(undefined);
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

        if (!!props.showConnectionDialog) {
            setConnectionInfo(connectionInfo);
        } else {
            const cxnWindowHandle = LoadConnectWindow(connectionInfo, undefined);

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

                            StartFinancialsImport(
                                connectionInfo,
                                cxnDescriptor,
                                cxnWindowHandle,
                                OnError,
                                OnJobCreated,
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
                    showError={errorState.msg}
                    authWindowActive={!!connectionInfo || showingAuthWindow}
                    buttonsDisabled={!!connectionInfo || showingAuthWindow}
                    textContent={props.textContent}
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
            {!!connectionInfo &&
                <LinkerModal
                    connectionInfo={connectionInfo}
                    theme={props.theme}
                    onCompleted={(success: boolean) => {
                        setConnectionInfo(undefined);
                    }}
                    onJobCreated={OnJobCreated}
                    checkAuthorizationStatus={false}
                    textContent={props.textContent}
                />
            }
        </div>
    );
}

export default BorrowerContainer;

