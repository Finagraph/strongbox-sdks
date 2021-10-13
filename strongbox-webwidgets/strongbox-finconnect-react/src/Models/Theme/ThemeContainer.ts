import { ThemeStyleMap } from './Theme';

export type ThemeContainer = {
    paddingLeft?: string;
    paddingTop?: string;
    paddingBottom?: string;
    paddingRight?: string;
    height?: string;
    width?: string;
}

export const defaultContainerStyleMap: ThemeStyleMap =
{
    container: 'container',
    map: [
        { containerName: 'paddingLeft', styleName: 'paddingLeft' },
        { containerName: 'paddingTop', styleName: 'paddingTop' },
        { containerName: 'paddingRight', styleName: 'paddingRight' },
        { containerName: 'paddingBottom', styleName: 'paddingBottom' },
        { containerName: 'height', styleName: 'height' },
        { containerName: 'width', styleName: 'width' },
    ]
};
