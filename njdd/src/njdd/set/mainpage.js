var datajson;
var carjson;
$(document).on("pageinit", "#mainpage", function () {
    //$("#mainpage_setbtn").on("tap", function () {
    //    //sessionStorage.name = "王阳";
    //});
    $("#mainpage_setbtn").html(sessionStorage.name);

    $.ajax({
        url: domain + url_getCarInfo + "?token=1",
        type: 'get',
        async: false,
        success: function (json) {

            if (typeof (json) == "object") {
                //为对象
                carjson = json;
            }
            else {
                //将字符串转换为对象
                carjson = JSON.parse(json);
            }
            if (carjson.result.datas.length > 0) {
                var selObj = $("#mainpage_selectcar");
                $.each(carjson.result.datas, function (i, item) {
                    if (sessionStorage.userid == item.car_ownerid) {
                        sessionStorage.carid = item.id;
                    }
                });
                if (sessionStorage.carid == null) {
                    selObj.append("<option value='" + "-1" + "'>" + "请选择" + "</option>");
                }
                $.each(carjson.result.datas, function (i, item) {
                    if (sessionStorage.carid == item.id) {
                        selObj.append("<option value='" + item.id + "'>" + item.car_code + "</option>");
                    }
                });

                $.each(carjson.result.datas, function (i, item) {
                    if (typeof (sessionStorage.carid) != "undefined") {
                        if (sessionStorage.carid != item.id) {
                            selObj.append("<option value='" + item.id + "'>" + item.car_code + "</option>");
                        }
                    } else {
                        selObj.append("<option value='" + item.id + "'>" + item.car_code + "</option>");
                    }
                });
                var option = $($("option", selObj).get(0));
                option.attr('selected', 'selected');
                selObj.selectmenu();
                selObj.selectmenu('refresh', true);

            }
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });

});

$(document).on("pageinit", "#setpage", function () {

    if (carjson.result.datas.length > 0) {
        var selObj = $("#setpage_selectcar");
        $.each(carjson.result.datas, function (i, item) {
            if (sessionStorage.userid == item.car_ownerid) {
                sessionStorage.carid = item.id;
            }
        });
        if (sessionStorage.carid == null) {
            selObj.append("<option value='" + "-1" + "'>" + "请选择" + "</option>");
        }
        $.each(carjson.result.datas, function (i, item) {
            if (sessionStorage.carid == item.id) {
                selObj.append("<option value='" + item.id + "'>" + item.car_code + "</option>");
            }
        });

        $.each(carjson.result.datas, function (i, item) {
            if (typeof (sessionStorage.carid) != "undefined") {
                if (sessionStorage.carid != item.id) {
                    selObj.append("<option value='" + item.id + "'>" + item.car_code + "</option>");
                }
            } else {
                selObj.append("<option value='" + item.id + "'>" + item.car_code + "</option>");
            }

        });
        var option = $($("option", selObj).get(0));
        option.attr('selected', 'selected');
        selObj.selectmenu();
        selObj.selectmenu('refresh', true);

    }

});

function mainpage_selectcar_change() {
    sessionStorage.carid = $("#mainpage_selectcar").val();
    alert(sessionStorage.carid);
}

function setpage_selectcar_change() {
    sessionStorage.carid = $("#setpage_selectcar").val();
    alert(sessionStorage.carid);
}

$(document).on("pageinit", "#infoinputpage", function () {
    if (carjson.result.datas.length > 0) {
        var selObj = $("#number");
        $.each(carjson.result.datas, function (i, item) {
            if (sessionStorage.userid == item.car_ownerid) {
                sessionStorage.carid = item.id;
            }
        });
        if (sessionStorage.carid == null) {
            selObj.append("<option value='" + "-1" + "'>" + "请选择" + "</option>");
        }
        $.each(carjson.result.datas, function (i, item) {
            if (sessionStorage.carid == item.id) {
                selObj.append("<option value='" + item.id + "'>" + item.car_code + "</option>");
            }
        });

        $.each(carjson.result.datas, function (i, item) {
            if (typeof (sessionStorage.carid) != "undefined") {
                if (sessionStorage.carid != item.id) {
                    selObj.append("<option value='" + item.id + "'>" + item.car_code + "</option>");
                }
            } else {
                selObj.append("<option value='" + item.id + "'>" + item.car_code + "</option>");
            }
        });
        var option = $($("option", selObj).get(0));
        option.attr('selected', 'selected');
        selObj.selectmenu();
        selObj.selectmenu('refresh', true);

    }
});

$(document).on("pageinit", "#personinfopage", function () {
    var unit, teamid,team;
    $.ajax({
        url: domain + url_getAlluser + "?token=1",
        type: 'get',
        async: false,
        success: function (json) {

            if (typeof (json) == "object") {
                //为对象
                datajson = json;
            }
            else {
                //将字符串转换为对象
                datajson = JSON.parse(json);
            }
            if (datajson.result.datas.length > 0) {
                $.each(datajson.result.datas, function (i, item) {
                    if (item.id == sessionStorage.userid) {
                        $("#personinfopage_name").val(item.name);
                        $("#personinfopage_tel").val(item.phone);
                        $("#personinfopage_email").val(item.email);
                        $("#personinfopage_password").val(item.password);
                        unit = item.unitName;
                        teamid = item.unitid;
                        team = item.teamName;
                        $("#personinfopage_unitName").empty();
                        $.ajax({
                            type: "get",
                            url: domain + url_getUnit + "?token=1",
                            async: true,
                            dataType: 'json',
                            success: function (data) {
                                $.each(data.result.datas, function (i, item) {
                                    $("#personinfopage_unitName").append("<option value='" + item.id + "'>" + item.name + "</option>");
                                });
                                panduanunit(unit, teamid, team);
                            }
                        });
                    }
                });
            }
            
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
});

function panduanunit(unit, teamUnitid, teamname) {
    var opList1 = document.getElementById("personinfopage_unitName");
    for (var i = 0, len = opList1.length; i < len; i++) {
        if (opList1.options[i].text == unit) {
            //opList1.options[i].selected = true;
            //$(" select option[value='" + teamUnitid + "']").prop("select", "selected");
            $("#personinfopage_unitName option[text='" + unit + "']").attr("selected", true);
            alert();
            break;
        }
    }
    teamselect(teamname);
}

function teamselect(teamUnitid, teamname) {
    //清空
    $("#personinfopage_teamName").empty();
    $.ajax({
        type: "get",
        url: domain + url_getTeam + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#personinfopage_teamName").append("<option ></option>");
            $.each(data.result.datas, function (i, item) {
                //根据所属单位填充所属车队的下拉内容
                if (teamUnitid == item.teamUnitid) {
                    $("#personinfopage_teamName").append("<option value='" + item.id + "'>" + item.name + "</option>");
                }

            });

        }
    });
    panduanteam(teamname);
}

function panduanteam(team) {
    var opList2 = document.getElementById("personinfopage_teamName");
    for (var i = 0, len = opList2.length; i < len; i++) {
        if (opList2.options[i].text == team) {
            var option = $($("option", $("#personinfopage_teamName")).get(i));
            option.attr('selected', 'selected');
            //opList2.options[i].selected = true;
            break;
        }
    }
}

function personunit_team() {
    var unitID = $("#personinfopage_unitName").val();
    $("#personinfopage_teamName").empty();
    $.ajax({
        type: "get",
        url: domain + url_getTeam + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#personinfopage_teamName").append("<option ></option>");
            $.each(data.result.datas, function (i, item) {
                //根据所属单位填充所属车队的下拉内容
                if (unitID == item.teamUnitid) {
                    $("#personinfopage_teamName").append("<option value='" + item.id + "'>" + item.name + "</option>");
                }

            });

        }
    });
}

$(document).on("pagebeforecreate", "#managepage", function () {
    $.ajax({
        url: domain + url_getAlluser + "?token=1",
        type: 'get',
        async: false,
        success: function (json) {

            if (typeof (json) == "object") {
                //为对象
                datajson = json;
            }
            else {
                //将字符串转换为对象
                datajson = JSON.parse(json);
            }
            if (datajson.result.datas.length > 0) {
                $.each(datajson.result.datas, function (i, item) {
                    //模板渲染
                    var html = tmpl("tmpl_managepage_detailinfo", item);
                    $(html).appendTo("#managepage_listview").trigger('create');
                });
            }
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
});

function managepage_btn_click(id) {
    var userunit,userteamid,userteam;
    if (datajson != null && datajson.result.datas.length > 0) {
        $.each(datajson.result.datas, function (i, item) {
            if (item.id == id) {
                $(document).on("pageinit", "#informationpage", function () {
                    $("#informationpage_name").val(item.name);
                    $("#informationpage_tel").val(item.phone);
                    $("#informationpage_email").val(item.email);
                    userunit = item.unitName;
                    userteamid = item.unitid;
                    userteam = item.teamName;
                    $("#informationpage_unit").empty();
                    $.ajax({
                        type: "get",
                        url: domain + url_getUnit + "?token=1",
                        async: true,
                        dataType: 'json',
                        success: function (data) {
                            $.each(data.result.datas, function (i, item) {
                                $("#informationpage_unit").append("<option value='" + item.id + "'>" + item.name + "</option>");
                            });
                            panduanuserunit(userunit, userteamid, userteam);
                        }
                    });
                    $("#deleteuser").click(function () {
                        var param = "?token=1&id=" + item.id;
                        $.ajax({
                            type: "get",
                            url: domain + url_deleteUser + param,
                            async: true,
                            dataType: 'json',
                            success: function () {
                                managepage_btn_click(id);
                            },
                            error: function (errorMsg) {
                                alert(errorMsg);
                            }
                        });

                    });
                });
            }
        });
        
    }
}

function panduanuserunit(userunit, userteamUnitid, userteamname) {
    var opList3 = document.getElementById("informationpage_unit");
    for (var i = 0, len = opList3.length; i < len; i++) {
        if (opList3.options[i].text == userunit) {
            opList3.options[i].selected = true;
            break;
        }
    }
    userteamselect(userteamUnitid, userteamname);
}
function userteamselect(userteamUnitid, userteamname) {
    //清空
    $("#informationpage_team").empty();
    $.ajax({
        type: "get",
        url: domain + url_getTeam + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#informationpage_team").append("<option ></option>");
            $.each(data.result.datas, function (i, item) {
                //根据所属单位填充所属车队的下拉内容
                if (userteamUnitid == item.teamUnitid) {
                    $("#informationpage_team").append("<option value='" + item.id + "'>" + item.name + "</option>");
                }

            });

        }
    });
    panduanuserteam(userteamname);
}

function panduanuserteam(userteamname) {
    var opList4 = document.getElementById("informationpage_team");
    for (var i = 4, len = opList4.length; i < len; i++) {
        if (opList4.options[i].text == userteamname) {
            opList4.options[i].selected = true;
            break;
        }
    }
}

function userunit_team() {
    var unitID = $("#informationpage_unit").val();
    $("#informationpage_team").empty();
    $.ajax({
        type: "get",
        url: domain + url_getTeam + "?token=1",
        async: true,
        dataType: 'json',
        success: function (data) {
            $("#informationpage_team").append("<option ></option>");
            $.each(data.result.datas, function (i, item) {
                //根据所属单位填充所属车队的下拉内容
                if (unitID == item.teamUnitid) {
                    $("#informationpage_team").append("<option value='" + item.id + "'>" + item.name + "</option>");
                }
            });

        }
    });
}