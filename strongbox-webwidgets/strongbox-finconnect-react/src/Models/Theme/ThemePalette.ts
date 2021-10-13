import { ThemeStyleMap } from './Theme';

export type ThemePalette = {
    windowBackground?: string;
    borrowerInteractionBackground?: string;
    controlBackground?: string;
    controlForeground?: string;
    progressBarForeground?: string;
    modalBackground?: string;
    modalText?: string;
    modalTitle?: string;
}

export const defaultControlPaletteStyleMap: ThemeStyleMap = {
    container: 'palette',
    map: [
        { containerName: 'controlForeground', styleName: 'color' },
        { containerName: 'controlBackground', styleName: 'backgroundColor' }
    ],
};

