import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { elementBaseStyle, tableBordRadius, inputRadius, mainDiv } from "./../components/Styles"

import {EmployeeService, AuthService} from './../services';

export default function EmployeeContainer() {

    const [employees, setEmployees] = useState([]);
    const [ids, setIds] = useState([]);
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [employeeRole, setEmployeeRole] = useState('Doctor');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState(0);
    const [role, setRole] = useState('');
    const client = new W3CWebSocket("ws://localhost:3001/ws")
    const [wsUpdate, setWsUpdate] = useState(0)

    useEffect(() => {
        async function getEmployees() {
            await getListOfEmployees();

            var role = await AuthService.getRole()
            setRole(role.role)
        }
        getEmployees();

        setClient()
    }, []);

    useEffect(() => {
        async function getEmployees() {
            await getListOfEmployees();
        }
        getEmployees();
    }, [wsUpdate]);

    const setClient = () => {
        client.onopen = () => {
            console.log("Open")
        }

        client.onmessage = (message) => {
            if (message.data.toString() == "UpdateEmployee"){
                setWsUpdate(Date.now())
            }
        }
    }

    const getListOfEmployees = async () => {

        let data = await EmployeeService.get();

        setEmployees(data.employees)
        setIds(data.ids)
        setDepartment(data.ids[0])
    };

    const ChangeEmployee = (employee) => {
        setId(employee.id)
        setName(employee.name)
        setAddress(employee.address)
        setEmail(employee.email)
        setPhone(employee.phone)
        setEmployeeRole(employee.role)
        setPassword(employee.password)
        setDepartment(employee.department)
    }

    const SaveData = async e => {
        e.preventDefault()
        if (id == 0){
            let employee = {
                name: name,
                email: email,
                phone: phone,
                address: address,
                role: employeeRole,
                password: password,
                department: department
            }

            let data = {
                employee: employee
            }

            await EmployeeService.post(data)
        }
        else {
            let employee = {
                id: id,
                name: name,
                email: email,
                phone: phone,
                address: address,
                role: employeeRole,
                password: password,
                department: department
            }

            let data = {
                employee: employee
            }

            await EmployeeService.put(id, data)
        }
        
        client.send(JSON.stringify({
            message: "UpdateEmployee"
        }))
    }

    const DeleteEmployee = async (id) => {
        await EmployeeService.delete(id)
        client.send(JSON.stringify({
            message: "UpdateEmployee"
        }))
    }

    const reset = () =>{
        setId(0)
        setName('')
        setEmail('')
        setPhone('')
        setAddress('')
        setEmployeeRole('Doctor')
        setPassword('')
        setDepartment(ids[0])
    }

    return (
        <div>
            <h2 style={elementBaseStyle}>List of employees</h2>
            <form id="employeeForm" onSubmit={SaveData} style={{display: role == "Admin" ? 'initial' : 'none'}}>
                <table border={1} style={{...tableBordRadius, ...elementBaseStyle}}>
                    <tbody>
                        <tr>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="name">Name:</label>
                                    <input type={"text"} style={inputRadius} name='name' value={name} minLength={1} maxLength={50} onChange={e => {setName(e.target.value)}}/>
                                </div>
                            </td>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="email">Email:</label>
                                    <input type={'email'} style={inputRadius} name='email' value={email} minLength={1} onChange={e => {setEmail(e.target.value)}}/>
                                </div>
                            </td>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="phone">Phone:</label>
                                    <input type={"text"} style={inputRadius} name='phone' value={phone} minLength={7} maxLength={30} onChange={e => {setPhone(e.target.value)}}/>
                                </div>
                            </td>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="address">Address:</label>
                                    <input type={"text"} style={inputRadius} name='address' value={address} minLength={1} maxLength={100} onChange={e => {setAddress(e.target.value)}}/>
                                </div>
                            </td>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="password">Password:</label>
                                    <input type={'password'} style={inputRadius} name='password' value={password} minLength={1} maxLength={8} onChange={e => {setPassword(e.target.value)}}/>
                                </div>
                            </td>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="roleSet">Role:</label>
                                    <select name="roleSet" style={inputRadius} onChange={e => { setEmployeeRole(e.target.value) }} value={employeeRole}>
                                        <option>Admin</option>
                                        <option>Doctor</option>
                                        <option>Reception</option>
                                    </select>
                                </div>
                            </td>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="departmentSet">Department Id:</label>
                                    <select name="departmentSet" style={inputRadius} onChange={e => { setDepartment(e.target.value) }} value={department}>
                                        {ids.map((element) =>
                                            <option key={element} value={element}>{element}</option>)
                                        }
                                    </select>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={elementBaseStyle}>
                    <button id="submit" type={'submit'}>Save</button>
                    <button id="reset" onClick={reset}>Reset</button>
                </div>
            </form>
            <table border={1} style={elementBaseStyle}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Password</th>
                        <th>Role</th>
                        <th>Department id</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) =>
                        <tr key={index * 10000}>
                            <td key={index}>
                                {employee.id}
                            </td>
                            <td key={index + 1}>
                                {employee.name}
                            </td>
                            <td key={index + 2}>
                                {employee.email}
                            </td>
                            <td key={index + 3}>
                                {employee.phone}
                            </td>
                            <td key={index + 4}>
                                {employee.address}
                            </td>
                            <td key={index + 5}>
                                <input type={role == "Admin" ? "text" : "password"} readOnly='readonly' value={employee.password}/>
                            </td>
                            <td key={index + 6}>
                                {employee.role}
                            </td>
                            <td key={index + 7}>
                                {employee.department}
                            </td>
                            <td key={index + 8}>
                                <button onClick={_ => {ChangeEmployee(employee)}} style={{display: role != "Admin" ? 'none' : 'initial'}}>Change employee</button>
                                <button onClick={_ => {DeleteEmployee(employee.id)}} style={{display: role != "Admin" ? 'none' : 'initial'}}>Delete emloyee</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}