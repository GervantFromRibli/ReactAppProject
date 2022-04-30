import React from 'react';

export default function WarningContainer() {
    return (
        <div style={{top: '37%', left: '37%', position: 'absolute'}}>
            <h1>You are not logged!</h1>
            <h2>To log in, you must visit this link: <a href='/login'>Login page</a></h2>
        </div>
    )
}