import React from 'react';
import { warnForm } from '../components/Styles';

export default function WarningContainer() {
    return (
        <div style={warnForm}>
            <h1>You are not logged!</h1>
            <h2>To log in, you must visit this link: <a href='/login'>Login page</a></h2>
        </div>
    )
}