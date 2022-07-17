Last update on 2022 Jan 04\

This repo contains the codes to produce the following artifacts associated with the research paper, ***Edge Cloud Workloads Monitoring and Failover: A Testbed  Implementation and Measurement Study***: 

1. [Installation guidelines](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/blob/master/Installation_Guidelines.md) to implement a three-tier distributed Cloud infrastructure. 

2. A micro-service architected IoT application developed to collect readings from Raspberry Pi-controlled temperature sensors. The application contains the following services
  a. [Database service (TempMonDB)](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/TempMonDB) to store the tempreture readings.
  b. [Backend Webserver (TempMonSensor)](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/TempMonSensor) to collect the tempreture readings from the sensors.
  c. [Frontend UI (TempMonWeb)](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/TempMonWeb) to display temperature readings from the database service.

2. Helm charts ([temp-mon-db-helm](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/temp-mon-db-helm), [temp-mon-sensor-helm](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/temp-mon-sensor-helm), and [temp-mon-web-helm](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/temp-mon-web-helm)) to deploy the above-mentioned microservices on the distributed Cloud infrastructure.\
Note: This [temp-mon-helm](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/temp-mon) all-in-one helo chart can be used to deploy the application.

3. A polling-based [monitoring and failover functionality](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/blob/master/monitor.py) to recover from edge workload and/or node failures.

# Contact Info
If you have any question about this repo, please feel free to drop me an email at mohammedaa.abuibaid@carleton.ca
