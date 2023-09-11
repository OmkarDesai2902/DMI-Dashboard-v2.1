const express = require('express')
const router = express.Router()
const { getAllDmis, getDmi, getDmiInd, updateDmi, deleteDmi, getBranchDmis, createDmi, getHrmsDmi ,
    getDmiIndHrms , updateDmiHrms , deleteDmiHrms,
    userAuth
} = require('../controllers/dmis')


router.route('/branch/:branchID').get(getBranchDmis)

router.route('/').get(getAllDmis).post(createDmi)
router.route('/:id').get(getDmi)

router.route('/hrms/:id').get(getHrmsDmi)

router.route('/:Code__c/:Active_Status__c/:Products__c/:Name__c/:Contact__c/:Email__c/:Mobile__c/:HR_Branch_ID/:Branch_Name_C/:BranchID/:isPartner/:VendorId/:isHypervergeEnabled/:asset_type/:opsCheckList/:2FA_MobileNo_Validation/:TW_FLS_JOURNEY/:PAN/:PreLogin_PAN_Uuid/:PreLogin_SELFIE_Uuid/:App_Registration_Done/:FLS_TARGET/:mandateType/:DID_Number/:isDigioKycEnabled/:Ifsc_No/:Account_No/:allowDigilockerSkip/:allowAccountAggregator/:mandatoryVehicleInsurance/:LastLogin_TimeStamp')
.get(getDmiInd)
.patch(updateDmi)
.delete(deleteDmi)

router.route('/:PersonnelNumber/:Name/:EmployeeSubgroup/:PositionText/:DateOfBirth/:DateOfJoining/:StrategicBusinessGroup/:BusinessUnit/:OrgUnit/:PersonnelArea/:BaseLocation/:BaseLocationText/:Gender/:Job/:EmailID/:ZONE/:STATE/:STATECODE/:ISPSNo/:ISName/:NSPSNo/:NSName/:DHPSNo/:DHName/:MOBILENO/:isEnable/:MCCODE')
.get(getDmiIndHrms)
.patch(updateDmiHrms)
.delete(deleteDmiHrms)

router.route('/userauth').post(userAuth)

module.exports = router
