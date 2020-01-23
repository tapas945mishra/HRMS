var employeeID;
var attendanceID;
var loginDate;
var deviceID;
var appVersion = "1.0.1.0";

var eventFiredFrom = 0;
var holiDayList = null;
var sundayList = null;
var employeeDetail = null;
var devProd = 1;
var currentPage = "";

var urlInit = (devProd == 1 ? "http://localhost:31484/api/" : "https://api2.1.msfhrms.com/api/");
var origin = (devProd == 1 ? "http://localhost:4400" : "file:///android_asset");

window.fn = {};

window.fn.open = function () {
    var menu = document.getElementById('menu');
    menu.open();
};

window.fn.load = function (page, source) {
    
    var pageName = page.replace('.html', '');
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    currentPage = pageName;

    if (source != '') {
        $(menu).find('i,span').removeClass("active");
        $(menu).find('ons-list-item').removeClass("active");
        $(source).find('i,span').addClass("active");
        $(source).addClass("active");
    }

    content.load(page).then(menu.close.bind(menu));
    
    if (pageName == 'notice') {
        getNotification();
        getEmployeeOnLeaveRequest();
        getVideos();
    }
    else if (pageName == 'profile') {
        getProfile();
    }
    else if (pageName == 'task') {
        getEodList();
        //getTaskDetail();
    }
    else if (pageName == 'attendance') {
        getAttendanceDetail();
    }
    else if (pageName == 'leave') {
        getLeaveBalance();
        getLeaveRequestStatus();

        $('#ddlInchargePerson').find("optgroup").remove();
        $('#ddlInchargePerson').find("option:gt(0)").remove();
        getBranchEmployees();
        getDepartmentEmployees();
    }
    else if (pageName == 'salary') {
        getSalaryDetail();
    }
    else if (pageName == 'grivances') {
        getEmployeeGrivance();
        getGrivancesReportTo();
    }
    else if (pageName == 'resignation') {
        getResignationStatus();
    }
    else if (pageName == 'holiday') {
        getNotification();
    }
    else if (pageName == 'employeeLeave') {
        getEmployeeOnLeaveRequest();
    }
    else if (pageName == 'transferApproval') {
        getTransferStatus();
    }
    else if (pageName == 'grivancesApproval') {
        getEmployeeGrivance();
    }
    else if (pageName == 'resignationApproval') {
        getResignationStatus();
    }
    else if (pageName == 'attendanceCheck') {
        getBranchByEmployee('ddlAttChkEmployeeBranch', 'cAuth');
    }
    else if (pageName == 'resetRegistration') {
        getBranchByEmployee('ddlResetRegEmployeeBranch', 'rAuth');
    }
    else if (pageName == 'starRating') {
        getBranchByEmployee('ddlRatingEmployeeBranch', 'cAuth');
    }
    else if (currentPage == 'idcardrequest') {
        getEmployeeDetailIDCardRequest();
        getIDCardRequestStatus();
    }
    else if (currentPage == 'idcardrequestApproval') {
        getIDCardRequestForApproval();
    }
    else if (currentPage == 'library') {
        getLibraryInfo();
    }
    else if (currentPage == 'eod')
    {
        getBranchByEmployee('ddlEodEmployeeBranch','eodAuth');
    }
};

$(document).ready(function () {

    getEmployeeDetail();
    getHolidayList();
    
    $(document).on('click', '.viewPDF', function () {
        showLoader();
        $("#ifrmPfdViewer").removeAttr("src");
        var path = $(this).attr("path").replace(/%20/gi, ' ');
        var embedPath = "http://docs.google.com/gview?url=" + path + "&embedded=true";
        //var embedPath= "https://drive.google.com/viewerng/viewer?url=" + path + "?pid=explorer&efh=false&a=v&chrome=false&embedded=true";
        $("#ifrmPfdViewer").attr("src", embedPath);
        hidePopover();
        setTimeout(function () { $("#pdfModal").show(); hideLoader(); }, 2000);
    });
    $(document).on("change", "#ddlAttChkEmployeeBranch", function () {
        if ($('#ddlAttChkEmployeeBranch').val() != 0) {
            getEmployeeByBranch('ddlAttChkEmployeeBranch','ddlAttChkEmployee');
        }
    });
    $(document).on("change", "#ddlResetRegEmployeeBranch", function () {
        if ($('#ddlResetRegEmployeeBranch').val() != 0) {
            getEmployeeByBranch('ddlResetRegEmployeeBranch', 'ddlResetRegEmployee');
        }
    });
    $(document).on("change", "#ddlRatingEmployeeBranch", function () {
        getEmployeeRating();
    });
    $(document).on("change", "#ddlEodEmployeeBranch", function () {
        if ($('#ddlEodEmployeeBranch').val() != 0) {
            getEmployeeByBranch('ddlEodEmployeeBranch', 'ddlEodEmployee');
        }
    });
    
    $(document).on("click", "#btnPopover", function (evt) {

        var mousePos = getMousePos($("#" + currentPage), evt);

        $('#popDocument').show(this);

        var width = $('#popDocument').find(".popover").css("width");

        var left = mousePos.x - parseInt(width);
        var top = mousePos.y;
        
        $('#popDocument').find(".popover").css('left', left + "px");
        $('#popDocument').find(".popover").css('top', top + "px");

    });
    $(document).on("click", "#btnRefresh", function () {
        if (currentPage == 'notice') {
            getNotification();
        }
        else if (currentPage == 'profile') {
            getProfile();
        }
        else if (currentPage == 'task') {
            getTaskDetail();
        }
        else if (currentPage == 'attendance') {
            getAttendanceDetail();
        }
        else if (currentPage == 'leave') {
            getLeaveBalance();
            getLeaveRequestStatus();
        }
        else if (currentPage == 'salary') {
            getSalaryDetail();
        }
        else if (currentPage == 'grivances') {
            getGrivancesReportTo();
        }
        else if (currentPage == 'resignation') {
            getResignationStatus();
        }
        else if (currentPage == 'holiday') {
            getNotification();
        }
        else if (currentPage == 'employeeLeave') {
            getEmployeeOnLeaveRequest();
        }
        else if (currentPage == 'transferApproval') {
            getTransferStatus();
        }
        else if (currentPage == 'grivancesApproval') {
            getEmployeeGrivance();
        }
        else if (currentPage == 'resignationApproval') {
            getResignationStatus();
        }
    });
    $(document).on("changestate", ".pull-hook", function () {
        if (event.state == 'action') {
            if (currentPage == 'notice') {
                getNotification();
                getEmployeeOnLeaveRequest();
            }
            else if (currentPage == 'profile') {
                getProfile();
            }
            else if (currentPage == 'task') {
                getTaskDetail();
            }
            else if (currentPage == 'attendance') {
                getAttendanceDetail();
            }
            else if (currentPage == 'leave') {
                getLeaveBalance();
                getLeaveRequestStatus();
            }
            else if (currentPage == 'salary') {
                getSalaryDetail();
            }
            else if (currentPage == 'grivances') {
                getGrivancesReportTo();
            }
            else if (currentPage == 'resignation') {
                getResignationStatus();
            }
            else if (currentPage == 'holiday') {
                getNotification();
            }
            else if (currentPage == 'employeeLeave') {
                getEmployeeOnLeaveRequest();
            }
            else if (currentPage == 'transferApproval') {
                getTransferStatus();
            }
            else if (currentPage == 'grivancesApproval') {
                getEmployeeGrivance();
            }
            else if (currentPage == 'resignationApproval') {
                getResignationStatus();
            }
            else if (currentPage == 'idcardrequest') {
                getEmployeeDetailIDCardRequest();
            }
        }
    });

    $(document).on('click', "img.list-item__thumbnail", function () {
        $("img.popup-image").prop("src", $(this).prop("src"));
        $('.thumbnail-popup').fadeTo(500, 1, function () { $(this).show(); });
    });
    $('.thumbnail-popup').click(function () {
        $('.thumbnail-popup').fadeTo(500, 0, function () { $(this).hide();});
    });
    $('.popupCloseButton').click(function () {
        $('.thumbnail-popup').fadeTo(500, 0, function () { $(this).hide(); });
    });
});

function getEmployeeDetail()
{
    if (employeeDetail == null) {
        if (employeeID != null && employeeID != '' && employeeID != undefined) {
            $.ajax({
                cache: false,
                async: true,
                crossDomain: true,
                type: "GET",
                dataType: "json",
                url: urlInit + "Profiles/getEmployeeProfile",
                contentType: 'text/plain',
                headers: {
                    "Access-Control-Allow-Origin": origin
                },
                data: {
                    "employeeID": employeeID
                },
                success: function (data) {
                    employeeDetail = data;
                },
                error: function (err) {
                }
            });
        }
        else {
        }
    }
}
function getHolidayList()
{
    if (holiDayList == null || sundayList == null)
    {
        $.ajax({
            cache: false,
            async: true,
            crossDomain: true,
            type: "GET",
            dataType: "json",
            url: urlInit + "Leaves/getHolidayList",
            contentType: 'text/plain',
            headers: {
                "Access-Control-Allow-Origin": origin
            },
            success: function (d) {
                holiDayList = d.holidays;
                sundayList = d.sundays;
            },
            error: function (err) {

            }
        });
    }
}
function getBranchByEmployee(ddlControl,auth) {
    showLoader();
    $.ajax({
        cache: false,
        async: true,
        crossDomain: true,
        type: "GET",
        dataType: "json",
        url: urlInit + "Profiles/getBranchByEmployee",
        contentType: 'text/plain',
        data: { "deviceID": deviceID, "auth": auth },
        headers: {
            "Access-Control-Allow-Origin": origin
        },
        success: function (d) {
            $('#' + ddlControl).find("option:gt(0)").remove();
            for (var i = 0; i < d.length; i++) {
                $('#' + ddlControl).append($("<option />").val(d[i].Branch_id).text(d[i].Branch_name));
            }
            hideLoader();
        },
        error: function (err) {
            hideLoader();
        }
    });
}
function getEmployeeByBranch(ddlSearchControl, ddlLoadControl) {
    showLoader();
    $.ajax({
        cache: false,
        async: true,
        crossDomain: true,
        type: "GET",
        dataType: "json",
        url: urlInit + "Profiles/getEmployeeByBranch",
        contentType: 'text/plain',
        data: { "branchID": $('#' + ddlSearchControl).val() },
        headers: {
            "Access-Control-Allow-Origin": origin
        },
        success: function (d) {
            $('#'+ddlLoadControl).find("option:gt(0)").remove();
            for (var i = 0; i < d.length; i++) {
                $('#' + ddlLoadControl).append($("<option />").val(d[i].emp_Id).text(d[i].emp_FName + ' ' + d[i].emp_LName));
            }
            hideLoader();
        },
        error: function (err) {
            hideLoader();
        }
    });
}
function getBranchEmployees() {
    showLoader();
    
    $.ajax({
        cache: false,
        async: true,
        crossDomain: true,
        type: "GET",
        dataType: "json",
        url: urlInit + "Leaves/getBranchEmployee",
        contentType: 'text/plain',
        data: { "deviceID": deviceID },
        headers: {
            "Access-Control-Allow-Origin": origin
        },
        success: function (d) {
            $('#ddlInchargePerson').append($("<optgroup label='BRANCH' />"));
            for (var i = 0; i < d.length; i++) {
                $('#ddlInchargePerson').append($("<option />").val(d[i].EMP_ID).text(d[i].EMP_NAME));
            }
            hideLoader();
        },
        error: function (err) {
            hideLoader();
        }
    });
}
function getDepartmentEmployees() {
    showLoader();
    $.ajax({
        cache: false,
        async: true,
        crossDomain: true,
        type: "GET",
        dataType: "json",
        url: urlInit + "Leaves/getDepartmentEmployee",
        contentType: 'text/plain',
        data: { "deviceID": deviceID },
        headers: {
            "Access-Control-Allow-Origin": origin
        },
        success: function (d) {
            $('#ddlInchargePerson').append($("<optgroup label='DEPARTMENT' />"));
            for (var i = 0; i < d.length; i++) {
                $('#ddlInchargePerson').append($("<option />").val(d[i].EMP_ID).text(d[i].EMP_NAME));
            }
            hideLoader();
        },
        error: function (err) {
            hideLoader();
        }
    });
}


function showLoader() {
    $("#modalLoader").show();
}
function hideLoader() {
    $("#modalLoader").hide();
}

//Get Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas[0].getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function hidePopover() {
    $('#popDocument').hide();
}

function navigateTo(page)
{
    window.location.href = page;
}

function showAlert(msg, msgType) {
    var dialog = $("#alertBox");
    var title = (msgType == 1 ? "<i class='fa fa-check-square-o fa-1x' style='color: green;' aria-hidden='true'></i> &nbsp; <span style='color: green;'>Success</span> !!!" : msgType == 0 ? "<i class='fa fa-exclamation-triangle fa-1x' style='color: red;' aria-hidden='true'></i > &nbsp; <span style='color: red;'>Error !!!</span>" : msgType == 2 ? "<i class='fa fa-info-circle fa-1x' style='color: blue;' aria-hidden='true'></i > &nbsp; <span style='color: blue;'>Information !!!</span>" : "<i class='fa fa-question-circle fa-1x' style='color: black;' aria-hidden='true'></i > &nbsp; <span style='color: black;'>Query !!!</span>");
    var message = (msgType == 1 ? "<span style='color: green;'>" + msg + "</span>" : msgType == 0 ? "<span style='color: red;'>" + msg + "</span>" : msgType == 2 ? "<span style='color: blue;'>" + msg + "</span>" : "<span style='color: black;'>" + msg + "</span>");
    dialog.find("div.alert-dialog-content").html(message);
    dialog.find("div.alert-dialog-title").html(title);
    if (dialog) {
        dialog.show();
    }
}
function refHideAlert(dialogID) {
    $("#btnHideAlert").unbind("click");
    $("#btnHideAlert").bind("click", function () {
        hideAlert(dialogID);
    });
}
function hideAlert(dialogID) {
    $("#alertBox").hide();
    if (dialogID != "") {
        showDialog(dialogID);
    }
}

function showDialog(dialogID) {
    var dialog = $("#" + dialogID);
    hidePopover();
    if (dialog) {
        dialog.show();
    }
}
function hideDialog(dialogID) {
    $("#"+dialogID).hide();
}

function isValidEmailID(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
        return false;
    } else {
        return true;
    }
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function changePassword() {
    if (deviceID != '' && deviceID != null && deviceID != undefined) {

        showLoader();

        var validate = changePasswordValidation();

        if (validate == "") {

            var dataList = {
                "object1": deviceID,
                "object2": $.trim($("#txtChnagePasswordUserName").val()),
                "object3": $("#txtChangePasswordPassword").val(),
                "object4": $("#txtChangePasswordNewPassword").val()
            };

            $.ajax({
                cache: false,
                async: true,
                crossDomain: true,
                type: "POST",
                dataType: "json",
                url: urlInit + "Logins/changePassword",
                contentType: 'application/json',
                headers: {
                    "Access-Control-Allow-Origin": origin
                },
                data: JSON.stringify(dataList),
                success: function (data) {
                    if (data.code == "1") {
                        hideLoader();
                        hideDialog("dialogChangePassword");
                        showAlert(data.message, data.code);
                        refHideAlert("");
                    }
                    else if (data.code == "0") {
                        hideLoader();
                        hideDialog("dialogChangePassword");
                        showAlert(data.message, data.code);
                        refHideAlert("dialogChangePassword");
                        
                    }
                    else {
                        hideLoader();
                        hideDialog("dialogChangePassword");
                        showAlert("Password could not be changed!!!", 0);
                        refHideAlert("dialogChangePassword");
                    }
                },
                error: function (err) {
                    hideLoader();
                    hideDialog("dialogChangePassword");
                    showAlert("Something went wrong!!!\n" + err.responseText, 0);
                    refHideAlert("dialogChangePassword");
                }
            });

        }
        else {
            hideLoader();
            hideDialog("dialogChangePassword");
            showAlert(validate, 2);
            refHideAlert("dialogChangePassword");
        }
    }
    else {
        hideDialog("dialogChangePassword");
        showAlert('Your device is not registered with MSF mobile app!!!', 2);
        refHideAlert("dialogChangePassword");
    }
}

function changePasswordValidation() {
    var uN = $("#txtChnagePasswordUserName").val();
    var oP = $("#txtChangePasswordPassword").val();
    var nP = $("#txtChangePasswordNewPassword").val();
    var cP = $("#txtChangePasswordConfirmPassword").val();

    if (uN != '' && oP != '' && nP != '' && cP != '') {
        if (nP == cP) {
            return "";
        }
        else {
            return "New password and confirm password does not match!!!";
        }
    }
    else {
        return "All fields must be filled!!!";
    }
}

function toggleToast(modifier, result) {
    //document.querySelector('ons-toast[modifier~=' + modifier).innerHTML(message);
    $('ons-toast[modifier~=' + modifier).find(".toast__message").html(result);
    $('ons-toast[modifier~=' + modifier).toggle();
    //document.querySelector('ons-toast[modifier~=' + modifier).firstChild.html(result);
    //document.querySelector('ons-toast[modifier~=' + modifier).toggle();
}

function handleLeaveDateChange(e,fD,tD,dD) {
    if ($(fD).val() != "" && $(tD).val() != "") {
        
        var result = getDateDiff($(fD).val(), $(tD).val(), 'd');

        var sffD = ($(fD).val()).split('-');
        var sfD = sffD[0] + "" + sffD[1] + "" + sffD[2];
        var sttD = ($(tD).val()).split('-');
        var stD = sttD[0] + "" + sttD[1] + "" + sttD[2];

        var holidayInBetween = holiDayList.filter(function (d) {
            return (d >= sfD && d <= stD);
            //return (new Date(d) >= new Date($(fD).val()) && new Date(d) <= new Date($(tD).val()));
        });
        var sundayInBetween = sundayList.filter(function (d) {
            
            return (d >= sfD && d <= stD);
            //return (new Date(d) >= new Date($(fD).val()) && new Date(d) <= new Date($(tD).val()));
        });
        $(dD).val(result - (holidayInBetween.length + sundayInBetween.length));
    }
}

function getDateDiff(fDate, tDate, format)
{
    if (new Date(tDate) >= new Date(fDate))
    {
        var result = 0;
        var fD = new Date(fDate);
        var tD = new Date(tDate);
        var oneDay = 24 * 60 * 60 * 1000;

        var dateDiff = (new Date(tDate).getTime() - new Date(fDate).getTime());
        
        var years = Math.floor(dateDiff / 31536000000);
        var months = Math.floor((dateDiff % 31536000000) / 2628000000);
        var days = Math.round(Math.abs(dateDiff / oneDay));

        if (format == "y") { result = years; }
        else if (format == "m") { result = months; }
        else if (format == "d") { result = days + 1; }
    }
    else {
        result = -1;
    }

    return result;
}

function getTodayDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}


//$(window).load(function () {
//    setTodaysDate();
//getAutoLoginToSystem()
//});

//function setTodaysDate() {
//    var now = new Date();

//    var day = ("0" + now.getDate()).slice(-2);
//    var month = ("0" + (now.getMonth() + 1)).slice(-2);

//    var today = now.getFullYear() + "-" + (month) + "-" + (day);

//    $('input[type=date]').val(today);
//}

