import React, { useState, useEffect } from 'react';

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

    useEffect(() => {
        async function getAppointments() {
            await getListOfAppointments();

            var role = await AuthService.getRole()
            setRole(role.role)
        }
        getAppointments();
    }, []);

    useEffect(() => {
        async function getAppointments() {
            await getListOfAppointments();
        }
        getAppointments();
    }, [pageNumb])

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

    const SaveData = async () => {
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
        await getListOfAppointments()
    }

    const DeleteAppointment = async (id) => {
        let result = await AppointmentService.delete(id)
        if (result.success != undefined){
            setPage(1)
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
            <h2 style={{marginLeft: 15, marginTop: 15}}>List of departments</h2>
            <form id="appointmentForm" onSubmit={SaveData} style={{display: role != "Doctor" ? 'initial' : 'none'}}>
                <table border={0}>
                    <tbody>
                        <tr>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="date">Date:</label>
                                    <input type={'date'} className="form-control" name='date' value={date} onChange={e => {setDate(e.target.value)}}/>
                                </div>
                            </td>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="startTime">Start of appointment:</label>
                                    <input type={'time'} className="form-control" name='startTime' value={startTime} onChange={e => {setStartTime(e.target.value)}}/>
                                </div>
                            </td>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="endTime">End of appointment:</label>
                                    <input type={'time'} className="form-control" name='endTime' value={endTime} onChange={e => {setEndTime(e.target.value)}}/>
                                </div>
                            </td>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="customer">Customer id:</label>
                                    <select name="customer" onChange={e => { setCustomer(e.target.value) }} value={customer}>
                                        {customerIds.map((element) =>
                                            <option key={element} value={element}>{element}</option>)
                                        }
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div style={{marginLeft: 15}}>
                                    <label htmlFor="employeeSet">Employee Id:</label>
                                    <select name="employeeSet" onChange={e => { setEmployee(e.target.value) }} value={employee}>
                                        {employeeIds.map((element) =>
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
            <button onClick={_ => {setPage(pageNumb + 1)}} style={{display: isNotLastPage ? 'initial' : 'none' }}>Next</button>
            <button onClick={_ => {setPage(pageNumb - 1)}} style={{display: pageNumb > 1 ? 'initial' : 'none'}}>Previous</button>
        </div>
    )
}