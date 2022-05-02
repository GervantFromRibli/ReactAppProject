import { AuthService } from "./";
import configData from "./../config.json";

class DepartmentService {
    async put(id, data) {
        let requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + AuthService.getCookie('Token')
            },
            body: JSON.stringify(data),
        };

        return await fetch(`${configData.DjangoDepartmentAPI}/` + id, requestOptions)
            .then(response => {
            if (response.status == 403) {
                window.location.assign("http://localhost:3000/login");
            }
            else {
                return response.json();
            }
        });
    }

    async get() {
        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + AuthService.getCookie('Token')
            },
        };

        return await fetch(`${configData.DjangoDepartmentAPI}/`, requestOptions).then(response => {
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
        return await fetch(`${configData.DjangoDepartmentAPI}/`, requestOptions).then(response => {
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
        return await fetch(`${configData.DjangoDepartmentAPI}/` + id, requestOptions).then(response => {
            if (response.status == 403) {
                window.location.assign("http://localhost:3000/login");
            }
            else {
                return response.json();
            }
        });
    }
}

export default new DepartmentService();