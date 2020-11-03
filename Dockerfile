#CBS is only supported on debian 8x (jessie) and 9x (stretch) as of 2020-07-xx
#   and supports LTS version of Node.js (using 12.18.2 for as of 2020-07-xx)
#https://docs.couchbase.com/nodejs-sdk/3.0/hello-world/start-using-sdk.html#installing-the-sdk
FROM node:12.18.2-stretch-slim

# Needed because the couchbase repos default to https
RUN apt-get update && apt-get install -y gnupg2 apt-transport-https ca-certificates
COPY ./couchbase.key .
RUN apt-key add couchbase.key

#LCB installation
COPY ./couchbase.list /etc/apt/sources.list.d/
RUN apt-get update && apt-get install -y libcouchbase3 libcouchbase-dev libcouchbase3-tools libcouchbase-dbg libcouchbase3-libev libcouchbase3-libevent
RUN apt-get install -y curl jq



