import { AccountingPackage } from '../Models/AccountingPackages';

import { TextContent } from '../Text/TextContent';
import { translations } from '../Text/en/en';

export type DesktopAuthResponse = {
    codeChallenge: string;
}

export function AccountingPackageConnectPrompt(accountingPackage: AccountingPackage, textContent?: TextContent): string {
    let connectTo = translations.ConnectToAccountingPkg;
    let unknown = translations.UnknownAccountingPkg;
    if (textContent) {
        connectTo = textContent.TextValue('ConnectToAccountingPkg');
        unknown = textContent.TextValue('UnknownAccountingPkg');
    }

    switch (accountingPackage) {
        case AccountingPackage.Xero:
            return `${connectTo} Xero`;
        case AccountingPackage.QuickBooksDesktop:
            return `${connectTo} QuickBooks Desktop`;
        case AccountingPackage.QuickBooksOnline:
            return `${connectTo} QuickBooks`;
        case AccountingPackage.SageIntacct:
            return `${connectTo} Sage Intacct`;
        case AccountingPackage.Example:
            return `${connectTo} DEX`;
        case AccountingPackage.FreeAgent:
            return `${connectTo} FreeAgent`;
        default:
            return unknown;
    }
}

export function AccountingPackageName(accountingPackage: AccountingPackage): string {
    switch (accountingPackage) {
        case AccountingPackage.Xero:
            return 'Xero';
        case AccountingPackage.QuickBooksDesktop:
            return 'QuickBooks Desktop';
        case AccountingPackage.QuickBooksOnline:
            return 'QuickBooks';
        case AccountingPackage.SageIntacct:
            return 'Sage Intacct';
        case AccountingPackage.Example:
            return 'Example';
        case AccountingPackage.FreeAgent:
            return 'FreeAgent';
        default:
            return 'Unknown Accounting Package';
    }
}
