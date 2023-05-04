# step1:window 的扩展 ： https://www.azimiao.com/8040.html

# 1 ： https://sourceforge.net/projects/gnuwin32/files/zip/3.0/ 
# 2 ： 找到 Git 文件夹下的usr/bin目录，将解压后bin里面的东西复制进去


# step2:提前 ssh 配置 一下(linux 版本)    

# 1.ssh-keygen -t [rsa|dsa]，将会生成密钥文件和私钥文件 id_rsa,id_rsa.pub或id_dsa,id_dsa.pub  ssh-keygen -t [rsa|dsa]
# 2.将 .pub 文件复制到B机器的 .ssh 目录， 并 cat id_rsa.pub >> ~/.ssh/authorized_keys
# 3.大功告成，从A机器登录B机器的目标账户，不再需要密码了；（直接运行 #ssh xxxx ）


# 如果 还要输入密码 可能有一下两点原因
# 问题一：权限问题
# chmod 700 /home/root

# chmod 700 ~/.ssh/

# chmod 600 ~/.ssh/authorized_keys 

# 问题2：配置文件问题
# 打开 /etc/ssh/sshd_config 
# StrictModes 的 注释打开并且改成 no
# PubkeyAuthentication 打开 yes

# 然后service sshd restart

# 最后 ssh user@IP -p 他的ssh端口 -i 你的私钥



# step2:提前 ssh 配置 一下(window 版本)-https://www.cnblogs.com/ministep/p/16974309.html
# 先安装OpenSSH客户端和服务器，win10自带客户端，我们安装即可。设置 -- 应用 -- 可选功能 -- 添加 -- 添加 OpenSSH 服务器
# 接着ssh-keygen -t rsa 生成密钥
# 然后 将 .ssh\authorized_keys 文件右键属性 -- 安全 -- 高级 -- 点击“禁用继承”--当出现提示时，选择“将继承的权限转换为此对象的显式权限”。然后将权限条目删除至只剩“SYSTEM”、自己的账户、“Administrators”。（此步我默认就是这三个用户，所以只用修改禁用继承）
# 
# 接着 打开sshd配置文件 C:\ProgramData\ssh\sshd.config ，注意 ProgramData 是隐藏文件夹
# PubkeyAuthentication yes # 使用公钥
# AuthorizedKeysFile	.ssh/authorized_keys # 公钥位置
# PasswordAuthentication no # 免密登录

# 确保以下2条有注释掉
#Match Group administrators
#  AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys

# 最后重启服务 ctrl + alt + delete 打开任务管理器，选择服务找到sshd重启


scp  -P 22 -r dist cvter@192.168.173.1:D:/project1
# ssh cvter@192.168.173.1 -p 22 < easyUnzip.sh << remotessh






# scp -r dist.zip cvter@192.168.173.1:/root/project  # 上传目录

# ssh cvter@192.168.173.1
# ssh-copy-id -i ~/.ssh/id_rsa.pub  cvter@192.168.173.1


# 第一个参数是 输出，第二个参数是输入
# npm run test >> 

# zip  ./dist.zip ./dist -r

# scp  -P 222 -r dist.zip root@10.21.2.47:/root/project  # 上传目录
# ssh root@10.21.2.47 -p 222 < easyUnzip.sh





