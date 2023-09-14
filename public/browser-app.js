const loadingDOM = document.querySelector('.loading-text')
const DmisDOM = document.querySelector('.dmis')
const DmisHrmsDOM = document.querySelector('.dmisHrms')
const dmiFormDOM = document.querySelector('.dmi-form')
const dmiInputDOM = document.querySelector('.dmi-input')
const formAlertDOM = document.querySelector('.form-alert')
const logoutBtnDOM = document.querySelector('#logout-btn')



dmiFormDOM.addEventListener('submit', async (e) => {
    e.preventDefault()
    checkS()
    const PS_ID = dmiInputDOM.value
    showDmis(PS_ID)
    showDmisHrms(PS_ID)
})

// Show DMI TBL FLS MASTER Function

const showDmis = async (PS_ID) => {
    loadingDOM.style.visibility = 'visible'
    try{

        const { data : { recordset }} = await axios.get(`/api/v1/dmis/${PS_ID}`)
        if(recordset.length <1){
            DmisDOM.innerHTML = ` <p> No FLS / DMIs in TBL_FLS_MASTER for mentioned Code__C : ${PS_ID}</p> `
            loadingDOM.style.visibility = 'hidden'
            return
        }
        DmisDOM.innerHTML = ''
        let TableNameHtml = 
        `
            <div class="single-dmi " style="background: #7f3e98; color: white; border: 1px white;" >
                <h5><span><i class="far fa-check-circle"></i></span>TBL_FLS_MASTER :</h5> 
            </div>  
        `
        let allDmis = TableNameHtml
        

        allDmis += recordset
            .map((record,index) =>{
                const { Code__c } = record
                const keys = Object.keys(record)
                const values = Object.values(record)

                let stringKeyValuesArray = ''

                for(let i=0; i<31; i++){
                    let individualKeyValue
                    individualKeyValue= values[i]+"/"
                    if(values[i] == ''){
                        individualKeyValue='empty'+'/'
                    }
                    if(i==30){
                        individualKeyValue = values[i]
                        if(values[i] == ''){
                            individualKeyValue='empty'
                        }
                    }
                    stringKeyValuesArray += individualKeyValue
                }

                

               return (
                    `
                    
                    <div class="single-dmi ">
                        <h5><span><i class="far fa-check-circle"></i></span>${index+1}) ${Code__c} </h5> 
                        <div class="dmi-links">
                            <a href="dmi.html?paramStr=${stringKeyValuesArray}" class="edit-link"><i class="fa fa-edit"></i></a>
                        </div>
                    </div>   
                    `
               )
                
            })
            .join(' ')
    
        DmisDOM.innerHTML = allDmis
    }
    catch(error) {
        DmisDOM.innerHTML = ` <p> Some error is there : ${error} </p> `
    }
    loadingDOM.style.visibility = 'hidden'
}

// Show DMI TBL HRMS Function

const showDmisHrms = async (PS_ID) => {
    loadingDOM.style.visibility = 'visible'
    try{
        const { data : { recordset }} = await axios.get(`/api/v1/dmis/hrms/${PS_ID}`)
        if(recordset.length <1){
            DmisHrmsDOM.innerHTML = ` <p> No FLS / DMIs in TBL_HRMS_SAP_JOINING_DATA for mentioned Code__C : ${PS_ID}</p> `
            loadingDOM.style.visibility = 'hidden'
            return
        }
        DmisHrmsDOM.innerHTML = ''
        let TableNameHtml1 = 
        `
            <div class="single-dmi " style="background: #7f3e98; color: white; border: 1px white; margin-top: 10px;" >
                <h5><span><i class="far fa-check-circle"></i></span>TBL_HRMS_SAP_JOINING_DATA :</h5> 
            </div>  
        `
        let allDmis1 = TableNameHtml1
        

        allDmis1 += recordset
            .map((record,index) =>{
                const { PersonnelNumber } = record
                const keys = Object.keys(record)
                const values = Object.values(record)

                let stringKeyValuesArray = ''

                for(let i=0; i<values.length; i++){
                    let individualKeyValue
                    individualKeyValue= values[i]+"/"
                    if(values[i] == ''){
                        individualKeyValue='empty'+'/'
                    }
                    if(i==values.length-1){
                        individualKeyValue = values[i]
                        if(values[i] == ''){
                            individualKeyValue='empty'
                        }
                    }
                    stringKeyValuesArray += individualKeyValue
                }

                

               return (
                    `
                    
                    <div class="single-dmi ">
                        <h5><span><i class="far fa-check-circle"></i></span>${index+1}) ${PersonnelNumber} </h5> 
                        <div class="dmi-links">
                            <a href="dmi-hrms.html?paramStr=${stringKeyValuesArray}" class="edit-link"><i class="fa fa-edit"></i></a>
                        </div>
                    </div>   
                    `
               )
                
            })
            .join(' ')
    
        DmisHrmsDOM.innerHTML += allDmis1
    }
    catch(error) {
        DmisHrmsDOM.innerHTML = ` <p> Some error is there : ${error} </p> `
    }
    loadingDOM.style.visibility = 'hidden'
}


//Logout 

logoutBtnDOM.addEventListener('click', async ()=>{
    try {
        let logoutAxios = await axios.get(`/logout`)
        let flag = logoutAxios.data.loggedOut

        if(flag){
            window.location.href = `auth.html`
        }
        
    } catch (error) {
        console.log(`browserapp.js : error inside logout fn error : ${error}`)
    }

})


const checkS = async () => { 
    try {
        let dataAxios  = await axios.get(`/checkS`)
        let flag = dataAxios.data.loggedIn
        if(!flag){
            alert('Session Expired. Please Login again')
            window.location.href = `auth.html`
        }
        

    } catch (error) {
        console.log(`browserapp.js : Error inside CheckS fn error : ${error}`)
    }


}





