$(document).ready(function () {

    if (!localStorage.username) {
        window.location.href = 'signin.html';
    }
    var username = localStorage.username.toUpperCase()
    $('#UserN').empty()
    $('#UserN').append(username.charAt(0))
    var date = new Date();
    $('.selectedMon').empty();
    $('.selectedMon').append(moment(date).format('MMM'))
    $('.selMon').click(function () {
        $('.selectedMon').empty();
        $('.selectedMon').append($(this).data("mon"))
    })
    var PayByDriver, allTags
    $("#StatementDate").datetimepicker({
        timepicker: false,
        format: 'm-d-Y'
    });
    getAllStatements()
    AllStatements()

    function getAllStatements() {
        $.ajax({
            url: localStorage.getItem('url') + "dri/getAllStatements",
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                allTags = result
                const Array = result;
                const Property = "Driver";
                PayByDriver = _.groupBy(Array, Property);
                $('#PayDriver').empty()
                $.each(PayByDriver, function (key, val) {
                    var jobid = '<li class="dd-item" data-id="15">' +
                        '<div class="dd-content ddFont"><div class="dd-handle pointernone"><i class="fa fa-reorder text-muted"></i></div>' + key +
                        '<span id="' + key + '" class="btn btn-outline rounded b-primary text-primary b-2x pull-right driStatement">Statement</span>' +
                        '</div>' +
                        '<ol class="dd-list">'
                    $.each(val, function (k, v) {
                        var bqty = ''
                        if (v.PHQty) {
                            bqty = bqty + v.PHQty + ' H <br>'
                        }
                        if (v.PLQty) {
                            bqty = bqty + v.PLQty + ' L <br>'
                        } if (v.PTQty) {
                            bqty = bqty + v.PTQty + ' T <br>'
                        }
                        if (v.PTollQty) {
                            bqty = bqty + v.PTollQty + ' T <br>'
                        }
                        if (v.PDFQty) {
                            bqty = bqty + v.PDFQty + ' D <br>'
                        }
                        if (v.PSTQty) {
                            bqty = bqty + v.PSTQty + ' ST <br>'
                        }
                        jobid = jobid + '<li class="dd-item" data-id="16">' +
                            '<div class="dd-content ddFont"><div class="dd-handle pointernone"><i class="fa fa-reorder text-muted"></i></div>' +
                            '<div class="row">' +
                            '<div class="col-md-3"><span>FT Bill : </span>' +
                            '<span id ="' + v.Fright_Bill + '"class="viewTag text-primary">' + v.Fright_Bill + '</span></div>' +
                            '<div class="col-md-3"><span>Date : </span><span class=" text-primary">' + moment(v.tagDate).format("MM-DD-YY") + '</span></div>' +
                            '<div class="col-md-2"><span>Qty : </span><span class=" text-primary">' + bqty + '</span></div>' +
                            '<div class="col-md-2"><span>Gross : $ </span><span class=" text-primary">' + v.ptotal + '</span></div>' +
                            '<div class="col-md-2"><span>Net : $ </span><span class=" text-success">' + v.pNetTotal + '</span></div>' +
                            '</div>' +
                            '</div>' +
                            '</li>'
                    })
                    jobid = jobid + '</ol></li>'
                    $('#PayDriver').append(jobid);
                })
            }
        })
    }

    $("ol").on("click", "span.driStatement", function () {
        $('#StatementDate').val('')
        genStatements($(this).attr("id"))
    })

    var details = {}, ftb = [];
    function genStatements(dri) {

        var qty = {}
        var h = 0, l = 0, t = 0, to = 0, df = 0, st = 0, total = 0, totalTag = 0, driverId, BrFee = 0
        $.each(PayByDriver, function (key, vals) {
            if (key === dri) {
                $.each(vals, function (k, v) {
                    d = {}
                    var bqty = '', rate = '', brate = ''
                    if (v.PHQty) {
                        bqty = bqty + v.PHQty + ' H <br>'
                        rate = rate + v.PHRate + '/H <br>'
                        h += v.PHTotal || 0
                        //brate = brate + v.BHRate + '/Hr, <br>'
                    }
                    if (v.PLQty) {
                        bqty = bqty + v.PLQty + ' L <br>'
                        rate = rate + v.PLRate + '/L <br>'
                        brate = brate + v.BLRate + '/L <br>'
                        l += v.PLTotal || 0
                    } if (v.PTQty) {
                        bqty = bqty + v.PTQty + ' T <br>'
                        rate = rate + v.PTRate + '/T <br>'
                        brate = brate + v.BTRate + '/T <br>'
                        t += v.PTTotal || 0
                    }
                    if (v.PTollQty) {
                        toll = v.PTollQty + ' Toll, <br>'
                        to += v.PTollTotal || 0
                        //rate = rate + v.PTollRate + '/Toll, <br>'
                    }
                    if (v.PDFQty) {
                        bqty = bqty + v.PDFQty + ' D <br>'
                        rate = rate + v.PDFRate + '/D <br>'
                        df += PDFTotal || 0
                    }
                    if (v.PSTQty) {
                        bqty = bqty + v.PSTQty + ' ST <br>'
                        rate = rate + v.PSTQty + '/ST <br>'
                        st += PSTTotal || 0
                    }
                    totalTag++
                    custId = v.customer_id
                    custName = v.customer_name
                    jobId = v.job_id
                    jobName = v.job_name
                    driverId = v.driver_id
                    ftb.push(v.Fright_Bill)
                    d.date = v.tagDate
                    d.ftb = v.Fright_Bill
                    d.qty = bqty
                    d.brate = brate
                    d.total = v.pNetTotal
                    d.rate = rate
                    d.fee = v.PBRFee
                    BrFee += v.PBRFee || 0
                    d.jobLoc = v.job_location
                    d.jobType = v.job_type
                    d.toll = v.PTollTotal || 0
                    d.cust = v.customer_name
                    d.amount = v.ptotal
                    total = total + v.pNetTotal
                    d.gtotal = total
                    details[k] = d;
                })
            }
        })
        BrFee = BrFee.toFixed(2)
        qty.Hours = h, qty.loads = l, qty.tons = t, qty.tolls = to, qty.dumpfee = df, qty.standbyTime = st, qty.BrokerFee = BrFee
        total = total.toFixed(2)
        console.log(h + ' == ' + l + ' == ' + t + ' == ' + to + ' == ' + df + ' == ' + st + ' == ' + BrFee)
        $('.invForm').empty();
        $('.invForm').val('');

        $('.errors').addClass('text-danger')
        $('.errors').removeClass('text-success')
        $('#DriverId').append(driverId)
        $('#DriverName').append(dri);
        $('#QTYTotal').empty()
        var tr
        if (details[0].fee == 0) {
            tr = '<tr><td>Date</td><td>Freight Bill</td><td>Description</td><td>Qty</td><td>Rate</td><td>Bill Rate</td><td>Total</td></tr>'
            $('#QTYTotal').append(tr)
            for (var i = 0; i < totalTag; i++) {
                tr = '<tr><td>' + moment(details[i].date).format('MM-DD-YYYY') + '</td>' +
                    '<td>' + details[i].ftb + '</td>' +
                    '<td>' + details[i].cust + '</td>' +
                    '<td>' + details[i].qty + '</td>' +
                    '<td>' + details[i].rate + '</td>' +
                    '<td>' + details[i].brate + '</td>' +
                    '<td>$ ' + details[i].total + '</td></tr>'
                $('#QTYTotal').append(tr)
            }
            tr = '<tr><td></td><td></td><td></td><td></td><td></td><td><strong>Total</strong></td><td> <strong> $ ' + total + '</strong></td></tr>'
            $('#QTYTotal').append(tr)
        } else {
            tr = '<tr><td>Date</td><td>Freight Bill</td><td>Description</td><td>QTY</td><td>Rate</td><td>Bridge</td><td>Amount</td><td>Broker Fee</td><td>Net Total</td></tr>'
            $('#QTYTotal').append(tr)
            for (var i = 0; i < totalTag; i++) {
                tr = '<tr><td>' + moment(details[i].date).format('MM-DD-YYYY') + '</td>' +
                    '<td>' + details[i].ftb + '</td>' +
                    '<td>' + details[i].cust + '</td>' +
                    '<td>' + details[i].qty + '</td>' +
                    '<td>' + details[i].rate + '</td>' +
                    '<td>$ ' + details[i].toll + '</td>' +
                    '<td>$ ' + details[i].amount + '</td>' +
                    '<td>$ ' + details[i].fee + '</td>' +
                    '<td>$ ' + details[i].total + '</td></tr>'
                $('#QTYTotal').append(tr)
            }
            tr = '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><strong>Total</strong></td><td> <strong> $ ' + total + '</strong></td></tr>'
            $('#QTYTotal').append(tr)
        }
        var qtyTbl = "<tbody>"
        $.each(qty, function (key, val) {
            if (val > 0) {
                qtyTbl += "<tr><td>" + key + "</td><td>" + val + "</td></tr>"
            }
        })
        qtyTbl += "</tbody>"
        $('#qtyview').empty()
        $('#qtyview').append(qtyTbl)
        $('#StatementDate').val('')
        $('#StatementModal').modal('show');
    }

    $('#StatementDate').change(function () {
        var letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var id = moment($('#StatementDate').val()).format('MMDDYY') + '-'
        for (var i = 0; i < 4; i++) {
            id += letters[(Math.floor(Math.random() * 16))];
        }
        $('.errors').removeClass('text-danger')
        $('.errors').addClass('text-success')
        $('#statementId').empty()
        $('#statementId').append(id)
    })
    $('#PrintnSave').on('click', function () {
        if (!$('.errors').hasClass('text-danger')) {
            saveStatement();
        } else {
            alert('please select date.')
        }

    })
    function saveStatement() {

        var data = {
            details: details,
            DriverId: $('#DriverId').text(),
            DriverName: $('#DriverName').text(),
            statementId: $('#statementId').text(),
            statementDate: moment($('#StatementDate').val(), 'MM-DD-YYYY'),
            checkNum: $('#checkNum').val(),
            status: 'Created',
            date: date,
            updatedby: localStorage.username,
            Total: details[Object.keys(details).length - 1].gtotal,
            payables: {
                statementId: $('#statementId').text(),
                statementDate: moment($('#StatementDate').val(), 'MM-DD-YYYY'),
                checkNum: $('#checkNum').val(),
            }
        }
        $.ajax({
            url: localStorage.getItem('url') + "dri/newStatement",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == 'success') {
                    var bills = {
                        ftbs: ftb,
                        updatedby: localStorage.username,
                        updatedDate: date
                    }
                    $.ajax({
                        url: localStorage.getItem('url') + "dri/updatedStatement",
                        data: JSON.stringify(bills),
                        type: 'post',
                        dataType: 'json',
                        contentType: 'application/json',
                        beforeSend: function (xhr) {
                            $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
                        },
                        success: function (result) {
                            $.unblockUI();
                            console.log(result)
                            if (result.msg == 'success') {
                                getAllStatements()
                                AllStatements()
                                $('#StatementModal').modal('hide')
                                var r = $('#DateRange').val()
                                r = r.split('-')
                                getAllTags(r[0], r[1])
                            }
                        }
                    })
                }

            }
        })
    }
    var Statments = $('#Statments').DataTable()
    function AllStatements() {
        $.ajax({
            url: localStorage.getItem('url') + "dri/ViewAllStatements",
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                Statments.clear().draw();
                $.each(result, function (key, val) {
                    var t = val.Total
                    t = t.toFixed(2)
                    Statments.row.add([
                        val.statementId,
                        val.DriverName,
                        '$ ' + t,
                        moment(val.statementDate).format('MM/DD/YYYY'), val.check
                    ]).draw(false);
                })
            }
        })
    }

    $('.NewFtCustSpan').click(function () {
        Drivers = JSON.parse(localStorage.getItem('Drivers'))
        $('#FtDriver').autocomplete({
            source: Drivers
        })
    })
    var DriTags = $('#DriTags').DataTable({
        /* scrollY: '50vh',
        scrollCollapse: true, */
        paging: false
    })


    var start = moment().subtract(1, 'month').startOf('month'),
        end = moment().subtract(1, 'month').endOf('month')
    starts()
    function starts() {
        $('#DateRange').daterangepicker({
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
    }
    function cb(start, end) {
        $('#DateRange span').html(start.format('MM-DD-YYYY') + ' - ' + end.format('MM-DD-YYYY'))
        console.log(start.format('MM-DD-YYYY') + " ------- " + end.format('MM-DD-YYYY'))
        getAllTags(start.format('MM-DD-YYYY'), end.format('MM-DD-YYYY'))
    }
    $('#Drivers').change(function () {
        var r = $('#DateRange').val()
        r = r.split('-')
        getAllTags(r[0], r[1])
    })
    function getAllTags(start, end) {
        var data = {
            dirName: $('#FtDriver').val(),
            start: start,
            end: end
        }
        $.ajax({
            url: localStorage.getItem('url') + "dri/getDriFtBills",
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
                DriTags.clear().draw()
                $.each(result, function (key, v) {
                    var bqty = ''
                    if (v.PHQty) {
                        bqty = bqty + v.PHQty + ' H, <br>'
                    }
                    if (v.PLQty) {
                        bqty = bqty + v.PLQty + ' L, <br>'
                    } if (v.PTQty) {
                        bqty = bqty + v.PTQty + ' T, <br>'
                    }
                    if (v.PTollQty) {
                        bqty = bqty + v.PTollQty + ' Toll, <br>'
                    }
                    if (v.PDFQty) {
                        bqty = bqty + v.PDFQty + ' D, <br>'
                    }
                    if (v.PSTQty) {
                        bqty = bqty + v.PSTQty + ' ST, <br>'
                    }
                    DriTags.row.add([
                        moment(v.tagDate).format("MM-DD-YY"),
                        v.Fright_Bill,
                        v.customer_name,
                        v.job_name,
                        bqty,
                        '$ ' + v.ptotal,
                        '$ ' + v.pNetTotal
                    ]).draw(false);

                })
            }
        })
    }
    $('#DriTags tbody').on('click', 'tr', function () {
        if ($(this).hasClass('green-500')) {
            $(this).removeClass('green-500');
        } else {
            $(this).addClass('green-500');
        }
    })
    $('#SeleAll').click(function () {
        $('#DriTags tbody tr').addClass('green-500')
    })
    $('#Clear').click(function () {
        $('#DriTags tbody tr').removeClass('green-500')
    })
    $('#Preview').click(function () {
        $('#StatementDate').val('')
        var ftbills = []
        DriTags.rows().eq(0).each(function (index) {
            if (DriTags.row(index).node().className.includes('green-500')) {
                var dat = DriTags.row(index).data()
                ftbills.push(dat[1])
            }
        });
        driStmet(ftbills)
    })

    function driStmet(ftbills) {
        var driver = $('#FtDriver').val(),
            qty = {}, i = 0,
            h = 0, l = 0, t = 0, to = 0, df = 0, st = 0, total = 0, gross = 0, totalTag = 0, driverId, dri, BrFee = 0
        $.each(ftbills, function (key, val) {
            $.each(allTags, function (k, v) {
                if (val == v.Fright_Bill) {
                    d = {}
                    var bqty = '', rate = '', brate = ''
                    if (v.PHQty) {
                        bqty = bqty + v.PHQty + ' H <br>'
                        rate = rate + v.PHRate + '/H <br>'
                        h += v.PHQty || 0
                        //brate = brate + v.BHRate + '/Hr, <br>'
                    }
                    if (v.PLQty) {
                        bqty = bqty + v.PLQty + ' L <br>'
                        rate = rate + v.PLRate + '/L <br>'
                        brate = brate + v.BLRate + '/L <br>'
                        l += v.PLQty || 0
                    } if (v.PTQty) {
                        bqty = bqty + v.PTQty + ' T <br>'
                        rate = rate + v.PTRate + '/T <br>'
                        brate = brate + v.BTRate + '/T <br>'
                        t += v.PTQty || 0
                    }
                    if (v.PTollQty) {
                        toll = v.PTollQty + ' Toll <br>'
                        to += v.PTollQty || 0
                        //rate = rate + v.PTollRate + '/Toll, <br>'
                    }
                    if (v.PDFQty) {
                        bqty = bqty + v.PDFQty + ' D <br>'
                        rate = rate + v.PDFRate + '/Dumps <br>'
                        df += PDFQty || 0
                    }
                    if (v.PSTQty) {
                        bqty = bqty + v.PSTQty + ' ST <br>'
                        rate = rate + v.PSTQty + '/ST <br>'
                        st += PSTQty || 0
                    }
                    totalTag++
                    custId = v.customer_id
                    custName = v.customer_name
                    jobId = v.job_id
                    jobName = v.job_name
                    driverId = v.driver_id
                    dri = v.Driver
                    ftb.push(v.Fright_Bill)
                    d.date = v.tagDate
                    d.ftb = v.Fright_Bill
                    d.qty = bqty
                    d.brate = brate
                    d.total = v.pNetTotal
                    d.rate = rate
                    d.fee = v.PBRFee
                    BrFee += v.PBRFee || 0
                    d.jobLoc = v.job_location
                    d.jobType = v.job_type
                    d.toll = v.PTollTotal || 0
                    d.cust = v.job_name
                    d.amount = v.ptotal
                    gross = gross + v.ptotal
                    total = total + v.pNetTotal
                    d.gtotal = total
                    details[i] = d
                    i++
                }
            })
        })

        BrFee = BrFee.toFixed(2)
        h = h.toFixed(2), l = l.toFixed(2), t = t.toFixed(2), df = df.toFixed(2), st = st.toFixed(2)
        qty.Hours = h, qty.loads = l, qty.tons = t, qty.tolls = to, qty.dumpfee = df, qty.standbyTime = st, qty.BrokerFee = BrFee
        total = total.toFixed(2)
        $('.invForm').empty();
        $('.invForm').val('');
        $('.errors').addClass('text-danger')
        $('.errors').removeClass('text-success')
        $('#DriverId').append(driverId)
        $('#DriverName').append(dri);
        $('#QTYTotal').empty()
        var tr
        if (details[0].fee == 0) {
            tr = '<tr><td>Date</td><td>Freight Bill</td><td>Description</td><td>Qty</td><td>Rate</td><td>Bill Rate</td><td>Total</td></tr>'
            $('#QTYTotal').append(tr)
            for (var i = 0; i < totalTag; i++) {
                tr = '<tr><td>' + moment(details[i].date).format('MM-DD-YY') + '</td>' +
                    '<td>' + details[i].ftb + '</td>' +
                    '<td>' + details[i].cust + '</td>' +
                    '<td>' + details[i].qty + '</td>' +
                    '<td>' + details[i].rate + '</td>' +
                    '<td>' + details[i].brate + '</td>' +
                    '<td>$ ' + details[i].total + '</td></tr>'
                $('#QTYTotal').append(tr)
            }
            tr = '<tr><td></td><td></td><td></td><td> </td><td></td><td><strong></strong></td><td> <strong> $ ' + total + '</strong></td></tr>'
            $('#QTYTotal').append(tr)
        } else {
            tr = '<tr><td>Date</td><td>Freight Bill</td><td>Description</td><td>QTY</td><td>Rate</td><td>Bridge</td><td>Amount</td><td>Broker Fee</td><td>Net Total</td></tr>'
            $('#QTYTotal').append(tr)
            for (var i = 0; i < totalTag; i++) {
                tr = '<tr><td>' + moment(details[i].date).format('MM/DD/YY') + '</td>' +
                    '<td>' + details[i].ftb + '</td>' +
                    '<td>' + details[i].cust + '</td>' +
                    '<td>' + details[i].qty + '</td>' +
                    '<td>' + details[i].rate + '</td>' +
                    '<td>$ ' + details[i].toll + '</td>' +
                    '<td>$ ' + details[i].amount + '</td>' +
                    '<td>$ ' + details[i].fee + '</td>' +
                    '<td>$ ' + details[i].total + '</td></tr>'
                $('#QTYTotal').append(tr)
            }
            tr = '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td><strong>$ ' + gross + '</strong></td><td><strong>$ ' + BrFee + '</strong></td><td> <strong> $ ' + total + '</strong></td></tr>'
            $('#QTYTotal').append(tr)
        }
        var qtyTbl = "<tbody>"
        $.each(qty, function (key, val) {
            if (val > 0) {
                qtyTbl += "<tr><td>" + key + "</td><td>" + val + "</td></tr>"
            }
        })
        qtyTbl += "</tbody>"
        $('#qtyview').empty()
        $('#qtyview').append(qtyTbl)
        $('#StatementDate').val('')
        $('#StatementModal').modal('show');
    }

})