#!/bin/bash
# find . -type f -iname \*.js -delete

echo -e "\e[91m --本地ts-build中--"
tsc --project ./

echo "编译ts成功"
# echo -e "\e[0m"

# echo -e "\e[91m --版本号升级--"
# tsc --project ./

# echo "版本号升级成功"
# echo -e "\e[0m"
