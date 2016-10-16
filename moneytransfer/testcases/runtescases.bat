IF NOT EXIST "logs" mkdir "logs"
SET des="logs\testcase.log"
SET source="..\bin"
IF EXIST %des% DEL %des%

java -cp %source% moneytransfer.Main "testcase_1" "true" "0,1,50" >> %des%
java -cp %source% moneytransfer.Main "testcase_2" "true" "1,0,50" >> %des%
java -cp %source% moneytransfer.Main "testcase_3" "true" "0,1,50;1,0,50" >> %des%
java -cp %source% moneytransfer.Main "testcase_4" "true" "0,1,50;1,2,50;2,0,50" >> %des%
java -cp %source% moneytransfer.Main "testcase_5" "true" "2,0,50;0,1,50;1,2,50;2,0,50;0,1,50;1,2,50" >> %des%

java -cp %source% moneytransfer.Main "testcase_21" "false" "0,1,50" >> %des%
java -cp %source% moneytransfer.Main "testcase_22" "false" "1,0,50" >> %des%
java -cp %source% moneytransfer.Main "testcase_23" "false" "0,1,50;1,0,50" >> %des%
java -cp %source% moneytransfer.Main "testcase_24" "false" "0,1,50;1,2,50;2,0,50" >> %des%
java -cp %source% moneytransfer.Main "testcase_25" "false" "2,0,50;0,1,50;1,2,50;2,0,50;0,1,50;1,2,50" >> %des%