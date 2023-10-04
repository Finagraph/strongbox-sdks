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
    let connectButtonDescription = 'connect to accounting system';

    switch (props.datasourceId.toLowerCase()) {
        case 'quickbooksonline':
            buttonImg = qbConnectImg;
            connectButtonDescription = 'connect to quickbooks online';
            break;
        case 'quickbooksdesktop':
            buttonImg = qbConnectImg;
            connectButtonDescription = 'connect to quickbooks desktop';
            break;
        case 'xero':
            buttonImg = xeroImg;
            connectButtonDescription = 'connect to xero';
            break;
        case 'sageintacct':
            buttonImg = sageIntacctImg;
            connectButtonDescription = 'connect to sageintacct';
            break;
        case 'example':
            buttonImg = exampleImg;
            connectButtonDescription = 'connect to dex';
            break;
        case 'freeagent':
            buttonImg = freeAgentImg;
            connectButtonDescription = 'connect to freeagent';
            break;
        case 'netsuite':
            buttonImg = netSuiteImg;
            connectButtonDescription = 'connect to netsuite';
            break;
        case 'myobbusiness':
            buttonImg = myobImg
            connectButtonDescription = 'connect to myob';
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
                {buttonImg ? (<img src={buttonImg} alt={connectButtonDescription} />) : ('Connect')}
            </button>
        </div>
    );
}
