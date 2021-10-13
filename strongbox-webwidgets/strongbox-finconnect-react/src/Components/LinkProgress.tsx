import * as React from 'react'
import '../styles.scss'

import { BuildThemeStyle, Theme } from '../Models/Theme/Theme';
import ProgressBar from './Progress/ProgressBar';
import ProgressStep from './ProgressStep/ProgressStep';

import { TextContent } from '../Text/TextContent';

export type LinkProgressProps = {
    theme?: Theme;
    onProgressComplete: () => void;
    children?: JSX.Element;
    onLinkPctgChange?: (pctComplete: number) => void;
    linkPctgComplete: number;
    textContent: TextContent;
}

const LinkProgress: React.FC<LinkProgressProps> = (props: LinkProgressProps): React.ReactElement => {
    let progressStyle = BuildThemeStyle(
        {},
        {
            container: 'palette',
            map: [
                { containerName: 'controlBackground', styleName: 'backgroundColor' },
                { containerName: 'controlForeground', styleName: 'color' }
            ]
        },
        props.theme
    );
    progressStyle = BuildThemeStyle(progressStyle, { container: 'controls', map: [{ containerName: 'borderRadius', styleName: 'borderRadius' }] }, props.theme);

    const _progressCounterSeconds = 10;
    const _progressCounterTickInterval = 200;  // milliseconds
    // _totalProgressTicks is just the number of ticks that are required to get to the 
    // number of seconds the progress bar is set to run for based on the tick interval.
    const _totalProgressTicks = (1000 / _progressCounterTickInterval) * _progressCounterSeconds;

    const [progressCounter, setProgressCounter] = React.useState<number>(0);
    const [progressIntervalId, setProgressIntervalId] = React.useState<number>(-1);

    const ProgressPercentage = (count: number): number => {
        return (count / _totalProgressTicks) * 100;
    }

    function HandleProgressTick(): void {
        let newValue = 0;

        setProgressCounter(previousValue => { newValue = previousValue + 1; return newValue; });
        props.onLinkPctgChange && props.onLinkPctgChange(ProgressPercentage(newValue));
    }

    const StopCounter = (): void => {
        (progressIntervalId !== -1) && clearInterval(progressIntervalId);
        setProgressIntervalId(-1);
    }

    React.useEffect(() => {
        if (progressCounter >= _totalProgressTicks) {
            StopCounter();
            props.onProgressComplete();
        }
    }, [progressCounter]);

    React.useEffect(() => {
        if (progressIntervalId === -1) {
            const id = window.setInterval(HandleProgressTick, _progressCounterTickInterval);
            setProgressIntervalId(id);
            return () => { StopCounter(); }
        } else {
            return () => { }
        }
    }, [])

    return (
        <>
            <ProgressBar style={{ marginTop: '40px' }} value={progressCounter} maxValue={_totalProgressTicks} theme={props.theme} />
            {!props.children && (
                <div style={{ marginTop: '15px' }}>
                    <ProgressStep
                        prompt={props.textContent.TextValue('EstablishingSecureConnection')}
                        progressThreshold={25}
                        currentProgress={props.linkPctgComplete}
                        theme={props.theme}
                    />
                    <ProgressStep
                        prompt={props.textContent.TextValue('GatheringRequiredInformation')}
                        progressThreshold={75}
                        currentProgress={props.linkPctgComplete}
                        theme={props.theme}
                    />
                    <ProgressStep
                        prompt={props.textContent.TextValue('DeliveringToYourAccountMgr')}
                        progressThreshold={95}
                        currentProgress={props.linkPctgComplete}
                        theme={props.theme}
                    />
                </div>
            )}
        </>
    );
}

export default LinkProgress;
