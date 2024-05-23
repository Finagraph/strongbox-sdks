import { AccountingPackage } from '../Models/AccountingPackages';

import { TextContent } from '../Text/TextContent';
import { translations } from '../Text/en/en';

export type DesktopAuthResponse = {
    codeChallenge: string;
}

export function AccountingPackageConnectPrompt(accountingPackage: AccountingPackage, textContent?: TextContent): string {
    let connectTo = translations.ConnectToAccountingPkg;
    let unknown = translations.UnknownAccountingPkg;
    let uploadText = translations.UnknownAccountingPkg;

    if (textContent) {
        connectTo = textContent.TextValue('ConnectToAccountingPkg');
        unknown = textContent.TextValue('UnknownAccountingPkg');
        uploadText = textContent.TextValue('ConnectWithFileUpload');
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
        case AccountingPackage.NetSuite:
            return `${connectTo} NetSuite`;
        case AccountingPackage.MYOBBusiness:
            return `${connectTo} MYOB Business`;
        case AccountingPackage.Dynamics365:
            return `${connectTo} Microsoft Dynamics 365`;
        case AccountingPackage.FileUpload:
            return uploadText;
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
        case AccountingPackage.NetSuite:
            return 'NetSuite';
        case AccountingPackage.Dynamics365:
            return 'Microsoft Dynamics 365';
        case AccountingPackage.MYOBBusiness:
            return 'MYOB Business';
        case AccountingPackage.FileUpload:
            return 'Upload Excel Template';
        default:
            return 'Unknown Accounting Package';
    }
}
