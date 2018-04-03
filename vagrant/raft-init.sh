#!/bin/bash
set -u
set -e

QDATA=$HOME/qdata

echo "[*] Cleaning up temporary data directories"
rm -rf $QDATA
mkdir -p $QDATA/logs

echo "[*] Configuring node 1"
mkdir -p $QDATA/dd1/{keystore,geth}
cp raft/static-nodes.json $QDATA/dd1
cp keys/key1 $QDATA/dd1/keystore
cp raft/nodekey1 $QDATA/dd1/geth/nodekey
geth --datadir $QDATA/dd1 init genesis.json

echo "[*] Configuring node 2"
mkdir -p $QDATA/dd2/{keystore,geth}
cp raft/static-nodes.json $QDATA/dd2
cp keys/key2 $QDATA/dd2/keystore
cp raft/nodekey2 $QDATA/dd2/geth/nodekey
geth --datadir $QDATA/dd2 init genesis.json

echo "[*] Configuring node 3"
mkdir -p $QDATA/dd3/{keystore,geth}
cp raft/static-nodes.json $QDATA/dd3
cp keys/key3 $QDATA/dd3/keystore
cp raft/nodekey3 $QDATA/dd3/geth/nodekey
geth --datadir $QDATA/dd3 init genesis.json

echo "[*] Configuring node 4"
mkdir -p $QDATA/dd4/{keystore,geth}
cp raft/static-nodes.json $QDATA/dd4
cp keys/key4 $QDATA/dd4/keystore
cp raft/nodekey4 $QDATA/dd4/geth/nodekey
geth --datadir $QDATA/dd4 init genesis.json

echo "[*] Configuring node 5"
mkdir -p $QDATA/dd5/{keystore,geth}
cp raft/static-nodes.json $QDATA/dd5
cp keys/key5 $QDATA/dd5/keystore
cp raft/nodekey5 $QDATA/dd5/geth/nodekey
geth --datadir $QDATA/dd5 init genesis.json
