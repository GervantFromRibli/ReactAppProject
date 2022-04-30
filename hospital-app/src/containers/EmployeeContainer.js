import React, { useState, useEffect } from 'react';

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

    useEffect(() => {
        async function getEmployees() {
            await getListOfEmployees();

            var role = await AuthService.getRole()
            setRole(role.role)
        }
        getEmployees();
    }, []);

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

    const SaveData = async () => {
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
        await getListOfEmployees()
    }

    const DeleteEmployee = async (id) => {
        await EmployeeService.delete(id)
        await getListOfEmployees()
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
            <h2 style={{marginLeft: 15, marginTop: 15}}>List of employees</h2>
            <form id="employeeForm" onSubmit={SaveData} style={{display: role == "Admin" ? 'initial' : 'none'}}>
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
                                    <label htmlFor="email">Email:</label>
                                    <input type={'email'} className="form-control" name='email' value={email} minLength={1} onChange={e => {setEmail(e.target.value)}}/>
                                </div>
                            </td>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="phone">Phone:</label>
                                    <input type={"text"} className="form-control" name='phone' value={phone} minLength={7} maxLength={30} onChange={e => {setPhone(e.target.value)}}/>
                                </div>
                            </td>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="address">Address:</label>
                                    <input type={"text"} className="form-control" name='address' value={address} minLength={1} maxLength={100} onChange={e => {setAddress(e.target.value)}}/>
                                </div>
                            </td>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="password">Password:</label>
                                    <input type={'password'} className="form-control" name='password' value={password} minLength={1} maxLength={8} onChange={e => {setPassword(e.target.value)}}/>
                                </div>
                            </td>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="roleSet">Role:</label>
                                    <select name="roleSet" onChange={e => { setEmployeeRole(e.target.value) }} value={employeeRole}>
                                        <option>Admin</option>
                                        <option>Doctor</option>
                                        <option>Reception</option>
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="departmentSet">Department Id:</label>
                                    <select name="departmentSet" onChange={e => { setDepartment(e.target.value) }} value={department}>
                                        {ids.map((element) =>
                                            <option key={element} value={element}>{element}</option>)
                                        }
                                    </select>
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