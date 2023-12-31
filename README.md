# Edge Workloads Monitoring and Failover: a StarlingX-Based Testbed Implementation and Measurement Study

This repository contains the implementation and experimental data related to our paper published in IEEE Access, titled "Edge Workloads Monitoring and Failover: a StarlingX-Based Testbed Implementation and Measurement Study."

## Overview
Our paper addresses the challenges of maintaining High Availability (HA) in Edge Clouds, focusing on a testbed implementation using StarlingX. We propose a dynamic failover functionality for Edge workloads and present an experimental optimization of this functionality in a microservice-architected IoT application.

## Key Findings
- The introduction of a dynamic failover functionality that centrally monitors Edge workloads, aiding in the recovery from deployment or Edge node failures.
- Experimental results showing the relationship between recovery time, Edge resources, network speed, and statistics collection timeout.
- The modular implementation of the proposed failover functionality to supplement the StarlingX fault management service.

## Repository Contents
This repo contains the codes to produce the following artifacts associated with the research paper, ***Edge Cloud Workloads Monitoring and Failover: A Testbed  Implementation and Measurement Study***: 

1. [Installation guidelines](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/blob/master/Installation_Guidelines.md) to implement a three-tier distributed Cloud infrastructure. 

2. A micro-service architected IoT application developed to collect readings from Raspberry Pi-controlled temperature sensors. The application contains the following services
  a. [Database service (TempMonDB)](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/TempMonDB) to store the tempreture readings.
  b. [Backend Webserver (TempMonSensor)](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/TempMonSensor) to collect the tempreture readings from the sensors.
  c. [Frontend UI (TempMonWeb)](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/TempMonWeb) to display temperature readings from the database service.

2. Helm charts ([temp-mon-db-helm](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/temp-mon-db-helm), [temp-mon-sensor-helm](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/temp-mon-sensor-helm), and [temp-mon-web-helm](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/temp-mon-web-helm)) to deploy the above-mentioned microservices on the distributed Cloud infrastructure.\
Note: This [temp-mon-helm](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/tree/master/temp-mon) all-in-one helo chart can be used to deploy the application.

3. A polling-based [monitoring and failover functionality](https://github.com/MohammedAbuibaid/Stx_DCI_Failover/blob/master/monitor.py) to recover from edge workload and/or node failures.


## Citation
If you use our work in your research, please cite:

```bibtex
@ARTICLE{9881497,
  author={Abuibaid, Mohammed and Ghorab, Amir Hossein and Seguin-Mcpeake, Aidan and Yuen, Owen and Yungblut, Thomas and St-Hilaire, Marc},
  journal={IEEE Access}, 
  title={Edge Workloads Monitoring and Failover: a StarlingX-Based Testbed Implementation and Measurement Study}, 
  year={2022},
  volume={10},
  pages={97101-97116},
  doi={10.1109/ACCESS.2022.3204976}
}
```
