
const MemberList = require('./../src/models/memberlist.model');
const AdminSetting = require('./../src/models/adminsetting.model');
const AdminBankList = require('./../src/models/adminbanklist.model');
const TimeHelper = require('./../src/modules/timehelper');
const CreditModel = require('./../src/models/creditmanage.model');
const TransactionList = require('./../src/models/transactionlist.model');
const timerHelper = require('./../src/modules/timehelper');

describe('Create Model',() =>
    {
        test.skip('Test Deposit ', async () => 
        {
            const am_bank = AdminBankList.findByTypeAndID(" AND status = 1 and work_type in ('NODE','IBK') and bank_id = 1 and (bank_type = 'DEPOSIT' or bank_type = 'BOTH') ")[0];
            let inputCredit =10;
            
            let row_transfer = 
            {
                credit : inputCredit,
                acc : '150234',
                bankdesc : 'กสิกรไทย (KBANK) /X150234',
                datetime: TimeHelper.getDateTimeNowStringNoT(),
                bank : "KBANK",
                bank_name : "กสิกรไทย",
            };

            let row_user = MemberList.getMemberByBankAccNo(` AND (bank_acc_no = '${row_transfer['acc']}' or bank_acc_no like '%${row_transfer['acc']}%') `);

            expect(row_user['id']).toEqual("test00001");

            const oldCredit = row_user['credit'];
            const expectCredit = oldCredit + inputCredit;
            
            CreditModel.deposit(inputCredit,row_user,row_transfer,"KBANK",am_bank,row_transfer.datetime);
            
            let row_user2 = MemberList.getMemberByBankAccNo(` AND (bank_acc_no = '${row_transfer['acc']}' or bank_acc_no like '%${row_transfer['acc']}%') `);

            expect(row_user2.credit).toEqual(expectCredit);

            let lastDep = TransactionList.findLastDepTransactionByUsername(row_user['id']);            
            if (lastDep) 
            {
                expect(lastDep.credit).toEqual(inputCredit);
            }
            else
            {
                
            }

        });

        test.skip('Test Deposit Error ', async () => 
        {
            const am_bank = AdminBankList.findByTypeAndID(" AND status = 1 and work_type in ('NODE','IBK') and bank_id = 1 and (bank_type = 'DEPOSIT' or bank_type = 'BOTH') ")[0];
            let inputCredit =15;
            
            let row_transfer = 
            {
                credit : inputCredit,
                acc : '150234',
                bankdesc : 'กสิกรไทย (KBANK) /X150234',
                datetime: TimeHelper.getDateTimeNowStringNoT(),
                bank : "KBANK",
                bank_name : "กสิกรไทย",
            };

            let row_user = MemberList.getMemberByBankAccNo(` AND id='test00001' `);
            
            const oldCredit = row_user['credit'];
            const expectCredit = oldCredit;
            
            CreditModel.depositError(inputCredit,row_transfer,"KBANK",am_bank,"",row_transfer.datetime);
            
            let row_user2 = MemberList.getMemberByBankAccNo(` AND id='test00001' `);
            expect(row_user2.credit).toEqual(expectCredit);

            let lastDep = TransactionList.findLastTransaction();            
            if (lastDep) 
            {
                expect(
                    lastDep.transaction_type=="DEPNL"                   
                ).toEqual(true);

                expect(
                    lastDep.credit == inputCredit                     
                ).toEqual(true);

                expect(
                    lastDep.username == null
                ).toEqual(true);
            }
            else
            {
                
            }

        });

        test.skip('Test Deposit Min', async () => 
        {
            const am_bank = AdminBankList.findByTypeAndID(" AND status = 1 and work_type in ('NODE','IBK') and bank_id = 1 and (bank_type = 'DEPOSIT' or bank_type = 'BOTH') ")[0];
            let inputCredit =1;
            
            let row_transfer = 
            {
                credit : inputCredit,
                acc : '150234',
                bankdesc : 'กสิกรไทย (KBANK) /X150234',
                datetime: TimeHelper.getDateTimeNowStringNoT(),
                bank : "KBANK",
                bank_name : "กสิกรไทย",
            };

            let row_user = MemberList.getMemberByBankAccNo(` AND (bank_acc_no = '${row_transfer['acc']}' or bank_acc_no like '%${row_transfer['acc']}%') `);

            expect(row_user['id']).toEqual("test00001");

            const oldCredit = row_user['credit'];
            const expectCredit = oldCredit;
                        
            let response = CreditModel.depositMin(inputCredit,row_user,row_transfer,"KBANK",am_bank
            ,"ฝากไม่ถึงขั้นต่ำ",row_transfer.datetime);    
            
            let row_user2 = MemberList.getMemberByBankAccNo(` AND (bank_acc_no = '${row_transfer['acc']}' or bank_acc_no like '%${row_transfer['acc']}%') `);

            expect(row_user2.credit).toEqual(expectCredit);

            let lastDep = TransactionList.findLastTransactionByUsername(row_user['id']);            
            if (lastDep) 
            {
                expect(lastDep.credit).toEqual(inputCredit);
            }
            else
            {
                
            }

        });

        test.skip('Test Deposit Many', async () => 
        {
            const am_bank = AdminBankList.findByTypeAndID(" AND status = 1 and work_type in ('NODE','IBK') and bank_id = 1 and (bank_type = 'DEPOSIT' or bank_type = 'BOTH') ")[0];
            let inputCredit =100;

            let row_transfer = 
            {
                credit : inputCredit,
                acc : '12345',
                bankdesc : 'กสิกรไทย (KBANK) /X12345',
                datetime: new Date(),
                bank : "KBANK",
                bank_name : "กสิกรไทย",
            };

            let row_user = MemberList.getAllMemberByBankAccNo(` AND (bank_acc_no = '${row_transfer['acc']}' or bank_acc_no like '%${row_transfer['acc']}%') `);

            const oldCredit = row_user['credit'];
            const expectCredit = oldCredit;
                        
            let response = CreditModel.depositMany(inputCredit,row_transfer,"KBANK",am_bank
            ,"พบสมาชิกหลายคน",row_user,row_transfer.datetime);   
            
            let row_user2 = MemberList.getAllMemberByBankAccNo(` AND (bank_acc_no = '${row_transfer['acc']}' or bank_acc_no like '%${row_transfer['acc']}%') `);

            let manyUser = [];
            row_user.forEach(element => {
                manyUser.push({
                    username : element.id,
                    mobile_no : element.mobile_no
                    });
                });

            let lastDep = TransactionList.findLastTransaction();            
            if (lastDep) 
            {
                expect(lastDep.transaction_type).toEqual("DEPMAN");
                expect(lastDep.user_list).toEqual(JSON.stringify(manyUser));
            }
            else
            {
                
            }

        });

    }
);


