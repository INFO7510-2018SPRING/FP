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
    CMD="constellation-node --url=https://127.0.0.$i:900$i/ --port=900$i --workdir=$DDIR --socket=tm.ipc --publickeys=tm.pub --privatekeys=tm.key --othernodes=https://127.0.0.1:9001/"
    echo "$CMD >> $QDATA/logs/constellation$i.log 2>&1 &"
    $CMD >> "$QDATA/logs/constellation$i.log" 2>&1 &
done

DOWN=true
while $DOWN; do
    sleep 0.1
    DOWN=false
    for i in {1..5}
    do
	if [ ! -S "$QDATA/c$i/tm.ipc" ]; then
            DOWN=true
	fi
    done
done

echo "[*] Starting Ethereum nodes"
set -v
ARGS="--unlock 0 --password password.txt --raft --rpc --rpcaddr 0.0.0.0 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum --emitcheckpoints"

PRIVATE_CONFIG=$QDATA/c1/tm.ipc nohup geth --datadir $QDATA/dd1 $ARGS --raftport 50401 --rpcport 22000 --port 21000 2>>$QDATA/logs/1.log &
PRIVATE_CONFIG=$QDATA/c2/tm.ipc nohup geth --datadir $QDATA/dd2 $ARGS --raftport 50402 --rpcport 22001 --port 21001 2>>$QDATA/logs/2.log &
PRIVATE_CONFIG=$QDATA/c3/tm.ipc nohup geth --datadir $QDATA/dd3 $ARGS --raftport 50403 --rpcport 22002 --port 21002 2>>$QDATA/logs/3.log &
PRIVATE_CONFIG=$QDATA/c4/tm.ipc nohup geth --datadir $QDATA/dd4 $ARGS --raftport 50404 --rpcport 22003 --port 21003 2>>$QDATA/logs/4.log &
PRIVATE_CONFIG=$QDATA/c5/tm.ipc nohup geth --datadir $QDATA/dd5 $ARGS --raftport 50405 --rpcport 22004 --port 21004 2>>$QDATA/logs/5.log &
set +v

echo
echo "All nodes configured. See '$QDATA/logs' for logs, and run e.g. 'geth attach $QDATA/dd1/geth.ipc' to attach to the first Geth node."
