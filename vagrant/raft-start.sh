#!/bin/bash
set -u
set -e

QDATA=$HOME/qdata

mkdir -p $QDATA/logs
echo "[*] Starting Constellation nodes"
#!/bin/bash
set -u
set -e
QDATA=$HOME/qdata
for i in {1..5}
do
    DDIR="$QDATA/c$i"
    mkdir -p $DDIR
    mkdir -p $QDATA/logs
    cp "keys/tm$i.pub" "$DDIR/tm.pub"
    cp "keys/tm$i.key" "$DDIR/tm.key"
    rm -f "$DDIR/tm.ipc"
    constellation-node --url=https://127.0.0.$i:900$i/ --port=900$i --workdir=$DDIR --socket=tm.ipc --publickeys=tm.pub --privatekeys=tm.key --othernodes=https://127.0.0.1:9001/ >> "$QDATA/logs/constellation$i.log" 2>&1 &
done

PENDING=true
while $PENDING; do
    sleep 0.1
    PENDING=false
    for i in {1..5}
    do
        if [ ! -S "$QDATA/c$i/tm.ipc" ]; then
                PENDING=true
        fi
    done
done

echo "[*] Starting Ethereum nodes"
ARGS="--unlock 0 --password password.txt --raft --rpc --rpcaddr 0.0.0.0 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum --emitcheckpoints"
for i in {1..5}
do
    rm -f $QDATA/dd$i/geth.ipc
    PRIVATE_CONFIG=$QDATA/c$i/tm.ipc nohup geth --datadir $QDATA/dd$i $ARGS --raftport 5040$i --rpcport 2200$i --port 2100$i 2>>$QDATA/logs/$i.log &
done

PENDING=true
while $PENDING; do
    sleep 0.1
    PENDING=false
    for i in {1..5}
    do
        if [ ! -S "$QDATA/dd$i/geth.ipc" ]; then
            PENDING=true
        fi
    done
done

echo
echo "All nodes configured. See '$QDATA/logs' for logs, and run e.g. 'geth attach $QDATA/dd1/geth.ipc' to attach to the first Geth node."
