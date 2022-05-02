import React from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';

export function Layout(props) {
    return (
        <div>
            <NavMenu />
            <Container>
                {props.children}
            </Container>
            <Footer />
        </div>
    );
}
