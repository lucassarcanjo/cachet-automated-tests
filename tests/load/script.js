import { check, sleep, group } from "k6";
import { Httpx } from "https://jslib.k6.io/httpx/0.1.0/index.js";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

const env = JSON.parse(open("./env.json"));

// Stage configurations --------------------------------------------------------
export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 70 },
    { duration: "30s", target: 70 },
    { duration: "20s", target: 0 },
  ],
};

// Configure HTTP client -------------------------------------------------------
const session = new Httpx({
  baseURL: env.baseUrl,
  headers: {
    "Content-Type": "application/json",
    "X-Cachet-Token": env.token,
  },
  timeout: 20000,
});

// Main function ---------------------------------------------------------------
export default function () {
  group("Visitors", function () {
    const res = session.get("/");

    check(res, { "status was 200": (r) => r.status == 200 });
    sleep(1);
  });

  group("Admins", function () {
    const dashboardResponse = session.get("/dashboard");

    check(dashboardResponse, { "status was 200": (r) => r.status == 200 });
    sleep(1);

    // Create a new incident
    const incident = {
      name: randomString(8),
      message: randomString(32),
      status: 1,
      component_id: 1,
      component_status: 3,
    };

    const incidentResponse = session.post(
      "/api/v1/incidents",
      JSON.stringify(incident)
    );

    check(incidentResponse, { "status was 200": (r) => r.status == 200 });

    sleep(1);

    // Update the status of the incident
    const incidentUpdate = {
      status: 2,
    };

    const incidentUpdateResponse = session.put(
      `/api/v1/incidents/${incidentResponse.json("data.id")}`,
      JSON.stringify(incidentUpdate)
    );

    check(incidentUpdateResponse, {
      "status was 200": (r) => r.status == 200,
    });
  });
}
