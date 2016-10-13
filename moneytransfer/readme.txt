Require JDK 1.8.0
Set Envireonment classpath to ..jdk1.8.0_101\bin
Run build.bat to build all class files
For test cases: run testcases/runtestcases.bat
Program arguments: String[] args
args[0]: testcase name
args[1]: true: call normal tranfer method, may produce a deadlock
         false: call resolve transfer method, prevent deadlock
args[2]: specify a list of transfering actions
         format: sendUserId_1,receivedUserId_1,amount_1;sendUserId_2,receivedUserId_2,amount_2;...
         for testing we have 3 userIds available: 0,1,2 corresponding to 3 username: A,B,C