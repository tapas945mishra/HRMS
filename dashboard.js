
var requestedLeaveList = null;
var requestedLeaveListL2 = null;
var employeeOnLeave = null;
var leaveRequest = null;
var grivanceDetail = null;
var actionID = null;

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        //debugger
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        console.log("deviceready");
        //console.log(FileTransfer);
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        //var parentElement = document.getElementById('deviceready');
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //getProfile();
        //getTask();
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();

ons.bootstrap().controller('AdminController', function ($scope, $http) {
    $scope.data = "NONE";
});
ons.ready(function () {
    console.log("Onsen UI is ready!");
});

$(document).ready(function () {

    employeeID = getUrlVars()["employeeID"];
    attendanceID = getUrlVars()["attendanceID"];
    loginDate = getUrlVars()["loginDate"];
    deviceID = getUrlVars()["deviceID"];

    fn.load('employeeLeave.html', '')
    
});

/* Leave Section */
function getEmployeeOnLeaveRequest() {
    showLoader();
    if (deviceID != null && deviceID != '' && deviceID != undefined) {
        $.ajax({cache: false,
            async: true,
            crossDomain: true,
            type: "GET",
            dataType: "json",
            url: urlInit + "Leaves/getEmployeeOnLeaveRequest",
            contentType: 'text/plain',
            headers: {
                "Access-Control-Allow-Origin": origin
            },
            data: {
                "deviceID": deviceID
            },
            success: function (d) {

                if (d.ONLEV_AUTH) {
                    showEmployeeOnLeave(d.ONLEV);
                }
                else {
                    $("#cardEmployeeOnLeave").hide();
                }

                if (d.REQLEVL1_AUTH) {
                    showRequestedLeaveL1(d.REQLEV);
                }
                else {
                    $("#cardLeaveRequested").hide();
                }

                if (d.REQLEVL2_AUTH) {
                    showRequestedLeaveL2(d.FORDLEV);
                }
                else {
                    $("#cardLeaveRequestedL2").hide();
                }
                

                hideLoader();
            },
            error: function (err) {
                showAlert("Something went wrong!!!\n" + err.responseText,0);
                refHideAlert("");
                hideLoader();
            }
        });
    }
    else {
        showAlert("You are not a registered user!!!",0);
        refHideAlert("");
        hideLoader();
    }
}
function showRequestedLeaveL1(d) {
    requestedLeaveList = d;
    var requestedLeave = "";
    $("#lstLeaveRequested").find($("ons-list-item")).remove();
    if (d.length > 0) {
        for (var i = 0; i < d.length; i++) {
            requestedLeave += "<ons-list-item modifier='longdivider' expandable>" +
                "<div class='left'>" +
                "<img src='" + d[i].PHOTO + "' alt='" + d[i].NAME + "' class='list-item__thumbnail' />" +
                "</div>" +
                "<div class='center'>" +
                "<span class='list-item__title'><b>" + d[i].NAME + " (" + d[i].DESIGNATION + ") </b></span>" +
                "<span class='list-item__title'>" + d[i].BRANCH + ", " + d[i].DEPARTMENT + "</span>" +
                "<span class='list-item__title'><b>From : </b>" + d[i].FROM + " <b>To : </b>" + d[i].TO + "</span>" +
                "<span class='list-item__title'><b>Incharge Person : </b>" + d[i].INCHARGE_PERSON + "</span>" +
                "</div>" +
                "<div class='expandable-content'>" +
                "<p><ons-button onclick=\"actionLeaveApproval('dialogLeaveApproval','" + d[i].ID + "','" + d[i].FROM_DT + "','" + d[i].TO_DT + "',1)\">Action</ons-button></p>" +
                "<p><b>Type : </b> " + d[i].TYPE + "</p>" +
                "<p><b>Days : </b> " + d[i].DAYS + "</p>" +
                "<p><b>Description : </b> " + d[i].DESCRIPTION + "</p>" +
                "</div> " +
                "</ons-list-item>";
        }
    }
    else {
        requestedLeave += "<ons-list-item> No record found!!!</ons-list-item>";
    }

    $(requestedLeave).appendTo($("#lstLeaveRequested"));
}
function showRequestedLeaveL2(d) {
    requestedLeaveListL2 = d;
    var requestedLeaveL2 = "";
    $("#lstLeaveRequestedL2").find($("ons-list-item")).remove();
    if (d.length > 0) {

        for (var i = 0; i < d.length; i++) {
            requestedLeaveL2 += "<ons-list-item modifier='longdivider' expandable>" +
                "<div class='left'>" +
                "<img src='" + d[i].PHOTO + "' alt='" + d[i].NAME + "' class='list-item__thumbnail' />" +
                "</div>" +
                "<div class='center'>" +
                "<span class='list-item__title'><b>" + d[i].NAME + " (" + d[i].DESIGNATION + ") </b></span>" +
                "<span class='list-item__title'>" + d[i].BRANCH + ", " + d[i].DEPARTMENT + "</span>" +
                "<span class='list-item__title'><b>From : </b>" + d[i].FROM + " <b>To : </b>" + d[i].TO + "</span>" +
                "<span class='list-item__title'><b>Incharge Person : </b>" + d[i].INCHARGE_PERSON + "</span>" +
                "</div>" +
                "<div class='expandable-content'>" +
                "<p><ons-button onclick=\"actionLeaveApproval('dialogLeaveApproval','" + d[i].ID + "','" + d[i].FROM_DT + "','" + d[i].TO_DT + "',2)\">Action</ons-button></p>" +
                "<p><b>Type : </b> " + d[i].TYPE + "</p>" +
                "<p><b>Days : </b> " + d[i].DAYS + "</p>" +
                "<p><b>Description : </b> " + d[i].DESCRIPTION + "</p>" +
                "</div> " +
                "</ons-list-item>";
        }
    }
    else {
        requestedLeaveL2 += "<ons-list-item> No record found!!!</ons-list-item>";
    }

    $(requestedLeaveL2).appendTo($("#lstLeaveRequestedL2"));
}
function showEmployeeOnLeave(d) {
    employeeOnLeave = d;
    var onLeave = "";
    $("#lstEmployeeOnLeave").find($("ons-list-item")).remove();
    if (d.length > 0) {

        for (var i = 0; i < d.length; i++) {
            onLeave +=  "<ons-list-item modifier='longdivider' expandable>" +
                "<div class='left'>" +
                "<img src='" + d[i].PHOTO + "' alt='" + d[i].NAME + "' class='list-item__thumbnail' />" +
                "</div>" +
                "<div class='center'>" +
                "<span class='list-item__title'><b>" + d[i].NAME + " (" + d[i].DESIGNATION + ") </b></span>" +
                "<span class='list-item__title'>" + d[i].BRANCH + ", " + d[i].DEPARTMENT + "</span>" +
                "<span class='list-item__title'><b>From : </b>" + d[i].FROM + " <b>To : </b>" + d[i].TO + "</span>" +
                "<span class='list-item__title'><b>Incharge Person : </b>" + d[i].INCHARGE_PERSON + "</span>" +
                "</div>" +
                "<div class='expandable-content'><b>Description : </b>" + d[i].DESCRIPTION + "" +
                "</div> " +
                "</ons-list-item>";
        }
    }
    else {
        onLeave += "<ons-list-item> No employees on leave for next 30 days!!!</ons-list-item>";
    }

    $(onLeave).appendTo($("#lstEmployeeOnLeave"));

}
function actionLeaveApproval(dialogID, recordID, minDT, maxDT, level) {
    actionID = recordID;
    $("#txtLeaveApprovalFD").val(minDT).change();
    $("#txtLeaveApprovalTD").val(maxDT).change();
    $("#txtLeaveApprovalFD").attr("min", minDT).attr("max", maxDT);
    $("#txtLeaveApprovalTD").attr("min", minDT).attr("max", maxDT);
    $("#ddlLeaveApprovalStatus").val(0);
    $("#txtLeaveApprovalDescription").val("");
    if (level == 1) {
        if ($("#ddlLeaveApprovalStatus option[value='F']").length == 0) {
            $("#ddlLeaveApprovalStatus").append('<option value="F">Forward</option>');
        }
    }
    else {
        if ($("#ddlLeaveApprovalStatus option[value='F']").length > 0) {
            $("#ddlLeaveApprovalStatus option[value='F']").remove();
        }
    }
    showDialog(dialogID);
}
function approveRejectLeave()
{
    if (actionID != null) {
        showLoader();

        var leave = {
            Sl_No: actionID,
            f_date: $("#txtLeaveApprovalFD").val(),
            t_date: $("#txtLeaveApprovalTD").val(),
            lvl1_sts: $("#ddlLeaveApprovalStatus").val(),
            lvl2_sts: $("#ddlLeaveApprovalStatus").val(),
            lvl3_sts: $("#ddlLeaveApprovalStatus").val(),
            Status: $("#ddlLeaveApprovalStatus").val(),
            Reason: $("#txtLeaveApprovalDescription").val(),
            No_Of_Approve_day: $("#txtLeaveApprovalDays").val(),
            Approve_by: employeeID
        };

        if ($("#ddlLeaveApprovalStatus").val() != 0 && $.trim($("#txtLeaveApprovalDays").val()) != "" && $.trim($("#txtLeaveApprovalDescription").val()) != "")
        {
            if ($("#ddlLeaveApprovalStatus").val() == 'F') {
                leave.lvl2_sts = 'P';
                leave.lvl3_sts = 'P';
                leave.Status = 'F';
            }

            $.ajax({
                cache: false,
                async: true,
                crossDomain: true,
                type: "POST",
                dataType: "json",
                url: urlInit + "Leaves/approveRejectLeave",
                contentType: 'application/json',
                headers: {
                    "Access-Control-Allow-Origin": origin
                },
                data: JSON.stringify(leave),
                success: function (data) {
                    if (data.code == "1") {
                        hideLoader();
                        hideDialog('dialogLeaveApproval');
                        showAlert(data.message,data.code);
                        refHideAlert('');
                        getEmployeeOnLeaveRequest();
                        resetApproveRejectLeave();
                    }
                    else {
                        hideLoader();
                        hideDialog('dialogLeaveApproval');
                        showAlert(data.message,data.code);
                        refHideAlert('dialogLeaveApproval');
                    }
                },
                error: function (err) {
                    hideLoader();
                    hideDialog('dialogLeaveApproval');
                    showAlert('Something went wrong!!!</br>'+err.responseText,0);
                    refHideAlert('');
                }
            });
        }
        else {
            hideLoader();
            hideDialog('dialogLeaveApproval');
            showAlert('(*) Marked fields are mandatory!!!',2);
            refHideAlert('dialogLeaveApproval');
        }
    }
    else {
        hideLoader();
        hideDialog('dialogLeaveApproval');
        showAlert('Please select a record!!!',2);
        refHideAlert('');
    }
}
function resetApproveRejectLeave()
{
    actionID = null;
    $("#txtLeaveApprovalFD").val("");
    $("#txtLeaveApprovalTD").val("");
    $("#ddlLeaveApprovalStatus").val(0);
    $("#txtLeaveApprovalDescription").val("");
    $("#txtLeaveApprovalDays").val("");
}
/* Leave Section */

/* Grivance Section */
function getEmployeeGrivance() {
    showLoader();
    if (deviceID != null && deviceID != '' && deviceID != undefined) {
        $.ajax({cache: false,
            async: true,
            crossDomain: true,
            type: "GET",
            dataType: "json",
            url: urlInit + "Grivance/getEmployeeGrivance",
            contentType: 'text/plain',
            headers: {
                "Access-Control-Allow-Origin": origin
            },
            data: {
                "deviceID": deviceID
            },
            success: function (d) {
                showEmployeeGrivance(d.data);
                hideLoader();
            },
            error: function (err) {
                showAlert("Something went wrong!!!\n" + err.responseText,0);
                refHideAlert("");
                hideLoader();
            }
        });
    }
    else {
        showAlert("You are not a registered user!!!",0);
        refHideAlert("");
        hideLoader();
    }
}
function showEmployeeGrivance(d) {
    
    grivanceDetail = d;
    var employeeGrivanceCount = 0;
    var employeeGrivance = "";

    $("#lstEmployeeGrivance").find($("ons-list-item")).remove();
    if (employeeID == 5 || employeeID == 25 || employeeID == 250) 
    {
        if (d.length > 0) {
            for (var i = 0; i < d.length; i++) {
                if (d[i].FLAG == 0) {
                    employeeGrivanceCount++;
                    employeeGrivance += "<ons-list-item modifier='longdivider' expandable>" +
                        "<div class='left'>" +
                        "<img src='" + d[i].PHOTO + "' alt='" + d[i].NAME + "' class='list-item__thumbnail' />" +
                        "</div>" +
                        "<div class='center'>" +
                        "<span class='list-item__title'><b>Name:</b>" + d[i].NAME + "</span>" +
                        "<span class='list-item__title'><b>Date:</b>" + d[i].DATE + "</i></b></span>" +
                        "<span class='list-item__title'><b>Subject:</b>" + d[i].SUBHEADER + "</span>" +
                        "</div>" +
                        "<div class='right'>" +
                        (d[i].STATUS == 0 ? '<i class="fa fa-clock" aria-hidden="true" style="color:#795548; font-size:1.5em;"></i>' : d[i].STATUS == 1 ? '<i class="fa fa-thumbs-up" aria-hidden="true" style="color:green; font-size:1.5em;"></i>' : d[i].STATUS == 2 ? '<i class="fa fa-thumbs-down" aria-hidden="true" style="color:#780102; font-size:1.5em;"></i>' : '<i class="fa fa-hand-o-right" aria-hidden="true" style="color:black; font-size: 1.5em;"></i>') +
                        "</div>" +
                        "<div class='expandable-content'>" +
                        "<p>" +
                        "<ons-button onclick=\"approveRejectGrivance('" + d[i].ID + "','1')\"><i class='fa fa-check' aria-hidden='true'></i></ons-button>&nbsp; &nbsp;" +
                        "<ons-button onclick=\"approveRejectGrivance('" + d[i].ID + "','2')\"><i class='fa fa-ban' aria-hidden='true'></i></ons-button>" +
                        "</p> " +
                        "<p><b>Detail : </b>" + d[i].QUERIES + "</p>" +
                        "</div> " +
                        "</ons-list-item>";
                }

            }
        }
        if (employeeGrivanceCount == 0) { employeeGrivance += "<ons-list-item> No record found!!!</ons-list-item>"; }
        $(employeeGrivance).appendTo($("#lstEmployeeGrivance"));
    }
    else {
        employeeGrivance += "<ons-list-item> You are not authorized!!!</ons-list-item>";
        $(employeeGrivance).appendTo($("#lstEmployeeGrivance"));
    }
}
function approveRejectGrivance(recordID, status)
{
    showLoader();

    var grivance = {
        ID: recordID,
        STATUS: status
    };

    $.ajax({
        cache: false,
        async: true,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        url: urlInit + "Grivance/approveRejectGrivance",
        contentType: 'application/json',
        headers: {
            "Access-Control-Allow-Origin": origin
        },
        data: JSON.stringify(grivance),
        success: function (data) {
            if (data.code == "1") {
                hideLoader();
                showAlert(data.message,data.code);
                refHideAlert('');
                getEmployeeGrivance();
            }
            else {
                hideLoader();
                showAlert(data.message,data.code);
                refHideAlert('');
            }
        },
        error: function (err) {
            hideLoader();
            showAlert('Something went wrong!!!</br>' + err.responseText,0);
            refHideAlert('');
        }
    });
}
/* Grivance Section */

/* Resignation Section */
function getResignationStatus() {
    showLoader();
    $.ajax({cache: false,
        async: true,
        crossDomain: true,
        type: "GET",
        dataType: "json",
        url: urlInit + "Resignation/getEmployeeResignation",
        contentType: 'text/plain',
        headers: {
            "Access-Control-Allow-Origin": origin
        },
        data: {
            "deviceID": deviceID
        },
        success: function (data) {
            showResignationStatus(data);
            hideLoader();
        },
        error: function (err) {
            showAlert("Something went wrong!!!\n" + err.responseText,0);
            refHideAlert("");
            hideLoader();
        }
    });
}
function showResignationStatus(d) {

    var resignationCount = 0;
    var resignstionStstus = "";
    $("#lstResignationStatus").find($("ons-list-item")).remove();
    if (d.length > 0) {

        for (var i = 0; i < d.length; i++) {

            resignationCount++;
            resignstionStstus += "<ons-list-item modifier='longdivider' expandable>" +
                "<div class='left'>" +
                "<img src='" + d[i].PHOTO + "' alt='" + d[i].NAME + "' class='list-item__thumbnail' />" +
                "</div>" +
                "<div class='center'>" +
                "<span class='list-item__title'><b>Name : </b>" + d[i].NAME + "</span>" +
                "<span class='list-item__title'><b>Applied On :</b>" + d[i].DATE + "</span>" +
                "</div>" +
                "<div class='right'>" +
                (d[i].FLAG == 0 ? '<i class="fa fa-clock" aria-hidden="true" style="color:#795548; font-size:1.5em;"></i>' : d[i].FLAG == 1 ? '<i class="fa fa-thumbs-up" aria-hidden="true" style="color:green; font-size:1.5em;"></i>' : d[i].FLAG == 2 ? '<i class="fa fa-thumbs-down" aria-hidden="true" style="color:#780102; font-size:1.5em;"></i>' : '<i class="fa fa-hand-o-right" aria-hidden="true" style="color:black; font-size:1.5em;"></i>') +
                "</div>" +
                "<div class='expandable-content'>" + (d[i].FLAG == 0 ? "<p><ons-button onclick=\"actionResignationApproval('dialogResignationApproval','" + d[i].ID + "')\">Action</ons-button></p>" : "") +
                "<p><b>Last Date :</b>" + d[i].LAST_WORKING_DATE + "</p>" +
                "<p><b>Reason : </b>" + d[i].REASON + "</p>" +
                "</div> " +
                "</ons-list-item>";

        }
    }


    if (resignationCount > 0) {
        $(resignstionStstus).appendTo($("#lstResignationStatus"));
    }
    else {
        $("<ons-list-item>No resignation found!!!</ons-list-item>").appendTo($("#lstResignationStatus"));
    }
}
function actionResignationApproval(dialogID, recordID) {
    actionID = recordID;
    $("#ddlResignationApprovalStatus").val(0);
    $("#txtResignationApprovalDescription").val("");
    $("#txtResignationLD").val("");
    showDialog(dialogID);
}
function approveRejectResignation() {
    if (actionID != null) {
        showLoader();
        if ($("#ddlResignationApprovalStatus").val() != 0 && $.trim($("#txtResignationApprovalDescription").val()) != "") {

            if (($("#ddlResignationApprovalStatus").val() == 'R') || ($("#ddlResignationApprovalStatus").val() == 'A' && $.trim($("#txtResignationLD").val()) != "")) {
                var resignation = {
                    Id: actionID,
                    lvl1_sts: $("#ddlResignationApprovalStatus").val(),
                    lvl2_sts: $("#ddlResignationApprovalStatus").val(),
                    lvl3_sts: $("#ddlResignationApprovalStatus").val(),
                    Approvedby: employeeID,
                    LastWorkingDate: $("#txtResignationLD").val(),
                    Other_Comment: $("#txtResignationApprovalDescription").val()
                };
                
                $.ajax({
                    cache: false,
                    async: true,
                    crossDomain: true,
                    type: "POST",
                    dataType: "json",
                    url: urlInit + "Resignation/approveRejectResignation",
                    contentType: 'application/json',
                    headers: {
                        "Access-Control-Allow-Origin": origin
                    },
                    data: JSON.stringify(resignation),
                    success: function (data) {
                        if (data.code == "1") {
                            actionID = null;
                            hideLoader();
                            hideDialog('dialogResignationApproval');
                            showAlert(data.message,data.code);
                            refHideAlert('');
                            getResignationStatus();
                        }
                        else {
                            hideLoader();
                            hideDialog('dialogResignationApproval');
                            showAlert(data.message,data.code);
                            refHideAlert('dialogResignationApproval');
                        }
                    },
                    error: function (err) {debugger
                        hideLoader();
                        hideDialog('dialogResignationApproval');
                        showAlert('Something went wrong!!!</br>' + err.responseText,0);
                        refHideAlert('');
                    }
                });
            }
            else {
                hideLoader();
                hideDialog('dialogResignationApproval');
                showAlert('Please enter laste working date!!!',2);
                refHideAlert('dialogResignationApproval');
            }
            
        }
        else {
            hideLoader();
            hideDialog('dialogResignationApproval');
            showAlert('All fields are mandatory!!!',2);
            refHideAlert('dialogResignationApproval');
        }
    }
    else {
        hideLoader();
        hideDialog('dialogResignationApproval');
        showAlert('Please select a record!!!',2);
        refHideAlert('');
    }
}
/* Resignation Section */

/* Transfer Section */
function getTransferStatus() {
    showLoader();
    $.ajax({
        cache: false,
        async: true,
        crossDomain: true,
        type: "GET",
        dataType: "json",
        url: urlInit + "Transfer/getEmployeeTransfer",
        contentType: 'text/plain',
        headers: {
            "Access-Control-Allow-Origin": origin
        },
        data: {
            "deviceID": deviceID
        },
        success: function (data) {
            showTransferStatus(data);
            hideLoader();
        },
        error: function (err) {
            showAlert("Something went wrong!!!\n" + err.responseText,2);
            refHideAlert("");
            hideLoader();
        }
    });
}
function showTransferStatus(d) {

    var transferCount = 0;
    var transferStstus = "";
    $("#lstTransferStatus").find($("ons-list-item")).remove();
    if (d.length > 0) {

        for (var i = 0; i < d.length; i++) {

            transferCount++;
            transferStstus += "<ons-list-item modifier='longdivider' expandable>" +
                "<div class='left'>" +
                "<img src='" + d[i].PHOTO + "' alt='" + d[i].NAME + "' class='list-item__thumbnail' />" +
                "</div>" +
                "<div class='center'>" +
                "<span class='list-item__title'><b>Name</b> : " + d[i].NAME + "</span>" +
                "<span class='list-item__title'><b>Branch</b> : " + d[i].FROM_BRANCH + ",<b> Dept.</b> :" + d[i].FROM_DEPARTMENT + "</span>" +
                "</div>" +
                "<div class='right'>" + 
                (d[i].FLAG == 1 ? '<i class="fa fa-clock" aria-hidden="true" style="color:#795548; font-size:1.5em;"></i>' : d[i].FLAG == 2 ? '<i class="fa fa-thumbs-up" aria-hidden="true" style="color:green; font-size:1.5em;"></i>' : d[i].FLAG == 3 ? '<i class="fa fa-thumbs-down" aria-hidden="true" style="color:#780102; font-size:1.5em;"></i>' : '<i class="fa fa-hand-o-right" aria-hidden="true" style="color:black; font-size:1.5em;"></i>') +
                "</div>" +
                "<div class='expandable-content'>" + (d[i].FLAG == 1 ? "<p><ons-button onclick=\"actionTransferApproval('dialogTransferApproval','" + d[i].ID + "')\">Action</ons-button></p>" : "") +
                "<p><b>To Branch.</b> : " + d[i].TO_BRANCH + "</p>" +
                "<p><b>To Dept.</b> : " + d[i].TO_DEPARTMENT + "</p>" +
                "<p><b>DOT :</b> " + d[i].DOT + "</p>" +
                "<p><b>DOJ :</b> " + d[i].DOJ + "</p>" +
                "<p><b>Remark</b> : " + d[i].REMARK + "</p>" +
                "</div> " +
                "</ons-list-item>";

        }
    }


    if (transferCount > 0) {
        $(transferStstus).appendTo($("#lstTransferStatus"));
    }
    else {
        $("<ons-list-item>No record found!!!</ons-list-item>").appendTo($("#lstTransferStatus"));
    }
}
function actionTransferApproval(dialogID, recordID) {
    actionID = recordID;
    showDialog(dialogID);
}
function approveRejectTransfer() {
    if (actionID != null) {
        showLoader();
        if ($("#ddlTransferApprovalStatus").val() != 0 && $.trim($("#txtTransferApprovalDescription").val()) != "") {
            var leave = {
                Transfer_id: actionID,
                lvl1_sts: $("#ddlTransferApprovalStatus").val(),
                lvl2_sts: $("#ddlTransferApprovalStatus").val(),
                lvl3_sts: $("#ddlTransferApprovalStatus").val(),
                Status: $("#ddlTransferApprovalStatus").val(),
                other_comment: $("#txtTransferApprovalDescription").val()
            };

            $.ajax({
                cache: false,
                async: true,
                crossDomain: true,
                type: "POST",
                dataType: "json",
                url: urlInit + "Transfer/approveRejectTransfer",
                contentType: 'application/json',
                headers: {
                    "Access-Control-Allow-Origin": origin
                },
                data: JSON.stringify(leave),
                success: function (data) {
                    if (data.code == "1") {
                        actionID = null;
                        hideLoader();
                        hideDialog('dialogTransferApproval');
                        showAlert(data.message,data.code);
                        refHideAlert('');
                        getTransferStatus();
                    }
                    else {
                        hideLoader();
                        hideDialog('dialogTransferApproval');
                        showAlert(data.message,data.code);
                        refHideAlert('dialogTransferApproval');
                    }
                },
                error: function (err) {
                    hideLoader();
                    hideDialog('dialogTransferApproval');
                    showAlert('Something went wrong!!!</br>' + err.responseText,data.code);
                    refHideAlert('');
                }
            });
        }
        else {
            hideLoader();
            hideDialog('dialogTransferApproval');
            showAlert('All fields are mandatory!!!',data.code);
            refHideAlert('dialogTransferApproval');
        }
    }
    else {
        hideLoader();
        hideDialog('dialogTransferApproval');
        showAlert('Please select a record!!!',data.code);
        refHideAlert('');
    }
}
/* Transfer Section */


/* Attendance Section */
function getAttendanceDetail() {
    showLoader();
    var result = valicateAttendanceSearch();
    var month = $("#txtAttChkSearchDate").val() == undefined ? null : $("#txtAttChkSearchDate").val();
    if (result == "") {
        $.ajax({
            cache: false,
            async: true,
            crossDomain: true,
            type: "GET",
            dataType: "json",
            url: urlInit + "Profiles/attendanceDetail",
            contentType: 'text/plain',
            headers: {
                "Access-Control-Allow-Origin": origin
            },
            data: {
                "branchID": $('#ddlAttChkEmployeeBranch').val(),
                "employeeID": $('#ddlAttChkEmployee').val(),
                "date": month
            },
            success: function (data) {
                showAttendanceDetail(data);
                hideLoader();
            },
            error: function (err) {
                showAlert("Something went wrong!!!\n" + err.responseText,0);
                refHideAlert("");
                hideLoader();
            }
        });
    }
    else {
        showAlert(result,2);
        refHideAlert("");
        hideLoader();
    }
}
function showAttendanceDetail(at) {
    var attendanceDetail = "";
    $("#lstAttendance").find($("ons-list-item")).remove();
    if (at.length > 0) {
        if ($('#ddlAttChkEmployee').val() == 0)
        {
            for (var i = 0; i < at.length; i++)
            {
                attendanceDetail += "<ons-list-item modifier='longdivider'>" +
                    "<div class='left'>" +
                    "<img src='" + at[i].PHOTO + "' alt='" + at[i].NAME + "' class='list-item__thumbnail' />" +
                    "</div>" +
                    "<div class='center'>" +
                    "<span class='list-item__title'><ons-row><ons-col width='15%' style='text-align:left;'><b>Name</b></ons-col><ons-col width='5%' style='text-align:left;'>:</ons-col><ons-col width='80%' style='text-align:left;'><b>" + at[i].NAME + "</b></ons-col></ons-row></span>" +
                    "<span class='list-item__title'><ons-row><ons-col width='15%' style='text-align:left;'><b>In</b></ons-col><ons-col width='5%' style='text-align:left;'>:</ons-col><ons-col width='80%' style='text-align:left;'><b>" + at[i].IN + "</b>, " + at[i].IN_AT + "</ons-col></ons-row></span>" +
                    "<span class='list-item__title'><ons-row><ons-col width='15%' style='text-align:left;'><b>Out</b></ons-col><ons-col width='5%' style='text-align:left;'>:</ons-col><ons-col width='80%' style='text-align:left;'><b>" + at[i].OUT + "</b>, " + at[i].OUT_AT + "</ons-col></ons-row></span>" +
                    "</div>" +
                    "</ons-list-item>";
            }
            
        }
        else {
            for (var i = 0; i < at.length; i++) {
                attendanceDetail += "<ons-list-item modifier='longdivider'>" +
                    "<div class='center'>" +
                    "<span class='list-item__title'><ons-row><ons-col width='15%' style='text-align:left;'><b>Date</b></ons-col><ons-col width='5%' style='text-align:left;'>:</ons-col><ons-col width='80%' style='text-align:left;'><b>" + at[i].DATE + "</b></ons-col></ons-row></span>" +
                    "<span class='list-item__title'><ons-row><ons-col width='15%' style='text-align:left;'><b>In</b></ons-col><ons-col width='5%' style='text-align:left;'>:</ons-col><ons-col width='80%' style='text-align:left;'><b>" + at[i].IN + "</b>, " + at[i].IN_AT + "</ons-col></ons-row></span>" +
                    "<span class='list-item__title'><ons-row><ons-col width='15%' style='text-align:left;'><b>Out</b></ons-col><ons-col width='5%' style='text-align:left;'>:</ons-col><ons-col width='80%' style='text-align:left;'><b>" + at[i].OUT + "</b>, " + at[i].OUT_AT + "</ons-col></ons-row></span>" +
                    "</div>" +
                    "</ons-list-item>";
            }
        }
        //for (var i = 0; i < at.length; i++) {
        //    attendanceDetail += "<ons-list-item modifier='longdivider' expandable>" +
        //        "<ons-row>" +
        //        "<ons-col width='40%'>" + at[i].DATE + "</ons-col>" +
        //        "<ons-col width='30%'>" + (at[i].ATTE.length > 0 ? at[i].ATTE[0].IN : "--") + "</ons-col>" +
        //        "<ons-col width='30%'>" + (at[i].ATTE.length > 0 ? at[i].ATTE[0].OUT : "--") + "</ons-col>" +
        //        //"<ons-col>" + (at[i].ATTE.length > 0 ? at[i].ATTE[0].STATUS : "--") + "</ons-col>" +
        //        "</ons-row>" +
        //        "<div class='expandable-content'>" +
        //        "<p><b>In At : </b>" + (at[i].ATTE.length > 0 ? at[i].ATTE[0].IN_ADDR : "--") + "</p>" +
        //        "<p><b>Out At : </b>" + (at[i].ATTE.length > 0 ? at[i].ATTE[0].OUT_ADDR : "--") + "</p>" +
        //        "</div>" +
        //        "</ons-list-item>";

        //}
    }
    else {
        attendanceDetail += "<ons-list-item>No attendance found!!!</ons-list-item>";
    }
    $(attendanceDetail).appendTo($("#lstAttendance"));
}
function valicateAttendanceSearch()
{
    var message = "";

    if ($('#ddlAttChkEmployeeBranch').val() == 0) {
        message += "Please select branch.</br>";
    }
    return message;
}
/* Attendance Section */

/* ID Card Approval */
function getIDCardRequestForApproval() {
    showLoader();
    if (employeeID != null && employeeID != '' && employeeID != undefined) {
        $.ajax({
            cache: false,
            async: true,
            crossDomain: true,
            type: "GET",
            dataType: "json",
            url: urlInit + "IDCardRequest/getIDCardRequestStatus",
            contentType: 'text/plain',
            headers: {
                "Access-Control-Allow-Origin": origin
            },
            data: {
                "deviceID": deviceID,
                "type": "approval"
            },
            success: function (data) {
                showIDCardRequestForApproval(data);
                hideLoader();
            },
            error: function (err) {
                showAlert("Something went wrong!!!\n" + err.responseText, 0);
                refHideAlert("");
                hideLoader();
            }
        });
    }
    else {
        showAlert("You are not a registered user!!!", 0);
        refHideAlert("");
        hideLoader();
    }

}
function showIDCardRequestForApproval(d) {
    IDCardRequestList = d;
    var IDCardRequest = "";
    $("#lstSelfIDCardRequestStatus").find($("ons-list-item")).remove();
    if (d.length > 0) {
        for (var i = 0; i < d.length; i++) {
            IDCardRequest += "<ons-list-item modifier='longdivider' expandable>" +
                "<div class='left'>" +
                "<img src='" + d[i].PHOTO + "' alt='" + d[i].NAME + "' class='list-item__thumbnail' />" +
                "</div>" +
                "<div class='center'>" +
                "<span class='list-item__title'><b>Name : </b>" + d[i].NAME  + " </span>" +
                "<span class='list-item__title'><b>Branch : </b>" + d[i].BRANCH + " </span>" +
                "<span class='list-item__title'><b>Department : </b>" + d[i].DEPARTMENT + " </span>" +
                "<span class='list-item__title'><b>Designation : </b>" + d[i].DESIGNATION + " </span>" +
                "<span class='list-item__title'><b>Applied On : </b>" + d[i].APPLIED_ON +"</span>" +
                "</div>" +
                "<div class='expandable-content'>" +
                "<p>" + (d[i].STATUS == 0 ? "<ons-button onclick=\"approveRejectIDCardRequest('" + d[i].ID + "',1)\"><i class='fa fa-thumbs-up' aria-hidden='true'></i></ons-button>&nbsp;&nbsp;<ons-button onclick=\"approveRejectIDCardRequest('" + d[i].ID + "',2)\"><i class='fa fa-thumbs-down' aria-hidden='true'></i></ons-button>" : "") + "</p>" +
                "</div> " +
                "</ons-list-item>";
        }
    }
    else {
        IDCardRequest += "<ons-list-item> No record found!!!</ons-list-item>";
    }

    $(IDCardRequest).appendTo($("#lstSelfIDCardRequestStatus"));
}
function approveRejectIDCardRequest(id, status)
{
    showLoader();
    var idcard = {
        ID: id,
        EMP_ID: employeeID,
        STATUS: status
    };

    $.ajax({
        cache: false,
        async: true,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        url: urlInit + "IDCardRequest/approveRejectIDCardRequest",
        contentType: 'application/json',
        headers: {
            "Access-Control-Allow-Origin": origin
        },
        data: JSON.stringify(idcard),
        success: function (data) {
            if (data.code != "0") {
                getIDCardRequestForApproval();
                showAlert(data.message, data.code);
                refHideAlert("");
            }
            else {
                showAlert(data.message, data.code);
                refHideAlert("");
            }
            hideLoader();
        },
        error: function (err) {
            showAlert("Something went wrong!!!\n" + err.responseText, 0);
            refHideAlert("");
            hideLoader();
        }
    });
}
/* ID Card Approval */

/* Employee Rating */
function getEmployeeRating()
{
    showLoader();
    
    $.ajax({
        cache: false,
        async: true,
        crossDomain: true,
        type: "GET",
        dataType: "json",
        url: urlInit + "Profiles/getEmployeeRating",
        contentType: 'text/plain',
        headers: {
            "Access-Control-Allow-Origin": origin
        },
        data: {
            "branchID": $('#ddlRatingEmployeeBranch').val()
        },
        success: function (data) {
            showRatingDetail(data);
            hideLoader();
        },
        error: function (err) {
            showAlert("Something went wrong!!!\n" + err.responseText, 0);
            refHideAlert("");
            hideLoader();
        }
    });
    
}
function showRatingDetail(rt)
{
    var ratingDetail = "";
    $("#lstStarRating").find($("ons-list-item")).remove();
    if (rt.length > 0) {
        for (var i = 0; i < rt.length; i++) {
            ratingDetail += "<ons-list-item modifier='longdivider'>" +
                "<div class='left'>" +
                "<img src='" + rt[i].PHOTO + "' alt='" + rt[i].NAME + "' class='list-item__thumbnail' />" +
                "</div>" +
                "<div class='center'>" +
                "<span class='list-item__title'><b>" + rt[i].NAME + "</b>," + rt[i].DESIGNATION + "," + rt[i].DEPARTMENT + "</span>" +
                "<span class='list-item__title'><div class='starating' data-id='" + rt[i].EMP_ID + "' data-newrating='" + rt[i].RATING + "' data-presentrating='" + rt[i].RATING +"'></div></span>" +
                "</div>" +
                "</ons-list-item>";
        }
    }
    else {
        ratingDetail += "<ons-list-item>No employee found!!!</ons-list-item>";
    }
    $(ratingDetail).appendTo($("#lstStarRating"));

    $(".starating").each(function () {
        var initialRating = $(this).data("presentrating");
        $(this).starRating({
            starSize: 20,
            starShape: 'rounded',
            totalStars: 10,
            disableAfterRate: false,
            emptyColor: 'white',
            hoverColor: 'yellow',
            activeColor: '#F60762',
            initialRating: initialRating,
            strokeWidth: 1,
            useGradient: false,
            minRating: 0,
            useFullStars: true,
            callback: function (currentRating, el) {
                $($(el)[0]).data("newrating", currentRating);
            }
        });
    });
    
}
function saveEmployeeRating()
{
    showLoader();
    var totalEmployes = $(".starating");
    if (totalEmployes.length > 0)
    {
        var rating = new Array();
        $(".starating").each(function () {
            rating.push({
                EMP_ID: $(this).data("id"),
                RATING: $(this).data("newrating")
            });
        });

        $.ajax({
            cache: false,
            async: true,
            crossDomain: true,
            type: "POST",
            dataType: "json",
            url: urlInit + "Profiles/saveEmployeeRating?deviceID="+deviceID,
            contentType: 'application/json',
            headers: {
                "Access-Control-Allow-Origin": origin
            },
            data: JSON.stringify(rating),
            success: function (data) {
                showAlert(data.message, data.code);
                refHideAlert("");
                hideLoader();
            },
            error: function (err) {
                showAlert("Something went wrong!!!\n" + err.responseText, 0);
                refHideAlert("");
                hideLoader();
            }
        });
    }
    else {
        showAlert("No employees found!!!", 0);
        hideLoader();
    }
}
/* Employee Rating */

/*Employee EOD*/
function getEmployeeEodList() {
    if ($("#ddlEodEmployeeBranch").val() != 0) {
        showLoader();
        var date = $("#txtEodSearchDate").val() == undefined ? null : $("#txtEodSearchDate").val();
        $.ajax({
            cache: false,
            async: true,
            crossDomain: true,
            type: "GET",
            dataType: "json",
            url: urlInit + "Task/getEmployeeEodList",
            contentType: 'text/plain',
            headers: {
                "Access-Control-Allow-Origin": origin
            },
            data: {
                "branchID": $('#ddlEodEmployeeBranch').val(),
                "employeeID": $('#ddlEodEmployee').val(),
                "date": date
            },
            success: function (data) {
                showEmployeeEodList(data);
                hideLoader();
            },
            error: function (err) {
                showAlert("Something went wrong!!!\n" + err.responseText, 0);
                refHideAlert("");
                hideLoader();
            }
        });
    }
    else {
        showAlert("Please select branch!!!",0);
        refHideAlert("");
    }
}
function showEmployeeEodList(d)
{
    $("#lstEmployeeEodList").find($("ons-list-item:not('.search')")).remove();
    var employeeEodList = "";
    var eodCount = 0;
    if (d.length > 0)
    {
        if ($('#ddlEodEmployee').val() == 0) {
            for (var i = 0; i < d.length; i++) {
                employeeEodList += "<ons-list-item modifier='longdivider' expandable>" +
                    "<div class='left'>" +
                    "<img src='" + d[i].PHOTO + "' alt='" + d[i].NAME + "' class='list-item__thumbnail' />" +
                    "</div>" +
                    "<div class='center'>" +
                    "<span class='list-item__title'>" + d[i].DATE + "</span>" +
                    "<span class='list-item__title'>" + d[i].NAME + "</span>" +
                    "<span class='list-item__title'>" + d[i].BRIEF + "</span>" +
                    "</div>" +
                    "<div class='expandable-content'>" +
                    "<p><textarea type='text' style='height:300px;' id='txtEod" + d[i].ID +"'>" + d[i].DETAIL + "</textarea></p>" +
                    "<p><ons-button onclick=\"editEmployeeEod(" + d[i].ID + ",'txtEod" + d[i].ID + "')\">Edit</ons-button>&nbsp;&nbsp;<ons-button onclick=\"confirmDeleteEmployeeEod(" + d[i].ID + ")\">Delete</ons-button></p>" +
                    "</div > " +
                    "</ons-list-item>";
            }

        }
        else {
            employeeEodList += "<ons-list-item modifier='longdivider'>" +
                "<div class='center'><img src='" + d[0].PHOTO + "' alt='" + d[0].NAME + "' class='list-item__thumbnail'  style='max-height:100%; max-width:100%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);' /></div>"+ 
                               "</ons-list-item>"; 
            for (var i = 0; i < d.length; i++) {
                employeeEodList += "<ons-list-item modifier='longdivider' expandable>" +
                    "<div class='center'>" +
                    "<span class='list-item__title'>" + d[i].DATE + "</span>" +
                    "<span class='list-item__title'>" + d[i].BRIEF + "</span>" +
                    "</div>" +
                    "<div class='expandable-content'>" +
                    "<p><textarea type='text' style='height:300px;' id='txtEod" + d[i].ID +"'>" + d[i].DETAIL + "</textarea></p>" +
                    "<p><ons-button onclick=\"editEmployeeEod(" + d[i].ID + ",'txtEod" + d[i].ID + "')\">Edit</ons-button>&nbsp;&nbsp;<ons-button onclick=\"confirmDeleteEmployeeEod(" + d[i].ID + ")\">Delete</ons-button></p>" +
                    "</div > " +
                    "</ons-list-item>";
            }
        }
    }
    else {
        employeeEodList = "<ons-list-item modifier='longdivider'>No record found!!!</ons-list-item>";
    }
    $(employeeEodList).appendTo($("#lstEmployeeEodList"));
}
function editEmployeeEod(id, txtEod)
{
    if ($.trim($("#" + txtEod).val()) != "") {
        showLoader();
        var tD = {
            ID: id,
            T1: $.trim($("#" + txtEod).val()),
            employeeID: employeeID
        };

        $.ajax({
            cache: false,
            async: true,
            crossDomain: true,
            type: "POST",
            dataType: "json",
            url: urlInit + "Task/addUpdateTask",
            contentType: 'application/json',
            headers: {
                "Access-Control-Allow-Origin": origin
            },
            data: JSON.stringify(tD),
            success: function (data) {
                if (data.code != "0") {
                    hideLoader();
                    showAlert(data.message, data.code);
                    refHideAlert("");
                    getEmployeeEodList();
                }
                else {
                    hideLoader();
                    showAlert(data.message, data.code);
                    refHideAlert("");
                }
            },
            error: function (err) {
                hideLoader();
                showAlert("Something went wrong!!!\n" + err.responseText, 0);
                refHideAlert("");
            }
        });
    }
    else {
        showAlert("Please enter EOD!!!", 0);
        refHideAlert("");
    }
}
function confirmDeleteEmployeeEod(id)
{
    ons.notification.confirm({
        id: 'confirmDeleteEmployeeEod',
        message: 'EOD will be deleted permanently. Are you sure?',
        modifier: "undefined",
        title: "Confirmation!!!",
        animation: "fade",
        buttonLabels: ["No", "Yes"],
        class: "confirmationToast",
        callback: function (action) {
            if (action == 1) {
                deleteEmployeeEod(id);
            }
        }
    });
}
function deleteEmployeeEod(id)
{
    showLoader();
    $.ajax({
        cache: false,
        async: true,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        url: urlInit + "Task/deleteEmployeeEod?ID="+ id,
        contentType: 'application/json',
        headers: {
            "Access-Control-Allow-Origin": origin
        },
        success: function (data) {
            if (data.code != "0") {
                hideLoader();
                showAlert(data.message, data.code);
                refHideAlert("");
                getEmployeeEodList();
            }
            else {
                hideLoader();
                showAlert(data.message, data.code);
                refHideAlert("");
            }
        },
        error: function (err) {
            hideLoader();
            showAlert("Something went wrong!!!\n" + err.responseText, 0);
            refHideAlert("");
        }
    });
}
/*Employee EOD*/

/*Reset Registration */
function getEmployeeRegistrationDetail()
{
    showLoader();
    var result = valicateResetRegistrationSearch();
    if (result == "") {
        $.ajax({
            cache: false,
            async: true,
            crossDomain: true,
            type: "GET",
            dataType: "json",
            url: urlInit + "Profiles/getRegistrationDetail",
            contentType: 'text/plain',
            headers: {
                "Access-Control-Allow-Origin": origin
            },
            data: {
                "branchID": $('#ddlResetRegEmployeeBranch').val(),
                "employeeID": $('#ddlResetRegEmployee').val()
            },
            success: function (data) {
                showEmployeeRegistrationDetail(data);
                hideLoader();
            },
            error: function (err) {
                showAlert("Something went wrong!!!\n" + err.responseText, 0);
                refHideAlert("");
                hideLoader();
            }
        });
    }
    else {
        showAlert(result, 2);
        refHideAlert("");
        hideLoader();
    }
}
function showEmployeeRegistrationDetail(at) {
    var attendanceDetail = "";
    $("#lstResetRegEmployee").find($("ons-list-item")).remove();
    if (at.length > 0) {
        for (var i = 0; i < at.length; i++) {
            attendanceDetail += "<ons-list-item modifier='longdivider'>" +
                "<div class='left'>" +
                "<img src='" + at[i].PHOTO + "' alt='" + at[i].NAME + "' class='list-item__thumbnail' />" +
                "</div>" +
                "<div class='center'>" +
                "<span class='list-item__title'><b>" + at[i].NAME + "</b></span>" +
                "<span class='list-item__title'>" + at[i].BRANCH + "</span>" +
                "<span class='list-item__title'>" + at[i].DEPARTMENT + "</span>" +
                "<span class='list-item__title'>" + at[i].DESIGNATION + "</span>" +
                "</div>" +
                "<div class='right'>" +
                "<ons-button onclick=\"confirmResetRegistration('" + at[i].ID + "','" + at[i].NAME + "')\"><i class='fa fa-ban' aria-hidden='true'></i></ons-button>" +
                "</div>" +
                "</ons-list-item>";
        }
    }
    else {
        attendanceDetail += "<ons-list-item>No employee found!!!</ons-list-item>";
    }
    $(attendanceDetail).appendTo($("#lstResetRegEmployee"));
}
function confirmResetRegistration(id, name) {
    ons.notification.confirm({
        id: 'confirmResetRegistration',
        message: 'Registration will be reset for '+ name +'. Are you sure?',
        modifier: "undefined",
        title: "Confirmation!!!",
        animation: "fade",
        buttonLabels: ["No", "Yes"],
        class: "confirmationToast",
        callback: function (action) {
            if (action == 1) {
                resetRegistration(id);
            }
        }
    });
}
function resetRegistration(id)
{
    showLoader();
    $.ajax({
        cache: false,
        async: true,
        crossDomain: true,
        type: "POST",
        dataType: "json",
        url: urlInit + "Profiles/resetRegistration?id=" + id,
        contentType: 'application/json',
        headers: {
            "Access-Control-Allow-Origin": origin
        },
        success: function (data) {
            if (data.code != "0") {
                hideLoader();
                showAlert(data.message, data.code);
                refHideAlert("");
                getEmployeeRegistrationDetail();
            }
            else {
                hideLoader();
                showAlert(data.message, data.code);
                refHideAlert("");
            }
        },
        error: function (err) {
            hideLoader();
            showAlert("Something went wrong!!!\n" + err.responseText, 0);
            refHideAlert("");
        }
    });
}
function valicateResetRegistrationSearch() {
    var message = "";

    if ($('#ddlResetRegEmployeeBranch').val() == 0) {
        message += "Please select branch.</br>";
    }
    return message;
}
/*Reset Registration */