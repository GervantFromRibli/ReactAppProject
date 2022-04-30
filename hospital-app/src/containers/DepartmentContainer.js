import React, { useState, useEffect } from 'react';

import {DepartmentService, AuthService} from './../services';

export default function DepartmentContainer() {

    const [departments, setDepartments] = useState([]);
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('')

    useEffect(() => {
        async function getDepartments() {
            await getListOfDepartments();

            var role = await AuthService.getRole()
            setRole(role.role)
        }
        getDepartments();
    }, []);

    const getListOfDepartments = async () => {

        let data = await DepartmentService.get();

        setDepartments(data)
    };

    const ChangeDepartment = (department) => {
        setId(department.id)
        setName(department.name)
        setAddress(department.address)
    }

    const SaveData = async () => {
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
        await getListOfDepartments()
    }

    const DeleteDepartment = async (id) => {
        await DepartmentService.delete(id)
        await getListOfDepartments()
    }

    const reset = () =>{
        setId(0)
        setName('')
        setAddress('')
    }

    return (
        <div>
            <h2 style={{marginLeft: 15, marginTop: 15}}>List of departments</h2>
            <form id="departmentForm" onSubmit={SaveData} style={{display: role == "Admin" ? 'initial' : 'none'}}>
                <table border={0}>
                    <tbody>
                        <tr>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="name">Name:</label>
                                    <input type={"text"} className="form-control" name='name' value={name} minLength={1} maxLength={50} onChange={e => {setName(e.target.value)}}/>
                                </div>
                            </td>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="address">Address:</label>
                                    <input type={"text"} className="form-control" name='address' value={address} minLength={1} maxLength={100} onChange={e => {setAddress(e.target.value)}}/>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={{marginLeft: 15, marginTop: 15}}>
                    <button id="submit" className="btn btn-primary" type={'submit'}>Save</button>
                    <a id="reset" className="btn btn-primary" onClick={reset}>Reset</a>
                </div>
            </form>
            <table className="table table-condensed table-striped  col-md-6">
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