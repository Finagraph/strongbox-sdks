import './StrongboxModal.scss';

import * as React from 'react';
import { PropsWithChildren } from 'react';

import { Styles } from 'react-modal';
import ReactModal from 'react-modal';

import { Theme } from '../../Models/Theme/Theme';

interface IStrongboxModalProps {
    className?: string;
    closeOnEscape?: boolean;
    closeOnOverlayClick: boolean;
    containerClassName?: string;
    onClose?: () => void;
    theme?: Theme;
    type?: 'full' | 'simple';
}

type Props = IStrongboxModalProps;

export class StrongboxModal extends React.Component<Props & PropsWithChildren> {
    public static defaultProps = {
        containerClassName: '',
        closeOnEscape: true,
        type: 'full',
    };

    private static _modalStyles: Styles = {
        overlay: {
            backgroundColor: 'rgba(0,0,0,.3)',
            // if this value is updated, update corresponding modal z-index
            zIndex: 11,
        },
        content: {
            overflow: 'hidden',
            outline: 'none',
        },
    };

    private GetModalStyle(): Styles {
        let result = StrongboxModal._modalStyles;

        const { theme } = this.props;

        if (!(theme && theme.palette)) {
            return result;
        }

        if (theme.palette.modalBackground) {
            result.content.background = theme.palette.modalBackground;
        }

        return result;
    }

    public render() {
        const { children, className, closeOnEscape, closeOnOverlayClick, onClose } = this.props;

        return (
            <ReactModal
                shouldCloseOnOverlayClick={closeOnOverlayClick}
                className={`finagraph-strongbox-modal ${className}`}
                isOpen={true}
                onRequestClose={onClose}
                shouldCloseOnEsc={closeOnEscape}
                style={this.GetModalStyle()}
                appElement={document.getElementById('root')}
            >
                {children}
            </ReactModal>
        );
    }
}

export default StrongboxModal;
