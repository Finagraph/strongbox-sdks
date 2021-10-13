/*
 * ----------------- Huge helpful hint --------------------
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
 *
 * In this project (the library)
 *  npm link react
 *  npm link react-dom
 *
 *  There are myriad discussions about this on the Interwebs but this is the one that ended up working
 *  for me.
*/


import * as React from 'react'

import qbImg from '../Images/QuickBooks.png';
import xeroImg from '../Images/xero.png';
import sageIntacctImg from '../Images/sageIntacct.png';
import exampleImg from '../Images/DEX-LOGO.png';

import '../styles.scss'

import { AccountingPkgPresentation, AccountingPackage } from '../Models/AccountingPackages';
import { Account } from '../Models/Api/strongbox.models';

export type IAccountingPackageProps = {
    buttonsDisabled: boolean;
    accountingPackages: AccountingPkgPresentation[];
    style?: React.CSSProperties;
    onPackageInvoke(accountingPackage: AccountingPkgPresentation): void;
}

const GetButtonImage = (packageName: AccountingPackage): any => {
    let result = undefined;

    if ((packageName === AccountingPackage.QuickBooksDesktop) ||
        (packageName === AccountingPackage.QuickBooksOnline)) {
        result = qbImg;
    } else if (packageName === AccountingPackage.Xero) {
        result = xeroImg;
    } else if (packageName === AccountingPackage.SageIntacct) {
        result = sageIntacctImg;
    } else if (packageName === AccountingPackage.Example) {
        result = exampleImg;
    }

    return result;
}

export const AccountingPackages: React.FC<IAccountingPackageProps> = ({
    buttonsDisabled,
    accountingPackages,
    onPackageInvoke,
    style,
}): React.ReactElement => {
    const AccountingPackageButtons = (): React.ReactNode => {
        let divStyle = {};
        let keyVal = 0;
        const buttons: React.ReactNode[] = [];

        accountingPackages.forEach(accountingPkg => {
            const buttonImg = GetButtonImage(accountingPkg.featureName);

            keyVal++;
            buttons.push((
                <div
                    className={'button-container'}
                    key={`${keyVal}`}
                    style={divStyle}
                >
                    <button
                        type="button"
                        className={'accounting-button'}
                        disabled={buttonsDisabled}
                        onClick={() => {
                            onPackageInvoke(accountingPkg);
                        }}
                    >
                        <img
                            src={buttonImg}
                        />
                    </button>
                    {accountingPkg.descriptor && (<h2 style={{ marginTop: '10px' }}>{accountingPkg.descriptor}</h2>)}
                </div>
            ));
            divStyle = {
                marginLeft: '20px',
            };
        });

        return (
            <>
                {buttons}
            </>
        );
    }            

    return (
        <div
            style={style || {}}
            className={'finagraph-strongbox-accounting-packages'}
        >
            {AccountingPackageButtons()}
        </div>
    );
}


