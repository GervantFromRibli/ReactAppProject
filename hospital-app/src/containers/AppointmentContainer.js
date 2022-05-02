import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { elementBaseStyle, tableBordRadius, inputRadius, mainDiv } from "./../components/Styles"

import {AppointmentService, AuthService} from './../services';

export default function AppointmentContainer() {

    const [appointments, setAppointments] = useState([]);
    const [employeeIds, setEmployeeIds] = useState([]);
    const [customerIds, setCustomerIds] = useState([]);
    const [id, setId] = useState(0);
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState((new Date()).toLocaleTimeString());
    const [endTime, setEndTime] = useState((new Date()).toLocaleTimeString());
    const [employee, setEmployee] = useState(0);
    const [customer, setCustomer] = useState(0);
    const [role, setRole] = useState('');
    const [pageNumb, setPage] = useState(1);
    const [isNotLastPage, setIsNotLastPage] = useState(true)
    const client = new W3CWebSocket("ws://localhost:3001/ws")
    const [wsUpdate, setWsUpdate] = useState(0)

    useEffect(() => {
        async function getAppointments() {
            await getListOfAppointments();

            var role = await AuthService.getRole()
            setRole(role.role)
        }
        getAppointments();

        setClient()
    }, []);

    useEffect(() => {
        async function getAppointments() {
            await getListOfAppointments();
        }
        getAppointments();

    }, [pageNumb, wsUpdate])

    const setClient = () => {
        client.onopen = () => {
            console.log("Open")
        }

        client.onmessage = (message) => {
            if (message.data.toString() == "UpdateAppointment"){
                setPage(1)
                setWsUpdate(Date.now())
            }
        }
    }

    const getListOfAppointments = async () => {

        let data = await AppointmentService.get(pageNumb);

        setAppointments(data.appointments)
        setEmployeeIds(data.employeeIds)
        setCustomerIds(data.customerIds)
        setEmployee(data.employeeIds[0])
        setCustomer(data.customerIds[0])
        setIsNotLastPage(data.isNotLastPage)
    };

    const ChangeAppointment = (appointment) => {
        setId(appointment.id)
        setDate(appointment.date)
        setStartTime(appointment.startTime)
        setEndTime(appointment.endTime)
        setEmployee(appointment.employee)
        setCustomer(appointment.customer)
    }

    const SaveData = async e => {
        e.preventDefault();
        if (id == 0){
            let appointment = {
                date: date,
                startTime: startTime,
                endTime: endTime,
                employee: employee,
                customer: customer
            }

            let data = {
                appointment: appointment
            }

            await AppointmentService.post(data)
        }
        else {
            let appointment = {
                id: id,
                date: date,
                startTime: startTime,
                endTime: endTime,
                employee: employee,
                customer: customer
            }

            let data = {
                appointment: appointment
            }

            await AppointmentService.put(id, data)
        }

        client.send(JSON.stringify({
            message: "UpdateAppointment"
        }))
    }

    const DeleteAppointment = async (id) => {
        let result = await AppointmentService.delete(id)
        if (result.success != undefined){
            client.send(JSON.stringify({
                message: "UpdateAppointment"
            }))
        }
    }

    const reset = () =>{
        setId(0)
        setDate(new Date())
        setStartTime((new Date()).toLocaleTimeString())
        setEndTime((new Date()).toLocaleTimeString())
        setEmployee(employeeIds[0])
        setCustomer(customerIds[0])
    }

    return (
        <div>
            <h2 style={elementBaseStyle}>List of departments</h2>
            <form id="appointmentForm" onSubmit={SaveData} style={{display: role != "Doctor" ? 'initial' : 'none'}}>
                <table border={1} style={{...tableBordRadius, ...elementBaseStyle}}>
                    <tbody>
                        <tr>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="date">Date:</label>
                                    <input type={'date'} style={inputRadius} name='date' value={date} onChange={e => {setDate(e.target.value)}}/>
                                </div>
                            </td>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="startTime">Start of appointment:</label>
                                    <input type={'time'} style={inputRadius} name='startTime' value={startTime} onChange={e => {setStartTime(e.target.value)}}/>
                                </div>
                            </td>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="endTime">End of appointment:</label>
                                    <input type={'time'} style={inputRadius} name='endTime' value={endTime} onChange={e => {setEndTime(e.target.value)}}/>
                                </div>
                            </td>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="customer">Customer id:</label>
                                    <select name="customer" style={inputRadius} onChange={e => { setCustomer(e.target.value) }} value={customer}>
                                        {customerIds.map((element) =>
                                            <option key={element} value={element}>{element}</option>)
                                        }
                                    </select>
                                </div>
                            </td>
                            <td style={tableBordRadius}>
                                <div style={mainDiv}>
                                    <label htmlFor="employeeSet">Employee Id:</label>
                                    <select name="employeeSet" style={inputRadius} onChange={e => { setEmployee(e.target.value) }} value={employee}>
                                        {employeeIds.map((element) =>
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
                        <th>Date</th>
                        <th>Start of appointment</th>
                        <th>End of appointment</th>
                        <th>Employee id</th>
                        <th>Customer id</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment, index) =>
                        <tr key={index * 10000}>
                            <td key={index}>
                                {appointment.id}
                            </td>
                            <td key={index + 1}>
                                {appointment.date}
                            </td>
                            <td key={index + 2}>
                                {appointment.startTime}
                            </td>
                            <td key={index + 3}>
                                {appointment.endTime}
                            </td>
                            <td key={index + 4}>
                                {appointment.employee}
                            </td>
                            <td key={index + 5}>
                                {appointment.customer}
                            </td>
                            <td key={index + 6}>
                                <button onClick={_ => {ChangeAppointment(appointment)}} style={{display: role == "Doctor" ? 'none' : 'initial'}}>Change appointment</button>
                                <button onClick={_ => {DeleteAppointment(appointment.id)}} style={{display: role == "Doctor" ? 'none' : 'initial'}}>Delete appointment</button>
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