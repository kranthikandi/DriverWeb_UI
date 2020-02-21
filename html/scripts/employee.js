$(document).ready(function () {
    if (!localStorage.username) {
        window.location.href = 'signin.html';
    }
    var username = localStorage.username.toUpperCase()
    $('#UserN').empty()
    $('#UserN').append(username.charAt(0))
    const now = new Date()
    getAllEmp()
    var AllDrivers
    var empTable = $('#empTab').DataTable()
    var DriTable = $('#DriverTable').DataTable()
    function getAllEmp() {
        $.ajax({
            url: localStorage.getItem('url') + "emp/employees",
            type: 'get',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                AllDrivers = result
                if (result.length == 0) {
                    maxDriID = 100
                }
                empTable.clear().draw();
                DriTable.clear().draw();
                $.each(result, function (key, val) {
                    var status
                    maxDriID = val.empId + 1
                    $('#newEmpId').val(maxDriID)
                    if (val.Role != 'Driver') {
                        if (val.status == 'Active') {
                            status = '<button class="md-btn md-flat m-b-sm w-xs text-success">' + val.status + '</button>'
                        } else if (val.status == 'Hold') {
                            status = '<button class="md-btn md-flat m-b-sm w-xs text-warning">' + val.status + '</button>'
                        } else if (val.status == 'Archive') {
                            status = '<button class="md-btn md-flat m-b-sm w-xs text-danger">' + val.status + '</button>'
                        }
                        empTable.row.add([
                            val.empId, val.empName, moment(val.hireDate).format('MM/DD/YYYY'), val.Role, status
                        ]).draw(false);
                    } else {
                        if (val.status == 'Active') {
                            status = '<button class="md-btn md-flat m-b-sm w-xs text-success">' + val.status + '</button>'
                        } else if (val.status == 'Hold') {
                            status = '<button class="md-btn md-flat m-b-sm w-xs text-warning">' + val.status + '</button>'
                        } else if (val.status == 'Archive') {
                            status = '<button class="md-btn md-flat m-b-sm w-xs text-danger">' + val.status + '</button>'
                        }
                        maxDriID = val.empId + 1
                        $('#IcDriverId').val(maxDriID)
                        DriTable.row.add([
                            val.empId, val.empName, moment(val.hireDate).format('MM/DD/YYYY'), status
                        ]).draw(false);
                    }
                })
            }
        })
    }

    $('#empAdd').click(function () {
        $('.clear').empty()
        $('.clear').val('')
        $('#newEmpId').val(maxDriID)
        $('#HireDate').empty()
        $("#HireDate").datetimepicker({
            timepicker: false,
            format: 'm-d-Y'
        });

        $('#HireDate').append(moment(now).format('MM-DD-YYYY'))
        $('#NewEmp').modal('show')

    })
    $(".HireDate").datetimepicker({
        timepicker: false,
        format: 'm-d-Y'
    });
    $(".struStat").click(function () {
        var stat = $(this).attr('value');
        $(".truStat").empty();
        $(".truStat").append(stat);
        if (stat == 'Available') {
            $('.truStat').removeClass('warning');
            $('.truStat').addClass('success');
            $('.truStat').removeClass('danger');
        } else if (stat == 'Assigned') {
            $('.truStat').addClass('warning');
            $('.truStat').removeClass('success');
            $('.truStat').removeClass('danger');
        } else if (stat == 'Service') {
            $('.truStat').removeClass('warning');
            $('.truStat').removeClass('success');
            $('.truStat').addClass('danger');
        }
    });
    $(".ttype").click(function () {
        var ttype = $(this).attr('value');
        $("#ttype").empty();
        $("#ttype").append(ttype);
    });
    $("#TruReg").datetimepicker({
        timepicker: false,
        format: 'm-d-Y'
    });
    $('#fleetAdd').click(function () {

        $('#UpdateTru').hide()
        $('#saveTru').show()
        $('.clear').val('')
        $('.clear').empty()
        $('.ccfrm').val('')
        $('.ccfrm').empty()
        $("#TruID").prop('disabled', false);
        $('#NewTruck').modal('show')
    })

    $('.eRole').click(function () {
        $(".eRoleSelected").empty()
        $(".eRoleSelected").append($(this).attr('id'))
    })

    $('.eRolethis').click(function () {
        $(".ThisERole").empty()
        $(".ThisERole").append($(this).attr('id'))
    })
    $('.eStatusthis').click(function () {
        $(".eThisEStatus").empty()
        if ($(this).attr('id') == 'Active') {
            $('.eThisEStatus').addClass('btn-success')
            $('.eThisEStatus').removeClass('btn-warning')
            $('.eThisEStatus').removeClass('btn-danger')
        } else if ($(this).attr('id') == 'Hold') {
            $('.eThisEStatus').removeClass('btn-success')
            $('.eThisEStatus').addClass('btn-warning')
            $('.eThisEStatus').removeClass('btn-danger')
        } else if ($(this).attr('id') == 'Archive') {
            $('.eThisEStatus').removeClass('btn-success')
            $('.eThisEStatus').removeClass('btn-warning')
            $('.eThisEStatus').addClass('btn-danger')
        }
        $(".eThisEStatus").append($(this).attr('id'))
    })

    $('#saveEmp').click(function () {
        var data = {
            id: $('#newEmpId').val(),
            name: $('#newEmpName').val(),
            role: $('.eRoleSelected').text(),
            hireDate: $('#HireDate').val()
        }
        $.ajax({
            url: localStorage.getItem('url') + "emp/newEmp",
            data: JSON.stringify(data),
            type: 'post',
            http2: true,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == 'success') {
                    alert('Employee added successfully!')
                } else {
                    alert('unable to save information. Please try again')
                }
                getAllEmp()
            }
        })
    })

    $('#saveTru').click(function () {
        if ($('#ttype').text() == '' || $('#ttype').text() == 'Truck Type' || $('.truStat').text() == '' || $('.truStat').text() == 'Select' ||
            $('#TruLic').val() == '' || $('#TruReg').val() == '' || $('#TruID').val() == '') {
            alert('select all fields')
            return false
        }
        var data = {
            truckid: $('#TruID').val(),
            truLic: $('#TruLic').val(),
            truReg: $('#TruReg').val(),
            truckType: $('#ttype').text(),
            status: 'Available'
        }
        $.ajax({
            url: localStorage.getItem('url') + "emp/newTruck",
            data: JSON.stringify(data),
            type: 'post',
            http2: true,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == 'success') {
                    alert('Truck added successfully!')

                } else {
                    alert('Truck details not saved Try again')
                }
                getAlltruck()
            }
        })
    })
    getAlltruck()
    var today = moment(new Date())
    var FleetTable = $('#FleetTable').DataTable()
    function getAlltruck() {
        $.ajax({
            url: localStorage.getItem('url') + "emp/getAlltruck",
            type: 'get',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                console.log(result)
                FleetTable.clear().draw();
                $.each(result, function (key, val) {
                    var reg = val.Reg_exp
                    var duration = today.diff(reg, 'days');
                    var regs
                    if (duration >= 0) {
                        regs = '<span class = "text-danger"> (' + moment(val.Reg_exp).format('MM-DD-YYYY') + ')</span>'
                    } else {
                        regs = moment(val.Reg_exp).format('MM-DD-YYYY')
                    }
                    FleetTable.row.add([
                        val.truck_id, val.truck_type, regs, val.license, val.status
                    ]).draw(false);
                })
            }
        })
    }

    $('#FleetTable tbody').on('click', 'tr', function () {
        FleetTable.$('tr.light-blue-500').removeClass('light-blue-500');
        $(this).addClass('light-blue-500');
        var row = FleetTable.row(this).data();
        $('.clear').val('')
        $('.clear').empty()
        $('.ccfrm').val('')
        $('.ccfrm').empty()
        $('.truStat').empty()
        $('#TruID').val(row[0])
        $('#TruLic').val(row[3])
        $("#TruID").prop('disabled', true);
        $('#ttype').append(row[1])
        $('.truStat').append(row[4])
        $('#UpdateTru').show()
        $('#saveTru').hide()
        $('#NewTruck').modal('show')
        var reg = row[2]
        if (reg.includes('(')) {
            reg = reg.slice(reg.indexOf("(") + 1, reg.indexOf("(") + 11)
            $('#TruReg').val(reg)
        } else {
            $('#TruReg').val(row[2])
        }
    })

    $('#UpdateTru').click(function () {
        var data = {
            truckid: $('#TruID').val(),
            truLic: $('#TruLic').val(),
            truReg: $('#TruReg').val(),
            truckType: $('#ttype').text(),
            status: $('.truStat').text()
        }
        $.ajax({
            url: localStorage.getItem('url') + "emp/UpdateTruck",
            data: JSON.stringify(data),
            type: 'post',
            http2: true,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == 'success') {
                    alert('Truck Updated successfully!')

                } else {
                    alert('Truck details not saved Try again')
                }
                getAlltruck()
            }
        })
    })



    $('#empTab tbody').on('click', 'tr', function () {
        empTable.$('tr.light-blue-500').removeClass('light-blue-500');
        $(this).addClass('light-blue-500');
        var row = empTable.row(this).data();
        $("#EmpId").prop('disabled', false);
        $('.clear').val('')
        $('.clear').empty()
        $('.showEmpTitle').empty()
        $('.showEmpTitle').append(row[1])
        $("#EmpId").val(row[0])
        $('#empName').val(row[1])
        $('.ThisERole').append(row[3])


        $('#empWeek').datetimepicker({
            timepicker: false,
            format: 'm-d-Y'
        });
        var data = {
            id: row[0]
        }
        $.ajax({
            url: localStorage.getItem('url') + "emp/thisEmp",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                console.log(result);
                if (result[0].status == 'Archive') {
                    $('.clear').prop('disabled', true);
                    $('#updateEmp').hide();
                } else {
                    $('.clear').prop('disabled', false);
                    $('#updateEmp').show();
                }
                var stat = result[0].status
                $('.ThisEStatus').removeClass('white')
                if (stat.includes('Active')) {
                    status = 'Active'
                    $('.ThisEStatus').addClass('btn-success')
                    $('.ThisEStatus').removeClass('btn-warning')
                    $('.ThisEStatus').removeClass('btn-danger')
                } else if (stat.includes('Hold')) {
                    status = 'Hold'
                    $('.ThisEStatus').removeClass('btn-success')
                    $('.ThisEStatus').addClass('btn-warning')
                    $('.ThisEStatus').removeClass('btn-danger')
                } else if (stat.includes('Archive')) {
                    status = 'Archive'
                    $('.ThisEStatus').removeClass('btn-success')
                    $('.ThisEStatus').removeClass('btn-warning')
                    $('.ThisEStatus').addClass('btn-danger')
                }
                $('.ThisEStatus').append(status)
                var EmpAcountTab = $('#EmpAcountTab').DataTable()
                EmpAcountTab.clear().draw();
                $('#empAddress').val(result[0].Address || '')
                $('#empSocial').val(result[0].Social || '')
                $('#empRate').val(result[0].Rate || '')

                if (result[0].Pay) {
                    $.each(result[0].Pay, function (key, val) {
                        if (val.week) {
                            EmpAcountTab.row.add([
                                val.week, val.hours, '$ ' + val.pay, val.check
                            ]).draw(false);
                        }
                    })
                }
            }
        })
        $('#showEmp').modal('show')

    })
    $('#empHours').change(function () {
        var Rate = $('#empRate').val()
        var hr = $('#empHours').val()
        var pay = parseInt(Rate * hr)
        $('#empPay').val(pay)
    })
    $('#updateEmp').click(function () {
        var data = {
            id: $('#EmpId').val(),
            role: $('.ThisERole').text(),
            status: $('.ThisEStatus').text(),
            Address: $('#empAddress').val(),
            Social: $('#empSocial').val(),
            Rate: $('#empRate').val(),
            Pay: {
                week: $('#empWeek').val(),
                hours: $('#empHours').val(),
                pay: $('#empPay').val(),
                check: $('#empCheck').val()
            }
        }
        console.log(data)
        $.ajax({
            url: localStorage.getItem('url') + "emp/empUpdate",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.ok == 1 && result.nModified == 1) {
                    alert('Updated')
                    $('#showEmp').modal('hide')
                    getAllEmp()
                }
            }
        })
    })
    $('#addNewDriver').click(function () {
        $('.ccfrm').empty()
        $('.ccfrm').val('')
        $('#IcDriverId').val(maxDriID)
        $('#UpdateDriver').hide()
        $('#saveDriver').show()
    })
    $('#saveDriver').click(function () {
        if (!$("#IcDriverName").val() || !$('#payHr').val() || !$('#payPer').val()) {
            $("#IcDriverName").addClass('bdr-danger')
            $('#payPer').addClass('bdr-danger')
            $('#payHr').addClass('bdr-danger')
            alert('* fields are required field !!')
            return
        }
        var data = {
            id: maxDriID,
            name: $('#IcDriverName').val(),
            hireDate: $('.HireDate').val(),
            address: $('#address').val(),
            city: $('#city').val(),
            zip: $('#zip').val(),
            ssn: $("#ssn").val(),
            taxId: $("#taxid").val(),
            Dl_Id: $("#Lid").val(),
            Dl_Exp: $("#lExp").val(),
            payHr: $('#payHr').val(),
            payPer: $('#payPer').val(),
            status: $('#ThisEStatus').text()
        }
        $.ajax({
            url: localStorage.getItem('url') + "emp/newDriver",
            data: JSON.stringify(data),
            type: 'post',
            http2: true,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == 'success') {
                    getAllEmp()
                    alert('Employee added successfully!')
                } else {
                    alert('unable to save information. Please try again')
                }
                getAllDrivers()
            }
        })
    })

    $('#UpdateDriver').click(function () {
        if (!$("#IcDriverName").val() || !$('#payHr').val() || !$('#payPer').val()) {
            $("#IcDriverName").addClass('bdr-danger')
            $('#payHr').addClass('bdr-danger')
            $('#payPer').addClass('bdr-danger')
            alert('* fields are required field !!')
            return
        }
        var data = {
            id: $('#IcDriverId').val(),
            name: $('#IcDriverName').val(),
            hireDate: $('.HireDate').val(),
            address: $('#address').val(),
            city: $('#city').val(),
            zip: $('#zip').val(),
            ssn: $("#ssn").val(),
            taxId: $("#taxid").val(),
            Dl_Id: $("#Lid").val(),
            Dl_Exp: $("#lExp").val(),
            payHr: $('#payHr').val(),
            payPer: $('#payPer').val(),
            status: $('.eThisEStatus').text()
        }
        $.ajax({
            url: localStorage.getItem('url') + "emp/updateDriver",
            data: JSON.stringify(data),
            type: 'post',
            http2: true,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == 'success') {
                    getAllEmp()
                    alert('Employee updated successfully!')
                } else {
                    alert('unable to save information. Please try again')
                }
            }
        })
    })
    var DriFtBills = $("#DriverFtbTable").DataTable()
    var DriStmts = $("#DriverStmtTable").DataTable()

    $('#DriverTable tbody').on('click', 'tr', function () {
        DriTable.$('tr.light-blue-500').removeClass('light-blue-500');
        $(this).addClass('light-blue-500');
        var row = DriTable.row(this).data();
        $('#UpdateDriver').show()
        $('#saveDriver').hide()
        $('#NewDriver').modal('show')
        $('.ccfrm').val('')
        $('.ccfrm').empty()
        $.each(AllDrivers, function (key, val) {
            if (val.empId == row[0]) {
                $('#IcDriverId').val(val.empId)
                $('#IcDriverName').val(val.empName)
                $('.HireDate').val(moment(val.hireDate).format('MM-DD-YYYY'))
                $('#address').val(val.address)
                $('#city').val(val.city)
                $('#zip').val(val.zip)
                $("#ssn").val(val.ssn)
                $("#taxid").val(val.taxId)
                $("#Lid").val(val.Dl_Id)
                $(".eThisEStatus").append(val.status)
                $("#lExp").val(val.Dl_Exp)
                $('#payHr').val(val.payHr)
                $('#payPer').val(val.payPer)
            }
        })
        var data = {
            driver_name: row[1]
        }
        $.ajax({
            url: localStorage.getItem('url') + "ftb/DriFTBDetails",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (DriFtbills) {
                DriFtBills.clear().draw(); var net, gross, id
                $.each(DriFtbills, function (key, val) {
                    if (val.status == 'Created') {
                        net = 0, gross = 0
                        id = '<span class = "btn-xs text-info">' + val.status + '</span>'
                    } else if (val.status == 'Paid') {
                        id = '<span class = "btn-xs  text-success">' + val.status + '</span>'
                    } else if (val.status == 'P-Paid') {
                        id = '<span class = "btn-xs text-warning">' + val.status + '</span>'
                    } else if (val.status == 'Entered') {
                        id = '<span class = "btn-xs text-primary">' + val.status + '</span>'
                    } else if (val.status == 'Preview') {
                        id = '<span class = "btn-xs text-primary">' + val.status + '</span>'
                    } else {
                        id = '<span class = "btn-xs text-lime-400">' + val.status + '</span>'
                    }
                    DriFtBills.row.add([
                        val.Fright_Bill,
                        moment(val.date).format('MM-DD-YYYY'),
                        val.job_id, val.pTotal || net, val.pNetTotal || gross, id
                    ]).draw(false);
                });
            }
        })
        $.ajax({
            url: localStorage.getItem('url') + "dri/driStatements",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (DriStmt) {
                DriStmts.clear().draw();
                $.each(DriStmt, function (key, val) {
                    DriStmts.row.add([
                        val.statementId, moment(val.date).format('MM-DD-YYYY'), val.check, val.Total
                    ]).draw(false);
                });
            }
        })
    })
})