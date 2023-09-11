
const userLoginForm = document.querySelector('.user-login-form')
const usernameInputDOM = document.querySelector('.username')
const passwordInputDOM = document.querySelector('.password')

axios.defaults.withCredentials = true ;

userLoginForm.addEventListener('submit', async (event) =>{
    event.preventDefault()
    const username  = usernameInputDOM.value
    const password  = passwordInputDOM.value
    let insertObject = { username , password}
    try {
        const insertAxios = await axios.post(`/api/v1/dmis/userauth`,insertObject)
        let flag = insertAxios.data.loggedIn
        if(flag){
            window.location.href = `index.html`
        }
        else{
            alert('Please Enter Valid Credentials')
        }

    } catch (error) {
        console.log(error)
    }

    


} )

const checkS = async () => { 
    try {
        let dataAxios  = await axios.get(`/checkS`)
        let flag = dataAxios.data.loggedIn
        if(flag){
            window.location.href = `index.html`
        }
        

    } catch (error) {
        console.log(error)
    }


}

checkS()