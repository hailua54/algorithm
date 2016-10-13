IF EXIST "logs" rmdir /s "logs"
mkdir "logs"

IF NOT EXIST "moneytransfer" mkdir "moneytransfer"
xcopy /y "../bin/moneytransfer" "./moneytransfer"

java moneytransfer.Main "testcase_1" "true" "0,1,50" >> "logs/testcase_1.log"
java moneytransfer.Main "testcase_2" "true" "1,0,50" >> "logs/testcase_2.log"
java moneytransfer.Main "testcase_3" "true" "0,1,50;1,0,50" >> "logs/testcase_3.log"
java moneytransfer.Main "testcase_4" "true" "0,1,50;1,2,50;2,0,50" >> "logs/testcase_4.log"

java moneytransfer.Main "testcase_5" "false" "0,1,50" >> "logs/testcase_5.log"
java moneytransfer.Main "testcase_6" "false" "1,0,50" >> "logs/testcase_6.log"
java moneytransfer.Main "testcase_7" "false" "0,1,50;1,0,50" >> "logs/testcase_7.log"
java moneytransfer.Main "testcase_8" "false" "0,1,50;1,2,50;2,0,50" >> "logs/testcase_8.log"