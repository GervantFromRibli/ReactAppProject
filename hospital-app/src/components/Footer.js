import React, { useState, useEffect } from 'react';

export function Footer() {

    const [isRender, setIsRender] = useState(true)

    useEffect(() => {
        if (window.location.href.includes("/login")){
            setIsRender(false)
        }
    }, []);

    const footerStyle = {
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        height: '2.5rem'
    }

    const divStyle = {
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
    }

    if (isRender){
        return (
            <footer style={footerStyle}>
                <div style={divStyle}>
                    Copyright@ 2022
                </div>
            </footer>
        );
    }
    else{
        return;
    }
}