import '../../styles.scss';

import * as React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

enum OverlayType {
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

export class LoadingIndicator extends React.Component<ILoadingIndicatorProps> {
    public static OverlayType = OverlayType;
    public static defaultProps = {
        active: false,
        size: 40,
        thickness: 6,
        overlayTextClassName: '',
        overlayType: OverlayType.None,
        showSpinner: true,
    };

    public render() {
        const {
            active,
            overlayStyle,
            overlayType,
            overlayTextClassName,
            showSpinner,
            size,
            thickness,
        } = this.props;

        let className = 'finagraph-strongbox-loading-overlay';
        if (overlayType === OverlayType.Light) {
            className += ' light';
        } else if (overlayType === OverlayType.Dark) {
            className += ' dark';
        }

        return (
            <div className={className} style={active ? overlayStyle : { display: 'none' }}>
                {!!this.props.overlayText && (
                    <div className={overlayTextClassName} style={{ marginBottom: 8 }}>
                        {this.props.overlayText}
                    </div>
                )}
                {showSpinner && <CircularProgress thickness={thickness} size={size} />}
                {this.props.children}
            </div>
        );
    }
}

export default LoadingIndicator;
