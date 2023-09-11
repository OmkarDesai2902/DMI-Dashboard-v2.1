const sql = require('mssql')
const bcrypt = require('bcryptjs')
const session = require('express-session')


const getAllDmis = async (req,res) =>{

    try {
        const result = await sql.query`select * from tbl_fls_master`
        res.send(result)
    } catch (error) {
        res.send(error)
    }

}

//bcrypt tach function
function isMatchUser (checkUsername) {
    return(bcrypt.compareSync(checkUsername,process.env.HASHUSER))
}
function isMatchPass (checkPassword) {
    return(bcrypt.compareSync(checkPassword,process.env.HASHPASS))
}

// User login Auth  
const userAuth = async (req,res) =>{
    const rBody = req.body
    const sessn = {}

    try {
        if(isMatchUser(req.body.username) && isMatchPass(req.body.password)){
            req.session.user = req.body.username
            
            res.send({ loggedIn : true  })
        }
        else {
            res.send({ loggedIn : false  })
        }

    } catch (error) {
        res.send(error)
    }

}


const getDmi = async (req,res) =>{
    const { id : dmiID} = req.params
    const Code__c = "'"+dmiID.toString()+"'";
    const qString = `select * from tbl_fls_master where Code__c=${Code__c} `;
    
    try {
        const result = await sql.query(qString)
        res.send(result)
    } catch (error) {
        res.send(error)
    }

}

const getHrmsDmi = async (req,res) =>{
    const { id : dmiID} = req.params
    const Code__c = "'"+dmiID.toString()+"'";
    const qString = `select * from tbl_hrms_sap_joining_data where PersonnelNumber=${Code__c} `;

    try {
        const result = await sql.query(qString)
        res.send(result)
    } catch (error) {
        res.send(error)
    }

}


const getBranchDmis = async (req,res) =>{
    
    const { branchID } = req.params
    const branchIDStr = "'"+branchID.toString()+"'";
    const qString = `select top(10) * from tbl_fls_master where [BranchID]=${branchIDStr} `;
    
    try {
        const result = await sql.query(qString)
        res.send(result)
    } catch (error) {
        res.send(error)
    }

}


// Get Individua DMI all fields
const getDmiInd = async (req,res) =>{
    
    const params  = req.params
    let cQuery = ''
    
    for (let x in params) {
        let hQuery = ''
        if(params[x] == "null"){
            hQuery = "["+ x +"] IS NULL AND " 
            if(x == "LastLogin_TimeStamp"){
                hQuery = "["+ x +"] IS NULL " 
            }
        }
        else{
            hQuery = "["+ x +"] ='"+params[x].toString()+"' AND "
            if(x == "LastLogin_TimeStamp"){
                hQuery = "["+ x +"] ='"+params[x].toString()+"' "
            }
        }
        cQuery += hQuery
    }

    const qString =`select * from tbl_fls_master where ${cQuery} `

    try {
        const result = await sql.query(qString)
        res.send(result)
    } catch (error) {
        res.send(error)
    }
}


//  Get Individua DMI all fields
const getDmiIndHrms = async (req,res) =>{
    
    const params  = req.params
    let cQuery = ''
    
    for (let x in params) {
        let hQuery = ''
        if(params[x] == "null"){
            hQuery = "["+ x +"] IS NULL AND " 
            if(x == "MCCODE"){
                hQuery = "["+ x +"] IS NULL " 
            }
        }
        else{
            hQuery = "["+ x +"] ='"+params[x].toString()+"' AND "
            if(x == "MCCODE"){
                hQuery = "["+ x +"] ='"+params[x].toString()+"' "
            }
        }
        cQuery += hQuery
    }

    const qString =`select * from tbl_hrms_sap_joining_data where ${cQuery} `

    try {
        const result = await sql.query(qString)
        res.send(result)
    } catch (error) {
        res.send(error)
    }
}

//update 
const updateDmi = async (req,res) =>{

    
    const rBody  = req.body
    let setQuery = ''
    
    for (let x in rBody) {
        let hQuery = ''
        if(rBody[x] == "null"){
            hQuery = "[" + x +"] = NULL ," 
            if(x == "LastLogin_TimeStamp"){
                hQuery = "[" + x +"] = NULL "
            }
        }
        else{
            hQuery = "[" + x +"] = '"+rBody[x].toString()+"', "
            if(x == "LastLogin_TimeStamp"){
                hQuery ="[" + x +"] = '"+rBody[x].toString()+"' "
            }
        }
        setQuery += hQuery
    }

    const rParams  = req.params
    let whereQuery = ''
    
    for (let x in rParams) {
        let hQuery = ''
        if(rParams[x] == "null"){
            hQuery =" ["+ x +"] IS NULL AND " 
            if(x == "LastLogin_TimeStamp"){
                hQuery = " ["+ x +"] IS NULL "
            }
        }
        else{
            hQuery = " ["+ x +"] = '"+rParams[x].toString()+"' AND "
            if(x == "LastLogin_TimeStamp"){
                hQuery = " ["+ x +"] = '"+rParams[x].toString()+"' "
            }
        }
        whereQuery += hQuery
    }

    const qString =`update tbl_fls_master set ${setQuery} where ${whereQuery} `

    try {
        const result = await sql.query(qString)
        res.send(result)
    } catch (error) {
        res.send(error)
    }

}

//update Dmi Hrms

const updateDmiHrms = async (req,res) =>{

    
    const rBody  = req.body
    let setQuery = ''
    
    for (let x in rBody) {
        let hQuery = ''
        if(rBody[x] == "null"){
            hQuery = "[" + x +"] = NULL ," 
            if(x == "MCCODE"){
                hQuery = "[" + x +"] = NULL "
            }
        }
        else{
            hQuery = "[" + x +"] = '"+rBody[x].toString()+"', "
            if(x == "MCCODE"){
                hQuery ="[" + x +"] = '"+rBody[x].toString()+"' "
            }
        }
        setQuery += hQuery
    }

    const rParams  = req.params
    let whereQuery = ''
    
    for (let x in rParams) {
        let hQuery = ''
        if(rParams[x] == "null"){
            hQuery =" ["+ x +"] IS NULL AND " 
            if(x == "MCCODE"){
                hQuery = " ["+ x +"] IS NULL "
            }
        }
        else{
            hQuery = " ["+ x +"] = '"+rParams[x].toString()+"' AND "
            if(x == "MCCODE"){
                hQuery = " ["+ x +"] = '"+rParams[x].toString()+"' "
            }
        }
        whereQuery += hQuery
    }

    const qString =`update tbl_hrms_sap_joining_data set ${setQuery} where ${whereQuery} `

    try {
        const result = await sql.query(qString)
        res.send(result)
    } catch (error) {
        res.send(error)
    }

}


//Delete 
const deleteDmi = async (req,res) =>{
    const params  = req.params
    let cQuery = ''
    
    for (let x in params) {
        let hQuery = ''
        if(params[x] == "null"){
            hQuery = "["+ x +"] IS NULL AND " 
            if(x == "LastLogin_TimeStamp"){
                hQuery = "["+ x +"] IS NULL " 
            }
        }
        else{
            hQuery = "["+ x +"] ='"+params[x].toString()+"' AND "
            if(x == "LastLogin_TimeStamp"){
                hQuery = "["+ x +"] ='"+params[x].toString()+"' "
            }
        }
        cQuery += hQuery
    }

    const qString =`delete top(1) from tbl_fls_master where ${cQuery} `

    try {
        const result = await sql.query(qString)
        res.send(result)
    } catch (error) {
        res.send(error)
    }
}

//Delete HRMS

const deleteDmiHrms = async (req,res) =>{
    const params  = req.params
    let cQuery = ''
    
    for (let x in params) {
        let hQuery = ''
        if(params[x] == "null"){
            hQuery = "["+ x +"] IS NULL AND " 
            if(x == "MCCODE"){
                hQuery = "["+ x +"] IS NULL " 
            }
        }
        else{
            hQuery = "["+ x +"] ='"+params[x].toString()+"' AND "
            if(x == "MCCODE"){
                hQuery = "["+ x +"] ='"+params[x].toString()+"' "
            }
        }
        cQuery += hQuery
    }

    const qString =`delete top(1) from tbl_hrms_sap_joining_data where ${cQuery} `

    try {
        const result = await sql.query(qString)
        res.send(result)
    } catch (error) {
        res.send(error)
    }
}


// Create DMI

const createDmi = async (req,res) =>{
    const rBody  = req.body

    if(rBody.oldDmi == '' || rBody.oldDmi == 'null') {
        res.status(404).send('Old DMI not found in MAS')
    }

    let dmiInsertQuery = 
    `
        Declare 
        @oldDMI varchar(20),@NewDMI varchar(20),@Name nvarchar(510),@email nvarchar(510),@mobile bigint,@PAN varchar(20)
        set @oldDMI='${rBody.oldDmi}' 
        set @NewDMI='${rBody.newDmi}' 
        set @Name='${rBody.nameDmi}'
        set @email='${rBody.emailDmi}'
        set @mobile='${rBody.phoneNoDmi}'
        set @PAN='${rBody.panDmi}'

        
        insert into TBL_FLS_MASTER
        (Code__c,Active_Status__c,Products__c,Name__c,Contact__c,Email__c,Mobile__c,HR_Branch_ID,Branch_Name_C,BranchID,isPartner,VendorId,isHypervergeEnabled,asset_type,opsCheckList,PAN,mandateType)

        select top(1) @NewDMI,Active_Status__c,Products__c,@Name,@mobile,@email,@mobile,HR_Branch_ID,Branch_Name_C,BranchID,isPartner,VendorId,isHypervergeEnabled,asset_type,opsCheckList,@PAN,'E'
        from TBL_FLS_MASTER where code__c = @oldDMI;

        
        insert into tbl_hrms_sap_joining_data
        (
        PersonnelNumber,Name,EmployeeSubgroup,PositionText,DateOfBirth,DateOfJoining,StrategicBusinessGroup,BusinessUnit,OrgUnit,PersonnelArea,BaseLocation,BaseLocationText,Gender,Job,EmailID,ZONE,STATE,STATECODE,ISPSNo,ISName,NSPSNo,NSName,DHPSNo,DHName,MOBILENO,MCCODE)

        select top(1) @NewDMI,@Name,EmployeeSubgroup,PositionText,DateOfBirth,DateOfJoining,StrategicBusinessGroup,BusinessUnit,OrgUnit,PersonnelArea,BaseLocation,BaseLocationText,Gender,Job,@email,ZONE,STATE,STATECODE,ISPSNo,ISName,NSPSNo,NSName,DHPSNo,DHName,@mobile,MCCODE
        from tbl_hrms_sap_joining_data where PersonnelNumber = @oldDMI;
    
    `


    
    try {
        const result = await sql.query(dmiInsertQuery)
        res.send(result)
    } catch (error) {
        
    }

}




///////////////////////////////////////////////////////////////

module.exports = { getAllDmis, getDmi, getDmiInd,updateDmi,deleteDmi,getBranchDmis, createDmi , 
    getHrmsDmi, getDmiIndHrms, updateDmiHrms, deleteDmiHrms, userAuth }