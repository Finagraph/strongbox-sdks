import * as React from 'react';

import '../styles.scss';

import xeroImg from '../Images/Connect/xero.png';
import qbConnectImg from '../Images/Connect/qbo.png';
import sageIntacctImg from '../Images/Connect/sageIntacct.png';
import exampleImg from '../Images/Connect/example.png';
import freeAgentImg from '../Images/Connect/freeagent.png';
import netsuiteImg from '../Images/Connect/netsuite.png';

type Props = {
    datasourceId: string;
    onClick: () => void;
    style: any;
};

export const ConnectButton: React.FC<Props> = (props): React.ReactElement => {
    // TODO:  Handle hover case for button and images.
    let buttonImg;

    switch (props.datasourceId.toLowerCase()) {
        case 'quickbooksonline':
            buttonImg = qbConnectImg;
            break;
        case 'quickbooksdesktop':
            buttonImg = qbConnectImg;
            break;
        case 'xero':
            buttonImg = xeroImg;
            break;
        case 'sageintacct':
            buttonImg = sageIntacctImg;
            break;
        case 'example':
            buttonImg = exampleImg;
            break;
        case 'freeagent':
            buttonImg = freeAgentImg;
            break;
        case 'netsuite':
            buttonImg = netsuiteImg;
            break;
    }

    return (
        <div className={'finagraph-strongbox-accounting-pkg-connect-container'}>
            <button
                className={`finagraph-strongbox-accounting-pkg-connect-button`}
                onClick={props.onClick}
                style={props.style}
            >
                {buttonImg ? (<img src={buttonImg} alt={'Connect'} />) : ('Connect')}
            </button>
        </div>
    );
}
