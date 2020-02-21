$(document).ready(function () {
    var custs, cstart, cend, drivers
    $('#FTDispDate').change(function () {
        getRates($('#nDjobId').val(), $('#FTDispDate').val(), $('#nttypes').text())
    })
    var allFtBills = $('#AllFtBills').DataTable({
        scrollY: '80vh',
        scrollCollapse: true,
        paging: false
    })
    var CustTags = $('#CustTags').DataTable({
        dom: "<'row'<'col-md-6'<'pull-left'f>><'col-md-6'<'pull-right'B>>>rt<'row'<'col-md-4'i><'col-md-8 pull-right'p>>",
        buttons: [
            'excel', 'pdf', 'print'
        ],
        scrollY: '80vh',
        scrollCollapse: true,
        paging: false
    })
    var DriTags = $('#DriFtBills').DataTable({
        dom: "<'row'<'col-md-6'<'pull-left'f>><'col-md-6'<'pull-right'B>>>rt<'row'<'col-md-4'i><'col-md-8 pull-right'p>>",
        buttons: [
            'excel', 'pdf', 'print'
        ],
        scrollY: '80vh',
        scrollCollapse: true,
        paging: false
    })
    function getRates(jId, dispDate, ttype) {
        var weeknumb = moment(dispDate).weekday()
        var name = {
            job_id: jId,
            weeknumb: weeknumb,
            ttype: ttype
        }
        $.ajax({
            url: localStorage.getItem('url') + "job/jjobs1",
            data: JSON.stringify(name),
            type: 'post',
            http2: true,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                $('#nBHRate').val(result.bHr)
                $('#nBLRate').val(result.bLoad)
                $('#nBTRate').val(result.bTon)
                if ($('#nPHRate').val() || $('#nPLRate').val() || $('#nPTRate').val()) {
                    $('#nPHRate').val()
                    $('#nPLRate').val()
                    $('#nPTRate').val()
                } else {
                    $('#nPHRate').val(result.pHr)
                    $('#nPLRate').val(result.pLoad)
                    $('#nPTRate').val(result.pTon)
                }

            }
        })
    }
    $('#nBHQty,#nBHRate').change(function () {
        $('#nPHQty').val($('#nBHQty').val())
        var rate = $('#nPLRate').val()
        if (!rate.includes('%')) {
            $('#nPHRate').val($('#nBHRate').val())
        }
        var n = $('#nBHQty').val() * $('#nBHRate').val()
        n = n.toFixed(2)
        $('#nBHTotal').val(n)
        var m = $('#nPHQty').val() * $('#nPHRate').val()
        m = m.toFixed(2)
        $('#nPHTotal').val(m)

        bTotal()
        pTotal()
    })
    $('#nBLQty,#nBLRate').change(function () {
        $('#nPLQty').val($('#nBLQty').val())
        var n = $('#nBLQty').val() * $('#nBLRate').val()
        n = n.toFixed(2)
        $('#nBLTotal').val(n)
        var rate = $('#nPLRate').val()
        if (rate == '') {
            $('#nPLRate').val($('#nBLRate').val())
            var m = $('#nPLQty').val() * $('#nPLRate').val()
            m = m.toFixed(2)
            $('#nPLTotal').val(m)
        }
        if (rate.includes('%')) {
            rate = parseInt(rate.slice(0, -1)) / 100
            var n = $('#nBLTotal').val() * rate
            n = n.toFixed(2)
            $('#nPLTotal').val(n)
        }


        bTotal()
        pTotal()
    })
    $('#nBTQty,#nBTRate').change(function () {
        var rate = $('#nPTRate').val()
        $('#nPTQty').val($('#nBTQty').val())

        var n = $('#nBTQty').val() * $('#nBTRate').val()
        n = n.toFixed(2)
        $('#nBTTotal').val(n)

        if (rate == '') {
            $('#nPTRate').val($('#nBTRate').val())
            var m = $('#nPTQty').val() * $('#nPTRate').val()
            m = m.toFixed(2)
            $('#nPTTotal').val(m)
        }
        if (rate.includes('%')) {
            var r = parseInt(rate.slice(0, -1)) / 100
            var n = $('#nBTTotal').val() * r
            n = n.toFixed(2)
            $('#nPTTotal').val(n)
        }

        bTotal()
        pTotal()
    })
    $('#nBTollQty,#nBTollRate').change(function () {
        $('#nPTollQty').val($('#nBTollQty').val())
        $('#nPTollRate').val($('#nBTollRate').val())
        var i = $('#nBTollQty').val() * $('#nBTollRate').val()
        i = i.toFixed(2)
        $('#nBTollTotal').val(i)
        var j = $('#nPTollQty').val() * $('#nPTollRate').val()
        j = j.toFixed(2)
        $('#nPTollTotal').val(j)

        bTotal()
        pTotal()
    })
    $('#nBDFQty,#nBDFRate').change(function () {
        var i = $('#nBDFQty').val() * $('#nBDFRate').val()
        i = i.toFixed(2)
        $('#nBDFTotal').val(i)
        bTotal()
    })
    $('#nBSTQty,#nBSTRate').change(function () {
        var i = $('#nBSTQty').val() * $('#nBSTRate').val()
        i = i.toFixed(2)
        $('#nBSTTotal').val(i)
        bTotal()
    })
    $('#nBMQty,#nBMRate,#nBMTax').change(function () {
        var i = $('#nBMQty').val() * $('#nBMRate').val();
        $('#nBMTotal').val(parseFloat(i + (i * (parseFloat($('#nBMTax').val()) / 100))))
        bTotal()
    })

    function bTotal() {
        var a = parseFloat($('#nBHTotal').val()) || 0,
            b = parseFloat($('#nBLTotal').val()) || 0,
            c = parseFloat($('#nBTTotal').val()) || 0,
            d = parseFloat($('#nBTollTotal').val()) || 0,
            e = parseFloat($('#nBDFTotal').val()) || 0,
            f = parseFloat($('#nBSTTotal').val()) || 0,
            g = parseFloat($('#nBMTotal').val()) || 0
        var t = a + b + c + d + e + f + g
        t = t.toFixed(2)
        $('#nbtotal').val(t)
        ValidateTotal()
    }
    $('#nPHQty,#nPHRate').change(function () {
        var n = $('#nPHQty').val() * $('#nPHRate').val()
        n = n.toFixed(2)
        $('#nPHTotal').val(n)
        pTotal()
    })
    $('#nPLQty,#nPLRate').change(function () {
        var n = $('#nPLQty').val() * $('#nPLRate').val()
        n = n.toFixed(2)
        $('#nPLTotal').val(n)
        var rate = $('#nPLRate').val()
        if (rate.includes('%')) {
            rate = parseInt(rate.slice(0, -1)) / 100
            var n = $('#nBLTotal').val() * rate
            n = n.toFixed(2)
            $('#nPLTotal').val(n)
        }

        pTotal()
    })
    $('#nPTQty,#nPTRate').change(function () {
        var n = $('#nPTQty').val() * $('#nPTRate').val()
        n = n.toFixed(2)
        $('#nPTTotal').val(n)
        var rate = $('#nPTRate').val()
        if (rate.includes('%')) {
            rate = parseInt(rate.slice(0, -1)) / 100
            var k = $('#nBTTotal').val() * rate
            k = k.toFixed(2)
            $('#nPTTotal').val(k)
        }

        pTotal()
    })
    $('#nPTollQty,#nPTollRate').change(function () {
        var i = $('#nPTollQty').val() * $('#nPTollRate').val()
        i = i.toFixed(2)
        $('#nPTollTotal').val(i)
        pTotal()
    })
    $('#nPDFQty,#nPDFRate').change(function () {
        var i = $('#nPDFQty').val() * $('#nPDFRate').val()
        i = i.toFixed(2)
        $('#nPDFTotal').val(i)
        pTotal()
    })
    $('#nPSTQty,#nPSTRate').change(function () {
        var i = $('#nPSTQty').val() * $('#nPSTRate').val()
        i = i.toFixed(2)
        $('#nPSTTotal').val(i)
        pTotal()
    })
    $('#nPMQty,#nPMRate,#nPMTax').change(function () {
        var i = $('#nPMQty').val() * $('#nPMRate').val()
        i = i.toFixed(2)
        $('#nPMTotal').val(parseFloat(i) + parseFloat($('#nPMTax').val()))
        pTotal()
    })

    $('#nFeePercent').change(function () {
        pTotal()
    })
    function pTotal() {
        var h = parseFloat($('#nFeePercent').val()) || 0,
            a = parseFloat($('#nPHTotal').val()) || 0,
            b = parseFloat($('#nPLTotal').val()) || 0,
            c = parseFloat($('#nPTTotal').val()) || 0,
            d = parseFloat($('#nPTollTotal').val()) || 0,
            e = parseFloat($('#nPDFTotal').val()) || 0,
            f = parseFloat($('#nPSTTotal').val()) || 0,
            g = parseFloat($('#nPMTotal').val()) || 0, y

        x = a + b + c + d + e + f + g
        x = x.toFixed(2)
        $('#nptotal').val(x)
        if (!h) {
            y = 0
        } else {
            h = h / 100
            y = (a + b + c) * h
            y = y.toFixed(2)
        }
        $('#nBrokerFee').val(y)
        $('#npNetTot').val((a + b + c) - y)
        /* $('.BrokerFee').val(y)
        var a = x - y
        a = a.toFixed(2)
        $('.pNetTot').val(a) */
        ValidateTotal()
    }

    function ValidateTotal() {

        var bill = parseFloat($('#nbtotal').val()) || parseFloat($('.btotal').val()),
            pay = parseFloat($('#npNetTot').val()) || parseFloat($('.pNetTot').val())
        if (pay > bill) {
            alert('Pay amount is more than Bill. Please verify again');
            $('#nbtotal').addClass('error')
            $('#npNetTot').addClass('error')
            $('.btotal').addClass('error')
            $('.pNetTot').addClass('error')
            $('.icon').removeClass('fa-arrow-up')
            $('.icon').addClass('fa-arrow-down')
            $('.MarVal').empty()
            var p = (pay / bill)
            var p1 = p.toString()
            var persent = p1.substr(0, 4), d = pay - bill,
                tot = '$ ' + d + ' - ' + persent
            $('.MarVal').append(tot)
            $('.alerts').addClass('text-danger')
            $('.alerts').removeClass('text-success')
        } else {
            $('#nbtotal').removeClass('error')
            $('#npNetTot').removeClass('error')
            $('#nbtotal').addClass('b-success')
            $('#npNetTot').addClass('b-success')
            $('.btotal').removeClass('error')
            $('.pNetTot').removeClass('error')
            $('.btotal').addClass('b-success')
            $('.pNetTot').addClass('b-success')
            $('.icon').addClass('fa-arrow-up')
            $('.icon').removeClass('fa-arrow-down')
            $('.MarVal').empty()
            $('.alerts').addClass('text-success')
            $('.alerts').removeClass('text-danger')
            var p = (bill / pay)
            var p1 = p.toString()
            var persent = p1.substr(0, 4), d = bill - pay,
                tot = '$ ' + d + ' ( ' + persent + '% )'
            $('.MarVal').append(tot)
        }
    }
    $('#NewFTB').click(function () {
        $('#NewFtBill').show()
        $('.FTUpdate').hide()
        $('#AllDriFtbills').val('')
        $('#tag_id').val('')
        $('#UpdateFtBill').hide()
        $(".DJobName").empty()
        $(".DCustomerName").empty()
        $(".sDriver").empty()
        $(".ttypes").empty()
        $(".DJobName").append('Job Name')
        $('.DCustomerName').append('Customer Name')
        $('.sDriver').append('Driver - Truck')
        $('#AllDriFtbills').empty()
        $('.ttypes').append('Truck Type')
        $('#newFtBillShow').modal('show')
        $('.newFtBill').prop('disabled', false)
        $('.NewFtBill').empty()
        $('.NewFtBill').val('')
        $('.invoiced').prop('disabled', false);
        $('.invDetails').hide()
        $('.binput').val('')
        $('.ccfrm').val('')
        $("#FTDispDate").datetimepicker({
            timepicker: false,
            format: 'm-d-Y'
        });
        $("#FTDispTime").datetimepicker({
            datepicker: false,
            format: 'H:i'
        });
        //resetDisp()
    })
    var unique = false
    $('#NewFtBill').click(function () {
        uniqueFTB($('#tag_id').val())
        $('#AllDriFtbills').empty()
        if ($('.MandField').val() == '') {
            $('.MandField').addClass('bdr-danger')
            alert('Please enter the mandatory fields')
            return
        } else if (unique) {
            return
        }
        var dritru = $("#nsDriver").text(), now = new Date();
        dritru = dritru.split(' - ');
        var ftData = {
            Fright_Bill: $('#tag_id').val(),
            updated: localStorage.username,
            updatedTime: now,
            status: 'Entered',
            BHQty: $('#nBHQty').val(),
            BHRate: $('#nBHRate').val(),
            BHTotal: $('#nBHTotal').val(),
            BLQty: $('#nBLQty').val(),
            BLRate: $('#nBLRate').val(),
            BLTotal: $('#nBLTotal').val(),
            BTQty: $('#nBTQty').val(),
            BTRate: $('#nBTRate').val(),
            BTTotal: $('#nBTTotal').val(),
            BTollQty: $('#nBTollQty').val(),
            BTollRate: $('#nBTollRate').val(),
            BTollTotal: $('#nBTollTotal').val(),
            BDFQty: $('#nBDFQty').val(),
            BDFRate: $('#nBDFRate').val(),
            BDFTotal: $('#nBDFTotal').val(),
            BSTQty: $('#nBSTQty').val(),
            BSTRate: $('#nBSTRate').val(),
            BSTTotal: $('#nBSTTotal').val(),
            BMQty: $('#nBMQty').val(),
            BMRate: $('#nBMRate').val(),
            BMTax: $('#nBMTax').val(),
            BMTotal: $('#nBMTotal').val(),
            btotal: $('#nbtotal').val(),
            PHQty: $('#nPHQty').val(),
            PHRate: $('#nPHRate').val(),
            PHTotal: $('#nPHTotal').val(),
            PLQty: $('#nPLQty').val(),
            PLRate: $('#nPLRate').val(),
            PLTotal: $('#nPLTotal').val(),
            PTQty: $('#nPTQty').val(),
            PTRate: $('#nPTRate').val(),
            PTTotal: $('#nPTTotal').val(),
            PTollQty: $('#nPTollQty').val(),
            PTollRate: $('#nPTollRate').val(),
            PTollTotal: $('#nPTollTotal').val(),
            PDFQty: $('#nPDFQty').val(),
            PDFRate: $('#nPDFRate').val(),
            PDFTotal: $('#nPDFTotal').val(),
            PSTQty: $('#nPSTQty').val(),
            PSTRate: $('#nPSTRate').val(),
            PSTTotal: $('#nPSTTotal').val(),
            PBRFeeRate: $('#nFeePercent').val(),
            PBRFee: $('#nBrokerFee').val(),
            ptotal: $('#nptotal').val(),
            pNetTotal: $('#npNetTot').val(),
            custName: $('#NewFtCust').val(),
            custId: $('#nDCustomerId').val(),
            jobName: $('#NewFtJobName').val(),
            JobId: $('#nDjobId').val(),
            jobType: $('#FtJobType').val(),
            Truck_Type: $('#FtTruckType').val(),
            Truck_id: $('#Truck_id').val(),
            job_location: $('#JobLoc').val(),
            notes: $('#DisNotes').val(),
            Date: moment($('#FTDispDate').val(), 'MM-DD-YYYY'),
            Time: $('#FTDispTime').val(),
            locA: $('#loca').val(),
            locB: $('#locb').val(),
            DriverId: dritru[1],
            Driver: $('#AllDriFtbills').val(),
        }
        $.ajax({
            url: localStorage.getItem('url') + "ftb/newFTBill",
            data: JSON.stringify(ftData),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == 'success') {
                    $('#newFtBillShow').modal('hide')
                    alert('bill added')
                    $.ajax({
                        url: localStorage.getItem('url') + "ftb/AllFtBills",
                        type: 'get',
                        http2: true,
                        contentType: 'application/json',
                        beforeSend: function (xhr) {
                            $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
                        },
                        success: function (result) {
                            $.unblockUI();
                            allFtBills.clear().draw()
                            $.each(result, function (key, val) {
                                allFtBills.row.add([
                                    moment(val.date).format('MM-DD-YYYY'),
                                    val.customer_id,
                                    val.customer_name,
                                    val.job_id,
                                    val.Fright_Bill,
                                    val.Driver,
                                    val.status
                                ]).draw(false);
                            })
                        }
                    })
                }
            }
        })
    })

    $('#nFeePercent').change(function () {
        if ($('#nFeePercent').val() == '') {
            alert('empty')
        }
    })

    var start = moment().subtract(1, 'month').startOf('month'),
        end = moment().subtract(1, 'month').endOf('month'), nstart, nend
    cb(start, end);
    function cb(start, end) {
        $('#CustDateRange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        getinvs(custs, start.format('MM-DD-YYYY'), end.format('MM-DD-YYYY'))
        nstart = start.format('MM-DD-YYYY')
        nend = end.format('MM-DD-YYYY')
    }
    $('#CustDateRange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);
    Dricb(start, end);
    function Dricb(start, end) {
        $('#DriDateRange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        getDriInvs(drivers, start.format('MM-DD-YYYY'), end.format('MM-DD-YYYY'))
    }
    $('#DriDateRange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, Dricb);
    getCustomers()
    function getCustomers() {
        $.ajax({
            url: localStorage.getItem('url') + "job/cust",
            type: 'get',
            http2: true,
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                $("#CustDropDown").empty();
                $.each(result, function (key, val) {
                    var dd = '<a class="dropdown-item custdd" id="' + val + '">' + val + '</a>'
                    $("#CustDropDown").append(dd);
                })
            }
        })
    }
    getDrivers()
    function getDrivers() {
        $.ajax({
            url: localStorage.getItem('url') + "dri/Alldrivers",
            type: 'get',
            http2: true,
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                localStorage.setItem('Drivers', JSON.stringify(result.dri))
                $("#DriDropDown").empty();
                $.each(result, function (key, val) {
                    var dd = '<a class="dropdown-item dridd" id = "' + val.ICdriver_name + '">' + val.ICdriver_name + '</a>'
                    $("#DriDropDown").append(dd);
                })
            }
        })
    }

    function getinvs(custs, cstart, cend) {
        var data = {
            custName: custs,
            start: cstart,
            end: cend
        }
        $.ajax({
            url: localStorage.getItem('url') + "ftb/getCustInvs",
            type: 'post',
            data: JSON.stringify(data),
            http2: true,
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                CustTags.clear().draw()
                $.each(result, function (key, val) {
                    var loc = '', rate = '', bqty = ''
                    if (val.BHQty) {
                        rate = rate + '$ ' + val.BHRate + '<br>'
                        bqty = bqty + val.BHQty + ' Hour,<br> '
                    }
                    if (val.BLQty) {
                        rate = rate + '$ ' + val.BLRate + '<br>'
                        bqty = bqty + val.BLQty + ' Load,<br>'
                    } if (val.BTQty) {
                        rate = rate + '$ ' + val.BTRate + '<br>'
                        bqty = bqty + val.BTQty + ' Ton,<br> '
                    } if (val.BTollQty) {
                        rate = rate + '$ ' + val.BTollRate + '<br>'
                        bqty = bqty + val.BTollQty + ' Toll,<br> '
                    } if (val.BDFQty) {
                        rate = rate + '$ ' + val.BDFRate + '<br>'
                        bqty = bqty + val.BDFQty + ' Dumps,<br> '
                    } if (val.BSTQty) {
                        rate = rate + '$ ' + val.BSTRate + '<br>'
                        bqty = bqty + val.BSTQty + ' Standby Time,<br> '
                    } if (val.BMQty) {
                        rate = rate + '$ ' + val.BMRate + '<br>'
                        bqty = bqty + val.BMQty + ' Material Fee,<br> '
                    }
                    if (val.LocA) {
                        loc = loc + val.LocA
                    }
                    if (val.LocB) {
                        loc = loc + ' / ' + val.LocB
                    }
                    CustTags.row.add([
                        moment(val.date).format('MM-DD-YYYY'),
                        val.invId || '',
                        val.checkNo || '',
                        val.Fright_Bill,
                        val.Truck_id || '',
                        val.Driver,
                        loc,
                        bqty,
                        rate,
                        '$' + val.bTotal
                    ]).draw(false);
                })
            }
        })
    }
    $('#CustTags tbody').on('click', 'tr', function () {
        CustTags.$('tr.light-blue-500').removeClass('light-blue-500');
        $(this).addClass('light-blue-500');
        var row = CustTags.row(this).data();
        $('.FTUpdate').show()
        $('#newFtBillShow').modal('show');
        getFtBill(row[3])
    })
    $('#DriFtBills tbody').on('click', 'tr', function () {
        DriTags.$('tr.light-blue-500').removeClass('light-blue-500');
        $(this).addClass('light-blue-500');
        var row = DriTags.row(this).data();
        $('.FTUpdate').show()
        $('#newFtBillShow').modal('show');
        getFtBill(row[3])
    })
    function getDriInvs(drivers, cstart, cend) {
        var data = {
            driName: drivers,
            start: cstart,
            end: cend
        }
        $.ajax({
            url: localStorage.getItem('url') + "ftb/getDriInvs",
            type: 'post',
            data: JSON.stringify(data),
            http2: true,
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                DriTags.clear().draw()
                $.each(result, function (key, val) {
                    var loc = '', rate = '', bqty = ''
                    if (val.PHQty) {
                        rate = rate + '$ ' + val.PHRate + '<br>'
                        bqty = bqty + val.PHQty + ' Hour,<br> '
                    }
                    if (val.PLQty) {
                        rate = rate + '$ ' + val.PLRate + '<br>'
                        bqty = bqty + val.PLQty + ' Load,<br>'
                    } if (val.PTQty) {
                        rate = rate + '$ ' + val.PTRate + '<br>'
                        bqty = bqty + val.PTQty + ' Ton,<br> '
                    } if (val.PTollQty) {
                        rate = rate + '$ ' + val.PTollRate + '<br>'
                        bqty = bqty + val.PTollQty + ' Toll,<br> '
                    } if (val.PDFQty) {
                        rate = rate + '$ ' + val.PDFRate + '<br>'
                        bqty = bqty + val.PDFQty + ' Dumps,<br> '
                    } if (val.PSTQty) {
                        rate = rate + '$ ' + val.PSTRate + '<br>'
                        bqty = bqty + val.PSTQty + ' Standby Time,<br> '
                    } if (val.PMQty) {
                        rate = rate + '$ ' + val.PMRate + '<br>'
                        bqty = bqty + val.PMQty + ' Material Fee,<br> '
                    }
                    if (val.LocA) {
                        loc = loc + val.LocA
                    }
                    if (val.LocB) {
                        loc = loc + ' / ' + val.LocB
                    }
                    DriTags.row.add([
                        moment(val.date).format('MM-DD-YYYY'),
                        val.invId || '',
                        val.checkNo || '',
                        val.Fright_Bill,
                        val.Truck_id || '',
                        loc,
                        bqty,
                        rate,
                        '$ ' + val.pTotal,
                        '$ ' + val.PBRFee,
                        '$ ' + val.pNetTotal
                    ]).draw(false);
                })
            }
        }).fail(function (err) {
            console.log(err)
            $.unblockUI();
        });
    }
    var diff = [], old = []
    function getFtBill(ftBill) {
        $('.invDetails').hide()
        var billId = { bill: ftBill } || { bill: $("#billId").val() }, i = 0
        $.ajax({
            url: localStorage.getItem('url') + "ftb/getFtBill",
            data: JSON.stringify(billId),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                old.hr = result[0].BHQty, old.lo = result[0].BLQty, old.to = result[0].BTQty, old.toll = result[0].BTollQty,
                    old.df = result[0].BDFQty, old.st = result[0].BSTQty, old.mt = result[0].BMQty, old.total = result[0].bTotal
                $(".tag_id").val(result[0].Fright_Bill)
                $(".customer_id").val(result[0].customer_id)
                $(".customer_name").val(result[0].customer_name)
                $(".job_id").val(result[0].job_id)
                $(".job_name").val(result[0].job_name)
                $(".job_type").val(result[0].job_type)
                //$("#DriverId").val(result[0].)
                $(".DriverName").val(result[0].Driver)
                $('.DriverId').val(result[0].driver_id)
                $(".Truck_id").val(result[0].Truck_id)
                $(".Truck_name").val(result[0].Truck_Type)
                $(".DisNotes").val(result[0].notes)
                $(".locA").val(result[0].LocA)
                $(".locB").val(result[0].LocB)
                $(".FTDispTime").val(result[0].Time)
                $(".JobLoc").val(result[0].job_location)
                $(".FTDispDate").val(moment(result[0].date).format('MM-DD-YYYY'))
                $('.invoiced').prop('disabled', false);
                $('.bdumpfee').val(result[0].dumpFee)
                $('.bStandBy').val(result[0].stTime)
                $('.bMaterial').val(result[0].mFee)
                $('.BHQty').val(result[0].BHQty)
                $('.BHRate').val(result[0].BHRate)
                $('.BHTotal').val(result[0].BHTotal)
                $('.BLQty').val(result[0].BLQty)
                $('.BLRate').val(result[0].BLRate)
                $('.BLTotal').val(result[0].BLTotal)
                $('.BTQty').val(result[0].BTQty)
                $('.BTRate').val(result[0].BTRate)
                $('.BTTotal').val(result[0].BTTotal)
                $('.BTollQty').val(result[0].BTollQty)
                $('.BTollRate').val(result[0].BTollRate)
                $('.BTollTotal').val(result[0].BTollTotal)
                $('.BDFQty').val(result[0].BDFQty)
                $('.BDFRate').val(result[0].BDFRate)
                $('.BDFTotal').val(result[0].BDFTotal)
                $('.BSTQty').val(result[0].BSTQty)
                $('.BSTRate').val(result[0].BSTRate)
                $('.BSTTotal').val(result[0].BSTTotal)
                $('.BMQty').val(result[0].BMQty)
                $('.BMRate').val(result[0].BMRate)
                $('.BMTax').val(result[0].BMTax)
                $('.BMTotal').val(result[0].BMTotal)
                $('.PHQty').val(result[0].PHQty)
                $('.PHRate').val(result[0].PHRate)
                $('.PHTotal').val(result[0].PHTotal)
                $('.PLQty').val(result[0].PLQty)
                $('.PLRate').val(result[0].PLRate)
                $('.PLTotal').val(result[0].PLTotal)
                $('.PTQty').val(result[0].PTQty)
                $('.PTRate').val(result[0].PTRate)
                $('.PTTotal').val(result[0].PTTotal)
                $('.PTollQty').val(result[0].PTollQty)
                $('.PTollRate').val(result[0].PTollRate)
                $('.PTollTotal').val(result[0].PTollTotal)
                $('.PDFQty').val(result[0].PDFQty)
                $('.PDFRate').val(result[0].PDFRate)
                $('.PDFTotal').val(result[0].PDFTotal)
                $('.PSTQty').val(result[0].PSTQty)
                $('.PSTRate').val(result[0].PSTRate)
                $('.PSTTotal').val(result[0].PSTTotal)
                $('.FeePercent').val(result[0].PBRFeeRate)
                $('.BrokerFee').val(result[0].PBRFee)
                $('.updatedBy').empty()
                $('.updatedBy').append(result[0].updateBy)
                $('.btotal').val(result[0].bTotal)
                $('.ptotal').val(result[0].pTotal)
                $('.pNetTot').val(result[0].pNetTotal)
                var dd = moment(result[0].updatedDate).format('MM-DD-YYYY hh:mm A');
                $('.updatedDate').empty()
                $('.updatedDate').append(dd)
                if (result[0].status == 'Invoiced' || result[0].status == 'Preview' || result[0].status == 'Paid' || result[0].status == 'P-Paid' || result[0].status == 'Adjusted') {
                    $('.invIds').empty()
                    $('#invDate').empty()
                    $('.invStatus').empty()
                    $('.FTUpdate').prop('disabled', true)
                    $('.invIds').append(result[0].invId)
                    if (result[0].invDate) {
                        $('#invDate').append(moment(result[0].invDate).format('MM-DD-YYYY'))
                    }
                    if (result[0].payables) {
                        $('#stmtIds').empty()
                        $('#stmtDate').empty()
                        $('#stmtStatus').empty()
                        $('#stmtIds').append(result[0].payables.statementId)
                        $('#stmtDate').append(moment(result[0].payables.statementDate).format('MM-DD-YYYY'))
                        $('#stmtStatus').append(result[0].payables.checkNum)
                    }
                    $('.invStatus').append(result[0].status)
                    $('.invDetails').show()
                } else {
                    $('.invDetails').hide()
                    $('.FTUpdate').prop('disabled', false)
                }

                $("#tag_id").val(result[0].Fright_Bill)
                $("#nDCustomerId").val(result[0].customer_id)
                $("#NewFtCust").val(result[0].customer_name)
                $("#nDjobId").val(result[0].job_id)
                $("#NewFtJobName").val(result[0].job_name)
                $("#FtJobType").val(result[0].job_type)
                //$("#DriverId").val(result[0].)
                $("#AllDriFtbills").val(result[0].Driver)
                $('.DriverId').val(result[0].driver_id)
                $("#Truck_id").val(result[0].Truck_id)
                $("#FtTruckType").val(result[0].Truck_Type)
                $("#DisNotes").val(result[0].notes)
                $("#loca").val(result[0].LocA)
                $("#locb").val(result[0].LocB)
                $("#FTDispTime").val(result[0].Time)
                $("#JobLoc").val(result[0].job_location)
                $("#FTDispDate").val(moment(result[0].date).format('MM-DD-YYYY'))
                $('#invoiced').prop('disabled', false);
                $('#bdumpfee').val(result[0].dumpFee)
                $('#bStandBy').val(result[0].stTime)
                $('#bMaterial').val(result[0].mFee)
                $('#nBHQty').val(result[0].BHQty)
                $('#nBHRate').val(result[0].BHRate)
                $('#nBHTotal').val(result[0].BHTotal)
                $('#nBLQty').val(result[0].BLQty)
                $('#nBLRate').val(result[0].BLRate)
                $('#nBLTotal').val(result[0].BLTotal)
                $('#nBTQty').val(result[0].BTQty)
                $('#nBTRate').val(result[0].BTRate)
                $('#nBTTotal').val(result[0].BTTotal)
                $('#nBTollQty').val(result[0].BTollQty)
                $('#nBTollRate').val(result[0].BTollRate)
                $('#nBTollTotal').val(result[0].BTollTotal)
                $('#nBDFQty').val(result[0].BDFQty)
                $('#nBDFRate').val(result[0].BDFRate)
                $('#nBDFTotal').val(result[0].BDFTotal)
                $('#nBSTQty').val(result[0].BSTQty)
                $('#nBSTRate').val(result[0].BSTRate)
                $('#nBSTTotal').val(result[0].BSTTotal)
                $('#nBMQty').val(result[0].BMQty)
                $('#nBMRate').val(result[0].BMRate)
                $('#nBMTax').val(result[0].BMTax)
                $('#nBMTotal').val(result[0].BMTotal)
                $('#nPHQty').val(result[0].PHQty)
                $('#nPHRate').val(result[0].PHRate)
                $('#nPHTotal').val(result[0].PHTotal)
                $('#nPLQty').val(result[0].PLQty)
                $('#nPLRate').val(result[0].PLRate)
                $('#nPLTotal').val(result[0].PLTotal)
                $('#nPTQty').val(result[0].PTQty)
                $('#nPTRate').val(result[0].PTRate)
                $('#nPTTotal').val(result[0].PTTotal)
                $('#nPTollQty').val(result[0].PTollQty)
                $('#nPTollRate').val(result[0].PTollRate)
                $('#nPTollTotal').val(result[0].PTollTotal)
                $('#nPDFQty').val(result[0].PDFQty)
                $('#nPDFRate').val(result[0].PDFRate)
                $('#nPDFTotal').val(result[0].PDFTotal)
                $('#nPSTQty').val(result[0].PSTQty)
                $('#nPSTRate').val(result[0].PSTRate)
                $('#nPSTTotal').val(result[0].PSTTotal)
                $('#nFeePercent').val(result[0].PBRFeeRate)
                $('#nBrokerFee').val(result[0].PBRFee)
                $('#nupdatedBy').empty()
                $('#nupdatedBy').append(result[0].updateBy)
                $('#nbtotal').val(result[0].bTotal)
                $('#nptotal').val(result[0].pTotal)
                $('#npNetTot').val(result[0].pNetTotal)
                var dd = moment(result[0].updatedDate).format('MM-DD-YYYY hh:mm A');
                $('#nupdatedDate').empty()
                $('#nupdatedDate').append(dd)
                if (result[0].status == 'Invoiced' || result[0].status == 'Preview' || result[0].status == 'Paid' || result[0].status == 'P-Paid' || result[0].status == 'Adjusted') {
                    $('#invIds').empty()
                    $('#invDate').empty()
                    $('#invStatus').empty()
                    $('#invIds').append(result[0].invId)
                    $('.FTUpdate').prop('disabled', true)
                    if (result[0].invDate) {
                        $('#invDate').append(moment(result[0].invDate).format('MM-DD-YYYY'))
                    }
                    if (result[0].payables) {
                        $('#stmtIds').empty()
                        $('#stmtDate').empty()
                        $('#stmtStatus').empty()
                        $('#stmtIds').append(result[0].payables.statementId)
                        $('#stmtDate').append(moment(result[0].payables.statementDate).format('MM-DD-YYYY'))
                        $('#stmtStatus').append(result[0].payables.checkNum)
                    }
                    $('#invStatus').append(result[0].status)
                    $('#invDetails').show()
                } else {
                    $('#invDetails').hide()
                    $('.FTUpdate').prop('disabled', false)
                }
                //$('#FtBillShow').modal('show')
            }
        })
    }

    $('.FTUpdate').click(function () {
        var status = $('#stmtStatus').text() + $('#invStatus').text()
        if (status != '') {
            alert("This bill can't be edit here")
            return
        }
        var now = new Date();
        var ftData = {
            tagid: $('#tag_id').val(),
            updated: localStorage.username,
            updatedTime: now,
            status: 'Entered',
            BHQty: $('#nBHQty').val(),
            BHRate: $('#nBHRate').val(),
            BHTotal: $('#nBHTotal').val(),
            BLQty: $('#nBLQty').val(),
            BLRate: $('#nBLRate').val(),
            BLTotal: $('#nBLTotal').val(),
            BTQty: $('#nBTQty').val(),
            BTRate: $('#nBTRate').val(),
            BTTotal: $('#nBTTotal').val(),
            BTollQty: $('#nBTollQty').val(),
            BTollRate: $('#nBTollRate').val(),
            BTollTotal: $('#nBTollTotal').val(),
            BDFQty: $('#nBDFQty').val(),
            BDFRate: $('#nBDFRate').val(),
            BDFTotal: $('#nBDFTotal').val(),
            BSTQty: $('#nBSTQty').val(),
            BSTRate: $('#nBSTRate').val(),
            BSTTotal: $('#nBSTTotal').val(),
            BMQty: $('#nBMQty').val(),
            BMRate: $('#nBMRate').val(),
            BMTax: $('#nBMTax').val(),
            BMTotal: $('#nBMTotal').val(),
            btotal: $('#nbtotal').val(),
            PHQty: $('#nPHQty').val(), PHRate: $('#nPHRate').val(), PHTotal: $('#nPHTotal').val(),
            PLQty: $('#nPLQty').val(), PLRate: $('#nPLRate').val(), PLTotal: $('#nPLTotal').val(),
            PTQty: $('#nPTQty').val(), PTRate: $('#nPTRate').val(), PTTotal: $('#nPTTotal').val(),
            PTollQty: $('#nPTollQty').val(), PTollRate: $('#nPTollRate').val(), PTollTotal: $('#nPTollTotal').val(),
            PDFQty: $('#nPDFQty').val(), PDFRate: $('#nPDFRate').val(), PDFTotal: $('#nPDFTotal').val(),
            PSTQty: $('#nPSTQty').val(), PSTRate: $('#nPSTRate').val(), PSTTotal: $('#nPSTTotal').val(),
            PBRFeeRate: $('#nFeePercent').val(), PBRFee: $('#nBrokerFee').val(),
            Driver: $('#AllDriFtbills').val(), customer_name: $('#NewFtCust').val(),
            date: moment($('#FTDispDate').val(), 'MM-DD-YYYY'),
            ptotal: $('#nptotal').val(), pNetTotal: $('#npNetTot').val(),
        }
        $.ajax({
            url: localStorage.getItem('url') + "ftb/updateFtBill",
            data: JSON.stringify(ftData),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                console.log(result)
                if (result.ok == 1) {
                    getAllTags()
                    saveDriverPay()
                    //showNewInv(ftData, diff)
                } else {
                    console.log(result)
                    alert('Fright Bill Details Not Updateed Please Try again!!')
                }
            }
        })
    })

    $('.FeePercent').on('keyup', function () {
        var a = parseFloat($('.PHTotal').val()) || 0,
            b = parseFloat($('.PLTotal').val()) || 0,
            c = parseFloat($('.PTTotal').val()) || 0,
            h = parseFloat($('.FeePercent').val())
        h = h / 100
        var y = (a + b + c) * h
        y = y.toFixed(2)
        $('.BrokerFee').val(y)
        pTotal()
    })

    function saveDriverPay() {
        var now = new Date()
        var d = $('#FTDispDate').val()
        var Apayable = {
            BHQty: $('#nBHQty').val(),
            BHRate: $('#nBHRate').val(),
            BHTotal: $('#nBHTotal').val(),
            BLQty: $('#nBLQty').val(),
            BLRate: $('#nBLRate').val(),
            BLTotal: $('#nBLTotal').val(),
            BTQty: $('#nBTQty').val(),
            BTRate: $('#nBTRate').val(),
            BTTotal: $('#nBTTotal').val(),
            BTollQty: $('#nBTollQty').val(),
            BTollRate: $('#nBTollRate').val(),
            BTollTotal: $('#nBTollTotal').val(),
            BDFQty: $('#nBDFQty').val(),
            BDFRate: $('#nBDFRate').val(),
            BDFTotal: $('#nBDFTotal').val(),
            BSTQty: $('#nBSTQty').val(),
            BSTRate: $('#nBSTRate').val(),
            BSTTotal: $('#nBSTTotal').val(),
            BMQty: $('#nBMQty').val(),
            BMRate: $('#nBMRate').val(),
            BMTax: $('#nBMTax').val(),
            BMTotal: $('#nBMTotal').val(),
            btotal: $('#nbtotal').val(),
            PHQty: $('#nPHQty').val(), PHRate: $('#nPHRate').val(), PHTotal: $('#nPHTotal').val(),
            PLQty: $('#nPLQty').val(), PLRate: $('#nPLRate').val(), PLTotal: $('#nPLTotal').val(),
            PTQty: $('#nPTQty').val(), PTRate: $('#nPTRate').val(), PTTotal: $('#nPTTotal').val(),
            PTollQty: $('#nPTollQty').val(), PTollRate: $('#nPTollRate').val(), PTollTotal: $('#nPTollTotal').val(),
            PDFQty: $('#nPDFQty').val(), PDFRate: $('#nPDFRate').val(), PDFTotal: $('#nPDFTotal').val(),
            PSTQty: $('#nPSTQty').val(), PSTRate: $('#nPSTRate').val(), PSTTotal: $('#nPSTTotal').val(),
            PBRFeeRate: $('#nFeePercent').val(), PBRFee: $('#nBrokerFee').val(),
            ptotal: $('#nptotal').val(), pNetTotal: $('#npNetTot').val(),
            updated: localStorage.username,
            updatedTime: now,
            tagDate: moment(d, 'MM-DD-YYYY'),
            Driver: $('#AllDriFtbills').val(), customer_name: $('#NewFtCust').val(),
            tagid: $('#tag_id').val(),
            invId: $('#invId').text(),
        }
        diff.hr = Apayable.BHQty - old.hr, diff.lo = Apayable.BLQty - old.lo, diff.to = Apayable.BTQty - old.to, diff.toll = Apayable.BTollQty - old.toll
        diff.df = Apayable.BDFQty - old.df, diff.st = Apayable.BSTQty - old.st, diff.mt = Apayable.BMQty - old.mt, diff.tot = Apayable.btotal - old.total
        var Apayable = Object.assign(Apayable, diff);
        $.ajax({
            url: localStorage.getItem('url') + "dri/updateBillDriver",
            data: JSON.stringify(Apayable),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                $('#FtBillShow').modal('hide')
                $('#newFtBillShow').modal('hide')
                getinvs(custs, nstart, nend)
                if (result.msg == 'success') {
                    //alert('Driver Pay updated')
                }
            }
        })
    }

    $('.aotuComplete').click(function () {
        Allcust = JSON.parse(localStorage.getItem('Customers'))
        console.log(Allcust)
        $("#GetCustFtbills").autocomplete({
            source: Allcust
        });
        $("#GetCustDisp").autocomplete({
            source: Allcust
        });
    })

    $('.autoCompleteDri').click(function () {
        var AllDri = JSON.parse(localStorage.getItem('Drivers'))
        $("#GetDriFtbills").autocomplete({
            source: AllDri
        });
        $("#AllDriFtbills").autocomplete({
            source: AllDri
        });
    })
    $('.NewFtCustSpan').click(function () {
        Allcust = JSON.parse(localStorage.getItem('Customers'))
        $('#NewFtCust').autocomplete({
            source: Allcust
        })
    })
    $('#GetCustFtbills').on('change', function () {
        custs = $("#GetCustFtbills").val()
        var r = $('#CustDateRange').val()
        r = r.split('-')
        getinvs(custs, r[0], r[1])
    })
    $('#GetDriFtbills').on('change', function () {
        drivers = $("#GetDriFtbills").val()
        var r = $('#DriDateRange').val()
        r = r.split('-')
        getDriInvs(drivers, r[0], r[1])
    })

    $('#NewFtCust').change(function () {
        var data = {
            custName: $('#NewFtCust').val()
        }
        $.ajax({
            url: localStorage.getItem('url') + "ftb/CustDetails",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                console.log(result)
                $('#nDCustomerId').val(result.custId.customer_id)
                var job_name = result.jobs[0].job_name || ' '
                localStorage.setItem('JobName', JSON.stringify(job_name))
            }
        })
    })
    $('.NewFtJobNameSpan').keypress(function () {
        var AllJobs = JSON.parse(localStorage.getItem('JobName'))
        $('#NewFtJobName').autocomplete({
            source: AllJobs
        })
    })
    $('.spanFtTruckType').keypress(function () {
        var AllJobs = JSON.parse(localStorage.getItem('truckType'))
        $('#FtTruckType').autocomplete({
            source: AllJobs
        })
    })
    $('.spanFtJobType').keypress(function () {
        var AllJobs = JSON.parse(localStorage.getItem('jobType'))
        $('#FtJobType').autocomplete({
            source: AllJobs
        })
    })
    $('#NewFtJobName').change(function () {
        var jobName = $('#NewFtJobName').val(), driList = JSON.parse(localStorage.getItem('Drivers'))
        if (driList.indexOf(jobName) < 0) {
            driList.push(jobName);
        }
    })
    $('#NewFtCust').keydown(function () {
        $('#NewFtCust').autocomplete({
            source: JSON.parse(localStorage.getItem('Customers'))
        })
    })

    $('#AllDriFtbills').keydown(function () {
        $("#AllDriFtbills").autocomplete({
            source: JSON.parse(localStorage.getItem('Drivers'))
        });
    })
    getAllTags()
    function getAllTags() {
        $.ajax({
            url: localStorage.getItem('url') + "ftb/AllFtBills",
            type: 'get',
            http2: true,
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                allFtBills.clear().draw()
                $.each(result, function (key, val) {
                    var stat = ''
                    if (val.status == 'Entered') {
                        stat = '<span class=" md-flat  w-xs text-info">' + val.status + '</span>'
                    } else if (val.status == 'Invoiced') {
                        stat = '<span class=" md-flat  w-xs text-primary">' + val.status + '</span>'
                    } else if (val.status == 'Invoiced' || val.status == 'Preview') {
                        stat = '<span class=" md-flat  w-xs text-primary">' + val.status + '</span>'
                    } else if (val.status == 'P-Paid') {
                        stat = '<span class=" md-flat  w-xs text-warning">' + val.status + '</span>'
                    } else if (val.status == 'Paid') {
                        stat = '<span class=" md-flat  w-xs text-success">' + val.status + '</span>'
                    } else {
                        stat = '<span class=" md-flat  w-xs text-danger">' + val.status + '</span>'
                    }
                    allFtBills.row.add([
                        moment(val.date).format('MM-DD-YYYY'),
                        val.customer_id,
                        val.customer_name,
                        val.job_id,
                        val.Fright_Bill,
                        val.Driver,
                        stat
                    ]).draw(false);
                })
                $.unblockUI();
            }
        })
    }

    $('#AllFtBills tbody').on('click', 'tr', function () {
        allFtBills.$('tr.light-blue-500').removeClass('light-blue-500');
        $(this).addClass('light-blue-500');
        var row = allFtBills.row(this).data();
        getFtBill(row[4], row[0])
        //$('.newFtBill').prop('disabled', true)
        $('#NewFtBill').hide()
        $('#newFtBillShow').modal('show');
        $('.FTUpdate').show()
    })

    $('#tag_id').change(function () {
        uniqueFTB($('#tag_id').val())
    })
    function uniqueFTB(ftb) {
        var FtBill = {
            bill: ftb
        }
        $.ajax({
            url: localStorage.getItem('url') + "ftb/uniqueFTB",
            data: JSON.stringify(FtBill),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                if (res.length > 0) {
                    alert('Douplicate Fright Bill')
                    unique = true
                } else {
                    unique = false
                }
            }
        })
    }
});