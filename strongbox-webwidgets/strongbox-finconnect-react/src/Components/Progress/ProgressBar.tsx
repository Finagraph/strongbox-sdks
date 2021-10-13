import * as React from 'react'
import '../../styles.scss'

import { BuildThemeStyle, Theme } from '../../Models/Theme/Theme';

const ProgressBar: React.FC<{
    value: number,
    maxValue: number,
    theme?: Theme,
    style?: any,
}> = ({ value, maxValue, theme, style }) => {
    let progressContainer = BuildThemeStyle(
        { ...style },
        {
            container: 'palette',
            map: [
                { containerName: 'controlBackground', styleName: 'backgroundColor' },
            ]
        },
        theme
    );
    progressContainer = BuildThemeStyle(progressContainer, { container: 'controls', map: [{ containerName: 'borderRadius', styleName: 'borderRadius' }] }, theme);

    let progressBar = BuildThemeStyle(
        {
            width: `${(value / maxValue) * 100}%`,
        },
        {
            container: 'palette',
            map: [
                { containerName: 'progressBarForeground', styleName: 'backgroundColor' },
            ]
        },
        theme
    );
    progressBar = BuildThemeStyle(progressBar, { container: 'controls', map: [{ containerName: 'borderRadius', styleName: 'borderRadius' }] }, theme);

    return (
        <>
            <div style={progressContainer} className={'finagraph-strongbox-progress-div'}>
                <div style={progressBar} />
            </div>
        </>
    );
}

export default ProgressBar;
