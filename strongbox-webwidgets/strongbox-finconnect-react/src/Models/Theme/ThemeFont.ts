import { ThemeStyleMap } from './Theme';

export type ThemeFont = {
    family?: string;
    size?: string;
    controlSize?: string;
    size_h1?: string;
    weight?: string;
    controlWeight?: string;
    weight_h1?: string;
    modalFamily?: string;
    modalTitleSize?: string;
    modalTitleWeight?: string;
    modalRegularSize?: string;
    modalRegularWeight?: string;
    modalSecuritySize?: string;
    modalSecurityWeight?: string;
}

export const defaultControlFontStyleMap: ThemeStyleMap =
{
    container: 'font',
    map: [
        { containerName: 'family', styleName: 'fontFamily' },
        { containerName: 'controlSize', styleName: 'fontSize' },
        { containerName: 'controlWeight', styleName: 'fontWeight' },
    ]
};

export const defaultFontStyleMap: ThemeStyleMap =
{
    container: 'font',
    map: [
        { containerName: 'family', styleName: 'fontFamily' },
        { containerName: 'size', styleName: 'fontSize' },
        { containerName: 'weight', styleName: 'fontWeight' },
    ]
};

export const defaultModalTitleFontStyleMap: ThemeStyleMap = {
    container: 'font',
    map: [
        { containerName: 'modalFamily', styleName: 'fontFamily' },
        { containerName: 'modalTitleSize', styleName: 'fontSize' },
        { containerName: 'modalTitleWeight', styleName: 'fontWeight' },
    ]
};

export const defaultModalRegularFontStyleMap: ThemeStyleMap = {
    container: 'font',
    map: [
        { containerName: 'modalFamily', styleName: 'fontFamily' },
        { containerName: 'modalRegularSize', styleName: 'fontSize' },
        { containerName: 'modalRegularWeight', styleName: 'fontWeight' },
    ]
};

export const defaultModalSecurityFontStyleMap: ThemeStyleMap = {
    container: 'font',
    map: [
        { containerName: 'modalFamily', styleName: 'fontFamily' },
        { containerName: 'modalSecuritySize', styleName: 'fontSize' },
        { containerName: 'modalSecurityWeight', styleName: 'fontWeight' },
    ]
};
