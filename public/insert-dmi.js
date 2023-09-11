
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
    if(BranchID == '' || BranchID == 'null'){
        alert('Please Enter Branch ID')
        submitFormDOM.style.display = 'none'
        showTextBox(BranchID)
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

    try {
        if(confirm("Do yo want to Insert entered details")){
            const insertAxios = axios.post(`/api/v1/dmis/`,insertObject)
            window.alert("Insertion Successful");
            window.location.href = `index.html`;
        }
        else{
            //dialogue box cancel
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