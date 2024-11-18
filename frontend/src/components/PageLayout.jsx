/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';

import { useIsAuthenticated } from '@azure/msal-react';
import { SignInButton } from './SignInButton';
import { SignOutButton } from './SignOutButton';

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();

    return (
        <>
            <Navbar bg="primary" variant="dark" className="navbarStyle">
                <Navbar.Brand href="/" className="ms-3">
                    Scheduling Application
                </Navbar.Brand>
                <div className="collapse navbar-collapse justify-content-end me-3">
                    {isAuthenticated ? <SignOutButton /> : <SignInButton />}
                </div>

            </Navbar>
            
            {props.children}
        </>
    );
};
