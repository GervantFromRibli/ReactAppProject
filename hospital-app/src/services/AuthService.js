import configData from "./../config.json";
import Cookies from 'universal-cookie';

class AuthService {
    async getRole() {
        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        return await fetch(`${configData.DjangoLoginAPI}/` + this.getCookie('Token'), requestOptions)
            .then(response => {
                if (response.status == 403) {
                    window.location.replace("http://localhost:3000/login");
                }
                else {
                    return response.json();
                }
            });
    }

    async login(data){
        let requestOptions = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        return await fetch(`${configData.DjangoLoginAPI}/`, requestOptions)
            .then(response => {
            if (response.status == 403) {
                return null;
            }
            else {
                return response.json()
            }
        });
    }

    getCookie(name) {
        const cookies = new Cookies();
        var cookie = cookies.get(name);
        return cookie;
    }

    setCookie(name, value){
        console.log(name)
        const cookies = new Cookies();
        cookies.set(name, value);
    }
}

export default new AuthService();