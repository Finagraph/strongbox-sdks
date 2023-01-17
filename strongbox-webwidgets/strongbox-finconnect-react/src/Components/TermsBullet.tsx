import * as React from 'react'

import '../styles.scss'

import CheckIcon from '@mui/icons-material/CheckCircleRounded';

export type TermsBulletProps = {
    title: string;
    description: string;
}

const TermsBullet: React.FC<TermsBulletProps> = (props: TermsBulletProps): React.ReactElement => {

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: '15px',
            }}
        >
            <CheckIcon
                color={'primary'}
                style={{
                    width: '32px',
                    height: '32px',
                }}
            />
            <div
                style={{
                    flexDirection: 'column',
                    alignItems: 'left',
                    marginLeft: '15px',
                }}
            >
                <span><strong>{props.title}</strong></span><br/>
                <span style={{
                    display: 'inline-block',
                    marginTop: '10px',
                }}>
                    {props.description}
                </span>
            </div>
        </div>
    );
}

export default TermsBullet;
