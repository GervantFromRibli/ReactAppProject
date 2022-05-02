import React, { useState, useEffect } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { AuthService } from "./../services";

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

    const RenderLinks = () => {
        return (
            <ul>
                <NavItem>
                    <NavLink tag={Link} to="/">Appointment` Catalog</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link}to="/customer">Customers` Catalog</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to="/department">Departments` Catalog</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to="/employee">Employees` Catalog</NavLink>
                </NavItem>
            </ul>);
    }

    if (isRender){
        return (
            <header>
                <Navbar className="box-shadow" light>
                    <Container>
                        <NavbarBrand onClick={ReturnToLogin}>{currentUser}</NavbarBrand>
                        <Collapse navbar>
                            <RenderLinks />
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
    else{
        return;
    }
}
