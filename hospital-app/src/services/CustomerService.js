import { AuthService } from "./";
import configData from "./../config.json";

class CustomerService {
    async put(id, data) {
        let requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + AuthService.getCookie('Token')
            },
            body: JSON.stringify(data),
        };

        return await fetch(`${configData.DjangoCustomerAPI}/` + id, requestOptions)
            .then(response => {
            if (response.status == 403) {
                window.location.assign("http://localhost:3000/login");
            }
            else {
                return response.json();
            }
        });
    }

    async get(page) {
        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + AuthService.getCookie('Token')
            },
        };

        return await fetch(`${configData.DjangoCustomerAPI}/` + page, requestOptions).then(response => {
            if (response.status == 403) {
                window.location.assign("http://localhost:3000/login");
            }
            else {
                return response.json();
            }
        });
    }

    async post(data) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + AuthService.getCookie('Token')

            },
            body: JSON.stringify(data),
        };
        return await fetch(`${configData.DjangoCustomerAPI}/`, requestOptions).then(response => {
            if (response.status == 403) {
                window.location.assign("http://localhost:3000/login");
            }
            else {
                return response.json();
            }
        });
    }

    async delete(id) {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + AuthService.getCookie('Token')

            },
        };
        return await fetch(`${configData.DjangoCustomerAPI}/` + id, requestOptions).then(response => {
            if (response.status == 403) {
                window.location.assign("http://localhost:3000/login");
            }
            else {
                return response.json();
            }
        });
    }
}

export default new CustomerService();