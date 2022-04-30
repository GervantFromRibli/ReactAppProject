import React, { useState, useEffect } from 'react';

import {CustomerService, AuthService} from './../services';

export default function CustomerContainer() {

    const [Customers, setCustomers] = useState([]);
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [pageNumb, setPage] = useState(1);
    const [isNotLastPage, setIsNotLastPage] = useState(true)
    const [role, setRole] = useState('')

    useEffect(() => {
        async function getCustomers() {
            await getListOfCustomers();

            var role = await AuthService.getRole()
            setRole(role.role)
        }
        getCustomers();
    }, []);

    useEffect(() => {
        async function getCustomers() {
            await getListOfCustomers();
        }
        getCustomers();
    }, [pageNumb])

    const getListOfCustomers = async () => {

        let data = await CustomerService.get(pageNumb);

        setCustomers(data.customers)
        setIsNotLastPage(data.isNotLastPage)
    };

    const ChangeCustomer = (customer) => {
        setId(customer.id)
        setName(customer.name)
        setEmail(customer.email)
        setPhone(customer.phone)
        setAddress(customer.address)
    }

    const SaveData = async () => {
        if (id == 0){
            let customer = {
                name: name,
                email: email,
                phone: phone,
                address: address
            }

            let data = {
                customer: customer
            }

            await CustomerService.post(data)
        }
        else {
            let customer = {
                id: id,
                name: name,
                email: email,
                phone: phone,
                address: address
            }

            let data = {
                customer: customer
            }

            await CustomerService.put(id, data)
        }
        await getListOfCustomers()
    }

    const DeleteCustomer = async (id) => {
        let result = await CustomerService.delete(id)
        if (result.success != undefined){
            setPage(1)
        }
    }

    const reset = () =>{
        setId(0)
        setName('')
        setEmail('')
        setPhone('')
        setAddress('')
    }

    return (
        <div>
            <h2 style={{marginLeft: 15, marginTop: 15}}>List of customers</h2>
            <form id="customerForm" onSubmit={SaveData} style={{display: role == "Doctor" ? 'none' : 'initial'}}>
                <table border={0}>
                    <tbody>
                        <tr>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="name">Name:</label>
                                    <input type={"text"} className="form-control" name='name' value={name} minLength={1} maxLength={100} onChange={e => {setName(e.target.value)}}/>
                                </div>
                            </td>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="email">Name:</label>
                                    <input type={'email'} className="form-control" name='email' value={email} onChange={e => {setEmail(e.target.value)}}/>
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
                                    <input type={"text"} className="form-control" name='address' value={address} minLength={1} maxLength={50} onChange={e => {setAddress(e.target.value)}}/>
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
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Customers.map((customer, index) =>
                        <tr key={index * 10000}>
                            <td key={index}>
                                {customer.id}
                            </td>
                            <td key={index + 1}>
                                {customer.name}
                            </td>
                            <td key={index + 2}>
                                {customer.email}
                            </td>
                            <td key={index + 3}>
                                {customer.phone}
                            </td>
                            <td key={index + 4}>
                                {customer.address}
                            </td>
                            <td key={index + 5}>
                                <button onClick={_ => {ChangeCustomer(customer)}} style={{display: role == "Doctor" ? 'none' : 'initial'}}>Change customer</button>
                                <button onClick={_ => {DeleteCustomer(customer.id)}} style={{display: role == "Doctor" ? 'none' : 'initial'}}>Delete customer</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button onClick={_ => {setPage(pageNumb + 1)}} style={{display: isNotLastPage ? 'initial' : 'none' }}>Next</button>
            <button onClick={_ => {setPage(pageNumb - 1)}} style={{display: pageNumb > 1 ? 'initial' : 'none'}}>Previous</button>
        </div>
    )
}