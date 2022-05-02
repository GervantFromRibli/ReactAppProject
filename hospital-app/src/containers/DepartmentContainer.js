import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { elementBaseStyle, tableBordRadius, inputRadius, mainDiv } from "./../components/Styles"

import {DepartmentService, AuthService} from './../services';

export default function DepartmentContainer() {

    const [departments, setDepartments] = useState([]);
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('')
    const client = new W3CWebSocket("ws://localhost:3001/ws")
    const [wsUpdate, setWsUpdate] = useState(0)

    useEffect(() => {
        async function getDepartments() {
            await getListOfDepartments();

            var role = await AuthService.getRole()
            setRole(role.role)
        }
        getDepartments();

        setClient()
    }, []);

    useEffect(() => {
        async function getDepartments() {
            await getListOfDepartments();
        }
        getDepartments();
    }, [wsUpdate]);

    const getListOfDepartments = async () => {

        let data = await DepartmentService.get();

        setDepartments(data)
    };

    const setClient = () => {
        client.onopen = () => {
            console.log("Open")
        }

        client.onmessage = (message) => {
            if (message.data.toString() == "UpdateDepartment"){
                setWsUpdate(Date.now())
            }
        }
    }

    const ChangeDepartment = (department) => {
        setId(department.id)
        setName(department.name)
        setAddress(department.address)
    }

    const SaveData = async e => {
        e.preventDefault()
        if (id == 0){
            let department = {
                name: name,
                address: address
            }

            let data = {
                department: department
            }

            await DepartmentService.post(data)
        }
        else {
            let department = {
                id: id,
                name: name,
                address: address
            }

            let data = {
                department: department
            }

            await DepartmentService.put(id, data)
        }

        client.send(JSON.stringify({
            message: "UpdateDepartment"
        }))
    }

    const DeleteDepartment = async (id) => {
        await DepartmentService.delete(id)
        client.send(JSON.stringify({
            message: "UpdateDepartment"
        }))
    }

    const reset = () =>{
        setId(0)
        setName('')
        setAddress('')
    }

    return (
        <div>
            <h2 style={elementBaseStyle}>List of departments</h2>
            <form id="departmentForm" onSubmit={SaveData} style={{display: role == "Admin" ? 'initial' : 'none'}}>
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
                                    <label htmlFor="address">Address:</label>
                                    <input type={"text"} style={inputRadius} name='address' value={address} minLength={1} maxLength={100} onChange={e => {setAddress(e.target.value)}}/>
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
                        <th>Address</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map((department, index) =>
                        <tr key={index * 10000}>
                            <td key={index}>
                                {department.id}
                            </td>
                            <td key={index + 1}>
                                {department.name}
                            </td>
                            <td key={index + 2}>
                                {department.address}
                            </td>
                            <td key={index + 5}>
                                <button onClick={_ => {ChangeDepartment(department)}} style={{display: role != "Admin" ? 'none' : 'initial'}}>Change department</button>
                                <button onClick={_ => {DeleteDepartment(department.id)}} style={{display: role != "Admin" ? 'none' : 'initial'}}>Delete department</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}