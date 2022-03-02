import * as React from 'react'
import '../styles.scss'

import { Theme } from '../Models/Theme/Theme';

import { TextContent } from '../Text/TextContent';
import LoadingIndicator from './LoadingIndicator/LoadingIndicator';
import ProgressStep from './ProgressStep/ProgressStep';

export type WorkingStepProps = {
    theme?: Theme;
    children?: JSX.Element;
    textContent: TextContent;
    content: string;
}

const WorkingStep: React.FC<WorkingStepProps> = (props: WorkingStepProps): React.ReactElement => {
    return (
        <>
            {!props.children && (
                <div style={{ position: 'relative', marginTop: '15px'}}>
                    <LoadingIndicator active={true} />
                    <div style={{ marginTop: '100px', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                        <ProgressStep
                            prompt={props.content}
                            progressThreshold={0}
                            currentProgress={0}
                            theme={props.theme}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default WorkingStep;
