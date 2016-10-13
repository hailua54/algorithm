IF EXIST "logs" rd /s "logs"
mkdir "logs"
REM testcase 1: normal transfer, A->B:50
java moneytransfer.Main testcase_1 true "0,1,50" >> "logs/testcase_1.log"
REM testcase 2: normal transfer, B->A:50
java moneytransfer.Main testcase_2 true "0,1,50" >> "logs/testcase_2.log"
REM testcase 3: normal transfer, A->B:50, B->A:50 DEADLOCK
java moneytransfer.Main testcase_3 true "0,1,50;1,0,50" >> "logs/testcase_3.log"
REM testcase 4: normal transfer, A->B:50, B->C:50, C->A:50 DEADLOCK
java moneytransfer.Main testcase_4 true "0,1,50;1,2,50;2,1,50" >> "logs/testcase_4.log"

REM testcase 5: resolved transfer, A->B:50
java moneytransfer.Main testcase_5 true "0,1,50" >> "logs/testcase_5.log"
REM testcase 6: resolved transfer, B->A:50
java moneytransfer.Main testcase_6 true "0,1,50" >> "logs/testcase_6.log"
REM testcase 7: resolved transfer, A->B:50, B->A:50 DEADLOCK
java moneytransfer.Main testcase_7 true "0,1,50;1,0,50" >> "logs/testcase_7.log"
REM testcase 8: resolved transfer, A->B:50, B->C:50, C->A:50 DEADLOCK
java moneytransfer.Main testcase_8 true "0,1,50;1,2,50;2,1,50" >> "logs/testcase_8.log"