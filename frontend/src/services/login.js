import http from "../http-common";

class LoginDataService {
    get(data) {
        return http.get("/username",data);
    }
}

export default new LoginDataService();