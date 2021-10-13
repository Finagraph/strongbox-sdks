import * as React from 'react'
import '../styles.scss'

import { AccountingPkgPresentation, AccountingPackage } from '../Models/AccountingPackages';
import { AccountingPackages } from './AccountingPackages';

import { BuildThemeStyle, Theme } from '../Models/Theme/Theme';
import { defaultControlStyleMap } from '../Models/Theme/ThemeControls';
import { generalWindowBackground, paragraphText } from '../Models/Theme/Colors';

import { TextContent } from '../Text/TextContent';

import IntroBanner from './IntroBanner';

export type SupportedAccountingPackages =
    AccountingPackage.QuickBooksDesktop |
    AccountingPackage.QuickBooksOnline |
    AccountingPackage.SageIntacct |
    AccountingPackage.Xero |
    AccountingPackage.Example;

export const SupportedAccountingPackagesList: AccountingPackage[] = [
    AccountingPackage.QuickBooksDesktop,
    AccountingPackage.QuickBooksOnline,
    AccountingPackage.SageIntacct,
    AccountingPackage.Xero,
    AccountingPackage.Example,
];

export type AccountingPackageToShow = {
    descriptor?: string;
    package: SupportedAccountingPackages;
}

export type ChoosePackageProps = {
    accountingPackages?: AccountingPackageToShow[];
    theme?: Theme;
    abort?: () => void;
    showLinkDialog: (accountingPackage: AccountingPackage) => void;
    children?: JSX.Element;
    showError?: string | undefined;
    textContent: TextContent;
    authWindowActive: boolean;
    buttonsDisabled: boolean;
}

const ChoosePackage: React.FC<ChoosePackageProps> = (props: ChoosePackageProps): React.ReactElement => {
    let buttonStyle = BuildThemeStyle({ border: 'none', color: paragraphText },
        {
            container: 'palette',
            map: [
                { containerName: 'windowBackground', styleName: 'backgroundColor' }
            ]
        },
        props.theme
    );
    if (!(buttonStyle.backgroundColor)) {
        buttonStyle.backgroundColor = generalWindowBackground;
    }
    buttonStyle = BuildThemeStyle(buttonStyle, defaultControlStyleMap, props.theme);

    const fullAccountingPackages: AccountingPkgPresentation[] = [
        {
            featureName: AccountingPackage.QuickBooksOnline,
            descriptor: props.textContent.TextValue('QBOnline'),
            isPublic: true,
        },
        {
            featureName: AccountingPackage.QuickBooksDesktop,
            descriptor: props.textContent.TextValue('QBDesktop'),
            isPublic: true,
        },
        {
            featureName: AccountingPackage.Xero,
            descriptor: undefined,
            isPublic: true,
        },
        {
            featureName: AccountingPackage.SageIntacct,
            descriptor: undefined,
            isPublic: true,
        },
        {
            featureName: AccountingPackage.Example,
            descriptor: props.textContent.TextValue('ExampleAccountingSystem'),
            isPublic: false,
        }
    ]

    const [activeAccountingPackages, setActiveAccountingPackages] = React.useState<AccountingPkgPresentation[]>(fullAccountingPackages);

    React.useEffect(() => {
        if (!props.accountingPackages) {
            const newPackages: AccountingPkgPresentation[] = fullAccountingPackages.filter(pkg => pkg.isPublic);
            setActiveAccountingPackages(newPackages);
        } else {
            const newPackages: AccountingPkgPresentation[] = [];

            props.accountingPackages.forEach(pkg => {
                const pkgPresentation = fullAccountingPackages.find(knownPkg => knownPkg.featureName.toLowerCase() === pkg.package.toLowerCase());
                if (pkgPresentation) {
                    const pkgToAdd = pkgPresentation;

                    if (pkg.descriptor || (pkg.descriptor !== undefined && pkg.descriptor === '')) {
                        pkgToAdd.descriptor = pkg.descriptor;
                    }
                    newPackages.push(pkgToAdd);
                }
            });

            setActiveAccountingPackages(newPackages);
        }
    }, [props.accountingPackages]);

    const PackageInvoke = (accountingPackage: AccountingPkgPresentation): void => {
        props.showLinkDialog(accountingPackage.featureName);
    }

    return (
        <>
            <IntroBanner
                theme={props.theme}
                textContent={props.textContent}
                authWindowActive={props.authWindowActive}
                abort={props.abort}
            />
            { props.showError && (
                <p style={{
                    color: "red",
                    marginBottom: "15px"
                }}>{props.showError}</p>
            )}
            { props.authWindowActive && (
                <p style={{
                    marginBottom: "15px"
                }}>
                    A Browser window is currently open to authenticate with your accounting package.  Please authenticate in that window or close it.
                </p>
            )}
            <AccountingPackages
                style={{
                    marginTop: '10px',
                }}
                buttonsDisabled={props.buttonsDisabled}
                accountingPackages={activeAccountingPackages}
                onPackageInvoke={PackageInvoke}
            />
            {!(props.children) && (
                <div style={{ marginTop: '15px' }}>
                    <p>{props.textContent.TextValue('ClickYourAccountingPackage')}</p>
                    <ul>
                        <li>{props.textContent.TextValue('PNLStatements')}</li>
                        <li>{props.textContent.TextValue('BalanceSheets')}</li>
                        <li>{props.textContent.TextValue('TransactionData')}</li>
                    </ul>
                    <p>{props.textContent.TextValue('NoteNoPersonalInformation')}</p>
                </div>
            )}
        </>
    );
}

export default ChoosePackage;
