import { createMuiTheme, Theme } from '@mui/material/styles';
import {
    strongboxPrimary,
    strongboxSecondary,
} from './Constants';

export function CreateStdTheme(): Theme {
    let primaryColor = strongboxPrimary;
    let secondaryColor = strongboxSecondary;

    return(createMuiTheme({
        palette: {
            primary: {
                main: primaryColor,
            },
            secondary: {
                main: secondaryColor,
            }
        }
    }));
}

export function CreateCustomTheme(primary: string, secondary: string): Theme {
    return (createMuiTheme({
        palette: {
            primary: {
                main: primary,
            },
            secondary: {
                main: secondary,
            }
        }
    }));
}
