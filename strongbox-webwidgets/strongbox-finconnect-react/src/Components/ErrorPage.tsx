import * as React from 'react'

import '../styles.scss'

import { BuildThemeStyle, Theme } from '../Models/Theme/Theme';
import { TextContent } from '../Text/TextContent';
import { defaultControlStyleMap } from '../Models/Theme/ThemeControls';
import { defaultControlPaletteStyleMap } from '../Models/Theme/ThemePalette';

import IntroBanner from './IntroBanner';

export type ErrorState = {
    msg: string;
    detailedMsg: string;
}

export type ErrorPageProps = {
    onDismiss: () => void;
    theme?: Theme;
    textContent: TextContent;
    errorText: string[];
    abort?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = (props: ErrorPageProps): React.ReactElement => {
    let buttonStyle = BuildThemeStyle(
        { marginTop: '30px' },
        defaultControlPaletteStyleMap,
        props.theme
    );
    buttonStyle = BuildThemeStyle(buttonStyle, defaultControlStyleMap, props.theme);

    const [dismissText, setDismissText] = React.useState<string>('');

    React.useEffect(() => {
        setDismissText(props.textContent.TextValue('Dismiss'));
    }, []);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
        }}>
            <IntroBanner
                theme={props.theme}
                textContent={props.textContent}
                authWindowActive={false}
                abort={props.abort}
            />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {
                    props.errorText.map(p => {
                        return (
                            <p>{p}</p>
                        );
                    })
                }
                <button
                    style={buttonStyle}
                    onClick={props.onDismiss}
                >
                    {dismissText}
                </button>
            </div>
        </div>
    );
}

export default ErrorPage;
