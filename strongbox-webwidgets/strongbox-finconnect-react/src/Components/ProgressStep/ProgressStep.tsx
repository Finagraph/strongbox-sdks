import * as React from 'react'
import '../../styles.scss'

import CheckIcon from '@material-ui/icons/CheckRounded';

import { BuildThemeStyle, Theme } from '../../Models/Theme/Theme';

const ProgressStep: React.FC<{
    prompt: string,
    progressThreshold: number,
    currentProgress: number,
    theme?: Theme,
}> = ({ prompt, progressThreshold, currentProgress, theme }) => {
    const iconWidth = '24px';
    const iconHeight = '24px';

    const ellipses = currentProgress >= progressThreshold ? '' : '...';

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
            }}>
                {(currentProgress >= progressThreshold) && <CheckIcon style={{ width: iconWidth, height: iconHeight }} />}
                <p style={{ marginLeft: '15px' }}>{prompt + ellipses}</p>
            </div>
        </>
    );
}

export default ProgressStep;
