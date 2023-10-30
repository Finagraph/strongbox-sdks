import * as React from 'react';
import { PropsWithChildren } from 'react';

import './StrongboxModal.scss';

import { StrongboxModal } from './StrongboxModal';
import { BuildThemeStyle, Theme } from '../../Models/Theme/Theme';
import { defaultModalTitleFontStyleMap } from '../../Models/Theme/ThemeFont';

interface ISimpleModalProps {
    actions?: JSX.Element[];
    cancelButtonClassName?: string;
    submitButtonClassName?: string;
    className?: string;
    contentClassName: string;
    actionsClassName?: string;
    closeOnOverlayClick: boolean;
    disableActions?: boolean;
    onCancel?: () => void;
    onCancelLabel?: string;
    onClose?: () => void;
    onComplete?: () => void;
    onCompleteLabel?: string;
    theme?: Theme;
    title?: string;
}

export const SimpleModal: React.FC<ISimpleModalProps & PropsWithChildren> = (props): React.ReactElement => {
    let titleStyle = BuildThemeStyle(
        {},
        {
            container: 'palette',
            map: [
                { containerName: 'modalTitle', styleName: 'color' }
            ]
        },
        props.theme
    );
    titleStyle = BuildThemeStyle(titleStyle, defaultModalTitleFontStyleMap, props.theme);

    /*
            {(props.title || props.onClose) && (
                <header className={`simple-modal__header`}>
                    {props.title && (
                        <h1 style={titleStyle} className={'simple-modal__title'}>{props.title}</h1>
                    )}
                    {(props.onCancel || props.onClose) && (
                        <i className={'material-icons finagraph-strongbox-modal__close'} onClick={props.onCancel || props.onClose}>close</i>
                    )}
                </header>
            )}
            <div className={`simple-modal__content ${props.contentClassName} custom-scroll`}>
                {props.children}
            </div>
            {(props.onCancel || props.onComplete || props.actions) && (
                <div className={props.actionsClassName ? props.actionsClassName : 'finagraph-strongbox-modal__actions'}>
                    {props.onCancel && (
                        <button
                            className={props.cancelButtonClassName}
                            disabled={props.disableActions}
                            onClick={props.onCancel}
                        >
                            {props.onCancelLabel}
                        </button>
                    )}
                    {props.actions}
                    {props.onComplete && (
                        <button
                            className={props.submitButtonClassName}
                            disabled={props.disableActions}
                            onClick={props.onComplete}
                        >
                            {props.onCompleteLabel}
                        </button>
                    )}
                </div>
            )}

            onClose={props.onClose}
            type={'simple'}
            className={props.className}
            theme={props.theme}
     */

    return (
        <StrongboxModal
            closeOnOverlayClick={props.closeOnOverlayClick}
            onClose={props.onClose}
            type={'simple'}
            className={props.className}
            theme={props.theme}
        >
            {(props.title || props.onClose) && (
                <header className={`simple-modal__header`}>
                    {props.title && (
                        <h1 style={titleStyle} className={'simple-modal__title'}>{props.title}</h1>
                    )}
                    {(props.onCancel || props.onClose) && (
                        <button
                            tabIndex={1}
                            onClick={props.onCancel || props.onClose}
                            className={'finagraph-strongbox-modal__close'}
                            name={'cancel'}
                        >
                            <i
                                className={'material-icons'}
                            >
                                close
                            </i>
                        </button>
                    )}
                </header>
            )}
            <div className={`simple-modal__content ${props.contentClassName} custom-scroll`}>
                {props.children}
            </div>
            {(props.onCancel || props.onComplete || props.actions) && (
                <div className={props.actionsClassName ? props.actionsClassName : 'finagraph-strongbox-modal__actions'}>
                    {props.onCancel && (
                        <button
                            className={props.cancelButtonClassName}
                            disabled={props.disableActions}
                            onClick={props.onCancel}
                            tabIndex={2}
                        >
                            {props.onCancelLabel}
                        </button>
                    )}
                    {props.actions}
                    {props.onComplete && (
                        <button
                            className={props.submitButtonClassName}
                            disabled={props.disableActions}
                            onClick={props.onComplete}
                            tabIndex={3}
                        >
                            {props.onCompleteLabel}
                        </button>
                    )}
                </div>
            )}
        </StrongboxModal>
    )
};

SimpleModal.defaultProps = {
    className: '',
    contentClassName: '',
    disableActions: false,
    onCancelLabel: 'Cancel',
    onCompleteLabel: 'Done',
};

export default SimpleModal;
