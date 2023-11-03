import { Counter } from "k6/metrics";
import http from "k6/http";

let ErrorrefreshToken = new Counter("errors_refreshToken");

export let options = {
    stages: [
        // Load Testing
        { duration: '1m', target: 50 },  // Load system with 50 users for 1 minute

        // Stress Testing
        { duration: '5m', target: 1000 },  // Stress the system with 1000 users for 5 minutes

        // Soak Testing
        { duration: '1h', target: 100 },  // Soak test with 100 users for 1 hour

        // Spike Testing
        { duration: '1m', target: 100 },  // Spike with 100 users for 1 minute
        { duration: '1m', target: 10 },   // Suddenly decrease to 10 users for 1 minute

        // Breakpoint Testing
        { duration: '5m', target: 10 },   // Start with 10 users
        { duration: '5m', target: 50 },   // Gradually increase to 50 users
    ],
};

export default function () {
    let response = http.get('https://reqres.in/api/users/2');
    
    // Verifikasi status kode HTTP 200 (OK)
    check(response, {
        'HTTP status is 200': (r) => r.status === 200,
    });

    // Periksa apakah permintaan refreshToken mengalami kesalahan
    if (response.status !== 200) {
        ErrorrefreshToken.add(1);
    }
  
    sleep(1);
}
