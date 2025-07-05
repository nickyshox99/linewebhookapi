
const AdminSetting = require('./../src/models/adminsetting.model');
const LineManage = require('./../src/models/linemanage.model');

describe('Test Send Notify',() =>
    {
        test.skip('Send Correct Token', async () => {
            let response ="";
            
            const lineSetting = AdminSetting.findByID("line_token");                
            if (lineSetting) 
            {
                const token = JSON.parse(lineSetting.value);        
                const line_token = token['Deposit'];
                
                
                if(line_token){
                    let msg ="";                
                    msg +='ทดสอบส่ง Line \n';
                    msg +='BANKID : \n';
                    msg +='Username : \n';
                    msg +='เบอร์มือถือ : \n';
                    msg +='วันที่ : \n';
                    msg +='รายละเอียด : \n' ;
                    msg +='เลขที่รายการ : \n'; 
                    response = await LineManage.sendNotify(line_token,msg);
                }
            }

            expect(response).toEqual("ok");
          });

        test.skip('Send InCorrect Token', async () => {
            let response ="";
            
            const lineSetting = AdminSetting.findByID("line_token");                
            if (lineSetting) 
            {
                const token = JSON.parse(lineSetting.value);        
                const line_token = token['Deposit'];
                
                
                if(line_token){
                    let msg ="";                
                    msg +='ทดสอบส่ง Line \n';
                    msg +='BANKID : \n';
                    msg +='Username : \n';
                    msg +='เบอร์มือถือ : \n';
                    msg +='วันที่ : \n';
                    msg +='รายละเอียด : \n' ;
                    msg +='เลขที่รายการ : \n'; 
                    response = await LineManage.sendNotify(line_token+"abc",msg);
                }
            }

            expect(response.msgerror.length!=0).toEqual(true);
        });
    }
);


