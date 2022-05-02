import React, { useState, useEffect } from 'react';
import { footerStyle, divStyle } from './Styles';

export function Footer() {

    const [isRender, setIsRender] = useState(true)

    useEffect(() => {
        if (window.location.href.includes("/login")){
            setIsRender(false)
        }
    }, []);

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