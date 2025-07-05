var dbConn = require('../../config/db.config');
const Cryptof = require('./cryptof.model');

var MainModel = function() {
    
};

MainModel.query = function(sqlStr,result) 
{
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

MainModel.queryFirstRow = function(sqlStr,result) 
{
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas[0]?datas[0]:[];
};

MainModel.insert = function(tableName,data,result) { 
    let sqlStr ="";
    try 
    {
        
        let tmpColumn = "";        
        let tmpValue = "";
        let tmpQuestionMark="";

        for (const [key, value] of Object.entries(data)) 
        {
            if (tmpColumn==="") 
            {
                tmpColumn+= "`"+key+"`";
                tmpQuestionMark +="?";
            }
            else
            {
                tmpColumn+= ",`"+ key+"`";
                tmpQuestionMark += ",?";
            }
            
            if (value==null) 
            {
                if (tmpValue==="") 
                {
                    tmpValue+="NULL";
                }    
                else
                {
                    tmpValue+=",NULL";
                }
            }
            else if(typeof(value)=="string")
            {
                if (tmpValue==="") 
                {
                    tmpValue+=`'${value.toString().replaceAll('?','')}'`;
                }    
                else
                {
                    tmpValue+=`,'${value.toString().replaceAll('?','')}'`;
                }
            }
            else
            {
                if (tmpValue==="") 
                {
                    tmpValue+=`${value}`;
                }    
                else
                {
                    tmpValue+=`,${value}`;
                }
            }
        }

        sqlStr = `INSERT INTO ${tableName} (`;
        
        sqlStr += tmpColumn;
        sqlStr += `) VALUES (`;
        sqlStr += tmpValue;
        sqlStr += `)`;

        //console.log(sqlStr);
        // console.log(tmpValue);
    
        const datas = dbConn.query(sqlStr);
        
        return true;
    } catch (error) {
        console.log(sqlStr);
        console.log(error);
        return false;     
    }
       
}

MainModel.update = function(tableName,data,condition,otherCondition="",result) { 

    let sqlStr ="";
    try 
    {
        
        let tmpWhere = "";        
        let tmpSet = "";

        for (const [key, value] of Object.entries(data)) 
        {            
            if (value==null) 
            {
                if (tmpSet==="") 
                {
                    tmpSet+= "`"+key+"`=null";
                }    
                else
                {
                    tmpSet+=",`"+key+"`=null";
                }
            }
            else if(typeof(value)=="string")
            {
                if (tmpSet==="") 
                {
                    tmpSet+= "`"+key+"`"+ `='${value}'`;
                }    
                else
                {
                    tmpSet+= ","+"`"+key+"`"+`='${value}'`;
                }
            }
            else
            {
                if (tmpSet==="") 
                {
                    tmpSet+= "`"+key+"`" +`=${value}`;
                }    
                else
                {
                    tmpSet+= ","+"`"+key+"`" +`=${value}`;
                }
            }
        }

        for (const [key, value] of Object.entries(condition)) 
        {  
            if (value==null) 
            {
                tmpWhere+= ` AND `+"`"+key+"`"+`=${value}`;
            }
            else if(typeof(value)=="string")
            {
                tmpWhere+= ` AND `+"`"+key+"`"+`='${value.toString().replaceAll('?','')}'`;
            }
            else
            {
                tmpWhere+= ` AND `+"`"+key+"`" +`=${value.toString().replaceAll('?','')}`;
            }
        }

        sqlStr = `UPDATE ${tableName} SET `;      
        sqlStr += tmpSet;  
        
        sqlStr += " WHERE 1=1 "    
        sqlStr += tmpWhere;
        sqlStr += otherCondition;
        
        //console.log(sqlStr);
        // console.log(tmpValue);
    
        const datas = dbConn.query(sqlStr);
        
        return true;
    } catch (error) {
        console.log(sqlStr);
        console.log(error);
        return false;     
    }
       
}

MainModel.delete = function(tableName,condition,otherCondition="",result) { 
    try 
    {
        let sqlStr ="";
        let tmpWhere = "";        
        let tmpSet = "";
     

        for (const [key, value] of Object.entries(condition)) 
        {  
            if (value==null) 
            {
                tmpWhere+= ` AND `+key+`=${value}`;
            }
            else if(typeof(value)=="string")
            {
                tmpWhere+= ` AND `+key+`='${value}'`;
            }
            else
            {
                tmpWhere+= ` AND `+key +`=${value}`;
            }
        }

        sqlStr = `DELETE FROM ${tableName} `;      
        sqlStr += tmpSet;  
        
        sqlStr += " WHERE 1=1 "    
        sqlStr += tmpWhere;
        sqlStr += otherCondition;
        
        //console.log(sqlStr);
        // console.log(tmpValue);
    
        const datas = dbConn.query(sqlStr);
        
        return true;
    } catch (error) {
        console.log(error);
        return false;     
    }
       
}

MainModel.getBankInfo = function(bank_id,result) 
{
    let sqlStr = "SELECT * FROM bank_info WHERE bank_id="+bank_id;
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas[0]?datas[0]:[];
};

module.exports = MainModel;