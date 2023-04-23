# window 的扩展 ： https://www.azimiao.com/8040.html

# step1 ： https://sourceforge.net/projects/gnuwin32/files/zip/3.0/ 
# step2 ： 找到 Git 文件夹下的usr/bin目录，将解压后bin里面的东西复制进去

# 提前 ssh 配置 一下

# ssh root@10.21.2.47 -p 222

# 第一个参数是 输出，第二个参数是输入
node test.js
zip  ./dist.zip ./build -r

scp  -P 222 -r dist.zip root@10.21.2.47:/root/project  # 上传目录
ssh root@10.21.2.47 -p 222 < easyUnzip.sh