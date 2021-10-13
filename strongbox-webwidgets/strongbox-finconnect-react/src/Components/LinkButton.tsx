import * as React from 'react'
import '../styles.scss'

import { BuildThemeStyle, Theme } from '../Models/Theme/Theme';
import { defaultControlFontStyleMap } from '../Models/Theme/ThemeFont';
import { defaultControlStyleMap } from '../Models/Theme/ThemeControls';
import { defaultControlPaletteStyleMap } from '../Models/Theme/ThemePalette';

import { TextContent } from '../Text/TextContent';

export type LinkButtonProps = {
    disabled?: boolean;
    theme?: Theme;
    textContent: TextContent;
    onClick?: (event: React.MouseEvent) => void,
}

const LinkButton: React.FC<LinkButtonProps> = (props) => {
    let buttonStyle = BuildThemeStyle({}, defaultControlPaletteStyleMap, props.theme);
    buttonStyle = BuildThemeStyle(buttonStyle, defaultControlFontStyleMap, props.theme);
    buttonStyle = BuildThemeStyle(buttonStyle, defaultControlStyleMap, props.theme);

    return (
        <button
            disabled={!!props.disabled}
            style={buttonStyle}
            onClick={props.onClick}
        >
            {props.textContent.TextValue('LinkButtonText')}
        </button>
    );
}

export default LinkButton;
