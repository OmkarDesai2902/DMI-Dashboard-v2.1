const { error } = require('console');
const path = require('path');
// HTML


// get Logout
const getLogout =  (req,res) =>{
    if(req.cookies.userId && req.session.user !== undefined) {
        res.clearCookie("userId")        
        res.send({ loggedOut : true  })

    }
    else {
        res.send({ loggedOut : false  })
    }

}

//  get sessions
const getSessions =  (req,res) =>{
    
    if(req.cookies.userId!== undefined && req.session.user !== undefined) {
        res.send({ loggedIn : true  })

    }
    else {
        res.send({ loggedIn : false  })
    }

}

// ./ page
const getIndex =  (req,res) =>{
    if(req.cookies.userId && req.session.user !== undefined) {
        var finalPath = path.join(__dirname, '../public', 'index.html')
        res.sendFile(finalPath, function (err) {
            if (err) {
                console.log(err)
            } else {
                // console.log('Sent:', finalPath)
            }
        })

    }
    else {
        res.redirect('./auth.html')
    }

}





//InsertDmi.html page
const getInsertDmi = (req,res) =>{
   
 
    if(req.cookies.userId && req.session.user !== undefined) {

        var finalPath = path.join(__dirname, '../public', 'insertDmi.html')
            
        res.sendFile(finalPath, function (err) {
            if (err) {
                console.log(err)
            } else {
                // console.log('Sent:', finalPath)
            }
        })
    }
    else {
        res.redirect('./auth.html')
    }

}

//dmi.html page
const getDmi = (req,res) =>{
      
    if(req.cookies.userId && req.session.user !== undefined) {
        var finalPath = path.join(__dirname, '../public', 'dmi.html')


        res.sendFile(finalPath, function (err) {
            if (err) {
                console.log(err)
            } else {
                // console.log('Sent:', finalPath)
            }
        })
    }
    else {
        res.redirect('./auth.html')
    }

}



//get-dmi-hrms.html page
const getDmiHrms = (req,res) =>{
  
    if(req.cookies.userId && req.session.user !== undefined) {
        //res.redirect(`./insertDmi.html`)

        var finalPath = path.join(__dirname, '../public', 'dmi-hrms.html')


        res.sendFile(finalPath, function (err) {
            if (err) {
                console.log(err)
            } else {
                // console.log('Sent:', finalPath)
            }
        })
    }
    else {
        res.redirect('./auth.html')
    }

}






//////////////////////////////////////////////////////////////

module.exports = {  getIndex, getInsertDmi ,getDmi, getDmiHrms, getSessions, getLogout }