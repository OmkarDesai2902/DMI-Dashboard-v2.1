
const loadingDOMedit = document.querySelector('.loading-text-editpage')
const DmisDOM = document.querySelector('.dmis')
const dmiIDDOM = document.querySelector('.dmi-edit-id')
const editFormDOM = document.querySelector('.single-dmi-form')
const editBtnDOM = document.querySelector('.dmi-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')


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

            let inputID = ''
            let minMaxLength = ''

            //textAndNumberPattern No spaces handle
            if(individualKey == 'Code__c' || individualKey == 'HR_Branch_ID' || individualKey == 'Ifsc_No' ){
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
            if(individualKey == 'Contact__c' || individualKey =='Mobile__c' ){
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
                minMaxLength = 'minlength="1" maxlength="4" '
            }
            //maxlength 45
            if(individualKey == 'Name__c' ){
                minMaxLength = 'minlength="1" maxlength="45" '
            }


            htmlFormString += 
            `
                <div class="form-control">
                    <label for="${individualKey}">${individualKey}</label>
                    <input type="text" name="${individualKey}" value="${individualValue}"  
                    class="task-edit-name ${individualKey}" id="${inputID}" 
                    ${minMaxLength}
                    required />
                </div>  
    
            `
            

        }

       

        
        
        dmiIDDOM.innerHTML = dmiObjectValues[0] + " Details :"
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
                var mailformat = /^\w+([\.-]?\w+)*@\w+$/;
                if(cd.value.match(/^[A-Z]*$/)){
                   
                }
                else{
                    alert("Kindly enter capital letters only")
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

    var updateObject = {  }

    let inputs = DmisDOM.getElementsByTagName('input');

    for (let index = 0; index < inputs.length; index++) {
        let name = inputs[index].name
        let value = inputs[index].value
        updateObject = { ...updateObject, [name] : value }
    }

    try {
        if(confirm("Do yo want to Edit entered details")){
            const updateAxios = axios.patch(`/api/v1/dmis/${paramStr}`,updateObject)
            window.alert("Updation Successful");
            window.location.href = `index.html`;
        }
        else{
            //dialogue box cancel
        }
    } catch (error) {
        DmisDOM.innerHTML = ` <p> Error : ${error} </p> `
    }

    

})

//Delete DMI 

function dmiDeleteFunction() {

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
        console.log(`edit-dmi.js : error inside checkS fn error : ${error} `)
    }


}

checkS()


//== 'Code__c'
// function classCheck (){
//     let  ClassDOM = document.getElementById("Code__c")
    
//     //console.log(ClassDOM)

// }
