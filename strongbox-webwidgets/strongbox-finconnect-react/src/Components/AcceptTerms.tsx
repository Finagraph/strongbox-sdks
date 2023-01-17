import * as React from 'react'

import '../styles.scss'

import { BuildThemeStyle, Theme } from '../Models/Theme/Theme';
import { TextContent } from '../Text/TextContent';
import { defaultControlStyleMap } from '../Models/Theme/ThemeControls';
import { defaultControlPaletteStyleMap } from '../Models/Theme/ThemePalette';

import { ThemeProvider } from '@mui/material/styles';

import { CreateCustomTheme } from '../Utils/Style';
import { sbxCheckboxPrimary, sbxCheckboxSecondary, termsOfUseUrl } from '../Utils/Constants';

import IntroBanner from './IntroBanner';
import TermsBullet from './TermsBullet';

import sbxVectorLogo from '../Images/Finagraph_Strongbox_Logo_Vertical.svg';

export type AcceptTermsProps = {
    abort?: () => void;
    onTermsAccepted: () => void;
    partnerName: string;
    theme?: Theme;
    textContent: TextContent;
}

type WindowText = {
    description1PreSbx: string;
    description1PostSbx: string;
    description2: string;
    description2Href: string;
    bullet1Title: string;
    bullet1Description: string;
    bullet2Title: string;
    bullet2Description: string;
    bullet3Title: string;
    bullet3Description: string;
    continue: string;
}

const AcceptTerms: React.FC<AcceptTermsProps> = (props: AcceptTermsProps): React.ReactElement => {
    let buttonStyle = BuildThemeStyle(
        { marginTop: '30px' },
        defaultControlPaletteStyleMap,
        props.theme
    );
    buttonStyle = BuildThemeStyle(buttonStyle, defaultControlStyleMap, props.theme);

    const sbxCheckButtonTheme = CreateCustomTheme(sbxCheckboxPrimary, sbxCheckboxSecondary);

    const [windowText] = React.useState<WindowText>({
        description1PreSbx:
            props.textContent.TextValueWithReplacement(
                'TermsDescriptionParagraph1PreSBX',
                {
                    placeHolder: '${partnerName}',
                    replacement: props.partnerName,
                },
            ),
        description1PostSbx: props.textContent.TextValue('TermsDescriptionParagraph1PostSBX'),
        description2: props.textContent.TextValue('TermsDescriptionParagraph2'),
        description2Href: props.textContent.TextValue('TermsDescriptionParagraph2Href'),
        bullet1Title: props.textContent.TextValue('TermsBullet1Title'),
        bullet1Description: props.textContent.TextValue('TermsBullet1Description'),
        bullet2Title: props.textContent.TextValue('TermsBullet2Title'),
        bullet2Description:
            props.textContent.TextValueWithReplacement(
                'TermsBullet2Description',
                {
                    placeHolder: '${partnerName}',
                    replacement: props.partnerName,
                },
            ),
        bullet3Title: props.textContent.TextValue('TermsBullet3Title'),
        bullet3Description: props.textContent.TextValue('TermsBullet3Description'),
        continue: props.textContent.TextValue('Continue'),
    });

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
                <img
                    style={{
                        marginTop: '15px',
                        width: '64px',
                        height: '64px'
                    }}
                    src={sbxVectorLogo}
                />
                <p
                    style={{
                        marginTop: '25px',
                    }}
                >
                    {windowText.description1PreSbx}<strong> Strongbox </strong>{windowText.description1PostSbx}
                </p>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                        paddingTop: '10px',
                    }}
                >
                    <ThemeProvider theme={sbxCheckButtonTheme}>
                        <TermsBullet
                            title={windowText.bullet1Title}
                            description={windowText.bullet1Description}
                        />
                        <TermsBullet
                            title={windowText.bullet2Title}
                            description={windowText.bullet2Description}
                        />
                        <TermsBullet
                            title={windowText.bullet3Title}
                            description={windowText.bullet3Description}
                        />
                    </ThemeProvider>
                </div>
                <p
                    style={{
                        marginTop: '25px',
                    }}
                >
                    {windowText.description2} <a href={ termsOfUseUrl } target="_blank">{windowText.description2Href}</a>
                </p>
                <button
                    style={buttonStyle}
                    onClick={props.onTermsAccepted}
                >
                    {windowText.continue}
                </button>
            </div>
         </div>
    );
}

export default AcceptTerms;
