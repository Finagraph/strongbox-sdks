import { ThemePalette } from './ThemePalette';
import { ThemeFont } from './ThemeFont';
import { ThemeContainer } from './ThemeContainer';
import { ThemeControls } from './ThemeControls';

export type Theme = {
    palette?: ThemePalette;
    font?: ThemeFont;
    container?: ThemeContainer;
    controls?: ThemeControls;
}

type ThemeElementMap = {
    containerName: string;
    styleName: string;
}

export type ThemeStyleMap = {
    container: 'palette' | 'font' | 'container' | 'controls';
    map: ThemeElementMap[];
}

export function BuildThemeStyle(startStyle: any, map: ThemeStyleMap, theme: Theme | undefined): any {
    if (!theme) {
        return startStyle;
    }
    const container = theme[map.container];
    if (!container) {
        return startStyle;
    }
    const newStyle = startStyle;

    map.map.forEach(elementMap => {
        container[elementMap.containerName] && (newStyle[elementMap.styleName] = container[elementMap.containerName]);
    });

    return newStyle;
}