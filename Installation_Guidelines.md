# StarlingX R4.0 Virtual All-In-One Duplex Distributed Cloud Infrastructure Instaltion Guidlines

#Networking Info
Networks used in yaml configuration files. Can be altered.

Note: OAM and Management subnets must be routable between all networks and not overlap between locations.

#OAM

**Central**
Subnet: 10.10.10.0/24
GW: 10.10.10.1
Floating: 10.10.10.2
Node 0: 10.10.10.3/24
Node 1: 10.10.10.4/24

**Subcloud1**:
GW: 10.10.11.1
Floating: 10.10.11.5 (accidentally made this .5 but keeping it this way) Node 0: 10.10.11.6/24
Node 1: 10.10.11.7/24

**Subcloud2**:
GW: 10.10.12.1
Floating: 10.10.12.5 (accidentally made this .5 but keeping it this way) Node 0: 10.10.12.3/24
Node 1: 10.10.12.4/24


#Management

**Central**:
Subnet: 192.168.200.0/24
GW: 192.168.200.1
Start IP: 192.168.200.2
End IP: 192.168.200.50

**Subcloud1**:
Subnet: 192.168.201.0/24 
GW: 192.168.201.1
Start IP: 192.168.201.2
End IP: 192.168.201.50

**Subcloud2**:
Subnet: 192.168.202.0/24
GW: 192.168.202.1
Start IP: 192.168.202.2
End IP: 192.168.202.50


#Step 0: Prep Host(s)

**StarlingX Docs**:
[https://docs.starlingx.io/deploy_install_guides/r5_release/virtual/aio_duplex_environ.html](https://docs.starlingx.io/deploy_install_guides/r5_release/virtual/aio_duplex_environ.html)

#Ensure Host (or VM) has VT-D + VT-X / intel virtualization features enabled. This is required for KVM virtualization.

#Update OS:

```  
sudo apt-get update
```  

#Clone the StarlingX tools repository:
sudo apt-get install -y git cd $HOME
git clone https://opendev.org/starlingx/tools.git

#Install required packages:
cd $HOME/tools/deployment/libvirt/
bash install_packages.sh
sudo apt install -y apparmor-profiles sudo apt-get install -y ufw
sudo ufw disable


Configure virtual machines


#Set up the virtual platform networks for virtual deployment:
bash setup_network.sh
#Prepare virtual servers.

#Download bootimage.iso cd ~/
wget http://mirror.starlingx.cengn.ca/mirror/starlingx/release/latest_release/centos/flock/outputs/iso/bo otimage.iso
# MAKE SURE TO USE THE SAME BOOTIMAGE ON ALL INSTALLS. “latest” Release is not labeled, best to download the iso once and then manually copy it to each host.

#Create the XML definitions for the virtual servers required by this configuration option. This will 
create the XML virtual server definition for:   duplex-controller-0 , duplex-controller-1

cd ~/tools/deployment/libvirt/
bash setup_configuration.sh -c duplex -i ~/bootimage.iso


Step1: Central Cloud Install:

#Console to the first controller virsh console duplex-controller-0
#Hit esc to go back to previous menu (in the virtual console)
#Select second option (All-in-one)
#Select serial console

#Wait for install and vm reboot. Stay connected to the console.

#set your login credentials Login: sysadmin Password: sysadmin
Changing password for sysadmin. (current) UNIX Password: sysadmin New Password: mypass
(repeat) New Password: mypass

# Set global vars and configure external connectivity

export CONTROLLER0_OAM_CIDR=<OAM-Central Node 0 IP/Mask>
export DEFAULT_OAM_GATEWAY=<OAM-Central GW>
export INT=enp2s1

sudo ip address add $CONTROLLER0_OAM_CIDR dev $INT
sudo ip link set up dev $INT
sudo ip route add default via $DEFAULT_OAM_GATEWAY dev $INT
#Create the ansible config file. Edit commands below then paste the entire block. cd ~
cat << EOF > localhost.yml system_mode: duplex distributed_cloud_role: systemcontroller

dns_servers:
- 1.1.1.1
- 1.0.0.1

external_oam_subnet: <OAM Central Network/Mask> external_oam_gateway_address: <OAM Central GW IP> external_oam_floating_address: <OAM Central Floating IP> external_oam_node_0_address: <OAM Central Node 0 IP> external_oam_node_1_address: <OAM Central Node 1 IP> 
management_subnet: <Management Central Network/Mask> management_gateway_address: <Management Central GW IP> management_start_address: <Management Central Start IP> management_end_address: <Management Central End IP>

admin_username: admin admin_password: !4901Team ansible_become_pass: !4901Team EOF

#Run ansible playbook
ansible-playbook /usr/share/ansible/stx-ansible/playbooks/bootstrap.yml

#Wait for the ansible playbook to finish.


Configure Controller-0:

#Console to the first controller virsh console duplex-controller-0
# Commands from here onwards are entered inside the VM

source /etc/platform/openrc

OAM_IF=enp2s1
MGMT_IF=enp2s2
system host-if-modify controller-0 lo -c none
IFNET_UUIDS=$(system interface-network-list controller-0 | awk '{if ($6=="lo") print $4;}')
for UUID in $IFNET_UUIDS; do
system interface-network-remove ${UUID}
done
system host-if-modify controller-0 $OAM_IF -c platform system interface-network-assign controller-0 $OAM_IF oam system host-if-modify controller-0 $MGMT_IF -c platform system interface-network-assign controller-0 $MGMT_IF mgmt
system interface-network-assign controller-0 $MGMT_IF cluster-host system ntp-modify ntpservers=0.pool.ntp.org,1.pool.ntp.org
system storage-backend-add ceph --confirmed system host-disk-list controller-0
system host-disk-list controller-0 | awk '/\/dev\/sdb/{print $2}' | xargs -i system host-stor-add controller-0 {}
system host-stor-list controller-0 system host-unlock controller-0
# Exit controller 0


Configure Controller-1:

# From host, start second controller
# List all VMs with 
#         virsh list -all

virsh start duplex-controller-1

# Console to first controller
virsh console duplex-controller-0 source /etc/platform/openrc

# Set controller-1 role
system host-update 2 personality=controller

#Console to the second controller virsh console duplex-controller-1



#Configure controller-1 networking

OAM_IF=enp2s1
system host-if-modify controller-1 $OAM_IF -c platform system interface-network-assign controller-1 $OAM_IF oam system interface-network-assign controller-1 mgmt0 cluster-host



echo ">>> Add OSDs to primary tier" system host-disk-list controller-1
system host-disk-list controller-1 | awk '/\/dev\/sdb/{print $2}' | xargs -i system host-stor-add controller-1 {}
system host-stor-list controller-1

------------------------------------------------------------------------------------


Improve Central Cloud Usability


# Make StarlingX UI available from outside the central cloud host on port 8080.. sudo iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination
10.10.10.2:8080
sudo iptables -t nat -A POSTROUTING -j MASQUERADE

# Make K8s Dashboartd available from outside the central cloud host on port 30000. sudo iptables -t nat -A PREROUTING -p tcp --dport 30000 -j DNAT --to-destination
10.10.10.2:30000
sudo iptables -t nat -A POSTROUTING -j MASQUERADE

# Ensure Port Forwarding is persistent. sudo iptables-save >/etc/iptables/rules.v4 sudo ip6tables-save >/etc/iptables/rules.v6

#install k8s dashboard
cat <<EOF > dashboard-values.yaml 
service:$
type: NodePort nodePort: 30000

rbac:
create: true clusterAdminRole: true

serviceAccount:
create: true
name: kubernetes-dashboard
EOF

helm repo update
helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
helm install dashboard kubernetes-dashboard/kubernetes-dashboard -f dashboard-values.yaml

# get dashboard details
export NODE_PORT=$(kubectl get -n default -o jsonpath="{.spec.ports[0].nodePort}" services dashboard-kubernetes-dashboard)
export NODE_IP=$(kubectl get nodes -o jsonpath="{.items[0].status.addresses[0].address}")
echo https://$NODE_IP:$NODE_PORT/


Step 2: Install Subcloud(s)

# Repeat these steps for each subcloud, ensuring new network ranges are used each time.
# Complete Step 0 for each host before completing Step 2.



#Console to the first controller virsh console duplex-controller-0
#Hit esc to go back to previous menu (in the virtual console)
#Select second option (All-in-one)

#Select serial console

#Wait for install and vm reboot. Stay connected to the console.

#set your login credentials Login: sysadmin Password: sysadmin
Changing password for sysadmin. (current) UNIX Password: sysadmin New Password: mypass
(repeat) New Password: mypass



# Console into controller 0 
export CONTROLLER0_OAM_CIDR=<OAM-Subcloud Node 0 IP/Mask>
#NO MASK ON THE GATEWAY
export DEFAULT_OAM_GATEWAY=<OAM-Subcloud Gateway IP>

#OAM int usually enp2s1 export INT=<OAM int>

sudo ip address add $CONTROLLER0_OAM_CIDR dev $INT

sudo ip link set up dev $INT

sudo ip route add default via $DEFAULT_OAM_GATEWAY dev $INT

#Test outbound internet connection. Should be able to ping 8.8.8.8 from inside the controller.
ping 8.8.8.8

#please note, although it says management it actually means OAM (hence the 10 networks)

#start config management

sudo config_management

#localhost:~$ sudo config_management
#Enabling interfaces... DONE
#Waiting 120 seconds for LLDP neighbor discovery ........................ DONE
#Retrieving neighbor details... DONE

#Available interfaces:
#local interface      remote port
#---------------      -----------
#eth1000              unknown
#eth1001              unknown
#enp2s1               unknown
#enp2s2               unknown

#Enter management interface name: <OAM int>
#Enter management IP address in CIDR notation, ie. ip/prefix_length: <OAM Subcloud
FloatingIP> #(10.10.x.5) /24
#Enter management gateway IP address [10.10.x.1]:
#Enter System Controller subnet in CIDR notation: <OAM Subcloud subnet> /24
#Disabling non-management interfaces... DONE
#Configuring management interface... DONE
#RTNETLINK answers: File exists
#Adding route to System Controller... DONE

#Back on central controller cd ~
cat <<EOF > bootstrap-valuesx.yml system_mode: duplex
name: "subcloudx" 
description: "4901 Team" location: "YOW"

management_subnet: <Management Subcloud Network/Mask> management_gateway_address: <Management Subcloud GW IP> management_start_address: <Management Subcloud Start IP> management_end_address: <Management Subcloud End IP>

external_oam_subnet: <OAM Subcloud Network/Mask> external_oam_gateway_address: <OAM Subcloud GW IP> external_oam_floating_address: <OAM Subcloud Floating IP>

systemcontroller_gateway_address: <Management  Central   GW IP> EOF
#still on central controller
dcmanager subcloud add --bootstrap-address <OAM Subcloud Floating IP>  --bootstrap-values bootstrap-valuesx.yml

# dcmanager subcloud add --bootstrap-address 10.10.12.5  --bootstrap-values bootstrap-values2.yml

tail -f /var/log/dcmanager/ansible/subcloud2_playbook_output.log

#confirm the deploy status is complete dcmanager subcloud list
#show version
System show

On host 1
sudo ip route add 192.168.201.0 via 134.117.92.191

On host 2
sudo ip route add 192.168.200.0 via 134.117.92.162

Add 192.168.200.1 ip to stxbr2 on host 1


Configure Controller-0:
# Enter the kvm console virsh list
virsh console <id of controller 0>
# Commands from here onwards are entered inside the VM

source /etc/platform/openrc

OAM_IF=enp2s1
MGMT_IF=enp2s2 
#if host is unlocked, do system host-lock controller-0
system host-if-modify controller-0 lo -c none
IFNET_UUIDS=$(system interface-network-list controller-0 | awk '{if ($6=="lo") print $4;}')
for UUID in $IFNET_UUIDS; do
system interface-network-remove ${UUID}
done
system host-if-modify controller-0 $OAM_IF -c platform system interface-network-assign controller-0 $OAM_IF oam system host-if-modify controller-0 $MGMT_IF -c platform system interface-network-assign controller-0 $MGMT_IF mgmt
system interface-network-assign controller-0 $MGMT_IF cluster-host system ntp-modify ntpservers=0.pool.ntp.org,1.pool.ntp.org
system storage-backend-add ceph --confirmed system host-disk-list controller-0
system host-disk-list controller-0 | awk '/\/dev\/sdb/{print $2}' | xargs -i system host-stor-add controller-0 {}
system host-stor-list controller-0

system host-unlock controller-0
#wait until controller-0 gets unlocked
#use system host-list to check sleep 30; system host-list


Install software on controller-1 node
virsh start duplex-controller-1 virsh console duplex-controller-1
#you will see an instruction telling you to configure personality of the node
#exit controller-1 and console into controller-0 system host-update 2 personality=controller system host-list
#you will see controller-1, locked, disabled, and online
#wait 5-10 minutes for con-1 to reboot
#if this doesn’t work, remember to add the subcloud controller gateway IP to stxbr2 on the subcloud controller host
#on host: sudo ifconfig stxbr2 [subcloud gw ip (.1)] netmask 255.255.255.0 broadcast [subcloud gw broadcast (.255)]





Configure controller-1
#ON CONTROLLER-0
#configure OAM and MGMT ints for con-1
OAM_IF=enp2s1
system host-if-modify controller-1 $OAM_IF -c platform system interface-network-assign controller-1 $OAM_IF oam system interface-network-assign controller-1 mgmt0 cluster-host 

#add osd for ceph
echo ">>> Add OSDs to primary tier" system host-disk-list controller-1
system host-disk-list controller-1 | awk '/\/dev\/sdb/{print $2}' | xargs -i system host-stor-add controller-1 {}
system host-stor-list controller-1

#unlock con-1
system host-unlock controller-1


How To: Bootstrap Subcloud(s) from Central Cloud

# Run the commands on the active controller in the central cloud.
#For each HOST on the subcloud
system host-route-add 1 <Management int> <Management Subcloud Network>  <Management
Subcloud Network CIDR> <Management Central GW IP>

#example: system host-route-add 1 enp2s2 192.168.<central-controller-mgmt-subnet [200]>.0
24 192.168.subcloud-mgmt-subnet [200].1

dcmanager subcloud add --bootstrap-address <OAM Subcloud Floating IP>  --bootstrap-values
<bootstrap-values yaml file> [for example: bootstrap-values.yml]
