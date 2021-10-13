/*
 * ----------------- Huge helpful hint --------------------
 * 
 * This applies primarily for a solution that allows local development using npm link.  You can
 * avoid all of this headache by not doing that and using relative paths instead.  There's a package
 * file checked in called package.local.  Copy that to package.json, delete node_modules and dist 
 * folders, run npm install and you should be good to go.
 * 
 * If you get the following error:
 * 
 * Error: Invalid hook call. Hooks can only be called inside the body of a function component
 * ...
 * 
 * It is possible that you simply are not calling the hook inside of the function component, but
 * more likely you've built this component and run 'npm link' to create a local symbolic link to
 * the project. 
 * 
 * Then to consume it so you can dev on it, in your consuming project you ran 'npm link strongbox-sdk'
 * Seems simple enough but react gets confused and thinks a different version of the dom from react
 * are being used (or some crap like that.)
 * 
 * The method I found for solving this was, essentially to make this component use symbolic links to
 * react that resolve back to the consuming project.
 * 
 * In the consuming application:
 *  cd node_modules/react
 *  npm link
 *  cd ..\react-dom
 *  npm link
 *  cd ..\react-modal
 *  npm link
 *  
 * In this project (the library)
 *  npm link react
 *  npm link react-dom
 *  npm link react-modal
 *   *  
 *  There are myriad discussions about this on the Interwebs but this is the one that ended up working
 *  for me.
*/

import * as React from 'react'
import './styles.scss'

import LinkButton from './Components/LinkButton';
import BorrowerContainer from './Components/BorrowerContainer';
import { BorrowerState, BorrowerSteps, ControlState } from './Models/BorrowerState';

import {
    DisconnectConnection,
    FinancialsImport,
    FindConnection,
    GetFinancialsConnectionDescriptor,
    ImportDayMonthYear,
    LenderConnectionOptions,
    LoadConnectWindow,
    RequestInformation,
    StrongboxConnectionDescriptor,
} from './Utils/ConnectStrongbox';

import { BuildThemeStyle, Theme } from './Models/Theme/Theme';
import { defaultFontStyleMap } from './Models/Theme/ThemeFont';
import { defaultContainerStyleMap } from './Models/Theme/ThemeContainer';
import { IDelegatedAccessToken } from './Models/Api/ClientBase';

import { AccountingPackageToShow, SupportedAccountingPackages } from './Components/ChoosePackage';

import { WebPortalClient } from './Models/Api/strongbox.client';

import { LinkerModal } from './Components/StrongboxLinker/LinkerModal';
import {
    FinancialStatementImportOptions,
    TransactionImportOptions,
    ReceivablesAndPayablesOptions,
    InitializeOrganizationParameters
} from './Models/Api/strongbox.models';

import { TextContent, TextLanguages } from './Text/TextContent';

const strongboxNexusUrlConst = 'https://api.strongbox.link';

export {
    BorrowerSteps,
    AccountingPackageToShow,
    SupportedAccountingPackages,
};

export type FinancialImportOptions = {
    mostRecentDate?: ImportDayMonthYear;
    financialStatementsPeriod?: FinancialStatementImportOptions;
    transactionsPeriod?: TransactionImportOptions;
    payablesPeriod?: ReceivablesAndPayablesOptions;
    receivablesPeriod?: ReceivablesAndPayablesOptions;
    anonymizeCustomersAndVendors: boolean;
};

export type SBLinkAccountingPackageChildProps = {
    step: BorrowerSteps;
    pctComplete?: number;
};

type SBLinkAccountingPackageProps = {
    accessToken: IDelegatedAccessToken;
    accountingPackages?: AccountingPackageToShow[];
    borrowerState: BorrowerState;
    children: (props: SBLinkAccountingPackageChildProps) => JSX.Element | undefined;
    className: string;
    disabled?: boolean;
    entityId: string;
    financialImportOptions?: LenderConnectionOptions;
    language?: string;
    onJobCreated?: (financialRecordId: string) => void;
    onLinkPackageClick: (event: React.MouseEvent) => void;
    onNextStep: (step: BorrowerSteps, goToStep?: BorrowerSteps) => void;
    onTermsAccepted: () => void;
    partnerName: string;
    showConnectionDialog?: boolean;
    strongboxNexusUrl: string;
    theme?: Theme,
}

const SBLinkAccountingPackage: React.FC<SBLinkAccountingPackageProps> = (props: SBLinkAccountingPackageProps): React.ReactElement => {
    let divStyle: any = {};

    // Get a valid language code supported by the widget.  Currently this is English or Spanish.
    // 
    // props.language contains the language code passed by the consumer. It can be undefined in
    // which case English is used.  
    //
    // Return value is always a language code that is actually supported by the widget, i.e. it can
    // be used as a parameter to the constructor for TextContent.

    const GetLanguage = (): TextLanguages => {
        if (!props.language) {
            return 'en';
        }

        // split will generate an array of at least 1 element.
        const languagePieces = props.language.split('-');

        // At the moment just returning the highest level value of a language meaning we aren't
        // delineating between local dialects, e.g. 'es-ar' (Argentinian Spanish) will just resolve
        // to 'es'.

        return (languagePieces[0] === 'es') ? 'es' : 'en';
    }

    const [linkPctgComplete, setLinkPctgComplete] = React.useState<number>(0);

    if (props.theme && props.theme.palette) {
        divStyle['backgroundColor'] = props.theme.palette.windowBackground;
    }

    divStyle = BuildThemeStyle(divStyle, defaultFontStyleMap, props.theme);
    divStyle = BuildThemeStyle(divStyle, defaultContainerStyleMap, props.theme);

    let stepChildren;
    if (props.borrowerState.state === ControlState.borrower) {
        stepChildren = props.children({
            step: props.borrowerState.activeStep,
            pctComplete: linkPctgComplete,
        });
    }

    const useLanguage = GetLanguage();

    const textContent = new TextContent(useLanguage);

    // The link element below is required for being able to use material-ui icons.

    return (
        <div style={divStyle} className={`finagraph-strongbox-borrower-portal ${props.className}`}>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            {props.borrowerState.state === ControlState.button &&
                <LinkButton
                    disabled={props.disabled}
                    theme={props.theme}
                    onClick={props.onLinkPackageClick}
                    textContent={textContent}
                />
            }
            {props.borrowerState.state === ControlState.borrower && (
                <BorrowerContainer
                    accountingPackages={props.accountingPackages}
                    entityId={props.entityId}
                    accessToken={props.accessToken}
                    theme={props.theme}
                    step={props.borrowerState.activeStep}
                    linkPctgComplete={linkPctgComplete}
                    onNextStep={props.onNextStep}
                    onLinkPctgChange={setLinkPctgComplete}
                    partnerName={props.partnerName}
                    strongboxUri={props.strongboxNexusUrl}
                    onJobCreated={props.onJobCreated}
                    onTermsAccepted={() => {
                        props.onTermsAccepted();
                        props.onNextStep(props.borrowerState.activeStep);
                    }}
                    showConnectionDialog={props.showConnectionDialog}
                    textContent={textContent}
                    financialImportOptions={props.financialImportOptions}
                >
                    {stepChildren}
                </BorrowerContainer>
            )}
        </div >
    );
}

// Exposing only onFailureToSetBusinessName at the moment as I don't really
// want to get into exposing a more general purpose error handler at the
// moment.

export type ISBLinkAccountingPackageProps = {
    accessToken: IDelegatedAccessToken;
    accountingPackages?: AccountingPackageToShow[];
    children: (props: SBLinkAccountingPackageChildProps) => JSX.Element | undefined;
    className?: string
    disabled?: boolean;
    financialImportOptions?: FinancialImportOptions;
    language?: string;
    onFailureToSetBusinessName?: (response?: Response) => void;
    onJobCreated?: (financialRecordId: string) => void;
    onButtonExpanded?: (expanded: boolean) => void;
    orgId: string;
    orgName?: string;
    partnerName: string;
    theme?: Theme;
    showConnectionDialog?: boolean;
    strongboxUrlOverride?: string;
}

const App: React.FC<ISBLinkAccountingPackageProps> = (props: ISBLinkAccountingPackageProps): React.ReactElement => {
    const [borrowerState, setBorrowerState] = React.useState<BorrowerState>({
        activeStep: BorrowerSteps.acceptTerms,
        state: ControlState.button,
    });

    const [termsAccepted, setTermsAccepted] = React.useState<boolean>(false);

    const strongboxUri = (): string => {
        return props.strongboxUrlOverride || strongboxNexusUrlConst;
    }

    const initOrgName = (): void => {
        if (!(props.orgId && props.accessToken && props.accessToken.accessToken)) {
            return;
        }

        let orgName = props.orgName;

        if (!orgName) {
            const dateStr = new Date().toDateString();
            orgName = `Imported on-${dateStr}`;
        }
        
        const webPortal = new WebPortalClient(props.accessToken, strongboxUri());

        webPortal.initializeOrganization(
            props.orgId,
            new InitializeOrganizationParameters({ 'displayName': orgName })
        )
            .catch(initException => {
                console.error(`Exception thrown setting the business name for orgId: ${props.orgId}, orgName: ${orgName}`);
                console.error(initException);
                props.onFailureToSetBusinessName && props.onFailureToSetBusinessName();
            });

    }

    const importOptions = React.useMemo((): LenderConnectionOptions | undefined => {
        if (!(props.financialImportOptions)) {
            return undefined;
        }
        return {
            ...props.financialImportOptions,
            provideUserCopy: false,
        }
    }, [props.financialImportOptions])

    return (<SBLinkAccountingPackage
        accessToken={props.accessToken}
        accountingPackages={props.accountingPackages}
        borrowerState={borrowerState}
        children={props.children}
        className={props.className || ''}
        disabled={props.disabled}
        entityId={props.orgId}
        financialImportOptions={importOptions}
        language={props.language}
        onJobCreated={props.onJobCreated}
        onLinkPackageClick={(event: React.MouseEvent): void => {
            setBorrowerState({
                ...borrowerState,
                state: ControlState.borrower,
            });
            props.onButtonExpanded && props.onButtonExpanded(true);
        }}
        onNextStep={(step: BorrowerSteps, goToStep?: BorrowerSteps): void => {
            let nextStep: BorrowerSteps;
            let controlState = ControlState.borrower;

            // choosePackage is 0 so don't use !goToStep
            if (goToStep !== undefined) {
                nextStep = goToStep;
            } else {
                switch (step) {
                    case BorrowerSteps.acceptTerms:
                        nextStep = BorrowerSteps.choosePackage;
                        break;
                    case BorrowerSteps.choosePackage:
                        initOrgName();
                        nextStep = BorrowerSteps.progress;
                        break;
                    case BorrowerSteps.progress:
                        nextStep = BorrowerSteps.congratulations;
                        break;
                    case BorrowerSteps.congratulations:
                        nextStep = termsAccepted ? BorrowerSteps.choosePackage : BorrowerSteps.acceptTerms;
                        controlState = ControlState.button;
                        props.onButtonExpanded && props.onButtonExpanded(false);
                        break;
                    default:
                        return;
                }
            }

            setBorrowerState({
                ...borrowerState,
                state: controlState,
                activeStep: nextStep,
            });
        }}
        onTermsAccepted={() => {
            setTermsAccepted(true);
        }}
        partnerName={props.partnerName}
        showConnectionDialog={props.showConnectionDialog === undefined ? true : props.showConnectionDialog}
        strongboxNexusUrl={strongboxUri()}
        theme={props.theme}
    />);
}

export default App
export {
    DisconnectConnection,
    FinancialsImport,
    FindConnection,
    GetFinancialsConnectionDescriptor,
    LenderConnectionOptions,
    LinkerModal,
    LoadConnectWindow,
    RequestInformation,
    StrongboxConnectionDescriptor,
    Theme
}
