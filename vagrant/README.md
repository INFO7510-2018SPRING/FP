# [Vagrant](http://vagrantup.com/)
starting a 4 nodes quorum chain using vagrant.

## 0. 
Download and install vagrant from [here](https://www.vagrantup.com/).

## 1. 
Bring up the vm on your host machine.
```bash
cd /path/to/FP/vagrant
vagrant up
```

## 2. 
Setup quorum inside vm.
```bash
cd /path/to/FP/vagrant
vagraht ssh
cd /vagrant
./raft-init.sh
./raft-start.sh
```
