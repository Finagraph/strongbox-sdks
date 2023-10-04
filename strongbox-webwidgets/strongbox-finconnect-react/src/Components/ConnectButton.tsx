import * as React from 'react';

import '../styles.scss';

import xeroImg from '../Images/Connect/xero.png';
import qbConnectImg from '../Images/Connect/qbo.png';
import sageIntacctImg from '../Images/Connect/sageIntacct.png';
import exampleImg from '../Images/Connect/example.png';
import freeAgentImg from '../Images/Connect/freeagent.png';
import netSuiteImg from '../Images/Connect/netsuite.png';
import myobImg from '../Images/Connect/myob.png';

type Props = {
    datasourceId: string;
    onClick: () => void;
    style: any;
    idButton: string;
};

export const ConnectButton: React.FC<Props> = (props): React.ReactElement => {
    // TODO:  Handle hover case for button and images.
    let buttonImg;
    let connectButtonDescription = 'Connect to accounting system';

    switch (props.datasourceId.toLowerCase()) {
        case 'quickbooksonline':
            buttonImg = qbConnectImg;
            connectButtonDescription = 'Connect to QuickBooks Online';
            break;
        case 'quickbooksdesktop':
            buttonImg = qbConnectImg;
            connectButtonDescription = 'Connect to QuickBooks Desktop';
            break;
        case 'xero':
            buttonImg = xeroImg;
            connectButtonDescription = 'Connect to Xero';
            break;
        case 'sageintacct':
            buttonImg = sageIntacctImg;
            connectButtonDescription = 'Connect to SageIntacct';
            break;
        case 'example':
            buttonImg = exampleImg;
            connectButtonDescription = 'Connect to DEX';
            break;
        case 'freeagent':
            buttonImg = freeAgentImg;
            connectButtonDescription = 'Connect to FreeAgent';
            break;
        case 'netsuite':
            buttonImg = netSuiteImg;
            connectButtonDescription = 'Connect to NetSuite';
            break;
        case 'myobbusiness':
            buttonImg = myobImg
            connectButtonDescription = 'Connect to MYOB';
            break;
    }

    return (
        <div className={'finagraph-strongbox-accounting-pkg-connect-container'}>
            <button
                className={`finagraph-strongbox-accounting-pkg-connect-button`}
                onClick={props.onClick}
                style={props.style}
                id={props.idButton}
                tabIndex={1}
            >
                {buttonImg ? (<img src={buttonImg} aria-label={connectButtonDescription} />) : ('Connect')}
            </button>
        </div>
    );
}
