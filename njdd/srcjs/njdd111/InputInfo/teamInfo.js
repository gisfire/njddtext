
var datajson = [];
$(document).ready(function () {
    $("#btn_start").on("click", function () {
        $.ajax({
            type: "get",
            url: "http://localhost:6242/njdd.web.mobile/src/njdd/InputInfo/datajson.json",
            async: true,
            dataType: 'json',
            success: function (data) {
                //drawData(data);
                alert(data.result.datas);
                goup(data.result.datas);
            },
            error: function (errorMsg) {
                alert("请求数据失败\n" + errorMsg.toString());
            }
        });
    });

    function goup(data) {
        for (var i = 0; i < data.length; i++) {
            var len = document.getElementById('test').innerHTML += '<div class="ui-block-a" style="border:1px solid white;width:38% "><span><h4>' + "姓名:" + data[i].name1 + '</h4></span></div> <div class="ui-block-b" style="border:1px solid white;width:38%"><span ><h4>' + "职称:" + data[i].work + '</h4></span></div>';
        }
    }

});

//车队成员管理，这个界面全部没改
$(document).on("pagebeforecreate", "#teaminfopage", function () {
    var teamid = $("#carteamname").val();
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
                    if (teamid = item.teamid) {
                        //模板渲染
                        var html = tmpl("tmpl_managepage_detailinfo", item);
                        $(html).appendTo("#teaminfo_listview").trigger('create');
                    }
                });
            }
        },
        error: function (errorMsg) {
            alert(errorMsg);
        }
    });
});
function teaminfopage_btn_click(id) {
    var userunit, userteamid, userteam;
    if (datajson != null && datajson.result.datas.length > 0) {
        $.each(datajson.result.datas, function (i, item) {
            if (item.id == id) {
                $(document).on("pageinit", "#teammemberinfo", function () {
                    $("#teammemberinfo_name").val(item.name);
                    $("#teammemberinfo_tel").val(item.phone);
                    $("#teammemberinfo_email").val(item.email);
                    userunit = item.unitName;
                    userteamid = item.teamid;
                    userteam = item.teamName;
                    $("#teammemberinfopage_unit").empty();
                    $.ajax({
                        type: "get",
                        url: domain + url_getUnit + "?token=1",
                        async: true,
                        dataType: 'json',
                        success: function (data) {
                            $.each(data.result.datas, function (i, item) {
                                $("#teammemberinfopage_unit").append("<option value='" + item.id + "'>" + item.name + "</option>");
                            });
                            panduanuserunit(userunit, userteamid);
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

function panduanuserunit(userunit, userteamUnitid) {
    var opList3 = document.getElementById("#informationpage_unit");
    for (var i = 0, len = opList3.length; i < len; i++) {
        if (opList3.options[i].text == userunit) {
            opList3.options[i].selected = true;
            break;
        }
    }
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
    panduanuserteam(userteam);
}

function panduanuserteam(userteam) {
    var opList4 = document.getElementById("#informationpage_team");
    for (var i = 4, len = opList4.length; i < len; i++) {
        if (opList4.options[i].text == userteam) {
            opList4.options[i].selected = true;
            break;
        }
    }
}
