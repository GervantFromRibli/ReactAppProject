import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { elementBaseStyle, tableBordRadius, inputRadius, mainDiv } from "./../components/Styles"

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
    const client = new W3CWebSocket("ws://localhost:3001/ws")
    const [wsUpdate, setWsUpdate] = useState(0)

    useEffect(() => {
        async function getCustomers() {
            await getListOfCustomers();

            var role = await AuthService.getRole()
            setRole(role.role)
        }
        getCustomers();

        setClient()
    }, []);

    useEffect(() => {
        async function getCustomers() {
            await getListOfCustomers();
        }
        getCustomers();
    }, [pageNumb, wsUpdate])

    const setClient = () => {
        client.onopen = () => {
            console.log("Open")
        }

        client.onmessage = (message) => {
            if (message.data.toString() == "UpdateCustomer"){
                setPage(1)
                setWsUpdate(Date.now())
            }
        }
    }

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

    const SaveData = async e => {
        e.preventDefault()
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
        
        client.send(JSON.stringify({
            message: "UpdateCustomer"
        }))
    }

    const DeleteCustomer = async (id) => {
        let result = await CustomerService.delete(id)
        if (result.success != undefined){
            client.send(JSON.stringify({
                message: "UpdateCustomer"
            }))
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
            <h2 style={elementBaseStyle}>List of customers</h2>
            <form id="customerForm" onSubmit={SaveData} style={{display: role == "Doctor" ? 'none' : 'initial'}}>
                <table border={1} style={{...tableBordRadius, ...elementBaseStyle}}>
                    <tbody>
                        <tr>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="name">Name:</label>
                                    <input type={"text"} style={inputRadius} name='name' value={name} minLength={1} maxLength={100} onChange={e => {setName(e.target.value)}}/>
                                </div>
                            </td>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="email">Email:</label>
                                    <input type={'email'} style={inputRadius} name='email' value={email} onChange={e => {setEmail(e.target.value)}}/>
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
                                    <input type={"text"} style={inputRadius} name='address' value={address} minLength={1} maxLength={50} onChange={e => {setAddress(e.target.value)}}/>
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
            <div style={elementBaseStyle}>
                <button onClick={_ => {setPage(pageNumb + 1)}} style={{display: isNotLastPage ? 'initial' : 'none' }}>Next</button>
                <button onClick={_ => {setPage(pageNumb - 1)}} style={{display: pageNumb > 1 ? 'initial' : 'none'}}>Previous</button>
            </div>
        </div>
    )
}