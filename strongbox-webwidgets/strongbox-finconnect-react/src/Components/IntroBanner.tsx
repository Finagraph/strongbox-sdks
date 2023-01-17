import * as React from 'react'
import '../styles.scss'

import { BuildThemeStyle, Theme } from '../Models/Theme/Theme';
import { defaultControlStyleMap } from '../Models/Theme/ThemeControls';
import { TextContent } from '../Text/TextContent';

import { generalWindowBackground, paragraphText } from '../Models/Theme/Colors';

import ContractIcon from '@mui/icons-material/ExpandLessRounded';

export type IntroBannerProps = {
    theme?: Theme;
    textContent: TextContent;
    authWindowActive: boolean;
    abort?: () => void;
}

const IntroBanner: React.FC<IntroBannerProps> = (props: IntroBannerProps): React.ReactElement => {
    const headerStyle = BuildThemeStyle(
        {},
        {
            container: 'font',
            map: [
                { containerName: 'size_h1', styleName: 'fontSize' },
                { containerName: 'weight_h1', styleName: 'fontWeight' }
            ]
        },
        props.theme
    );
    let buttonStyle = BuildThemeStyle({ border: 'none', color: paragraphText },
        {
            container: 'palette',
            map: [
                { containerName: 'windowBackground', styleName: 'backgroundColor' }
            ]
        },
        props.theme
    );
    if (!(buttonStyle.backgroundColor)) {
        buttonStyle.backgroundColor = generalWindowBackground;
    }
    buttonStyle = BuildThemeStyle(buttonStyle, defaultControlStyleMap, props.theme);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
        }}>
            <h1 style={headerStyle}>{props.textContent.TextValue('SecurelySubmitPrompt')}</h1>
            <button
                style={{
                    ...buttonStyle,
                    height: '40px',
                    padding: '8px 8px 12px 8px',
                }}
                disabled={props.authWindowActive}
                onClick={props.abort}
            >
                <ContractIcon />
            </button>
        </div>
    );
}

export default IntroBanner;
