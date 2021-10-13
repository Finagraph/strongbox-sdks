import { ThemeStyleMap } from './Theme';

export type ThemeControls = {
    borderRadius?: string;
}

export const defaultControlStyleMap: ThemeStyleMap =
{
    container: 'controls',
    map: [
        { containerName: 'borderRadius', styleName: 'borderRadius' },
    ]
};
