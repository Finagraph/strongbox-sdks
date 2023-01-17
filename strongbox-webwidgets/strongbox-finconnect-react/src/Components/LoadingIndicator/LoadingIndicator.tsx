import '../../styles.scss';

import * as React from 'react';
import { PropsWithChildren } from 'react';

import CircularProgress from '@mui/material/legacy/CircularProgress';

export enum OverlayType {
    None = 'none',
    Dark = 'dark',
    Light = 'light',
}

interface ILoadingIndicatorProps {
    active: boolean;
    overlayStyle?: React.CSSProperties;
    overlayText?: string;
    overlayTextClassName?: string;
    overlayType?: OverlayType;
    showSpinner?: boolean;
    size?: number;
    style?: React.CSSProperties;
    thickness?: number;
}

const LoadingIndicatorComponent: React.FC<ILoadingIndicatorProps & PropsWithChildren> = (props): React.ReactElement => {
    const {
        active,
        children,
        overlayStyle,
        overlayText,
        overlayTextClassName,
        overlayType,
        showSpinner,
        size,
        style,
        thickness

    } = props;

    const [className, setClassName] = React.useState<string>('loadingOverlay');

    React.useEffect(() => {
        let newClassName = 'finagraph-strongbox-loading-overlay';

        if (overlayType !== undefined) {
            if (overlayType === OverlayType.Light) {
                newClassName += ' light';
            } else if (overlayType === OverlayType.Dark) {
                newClassName += ' dark';
            }
        }

        setClassName(newClassName);
    }, [overlayType]);


    return (
        <div className={className} style={active ? overlayStyle : { display: 'none' }}>
            {!!overlayText && (
                <div className={overlayTextClassName || ''} style={{ marginBottom: 8 }}>
                    {overlayText}
                </div>
            )}
            {(showSpinner !== false) && <CircularProgress style={style} thickness={thickness || 6} size={size || 40} />}
            {children}
        </div>
    );
}

export default LoadingIndicatorComponent;
