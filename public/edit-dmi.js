
const loadingDOMedit = document.querySelector('.loading-text-editpage')
const DmisDOM = document.querySelector('.dmis')
const dmiIDDOM = document.querySelector('.dmi-edit-id')
const editFormDOM = document.querySelector('.single-dmi-form')
const editBtnDOM = document.querySelector('.dmi-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')

const roundLoaderDOM = document.querySelector('.test-loader')

const params = document.location.search
const paramStr = new URLSearchParams(params).get('paramStr')
const dmiIDSearched = paramStr.split("/")[0]

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

        for(let i=0; i<31; i++){
            let individualKey = dmiObjectKeys[i]
            let individualValue = dmiObjectValues[i]

            let inputID = 'defaultID'
            let minMaxLength = ' '

            //textAndNumberPattern No spaces handle
            if(individualKey == 'Code__c' || individualKey == 'HR_Branch_ID' || individualKey == 'Ifsc_No' || individualKey=='PAN' || individualKey=='FLS_TARGET' ){
                inputID = 'textAndNumberPatternID'
            }
            //text no spaces handle
            if(individualKey == 'Active_Status__c' || individualKey == 'Products__c'    ){
                inputID = 'textPatternID'
            }
            //Capital text no spaces handle
            if(individualKey == 'Products__c'   ){
                inputID = 'capitalTextPatternID'
            }
            // text spaces handle
            if(individualKey == 'Name__c'    ){
                inputID = 'spacesTextPatternID'
            }
            //number no spaces handle
            if(individualKey == 'Contact__c' || individualKey =='Mobile__c' || individualKey=='BranchID'){
                inputID = 'numberPatternID'
                //minMaxLength = 'minlength="10" maxlength="10" '
            }

            // for mobile number only 10digits no spaces
            if(individualKey == 'Contact__c' || individualKey =='Mobile__c' ){
                inputID = 'numberPatternID'
                minMaxLength = 'minlength="10" maxlength="10" '
            }
            // mail 
            if(individualKey == 'Email__c'    ){
                inputID = 'emailPatternID'
            }
            //maxlength 17
            if(individualKey == 'Code__c' ){
                minMaxLength = 'minlength="1" maxlength="17" '
            }
            //maxlength 8
            if(individualKey == 'Active_Status__c' ){
                minMaxLength = 'minlength="1" maxlength="8" '
            }
            //maxlength 4
            if(individualKey == 'Products__c' ){
                minMaxLength = 'minlength="1" maxlength="12" '
            }
            //maxlength 45
            if(individualKey == 'Name__c' ){
                minMaxLength = 'minlength="1" maxlength="45" '
            }
            //maxlength 10
             if(individualKey == 'PAN' ){
                minMaxLength = 'minlength="10" maxlength="10" '
            }

            htmlFormString += 
            `
                <div class="form-control">
                    <label for="${individualKey}">${individualKey}</label>
                    <input type="text" required name="${individualKey}" value="${individualValue}"   
                    class="task-edit-name ${individualKey}" id="${inputID}" 
                    ${minMaxLength}
                     />
                </div>  
    
            `
            

        }

       

        
        
        dmiIDDOM.innerHTML = dmiObjectValues[0] + " Details (TBL_FLS_MASTER) :"
        DmisDOM.innerHTML = htmlFormString

        //textAndNumberPattern No spaces handle
        let  tAndNIdDOM = document.querySelectorAll("#textAndNumberPatternID")
        tAndNIdDOM.forEach((cd) =>{
            cd.addEventListener('input',()=>{
                cd.value=cd.value.replace(/[^0-9,A-Z,a-z]/g,'');
                //console.log(cd)
            })
        })

        //textPattern no spaces textPatternID
        let  tIdDOM = document.querySelectorAll("#textPatternID")
        tIdDOM.forEach((cd) =>{
            cd.addEventListener('input',()=>{
                cd.value=cd.value.replace(/[^A-Z,a-z]/g,'');
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
        //capitalTextPattern no spaces 
        let  cTIdDOM = document.querySelectorAll("#capitalTextPatternID")
        cTIdDOM.forEach((cd) =>{
            cd.addEventListener('input',()=>{
                //cd.value=cd.value.replace(/[^A-Z]/g,'');
                //var mailformat = /^\w+([\.-]?\w+)*@\w+$/;
                if(cd.value.match(/^[A-Z]*$/)){
                   
                }
                else{
                    alert("Kindly enter capital letters only in Products__c")
                    cd.value=cd.value.replace(/[^A-Z]/g,'');
                }
                //console.log(cd)
            })
        })
        
        //mailPattern emailPatternID
        // let  emDOM = document.querySelectorAll("#emailPatternID")
        // emDOM.forEach((cd) =>{
        //     cd.addEventListener('focusout',()=>{
        //         var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        //         if(!cd.value.match(mailformat)){
        //             alert("You have entered an invalid email address!");
        //         }
        //     })
        // })

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
    roundLoaderDOM.style.visibility = 'visible'

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
        
        //Phone Number 10 Digits validation 'Contact__c' 'Mobile__c' 
        let phoneInput1 = document.querySelector('.Contact__c')
        let phoneInput2 = document.querySelector('.Mobile__c')

        //console.log(phoneInput1.value.length)

        //PAN should be 10 Handle:
        let panInput = document.querySelector('.PAN')
        console.log(panInput.value.length)

        //Phone Number 10 Digits validation 'Contact__c' 'Mobile__c'
        if(phoneInput1.value.length !==10 || phoneInput2.value.length !==10 ){
            roundLoaderDOM.style.visibility = 'hidden'
            if(phoneInput1.value.length !==10){
                window.alert(`Only ${phoneInput1.value.length} digits in Contact__c. Please enter 10 digits`)
                document.querySelector('.Contact__c').focus()
                return
            }
            else{
                window.alert(`Only ${phoneInput2.value.length} digits in Mobile__c. Please enter 10 digits`)
                document.querySelector('.Mobile__c').focus()
                return
            }
            
        }
        
        // PAN should be 10 chars
        else if(panInput.value.length !==10){
            roundLoaderDOM.style.visibility = 'hidden'
            window.alert(`Only ${panInput.value.length} characters in PAN. Please enter 10 characters`)
            document.querySelector('.PAN').focus()
            return
        }
    
        //mailPattern emailPatternID
        else if(!emDOM.value.match(mailformat)){
            roundLoaderDOM.style.visibility = 'hidden'
            alert("You have entered an invalid email address!");
            document.querySelector('.Email__c').focus()
            return
        }
        else {
            if(confirm("Do yo want to Edit entered details")){
                const updateAxios = axios.patch(`/api/v1/dmis/${paramStr}`,updateObject)
                roundLoaderDOM.style.visibility = 'hidden'
                window.alert("Updation Successful");
                window.location.href = `index.html`;
            }
            else{
                //dialogue box cancel
                roundLoaderDOM.style.visibility = 'hidden'
            }
        }
    } catch (error) {
        DmisDOM.innerHTML = ` <p> Error : ${error} </p> `
        roundLoaderDOM.style.visibility = 'hidden'
    }

    roundLoaderDOM.style.visibility = 'hidden'

})

//Delete DMI 

function dmiDeleteFunction() {
    roundLoaderDOM.style.visibility = 'visible'
    try {
        if(confirm(`Do yo want to Delete ${dmiIDSearched}`)){
            const deleteAxios = axios.delete(`/api/v1/dmis/${paramStr}`)
            roundLoaderDOM.style.visibility = 'hidden'
            window.alert(`${dmiIDSearched} Deleted Successfully`);
            window.location.href = `index.html`;
        }
        else{
            //dialogue box cancel
            roundLoaderDOM.style.visibility = 'hidden'
        }
    } catch (error) {
        DmisDOM.innerHTML = ` <p> Error : ${error} </p> `
        roundLoaderDOM.style.visibility = 'hidden'
    }
    roundLoaderDOM.style.visibility = 'hidden'
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
        console.log(`edit-dmi.js : error inside checkS fn error : ${error} `)
    }


}

checkS()


//== 'Code__c'
// function classCheck (){
//     let  ClassDOM = document.getElementById("Code__c")
    
//     //console.log(ClassDOM)

// }
