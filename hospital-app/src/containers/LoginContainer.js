import React, { useState } from 'react';

import {AuthService} from './../services';

export default function LoginContainer() {

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const login = async (e) => {
        e.preventDefault();
        var loginData = {
            username,
            password
        }

        var token = await AuthService.login(loginData);
        alert(token.response)
        if (token === null){
            alert("No such user");
        }
        else {
            AuthService.setCookie("Token", token.response)
            window.location.assign("http://localhost:3000/")
        }
    }

    return (
        <form onSubmit={login}>
            <div className="text-center">
                <h2>Login form</h2>
                <hr />
                <div id="username">
                    <label className="control-label">User`s name`: </label><br />
                    <input id="userName" name="userName" value={username} onChange={e => { setUserName(e.target.value) }} />
                </div>
                <div id="password">
                    <label className="control-label">Password: </label><br />
                    <input id="passWord" name="passWord" value={password} onChange={e => { setPassword(e.target.value) }} />
                </div>
                <hr />
                <div>
                    <input type={'submit'} value="Log in" id="acceptData" />
                </div>
            </div>
        </form>
    )
}