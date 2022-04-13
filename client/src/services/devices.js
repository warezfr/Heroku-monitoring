import http from "../http-common";

class DevicesDataService {
    get(data) {
        return http.post("companies/records", data);
    }

    getHistorial(data) {
        return http.post("devices/records", data);
    }
}

export default new DevicesDataService();