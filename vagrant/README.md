# [Vagrant](http://vagrantup.com/)
starting a 4 nodes quorum chain using vagrant.

## Accounts
### Constellation Public Keys:
node1: `BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=`  
node2: `QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=`  
node3: `oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8=`  
node4: `R56gy4dn24YOjwyesTczYa8m5xhP6hF2uTMCju/1xkY=`  
node5: `UfNSeSGySeKg11DVNEnqrUtxYRVor4+CvluI8tVv62Y=`

### Ethereum Wallet Addresses:
node1: `0xed9d02e382b34818e88b88a309c7fe71e65f419d`    
node2: `0xca843569e3427144cead5e4d5999a3d0ccf92b8e`  
node3: `0x0fbdc686b912d7722dc86510934589e0aaf3b55a`  
node4: `0x9186eb3d20cbd1f5f992a950d808c4495153abd5`  
node5: `0x0638e1574728b6d862dd5d3a3e0942c3be47d996`

## Usage
### 0. 
Download and install vagrant from [here](https://www.vagrantup.com/).

### 1. 
Bring up the vm on your host machine.
```bash
cd /path/to/FP/vagrant
vagrant up
```

### 2. 
Setup quorum inside vm.
```bash
cd /path/to/FP/vagrant
vagraht ssh
cd /vagrant
./raft-init.sh
./raft-start.sh
```
