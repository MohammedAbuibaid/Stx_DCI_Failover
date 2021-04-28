#!/usr/bin/python3.9

import subprocess
import os
from time import sleep

COMMAND_RETRIES=3
POLLING_FREQ = 10
COMMAND_TIMEOUT = 5

MANAGED_CLOUDS = [
	#{"name": "Central", "floating_ip": "10.10.10.2", "context": "central", "triggers": []},
	{"name": "Subcloud 1", "floating_ip": "10.10.11.5", "context": "subcloud1", "triggers": [
		{
			"name": "Temp-Mon Helm Chart", 
			"monitor_command": "helm --kube-context subcloud1 list | grep 'temp-mon'",
			"recover_command": "helm --kube-context subcloud1 install temp-mon 4901-Capstone2020/temp-mon", 
			"restore_command": "helm --kube-context central install temp-mon 4901-Capstone2020/temp-mon", 
		}
	]}
]

def call(command, timeout=5, retries = 1): # Run command and return T/F depending on status code 
	for _ in range(0, retries):
		if bool(subprocess.call(command, stdout=open(os.devnull, 'w'), stderr=subprocess.STDOUT, shell=True, timeout=timeout)):
			continue
		else:
			return True
		sleep(0.5)
	return False

while True:
	for node in MANAGED_CLOUDS:
		print(f"Checking {node['name']} for failures....")
		for trigger in node['triggers']:
			try:
				if not call(trigger['monitor_command'], COMMAND_TIMEOUT, COMMAND_RETRIES): # Trigger alert
					print(f"Service 'temp-mon' declared dead on Subcloud 1, attempting to reinstall...")
					if 'recover_command' in trigger and call(trigger['recover_command']):
						print("Successfully recovered service")
				else:
					print("No errors detected")
			
			except subprocess.TimeoutExpired: # If command timesout
				print(f"Node 'subcloud1' decalred dead, attempting to relocate workload 'temp-mon'")
				if 'restore_command' in trigger and call(trigger['restore_command']):
					print("Successfully restored service")
				else:
					print("Could not automatically recover, please do so manually")
	sleep(POLLING_FREQ)
