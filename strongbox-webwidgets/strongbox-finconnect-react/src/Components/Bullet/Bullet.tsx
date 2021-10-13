import * as React from 'react';

/**
 * className is the class of the div containing all the bullet stuff.
 * bulletClassName is the class name of the region containing the bullet itself containing background color and foreground color
 * */

type Props = {
    className: string;
    bulletClassName: string;
    bulletText: string;
};

export const Bullet: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div
            className={props.className}
        >
            <h2
                className={props.bulletClassName}
                style={{
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {props.bulletText}
            </h2>
        </div>
    );
}
