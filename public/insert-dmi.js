
const loadingDOM = document.querySelector('.loading-text-editpage')
const loadingDOMedit = document.querySelector('.loading-text-editpage')
const DmisDOM = document.querySelector('.dmis')
const dmiIDDOM = document.querySelector('.dmi-edit-id')
const submitFormDOM = document.querySelector('.single-dmi-form')
const searchFormDOM = document.querySelector('.search-dmi-form')
const editBtnDOM = document.querySelector('.dmi-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')
const dmiInputDOM = document.querySelector('.dmi-input')
const branchSearchButton = document.querySelector('.branch-search-btn')
const insertFormDiv = document.querySelector('.insert-form-div')


insertFormDiv.style.display = 'none'
submitFormDOM.style.display = 'none'

branchSearchButton.addEventListener('click',(event) => {
    event.preventDefault()
    checkS()
    const BranchID = dmiInputDOM.value
    if(BranchID == '' || BranchID == 'null' || BranchID.length <1){
        alert('Please Enter Branch ID')
        submitFormDOM.style.display = 'none'
        // showTextBox(BranchID)
        DmisDOM.innerHTML = ` <p> Enter valid Branch ID</p> `
        dmiInputDOM.focus()
        return
    }
    if(BranchID.length > 5){
        alert('Only 5 digit allowed for Branch ID')
        submitFormDOM.style.display = 'none'
        // showTextBox(BranchID)
        DmisDOM.innerHTML = ` <p> Enter 5 digit Branch ID</p> `
        dmiInputDOM.focus()
        return
    }
    
    
    showTextBox(BranchID)
    editBtnDOM.style.visibility = 'visible'
    submitFormDOM.style.display = 'block'
    insertFormDiv.style.display = 'block'
})



const showTextBox = async(BranchID) => {
    loadingDOM.style.visibility = 'visible'
    try {
        const { data : { recordset }} = await axios.get(`/api/v1/dmis/branch/${BranchID}`)
        if(recordset.length <1){
            DmisDOM.innerHTML = ` <p> No FLS / DMIs to show for mentioned Branch ${BranchID}</p> `
            loadingDOMedit.style.visibility = 'hidden'
            editBtnDOM.style.visibility = 'hidden'
            submitFormDOM.style.display = 'none'
           return
        }

        let branchDmis = 
        `
        <table>
        <tr>
            <th>Code__c</th>
            <th>Name__c</th>
            <th>HR_Branch_ID</th>
            <th>Branch_Name_C</th>
            <th>BranchID</th>
        </tr>

        `
        
        branchDmis += recordset
        .map((record,index) =>{
            const { Code__c,Name__c ,HR_Branch_ID, Branch_Name_C ,BranchID} = record
            
            return (
            `
            <tr>
                <td>${Code__c}</td>
                <td>${Name__c}</td>
                <td>${HR_Branch_ID}</td>
                <td>${Branch_Name_C}</td>
                <td>${BranchID}</td>
                
            </tr>
            `
            )

        })
        .join(' ')
        
        DmisDOM.innerHTML = `${branchDmis} </table>`


    } catch (error) {
        DmisDOM.innerHTML = ` <p> Some error is there : ${error} </p> `
    }
    loadingDOMedit.style.visibility = 'hidden'
}






submitFormDOM.addEventListener('submit', async (e) =>{
    e.preventDefault()
    var insertObject = {  }

    let inputs = insertFormDiv.getElementsByTagName('input');

    for (let index = 0; index < inputs.length; index++) {
        let name = inputs[index].name
        let value = inputs[index].value
        insertObject = { ...insertObject, [name] : value }
    }
    let oldPS_ID = insertObject.oldDmi
    let newPS_ID = insertObject.newDmi
    let phoneInput = insertObject.phoneNoDmi

    //Phone Number 10 Digits validation
    if(phoneInput.length !==10){
        window.alert(`Only ${phoneInput.length} digits in Phone number. Please enter 10 digits`)
        document.querySelector('.phoneNoDmi').focus()
        return
    }

    //console.log(newPS_ID)

    try {
        //Check if DMI present in MAS to replicate
        const { data : { recordset }} = await axios.get(`/api/v1/dmis/${oldPS_ID}`)
        
        

        // Check if new DMI present in MAS already
        const data1 = await axios.get(`/api/v1/dmis/${newPS_ID}`)
        let newDmiArray = data1.data.recordsets[0]

        //Check Old DMI does not exists recordset.length <1
        if(recordset.length <1){
            window.alert(`No FLS / DMIs in TBL_FLS_MASTER for mentioned Code__C : ${oldPS_ID} | Please Enter Old DMI from above results`)
            document.querySelector('.oldDmi').focus()
            return
        }
       

        //Check New DMI does exists already or not
        if(newDmiArray.length >= 1) {
            window.alert(`FLS / DMI ${newPS_ID} already present in MAS | Please update existing records if required`)
            document.querySelector('.newDmi').focus()
            return

        }
        //Proceed to insert data
        else {
            if(confirm("Do yo want to Insert entered details")){
                const insertAxios = axios.post(`/api/v1/dmis/`,insertObject)
                window.alert("Insertion Successful");
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



const checkS = async () => { 
    try {
        let dataAxios  = await axios.get(`/checkS`)
        let flag = dataAxios.data.loggedIn

        if(!flag){
            alert('Session Expired. Please Login again')
            window.location.href = `auth.html`
        }
        

    } catch (error) {
        console.log(`insert-dmi.js : Error inside checkS fn error : ${error} `)
    }


}