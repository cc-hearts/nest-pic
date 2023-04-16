#!/bin/bash
docker rm -f nest-pic
docker rmi -f nest-pic:1.0.0

docker build -t nest-pic:1.0.0 .

docker run -p 30002:30002 -v /opt/nest-pic/nest-pic/file:/usr/nest-pic/file --name nest-pic -d nest-pic:1.0.0