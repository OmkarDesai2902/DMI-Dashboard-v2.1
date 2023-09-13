const loadingDOMedit = document.querySelector('.loading-text-editpage')
const DmisDOM = document.querySelector('.dmis')
const dmiIDDOM = document.querySelector('.dmi-edit-id')
const editFormDOM = document.querySelector('.single-dmi-form')
const editBtnDOM = document.querySelector('.dmi-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')

const params = document.location.search
const paramStr = new URLSearchParams(params).get('paramStr')
const dmiIDSearched = paramStr.split("/")[0]

// const roundLoaderDOM = document.querySelector('.test-loader')

// Show DMI Function

const showTasks = async () => {
    loadingDOMedit.style.visibility = 'visible'
    try{
        const { data : { recordset }} = await axios.get(`/api/v1/dmis/${paramStr}`)
        if(recordset.length <1){
            DmisDOM.innerHTML = ` <p> ${dmiIDSearched} not present in MAS (TBL_FLS_MASTER)</p> `
            loadingDOMedit.style.visibility = 'hidden'
            editBtnDOM.style.visibility = 'hidden'
            return
        }
        
        
        const dmiObject = recordset[0]
        const dmiObjectKeys = Object.keys(dmiObject)
        const dmiObjectValues = Object.values(dmiObject)
        

        let htmlFormString = ''

        for(let i=0; i<dmiObjectKeys.length; i++){
            let individualKey = dmiObjectKeys[i]
            let individualValue = dmiObjectValues[i]

            let inputID = 'defaultID'
            let minMaxLength = ' '

            //textAndNumberPattern No spaces handle
            if(individualKey == 'PersonnelNumber'  ){
                inputID = 'textAndNumberPatternID'
            }
            // text spaces handle
            if(individualKey == 'Name'    ){
                inputID = 'spacesTextPatternID'
            }

            //Capital text no spaces handle
            if(individualKey == 'BusinessUnit'   ){
                inputID = 'capitalTextSpacesPatternID'
            }
            // mail 
            if(individualKey == 'EmailID'    ){
                inputID = 'emailPatternID'
            }
            // for mobile number only 10digits no spaces
            if(individualKey == 'MOBILENO' ){
                inputID = 'numberPatternID'
                minMaxLength = 'minlength="10" maxlength="10" '
            }

            //maxlength 17
            if(individualKey == 'PersonnelNumber' ){
                minMaxLength = 'minlength="1" maxlength="17" '
            }
            //maxlength 45
            if(individualKey == 'Name' ){
                minMaxLength = 'minlength="1" maxlength="45" '
            }



            htmlFormString += 
            `
                <div class="form-control">
                    <label for="${individualKey}">${individualKey}</label>
                    <input type="text" required name="${individualKey}" value="${individualValue}" 
                    class="task-edit-name ${individualKey}" id=${inputID}  
                    ${minMaxLength}
                     />
                </div>  
    
            `
        }

        
        
        dmiIDDOM.innerHTML =  dmiObjectValues[0] + " Details (TBL_HRMS_SAP_JOINING_DATA) :" 
        DmisDOM.innerHTML = htmlFormString

        //textAndNumberPattern No spaces handle
        let  tAndNIdDOM = document.querySelectorAll("#textAndNumberPatternID")
        tAndNIdDOM.forEach((cd) =>{
            cd.addEventListener('input',()=>{
                cd.value=cd.value.replace(/[^0-9,A-Z,a-z]/g,'');
                //console.log(cd)
            })
        })

        //spacesTextPatternID
        let  sTIdDOM = document.querySelectorAll("#spacesTextPatternID")
        sTIdDOM.forEach((cd) =>{
            cd.addEventListener('input',()=>{
                cd.value=cd.value.replace(/[^ ,A-Z,a-z]/g,'');
                //console.log(cd)
            })
        })

        //capitalTextSpacesPatternID
        let  sCTIdDOM = document.querySelectorAll("#capitalTextSpacesPatternID")
        sCTIdDOM.forEach((cd) =>{
            cd.addEventListener('input',()=>{
                //cd.value=cd.value.replace(/[^ ,A-Z]/g,'');
                if(cd.value.match(/^[A-Z]*$/)){
                   
                }
                else{
                    alert("Kindly enter capital letters only in BusinessUnit")
                    cd.value=cd.value.replace(/[^ ,A-Z]/g,'');
                }
                //console.log(cd)
            })
        })

        //numberPatternID no spaces
        let  nIdDOM = document.querySelectorAll("#numberPatternID")
        nIdDOM.forEach((cd) =>{
            cd.addEventListener('input',()=>{
                cd.value=cd.value.replace(/[^0-9]/g,'');
                //console.log(cd)
            })
        })


        let inputs = DmisDOM.getElementsByTagName('input');
        

    }
    catch(error) {
        DmisDOM.innerHTML = ` <p> Some error is there : ${error} </p> `
    }

    loadingDOMedit.style.visibility = 'hidden'
}
showTasks()


editFormDOM.addEventListener('submit', async (e) => {
    e.preventDefault()
    var updateObject = {  }

    let inputs = DmisDOM.getElementsByTagName('input');

    for (let index = 0; index < inputs.length; index++) {
        let name = inputs[index].name
        let value = inputs[index].value
        updateObject = { ...updateObject, [name] : value }
    }

    

    try {
        //mailPattern emailPatternID
        let  emDOM = document.querySelector("#emailPatternID")
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        //Phone Number 10 Digits validation 'MOBILENO'
        let phoneInput1 = document.querySelector('.MOBILENO')
        if(phoneInput1.value.length !==10){
            window.alert(`Only ${phoneInput1.value.length} digits in Contact__c. Please enter 10 digits`)
            document.querySelector('.MOBILENO').focus()
            return
        }

        //mailPattern emailPatternID
        else if(!emDOM.value.match(mailformat)){
            alert("You have entered an invalid email address!");
            document.querySelector('.EmailID').focus()
            return
        }
        else{
            if(confirm("Do yo want to Edit entered details")){
                const updateAxios = axios.patch(`/api/v1/dmis/${paramStr}`,updateObject)
                window.alert("Updation Successful");
                window.location.href = `index.html`;
            }
            else{
                //dialogue box cancel
            }
        }
        
    } catch (error) {
        DmisDOM.innerHTML = ` <p> Error : ${error} </p> `
    }

    

})

//Delete DMI 

async function dmiDeleteFunction() {
    try {
        if(confirm(`Do yo want to Delete ${dmiIDSearched}`)){
            const deleteAxios = axios.delete(`/api/v1/dmis/${paramStr}`)
            window.alert(`${dmiIDSearched} Deleted Successfully`);
            window.location.href = `index.html`;
        }
        else{
            //dialogue box cancel
        }
    } catch (error) {
        DmisDOM.innerHTML = ` <p> Error : ${error} </p> `
    }

}


const checkS = async () => { 
    
    try {
        let dataAxios  = await axios.get(`/checkS`)
        let flag = dataAxios.data.loggedIn

        if(!flag){
            alert('Session Expired. Please Login again')
            window.location.href = `auth.html`
        }
        

    } catch (error) {
        console.log(`edit-dmi-hrms.js :error inside CheckS fn error : ${error}`)
       
    }


}

checkS()


