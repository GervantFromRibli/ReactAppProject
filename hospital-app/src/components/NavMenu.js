import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { AuthService } from "./../services";
import { headerStyle, childDiv, firstChild, parentDiv, linkStyle } from './Styles';

export function NavMenu() {

    const [currentUser, setCurrentUser] = useState('');
    const [isRender, setIsRender] = useState(true)

    useEffect(() => {
        async function GetUser() {
            let user = await AuthService.getRole();
            setCurrentUser(user.name);
        }
        GetUser();
        
        if (window.location.href.includes("/login")){
            setIsRender(false)
        }
    }, []);

    const ReturnToLogin = () => {
        window.location.assign("http://localhost:3000/login");
    }

    if (isRender){
        return (
            <header style={headerStyle}>
                <nav>
                    <Container>
                        <div style={parentDiv}>
                            <div style={{...childDiv, ...firstChild}}>
                                <a onClick={ReturnToLogin}>{currentUser}</a>
                            </div>
                            <div style={childDiv}>
                                <a href="/" style={linkStyle}>Appointment` Catalog</a>
                            </div>
                            <div style={childDiv}>
                                <a href="/customer" style={linkStyle}>Customers` Catalog</a>
                            </div>
                            <div style={childDiv}>
                                <a href="/department" style={linkStyle}>Departments` Catalog</a>
                            </div>
                            <div style={childDiv}>
                                <a href="/employee" style={linkStyle}>Employees` Catalog</a>
                            </div>
                        </div>
                    </Container>
                </nav>
            </header>
        );
    }
    else{
        return;
    }
}
