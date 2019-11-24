#!/usr/bin/env bash

IP_ADDRESSES=($(hostname -i))

for IP_ADDRESS in "${IP_ADDRESSES[@]}"; do
  printf "IP: \t%s\n" $IP_ADDRESS
done

printf "node: \t%s\n"   $(node --version)
printf "npm:  \t%s\n"   $(npm --version)
printf "yarn: \t%s\n"   $(yarn --version)

exec "$@"
