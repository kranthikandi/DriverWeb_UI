$(document).ready(function () {

    if (!localStorage.username) {
        window.location.href = 'signin.html';
    }
    var username = localStorage.username.toUpperCase()
    $('#UserN').empty()
    $('#UserN').append(username.charAt(0))
    var d = new Date();
    var today = moment(d).format('MM-DD-YYYY'), allTags = []
    var AllTags = $('#AllTags').DataTable({
        scrollY: '100vh',
        scrollCollapse: true,
        paging: false
    })
    var CustTags = $('#CustTags').DataTable({
        /* scrollY: '50vh',
        scrollCollapse: true, */
        paging: false
    })
    $('#invWeek').click(function () {
        $('#invByWeek').show()
        $('#AllInv').hide()
        getAllTagsByWeek()
    })
    $('#ShowAllInv').click(function () {
        $('#invByWeek').hide()
        $('#AllInv').show()
        getAllInvs()
    })
    var allInvTable = $('#AllInvTab').DataTable(),
        invTable = $('#invTable').DataTable({
            paging: false,
            dom: "t"
        })
    getAllInvs()
    var AllInvDetails
    function getAllInvs() {
        $.ajax({
            url: localStorage.getItem('url') + "inv/allInvs",
            type: 'get',
            http2: true,
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.length == 0) {
                    $("#noJobs").show();
                }
                else {
                    $("#noJobs").hide();
                }
                AllInvDetails = result
                allInvTable.clear().draw()
                $.each(AllInvDetails, function (key, val) {
                    var counter = 0
                    $.each(val.details, function (k, v) {
                        counter++
                    })
                    var id = ''
                    if (val.status == 'Archived') {
                        id = '<span class = "btn danger">' + val.status + '</span>'
                    } else if (val.status == 'Paid') {
                        id = '<span class = "btn  success">' + val.status + '</span>'
                    } else if (val.status == 'P-Paid') {
                        id = '<span class = "btn warning">' + val.status + '</span>'
                    } else if (val.status == 'Created') {
                        id = '<span class = "btn info">' + val.status + '</span>'
                    } else if (val.status == 'Preview') {
                        id = '<span class = "btn primary">' + val.status + '</span>'
                    } else {
                        id = '<span class = "btn lime-400">' + val.status + '</span>'
                    }
                    allInvTable.row.add([
                        val.invId || '<span id="previewId" data-id="' + val._id + '" > --</span> ',
                        moment(val.InvDate).format('MM-DD-YYYY'),
                        val.customer_name,
                        '$ ' + val.Total,
                        counter,
                        id
                    ]).draw(false);
                })
            }
        })
    }

    $('#archiveInv').click(function () {
        $('#DeleteInv').modal('show')
    })

    $('#DelInv').click(function () {
        deleteInc()
        $('#DeleteInv').modal('hide')
        $('#invoices').show()
        $('#invAnimation').hide()
    })

    function deleteInc() {
        var id, invid, arch = false, ftb = []
        if ($('#invoiceId').attr('class')) {
            invid = $('#invoiceId').attr('class')
            arch = true
        } else {
            arch = false
            invid = $('#invId').text() || $('#invoiceId').attr('class')
        }
        $.each(AllInvDetails, function (key, val) {
            if (val.invId == invid || val._id == invid) {
                id = val.customer_id
                for (var i = 0; i < Object.keys(val.details).length; i++) {
                    ftb.push(val.details[i].ftb)
                }
            }
        })


        var data = {
            invId: invid,
            updatedBy: localStorage.username,
            custId: id,
            updatedDate: new Date(),
            custName: $('#custName').text(),
            TotalRev: parseInt($('#InvTotal').text()),
            arch: arch,
            ftb: ftb
        }
        $.ajax({
            url: localStorage.getItem('url') + "inv/invArch",
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
                    alert('Invoice Deleted successfully! ')
                    $('#InvoiceModal').modal('hide')
                    ftbillsList = [], allTags = []
                } else if (result.msg == 'unable to update the AR') {
                    alert('Unable to Delete the Invoice')
                    $('#InvoiceModal').modal('hide')
                    console.log(result);
                } else if (result.msg == 'unable to update the FTbills') {
                    alert('Unable to Delete the Invoice')
                    $('#InvoiceModal').modal('hide')
                    console.log(result);
                }
                getAllInvs()
                getAllTagsByWeek()
            }
        })

    }

    $('#AllInvTab tbody').on('click', 'tr', function () {
        var row = allInvTable.row(this).data(), invId = row[0]
        $('#invDate').empty()
        $('#invDate').val('')
        if (!row || row[5].includes('danger')) {
            allInvTable.$('tr.red-600').removeClass('red-600');
            allInvTable.$('tr.light-blue-500').removeClass('light-blue-500');
            $(this).addClass('red-600');
            $('#print').hide()
            $('#archiveInv').hide()
            $('#Invoice').hide()
        } else if (!row || row[5].includes('Preview')) {
            allInvTable.$('tr.light-blue-500').removeClass('light-blue-500');
            allInvTable.$('tr.red-600').removeClass('red-600');
            invId = $(this).find("td > span").attr('data-id')
            $(this).addClass('light-blue-500');
        } else if (row[5].includes('Paid')) {
            $('#archiveInv').hide()
            $('#Invoice').hide()
        } else if (row[5].includes('P-Paid')) {
            $('#archiveInv').hide()
            $('#Invoice').hide()
        } else {
            viewStat = '<i class="fa-check lime-200"></i>'
            $('#InvBody').removeClass('archievedInv')
            allInvTable.$('tr.light-blue-500').removeClass('light-blue-500');
            allInvTable.$('tr.red-600').removeClass('red-600');
            $(this).addClass('light-blue-500');
            $('#print').show()
            $('#archiveInv').show()
            $('#Invoice').hide()
        }
        showInv(invId)
    })

    $('#invDate').change(function () {
        var fid = $('#invoiceId').text()
        fid = fid.split('-')
        var dt = moment($('#invDate').val())
        var invNum = moment(dt).format('MMYY') + moment(dt).week() + '-' + fid[1];
        var inv = '<span id="invoiceId" class="' + fid + '">' + invNum + '</span>'
        $('#invoiceId').empty()
        $('#invoiceId').append(invNum);
    })
    $('#invTable tbody').on('click', 'tr', function () {
        var row = invTable.row(this).data()
        if (row) {
            $('#EditInv').modal('show')
            getFtBill(row[1])
        }
    })
    var old = [], diff = []
    function getFtBill(ftb) {
        var billId = { bill: ftb }
        $.ajax({
            url: localStorage.getItem('url') + "ftb/getFtBill",
            data: JSON.stringify(billId),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                console.log(data);
                if (data.length > 1) {
                    $.each(data, function (key, val) {
                        if (moment(val.date).format('MM-DD-YYYY') == date) {
                            i = key
                        }
                    })
                } else {
                    data = data[0]
                }
                old.hr = parseFloat(data.BHQty) || 0, old.lo = parseFloat(data.BLQty) || 0, old.to = parseFloat(data.BTQty) || 0, old.toll = parseFloat(data.BTollQty) || 0,
                    old.df = parseFloat(data.BDFQty) || 0, old.st = parseFloat(data.BSTQty) || 0, old.mt = parseFloat(data.BMQty) || 0, old.total = parseFloat(data.bTotal) || 0
                console.log(old)
                $('#EditDriver').empty()
                $('#EditDriver').append(data.Driver)
                $('#EditCust').empty()
                $('#EditCust').append(data.customer_name)
                $('.tagId').empty()
                $('.tagId').append(ftb)
                $('#tagDate').empty()
                $('#tagDate').append(moment(data.date).format('MM-DD-YY'))
                $('.BHQty').val(data.BHQty)
                $('.BHRate').val(data.BHRate)
                $('.BHTotal').val(data.BHTotal)
                $('.BLQty').val(data.BLQty)
                $('.BLRate').val(data.BLRate)
                $('.BLTotal').val(data.BLTotal)
                $('.BTQty').val(data.BTQty)
                $('.BTRate').val(data.BTRate)
                $('.BTTotal').val(data.BTTotal)
                $('.BTollQty').val(data.BTollQty)
                $('.BTollRate').val(data.BTollRate)
                $('.BTollTotal').val(data.BTollTotal)
                $('.BDFQty').val(data.BDFQty)
                $('.BDFRate').val(data.BDFRate)
                $('.BDFTotal').val(data.BDFTotal)
                $('.BSTQty').val(data.BSTQty)
                $('.BSTRate').val(data.BSTRate)
                $('.BSTTotal').val(data.BSTTotal)
                $('.BMQty').val(data.BMQty)
                $('.BMRate').val(data.BMRate)
                $('.BMTax').val(data.BMTax)
                $('.BMTotal').val(data.BMTotal)
                $('.PHQty').val(data.PHQty)
                $('.PHRate').val(data.PHRate)
                $('.PHTotal').val(data.PHTotal)
                $('.PLQty').val(data.PLQty)
                $('.PLRate').val(data.PLRate)
                $('.PLTotal').val(data.PLTotal)
                $('.PTQty').val(data.PTQty)
                $('.PTRate').val(data.PTRate)
                $('.PTTotal').val(data.PTTotal)
                $('.PTollQty').val(data.PTollQty)
                $('.PTollRate').val(data.PTollRate)
                $('.PTollTotal').val(data.PTollTotal)
                $('.PDFQty').val(data.PDFQty)
                $('.PDFRate').val(data.PDFRate)
                $('.PDFTotal').val(data.PDFTotal)
                $('.PSTQty').val(data.PSTQty)
                $('.PSTRate').val(data.PSTRate)
                $('.PSTTotal').val(data.PSTTotal)
                $('.FeePercent').val(data.PBRFeeRate)
                $('.BrokerFee').val(data.PBRFee)
                $('.updatedBy').empty()
                $('.updatedBy').append(data.updateBy)
                $('.btotal').val(data.bTotal)
                $('.ptotal').val(data.pTotal)
                $('.pNetTot').val(data.pNetTotal)
                var dd = moment(data.updatedDate).format('MM-DD-YYYY hh:mm A');
                $('.updatedDate').empty()
                $('.updatedDate').append(dd)
            }
        })
    }

    $('#newFTUpdate').click(function () {
        var now = new Date();
        var ftData = {
            tagid: $('.tagId').text(),
            Driver: $('#EditDriver').text(),
            customer_name: $('#EditCust').text(),
            date: $('#tagDate').text(),
            updated: localStorage.username,
            updatedTime: now,
            status: 'Entered',
            BHQty: $('.BHQty').val(),
            BHRate: $('.BHRate').val(),
            BHTotal: $('.BHTotal').val(),
            BLQty: $('.BLQty').val(),
            BLRate: $('.BLRate').val(),
            BLTotal: $('.BLTotal').val(),
            BTQty: $('.BTQty').val(),
            BTRate: $('.BTRate').val(),
            BTTotal: $('.BTTotal').val(),
            BTollQty: $('.BTollQty').val(),
            BTollRate: $('.BTollRate').val(),
            BTollTotal: $('.BTollTotal').val(),
            BDFQty: $('.BDFQty').val(),
            BDFRate: $('.BDFRate').val(),
            BDFTotal: $('.BDFTotal').val(),
            BSTQty: $('.BSTQty').val(),
            BSTRate: $('.BSTRate').val(),
            BSTTotal: $('.BSTTotal').val(),
            BMQty: $('.BMQty').val(),
            BMRate: $('.BMRate').val(),
            BMTax: $('.BMTax').val(),
            BMTotal: $('.BMTotal').val(),
            btotal: $('.btotal').val(),
            PHQty: $('.PHQty').val(), PHRate: $('.PHRate').val(), PHTotal: $('.PHTotal').val(),
            PLQty: $('.PLQty').val(), PLRate: $('.PLRate').val(), PLTotal: $('.PLTotal').val(),
            PTQty: $('.PTQty').val(), PTRate: $('.PTRate').val(), PTTotal: $('.PTTotal').val(),
            PTollQty: $('.PTollQty').val(), PTollRate: $('.PTollRate').val(), PTollTotal: $('.PTollTotal').val(),
            PDFQty: $('.PDFQty').val(), PDFRate: $('.PDFRate').val(), PDFTotal: $('.PDFTotal').val(),
            PSTQty: $('.PSTQty').val(), PSTRate: $('.PSTRate').val(), PSTTotal: $('.PSTTotal').val(),
            PBRFeeRate: $('.FeePercent').val(), PBRFee: $('.BrokerFee').val(),
            ptotal: $('.ptotal').val(), pNetTotal: $('.pNetTot').val(),
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
                    saveDriverPay()
                    //showNewInv(ftData, diff)
                } else {
                    console.log(result)
                    alert('Fright Bill Details Not Updateed Please Try again!!')
                }
            }
        })
    })

    function saveDriverPay() {
        var now = new Date()
        var Apayable = {
            BHQty: $('.BHQty').val(),
            BHRate: $('.BHRate').val(),
            BHTotal: $('.BHTotal').val(),
            BLQty: $('.BLQty').val(),
            BLRate: $('.BLRate').val(),
            BLTotal: $('.BLTotal').val(),
            BTQty: $('.BTQty').val(),
            BTRate: $('.BTRate').val(),
            BTTotal: $('.BTTotal').val(),
            BTollQty: $('.BTollQty').val(),
            BTollRate: $('.BTollRate').val(),
            BTollTotal: $('.BTollTotal').val(),
            BDFQty: $('.BDFQty').val(),
            BDFRate: $('.BDFRate').val(),
            BDFTotal: $('.BDFTotal').val(),
            BSTQty: $('.BSTQty').val(),
            BSTRate: $('.BSTRate').val(),
            BSTTotal: $('.BSTTotal').val(),
            BMQty: $('.BMQty').val(),
            BMRate: $('.BMRate').val(),
            BMTax: $('.BMTax').val(),
            BMTotal: $('.BMTotal').val(),
            btotal: $('.btotal').val(),
            PHQty: $('.PHQty').val(), PHRate: $('.PHRate').val(), PHTotal: $('.PHTotal').val(),
            PLQty: $('.PLQty').val(), PLRate: $('.PLRate').val(), PLTotal: $('.PLTotal').val(),
            PTQty: $('.PTQty').val(), PTRate: $('.PTRate').val(), PTTotal: $('.PTTotal').val(),
            PTollQty: $('.PTollQty').val(), PTollRate: $('.PTollRate').val(), PTollTotal: $('.PTollTotal').val(),
            PDFQty: $('.PDFQty').val(), PDFRate: $('.PDFRate').val(), PDFTotal: $('.PDFTotal').val(),
            PSTQty: $('.PSTQty').val(), PSTRate: $('.PSTRate').val(), PSTTotal: $('.PSTTotal').val(),
            PBRFeeRate: $('.FeePercent').val(), PBRFee: $('.BrokerFee').val(),
            ptotal: $('.ptotal').val(), pNetTotal: $('.pNetTot').val(),
            updated: localStorage.username,
            updatedTime: now,
            tagid: $('.tagId').text(),
            invId: $('#invId').text(),
        }
        diff.hr = parseFloat(Apayable.BHQty - old.hr), diff.lo = parseFloat(Apayable.BLQty - old.lo), diff.to = parseFloat(Apayable.BTQty - old.to), diff.toll = parseFloat(Apayable.BTollQty - old.toll)
        diff.df = parseFloat(Apayable.BDFQty - old.df), diff.st = parseFloat(Apayable.BSTQty - old.st), diff.mt = parseFloat(Apayable.BMQty - old.mt), diff.tot = parseFloat(Apayable.btotal - old.total)
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
                console.log(result)
                $('#EditInv').modal('hide')
                $('#invoices').show()
                $('#invAnimation').hide()
                getAllInvs()
                if (result.msg == 'success') {
                    //alert('Driver Pay updated')
                } else {
                    alert('error in adding Payables. Please Try again')
                }
            }
        })
    }

    function showInv(invoiceId) {
        $('#QTYTotal').empty();
        $('.invForm').empty();
        $('.invForm').append('');
        //$('#InvoiceModal').modal('show')
        InvAnimation()
        console.log(AllInvDetails)
        $.each(AllInvDetails, function (key, val) {
            var data = {
                customer_id: val.customer_id
            }
            $.ajax({
                url: localStorage.getItem('url') + "cust/custLoc",
                data: JSON.stringify(data),
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                beforeSend: function (xhr) {
                    $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
                },
                success: function (result) {
                    $.unblockUI();
                    var loc = result.customer_location
                    loc = loc.split(',')
                    $('#add1').empty()
                    $('#add2').empty()
                    $('#add1').append(loc[0])
                    $('#add2').append(loc[1])
                }
            })
            if (invoiceId == val.invId) {
                $('#invId').append(val.invId)
                $('#invDate').hide()
                $('#InvIdTrue').append(moment(val.InvDate).format('MM-DD-YYYY'))
                if (val.job_location) {
                    job_location = val.job_location.split(',')
                } else {
                    job_location = ''
                }
                $('#custName').append(val.customer_name)
                $('#custId').append(val.customer_id)
                //$('#JobName').append(val.job_name)

                if (val.status == "Paid") {
                    $('#statusComment').empty()
                    $("#statusComment").attr('class', '')
                    $('#statusComment').text('This invoice is PAID')
                    $('#statusComment').addClass('text-success')
                } else if (val.status == "P-Paid") {
                    $('#statusComment').empty()
                    $("#statusComment").attr('class', '')
                    $('#statusComment').text('This invoice is PARTIAL-PAID')
                    $('#statusComment').addClass('text-warning')
                } else if (val.status == "Adjusted") {
                    var text = 'This invoice is Adjusted'
                    $('#statusComment').empty()
                    $("#statusComment").attr('class', '')
                    $('#statusComment').text(text)
                    $('#statusComment').addClass('lime-200')
                } else if (val.status == "Created") {
                    $('#statusComment').empty()
                }
                $('#phone').append(val.phone)
                $('#email').append(val.email)
                invTable.clear().draw()
                $.each(val.details, function (keys, vals) {
                    invTable.row.add([
                        moment(vals.date).format('MM-DD-YY'),
                        vals.ftb,
                        vals.jobName,
                        //vals.driver,
                        vals.qty,
                        vals.rate,
                        vals.total
                    ]).draw(false);
                })
                var ppaid = ''
                if (val.status == 'P-Paid' && val.paid) {
                    ppaid += '<tr><td></td><td></td><td>on ' + moment(val.updateDate).format('MM-DD-YYYY') + '</td><td><strong>Paid</strong></td><td > $ <strong id="InvTotal"> ' + val.paid + '</strong></td></tr>' +
                        '<tr><td></td><td></td><td></td><td><strong>Balance</strong></td><td > $ <strong id="InvTotal"> ' + val.balance + '</strong></td></tr>'
                } else if (val.status == 'Adjusted') {
                    ppaid += '<tr><td></td><td></td><td>on ' + moment(val.updateDate).format('MM-DD-YYYY') + '</td><td><strong>Adjusted</strong></td><td > $ <strong id="InvTotal"> ' + val.paid + '</strong></td></tr>'
                }
                var tr = '<tr><td></td><td></td><td></td><td></td><td><strong>Total</strong></td><td > $ <strong id="InvTotal"> ' + val.Total + '</strong></td></tr>'
                tr += ppaid
                $('#pTot').empty()
                $('#pTot').append("$ " + val.Total)
                $('#QTYTotal').append(tr)
                var tr = "<tbody>"
                if (val.qtytble) {
                    $.each(val.qtytble, function (key, val) {
                        if (val > 0) {
                            tr += "<tr><td>" + key + "</td><td>" + val + "</td></tr>"
                        }
                    })
                }
                tr += "</tbody>"
                $('#qtyview').empty()
                $('#qtyview').append(tr)
            } else if (invoiceId == val._id) {
                $('#pTot').empty()
                $('#pTot').append("$ " + val.Total)
                var tr = "<tbody>"
                if (val.qtytble) {
                    $.each(val.qtytble, function (key, val) {
                        if (val > 0) {
                            tr += "<tr><td>" + key + "</td><td>" + val + "</td></tr>"
                        }
                    })
                }
                tr += "</tbody>"
                $('#qtyview').empty()
                $('#qtyview').append(tr)
                $('#Invoice').show()
                $('#invDate').show()
                $('#print').hide()
                $('#archiveInv').show()
                var fid = val._id
                fid = fid.substring(0)
                var id = fid.substring(22)
                id = parseInt(id, 16)
                var now = new Date(),
                    invNum = moment(now).format('MMYY') + moment(now).week() + '-' + id;
                var inv = '<span id="invoiceId" class="' + fid + '">' + invNum + '</span>'
                $('#invId').append(inv);
                job_location = val.job_location.split(',')
                $('#custName').append(val.customer_name)
                $('#custId').append(val.customer_id)
                //$('#JobName').append(val.job_name)
                $('#add1').empty()
                $('#add2').empty()
                $('#add1').append(job_location[0])
                $('#add2').append(job_location[1])
                $('#phone').append(val.phone)
                $('#email').append(val.email)
                for (var i = 0; i < val.totalTag; i++) {
                    var tr = '<tr><td>' + moment(val.details[i].date).format('MM-DD-YY') + '</td>' +
                        '<td>' + val.details[i].ftb + '</td>' +
                        '<td>' + val.details[i].jobName + '</td>' +
                        // '<td>' + val.details[i].driver + '</td>' +
                        '<td>' + val.details[i].qty + '</td>' +
                        '<td>' + val.details[i].rate + '</td>' +
                        '<td> $ ' + val.details[i].total + '</td></tr>'
                    $('#QTYTotal').append(tr)
                }
                var tr = '<tr><td></td><td></td><td></td><td></td><td><strong>Total</strong></td><td > $ <strong id="InvTotal"> ' + val.Total + '</strong></td></tr>'
                $('#pTot').empty()
                $('#pTot').append("$ " + val.Total)
                $('#QTYTotal').append(tr)
            }
        })
    }

    function InvAnimation() {
        $('#invoices').hide()
        $('#invAnimation').show()
        $("#invAnimation").animate({
            //left: '10px',
            opacity: '1',
            //height: '100px',
            //width: '90%'
        }, "slow");
    }
    $('.hideInv').click(function () {
        $('#invoices').show()
        $('#invAnimation').hide()
    })

    var idate = moment().weekday(0);

    $("#invdate").val(moment(idate).format('MM-DD-YYYY'));

    $('#invdate').datetimepicker({
        onGenerate: function (ct) {
            $(this).find('.xdsoft_date.xdsoft_weekend')
                .addClass('xdsoft_disabled');
        },
        weekend: ['01.01.2014', '02.01.2014', '03.01.2014', '04.01.2014', '05.01.2014', '06.01.2014'],
        timepicker: false,
        format: 'm-d-Y'
    });
    getAllTagsByWeek()

    var tagsWeekly, tagsJob;
    function getAllTagsByWeek() {
        var dateRange = {
            status: 'Entered'
        }
        $.ajax({
            url: localStorage.getItem('url') + "ftb/getEnterFTB",
            data: JSON.stringify(dateRange),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.length == 0) {
                    $("#noJobs").show();
                }
                if (result.length > 0) {
                    AllTags.clear().draw()
                    $.each(result, function (keys, val) {
                        var loc = '', rate = '', bqty = ''
                        if (val.BHQty) {
                            rate = rate + '$ ' + val.BHRate + '<br>'
                            bqty = bqty + val.BHQty + ' H <br> '
                        }
                        if (val.BLQty) {
                            rate = rate + '$ ' + val.BLRate + '<br>'
                            bqty = bqty + val.BLQty + ' L <br>'
                        } if (val.BTQty) {
                            rate = rate + '$ ' + val.BTRate + '<br>'
                            bqty = bqty + val.BTQty + ' T <br> '
                        } if (val.BTollQty) {
                            rate = rate + '$ ' + val.BTollRate + '<br>'
                            bqty = bqty + val.BTollQty + ' Toll,<br> '
                        } if (val.BDFQty) {
                            rate = rate + '$ ' + val.BDFRate + '<br>'
                            bqty = bqty + val.BDFQty + ' D <br> '
                        } if (val.BSTQty) {
                            rate = rate + '$ ' + val.BSTRate + '<br>'
                            bqty = bqty + val.BSTQty + ' ST <br> '
                        } if (val.BMQty) {
                            rate = rate + '$ ' + val.BMRate + '<br>'
                            bqty = bqty + val.BMQty + ' MF <br> '
                        }
                        if (val.LocA) {
                            loc = loc + val.LocA
                        }
                        if (val.LocB) {
                            loc = loc + ' / ' + val.LocB
                        }
                        AllTags.row.add([
                            moment(val.date).format('MM-DD-YY'),
                            val.Fright_Bill,
                            val.customer_name,
                            val.job_name,
                            val.Truck_id || '',
                            val.Driver,
                            loc,
                            bqty,
                            rate,
                            '$' + val.bTotal,
                        ]).draw(false);
                    })
                    $("#noJobs").hide();
                    allTags = []
                    const Array = result;
                    const Property = "job_id";
                    const FtbillByJobs = _.groupBy(Array, Property);
                    $('#iJobIds').empty()
                    tagsJob = FtbillByJobs
                    $.each(FtbillByJobs, function (key, val) {
                        var jobid = '<li class="dd-item" data-id="15">' +
                            '<div class="dd-content box ddFont"><div class="dd-handle pointernone"><i class="fa fa-reorder text-muted"></i></div>' + key +
                            '<span id="' + key + '"class="text-success md-flat pull-right invthisJob"></span>' +
                            '</div>' +
                            '<ol class="dd-list">'
                        $.each(val, function (k, v) {
                            var bqty = ''
                            if (v.BHQty) {
                                bqty = bqty + v.BHQty + ' H '
                            }
                            if (v.BLQty) {
                                bqty = bqty + v.BLQty + ' L '
                            } if (v.BTQty) {
                                bqty = bqty + v.BTQty + ' T '
                            }
                            jobid = jobid + '<li class="dd-item" data-id="16">' +
                                '<div class="dd-content box ddFont"><div class="dd-handle pointernone"><i class="fa fa-reorder text-muted"></i></div>' +
                                '<div class="row">' +
                                '<div class="col-md-3"><span>FT Bill : </span>' +
                                '<span id ="' + v.Fright_Bill + '"class="viewTag text-primary">' + v.Fright_Bill + '</span></div>' +
                                '<div class="col-md-3"><span>Date : </span><span class=" text-primary">' + moment(v.date).format("MM-DD-YYYY") + '</span></div>' +
                                '<div class="col-md-3"><span>Qty : </span><span class=" text-primary">' + bqty + '</span></div>' +
                                '<div class="col-md-3"><span>Total : $ </span><span class=" text-success">' + v.bTotal + '</span></div>' +
                                '</div>' +
                                '</div>' +
                                '</li>'
                        })
                        jobid = jobid + '</ol></li>'
                        $('#iJobIds').append(jobid);
                    })
                    var len = result.length
                    var minDate = moment(result[len - 1].date), maxDate = today;
                    var f = [];

                    var WeekE = moment($("#invdate").val()).format('MM/DD/YYYY');
                    f.push(WeekE);
                    WeekE = moment(WeekE, 'MM/DD/YYYY')
                    if (moment(minDate).format('MM-DD-YYYY') === moment(maxDate).format('MM-DD-YYYY')) {
                        var weeks = Math.ceil(minDate.diff(WeekE, 'days') / 7)
                    } else {
                        var weeks = Math.ceil(WeekE.diff(minDate, 'days') / 7)
                    }


                    for (var i = 0; i < weeks; i++) {
                        WeekE = moment(moment(WeekE).add(-7, 'days')).format('MM/DD/YYYY');
                        f.push(WeekE);
                    }
                    var FTbillByWeek = {};

                    for (var i = 0; i < f.length; i++) {
                        var temp = [];
                        $.each(result, function (key, val) {
                            var date = moment(val.date).format('MM/DD/YYYY')
                            var x = moment(f[i])
                            var asd = moment('02-20-2019').diff('02-26-2019', 'days')
                            var week = Math.ceil(x.diff(date, 'days'))
                            if (week < 0) {

                            } else if (week >= 0 && week <= 6) {
                                temp.push(val);
                            }
                        })
                        if (temp.length > 0) {
                            FTbillByWeek[f[i]] = temp;
                        } else {
                        }
                    }

                    for (var i = 0; i < f.length; i++) {
                        var a = FTbillByWeek[f[i]];
                        var b = _.groupBy(a, "job_id");
                        FTbillByWeek[f[i]] = b;
                    }
                    tagsWeekly = FTbillByWeek;
                    $('#iByWeeks').empty();
                    $.each(FTbillByWeek, function (key, val) {
                        var jobid = '<li class="dd-item" data-id="15">' +
                            '<div class="dd-content ddFont"><div class="dd-handle pointernone"><i class="fa fa-reorder text-muted"></i></div>' + key + '</div>' +
                            '<ol class="dd-list">'
                        $.each(val, function (keys, vals) {
                            jobid = jobid + '<li class="dd-item" data-id="15">' +
                                '<div class="dd-content ddFont"><div class="dd-handle pointernone"><i class="fa fa-reorder text-muted"></i></div>' + keys + " - " + vals[0].customer_name +
                                '<span data-week="' + key + '" data-job="' + keys + '" id="' + keys + '"class="btn btn-outline rounded b-primary text-primary b-2x pull-right invthisWeek">Preview</span>' +
                                '<span class="selectall pull-right "><i class="fa fa-check"><i class="fa fa-check"></i></i></span>' +
                                '</div>' +
                                '<ol class="dd-list selectINV">'
                            $.each(vals, function (k, v) {
                                var bqty = '', rate = '', totalview = '', hqty, lqty, tqty, tollqty,
                                    dfqty, stqty, mqty
                                if (v.BHQty) {
                                    rate = rate + '$ ' + v.BHRate + '<br>'
                                    bqty = bqty + v.BHQty + ' Hour,<br> '
                                    hqty += v.BHQty
                                }
                                if (v.BLQty) {
                                    rate = rate + '$ ' + v.BLRate + '<br>'
                                    bqty = bqty + v.BLQty + ' Load,<br>'
                                    lqty += v.BLQty
                                } if (v.BTQty) {
                                    rate = rate + '$ ' + v.BTRate + '<br>'
                                    bqty = bqty + v.BTQty + ' Ton,<br> '
                                    tqty += v.BTQty
                                } if (v.BTollQty) {
                                    rate = rate + '$ ' + v.BTollRate + '<br>'
                                    bqty = bqty + v.BTollQty + ' Toll,<br> '
                                    tollqty += v.BTollQty
                                } if (v.BDFQty) {
                                    rate = rate + '$ ' + v.BDFRate + '<br>'
                                    bqty = bqty + v.BDFQty + ' Dumps,<br> '
                                    dfqty += v.BDFQty
                                } if (v.BSTQty) {
                                    rate = rate + '$ ' + v.BSTRate + '<br>'
                                    bqty = bqty + v.BSTQty + ' Standby Time,<br> '
                                    stqty += v.BSTQty
                                } if (v.BMQty) {
                                    rate = rate + '$ ' + v.BMRate + '<br>'
                                    bqty = bqty + v.BMQty + ' Material Fee,<br> '
                                    mqty += v.BMQty
                                }
                                hqty, lqty, tqty, tollqty,
                                    dfqty, stqty, mqty
                                var viewtr = '<tr>'
                                if (hqty) {
                                    viewtr += '<td>' + hqty + '</td>'
                                } else if (lqty) {
                                    viewtr += '<td>' + lqty + '</td>'
                                } else if (tqty) {
                                    viewtr += '<td>' + tqty + '</td>'
                                } else if (tollqty) {
                                    viewtr += '<td>' + tollqty + '</td>'
                                } else if (dfqty) {
                                    viewtr += '<td>' + dfqty + '</td>'
                                } else if (stqty) {
                                    viewtr += '<td>' + stqty + '</td>'
                                } else if (mqty) {
                                    viewtr += '<td>' + mqty + '</td>'
                                }
                                viewtr += '</tr>'
                                $('#totalview').append(viewtr)
                                allTags.push(v.Fright_Bill)
                                jobid = jobid + '<li class="dd-item" data-id="16">' +
                                    '<div class="dd-content ddFont"><div class="dd-handle pointernone"><i class="fa fa-reorder text-muted"></i></div>' +
                                    '<div class="row">' +
                                    '<div class="col-md-3"><span>FT Bill : </span>' +
                                    '<span id ="' + v.Fright_Bill + '"class="viewTag text-primary" data-date="' + moment(v.date).format('MM-DD-YYYY') + '" >' + v.Fright_Bill + '</span></div>' +
                                    '<div class="col-md-3"><span>Date : </span><span class=" text-primary">' + moment(v.date).format("MM-DD-YYYY") + '</span></div>' +
                                    '<div class="col-md-3"><span>Qty : </span><span class=" text-primary">' + bqty + '</span></div>' +
                                    '<div class="col-md-2"><span>Total : $ </span><span class=" text-success">' + v.bTotal + '</span></div>' +
                                    '<div class="col-md-1"> <span class = "selected" data-ftbill=' + v.Fright_Bill + '><i class = "faicon fa fa-check" ></i></span></div>'
                                '</div>' +
                                    '</div>' +
                                    '</li>'
                            })
                            jobid = jobid + '</ol></li>'
                        })
                        jobid = jobid + '</ol></li>'
                        $('#iByWeeks').append(jobid);


                    })
                } else {
                    $('#iByWeeks').empty();
                }
            }
        })
    }


    $("ol").on("click", "span.invthisWeek", function () {
        invoicing($(this).data("job"), $(this).data("week"))
        getAllTagsByWeek()
    })

    $("ol").on("click", "span.invthisJob", function () {
        // alert($(this).attr("id"))
        getAllTagsByWeek()
    })
    var ftbillsList = []
    $("ol").on("click", "span.selected", function () {
        if ($(this).hasClass('text-success')) {
            $(this).removeClass('text-success')
            for (var i = 0; i < ftbillsList.length; i++) {
                if (ftbillsList[i] === $(this).data("ftbill")) {
                    ftbillsList.splice(i, 1);
                }
            }
        } else {
            $(this).addClass('text-success')
            ftbillsList.push($(this).data("ftbill"))
        }
    })
    $("ol").on("click", "span.selectall", function () {
        if ($(this).hasClass('text-success')) {
            $(this).removeClass('text-success')
            $('.selected').removeClass('text-success')
            ftbillsList = []
        } else {
            $(this).addClass('text-success')
            $('.selected').addClass('text-success')
            ftbillsList = []
            ftbillsList = allTags
        }
    })

    function invoicing(job, week) {

        var details = [], custId, rate, custName, jobId, jobName, jobLoc, jobType, total = 0, totalTag = 0, ftb = '';
        console.log(ftbillsList)
        if (ftbillsList.length == 0) {
            alert('please select Fright Bills to invoice')
            return true
        }
        var qty = {}
        $.each(tagsWeekly, function (key, vals) {
            if (key === week) {
                $.each(vals, function (key, val) {
                    if (key === job) {
                        var h = 0, l = 0, t = 0, to = 0, df = 0, st = 0, bm = 0, i = 0
                        $.each(val, function (k, v) {
                            for (var x = 0; x < ftbillsList.length; x++) {
                                if (v.Fright_Bill == ftbillsList[x]) {
                                    var bqty = '', rate = ''
                                    if (v.BHQty) {
                                        rate = rate + '$ ' + v.BHRate + '<br>'
                                        bqty = bqty + v.BHQty + ' Hour,<br> '
                                        h += v.BHQty
                                    }
                                    if (v.BLQty) {
                                        rate = rate + '$ ' + v.BLRate + '<br>'
                                        bqty = bqty + v.BLQty + ' Load,<br>'
                                        l += v.BLQty
                                    } if (v.BTQty) {
                                        rate = rate + '$ ' + v.BTRate + '<br>'
                                        bqty = bqty + v.BTQty + ' Ton,<br> '
                                        t += v.BTQty
                                    } if (v.BTollQty) {
                                        rate = rate + '$ ' + v.BTollRate + '<br>'
                                        bqty = bqty + v.BTollQty + ' Toll,<br> '
                                        to += v.BTollQty
                                    } if (v.BDFQty) {
                                        rate = rate + '$ ' + v.BDFRate + '<br>'
                                        bqty = bqty + v.BDFQty + ' Dumps,<br> '
                                        df += v.BDFQty
                                    } if (v.BSTQty) {
                                        rate = rate + '$ ' + v.BSTRate + '<br>'
                                        bqty = bqty + v.BSTQty + ' Standby Time,<br> '
                                        st += v.BSTQty
                                    } if (v.BMQty) {
                                        rate = rate + '$ ' + v.BMRate + '<br>'
                                        bqty = bqty + v.BMQty + ' Material Fee,<br> '
                                        bm += v.BMQty
                                    }
                                    d = {}

                                    totalTag++
                                    custId = v.customer_id
                                    custName = v.customer_name
                                    jobId = v.job_id
                                    jobName = v.job_name
                                    jobLoc = v.job_location
                                    jobType = v.job_type
                                    d.rate = rate
                                    ftb = ftb + v.Fright_Bill + '||'
                                    d.date = v.date
                                    d.ftb = v.Fright_Bill
                                    d.qty = bqty
                                    d.total = v.bTotal
                                    d.truckid = v.Truck_id
                                    d.jobName = v.job_name
                                    total = total + v.bTotal
                                    details.push(d);
                                    i++
                                }
                            }

                        })
                        h = h.toFixed(2), l = l.toFixed(2), t = t.toFixed(2), df = df.toFixed(2), st = st.toFixed(2), bm = bm.toFixed(2)
                        qty.Hours = h, qty.loads = l, qty.tons = t, qty.tolls = to, qty.dumpfee = df, qty.standbyTime = st, qty.material = bm
                    }
                })
            }
        })
        var now = new Date();
        total = total.toFixed(2)
        //var invNum = moment(now).format('MMYY') + moment(now).week() + '-' + id;
        var data = {
            //invId: invNum,
            updatedBy: localStorage.username,
            updatedDate: now,
            status: 'Preview',
            detail: details,
            total: total,
            cust_id: custId,
            cust_name: custName,
            job_id: jobId,
            job_name: jobName,
            job_loc: jobLoc,
            job_type: jobType,
            ftb: ftb,
            totalTag: totalTag,
            qty: qty
        }
        $.ajax({
            url: localStorage.getItem('url') + "inv/PreviewInv",
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
                    getAllInvs()
                    ftbillsList = [], allTags = []
                    InvAnimation()
                    showInvPrint(result.invRes, custId, totalTag);
                }

            }
        })
    }

    function saveAReceivables(d) {
        var d = {
            customer_id: d.customer_id,
            customer_name: d.customer_name,
            updatedBy: d.updatedBy,
            updatedDate: d.updatedDate,
            TotalRev: d.TotalRev,
            invDetails: d.invDetails
        }
        $.ajax({
            url: localStorage.getItem('url') + "cust/newARInvoice",
            data: JSON.stringify(d),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                if (result.msg == 'success') {
                    //alert('success');
                }

            }
        })

    }

    function showInvPrint(invData, loc, totalTag) {
        var data = {
            customer_id: loc
        }
        var custLoc
        $.ajax({
            url: localStorage.getItem('url') + "cust/custLoc",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                $('#Invoice').show()
                $('#invDate').show()
                getAllTagsByWeek();
                $('#QTYTotal').empty();
                $('.invForm').empty();
                custLoc = result.customer_location
                custLoc = custLoc.split(',')
                var fid = invData._id
                fid = fid.substring(0)
                var id = fid.substring(22)
                id = parseInt(id, 16)
                var now = new Date(),
                    invNum = moment(now).format('MMYY') + moment(now).week() + '-' + id;
                var inv = '<span id="invoiceId" class="' + fid + '">' + invNum + '</span>'
                $('#invId').append(inv);
                $('#invId').data('fullId', fid);
                $('#invDate').val(moment(invData.InvDate).format('MM-DD-YYYY'))
                $('#custName').append(invData.customer_name)
                $('#custId').append(invData.customer_id)
                $('#JobName').append(invData.customer_id)
                $('#add1').empty()
                $('#add2').empty()
                $('#add1').append(custLoc[0])
                $('#add2').append(custLoc[1])
                $('#phone').append(invData.phone)
                $('#email').append(invData.email)
                $('#pTot').empty()
                $('#pTot').append("$ " + invData.Total)

                for (var i = 0; i < totalTag; i++) {
                    var tr = '<tr><td>' + moment(invData.details[i].date).format('MM-DD-YY') + '</td>' +
                        '<td>' + invData.details[i].ftb + '</td>' +
                        '<td>' + invData.details[i].jobName + '</td>' +
                        // '<td>' + invData.details[i].driver + '</td>' +
                        '<td>' + invData.details[i].qty + '</td>' +
                        '<td>' + invData.details[i].rate + '</td>' +
                        '<td> $ ' + invData.details[i].total + '</td></tr>'
                    $('#QTYTotal').append(tr)
                }
                var tr = '<tr><td></td><td></td><td></td><td></td><td><strong>Total</strong></td><td>$ <strong id="InvTotal">  ' + invData.Total + '</strong></td></tr>'
                $('#QTYTotal').append(tr)
                var qtyTbl = "<tbody>"
                if (invData.qtytble) {
                    $.each(invData.qtytble, function (key, val) {
                        if (val > 0) {
                            qtyTbl += "<tr><td>" + key + "</td><td>" + val + "</td></tr>"
                        }
                    })
                }
                qtyTbl += "</tbody>"
                $('#qtyview').empty()
                $('#qtyview').append(qtyTbl)
            }
        })
    }

    $('#Invoice').click(function () {
        if ($('#invDate').val() == "") {
            alert('Please select date')
            return
        }
        var fid = $('#invoiceId').attr('class'), index
        $.each(AllInvDetails, function (key, val) {
            if (val._id == fid) {
                index = key
            }
        })
        var data = {
            fullId: fid,
            invId: $('#invoiceId').text(),
            invDate: AllInvDetails[index].InvDate,
            updatedBy: localStorage.username,
            updatedDate: new Date(),
            customer_id: AllInvDetails[index].customer_id,
            customer_name: AllInvDetails[index].customer_name,
            totalRev: AllInvDetails[index].Total,
            invDetails: {
                invID: $('#invoiceId').text(),
                invTotal: AllInvDetails[index].Total,
                invDate: $('#invDate').val(),
                status: 'Created'
            },
            allFtb: AllInvDetails[index].details
        }

        $.ajax({
            url: localStorage.getItem('url') + "inv/thisInv",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                //saveAReceivables(data)
                console.log(result)
                getAllInvs()
                getAllTagsByWeek()
                $('.print').show()
                InvPdf()
                $('#invDate').hide()
                $('#InvIdTrue').append($('#invDate').val())
                $('#Invoice').hide()
            }
        })

    })


    $('.BHQty,.BHRate').change(function () {
        $('.PHQty').val($('.BHQty').val())
        var i = $('.BHQty').val() * $('.BHRate').val()
        i = i.toFixed(2)
        var j = $('.PHQty').val() * $('.PHRate').val()
        j = j.toFixed(2)
        $('.BHTotal').val(i)
        $('.PHTotal').val(j)
        bTotal()
        pTotal()
    })
    $('.BLQty,.BLRate').change(function () {
        $('.PLQty').val($('.BLQty').val())
        var i = $('.BLQty').val() * $('.BLRate').val()
        i = i.toFixed(2)
        $('.BLTotal').val(i)
        var j = $('.PLQty').val() * $('.PLRate').val()
        j = j.toFixed(2)
        $('.PLTotal').val(j)
        var rate = $('.PLRate').val()
        if (rate.includes('%')) {
            rate = parseInt(rate.slice(0, -1)) / 100
            var k = $('.BLTotal').val() * rate
            k = k.toFixed(2)
            $('.PLTotal').val(k)
        }
        bTotal()
        pTotal()
    })
    $('.BTQty,.BTRate').change(function () {
        var rate = $('.PTRate').val()
        $('.PTQty').val($('.BTQty').val())
        var i = $('.BTQty').val() * $('.BTRate').val()
        i = i.toFixed(2)
        $('.BTTotal').val(i)
        var j = $('.PTQty').val() * $('.PTRate').val()
        j = j.toFixed(2)
        $('.PTTotal').val(j)
        if (rate.includes('%')) {
            rate = parseInt(rate.slice(0, -1)) / 100
            var k = $('.BTTotal').val() * rate
            k = k.toFixed(2)
            $('.PTTotal').val(k)
        }
        bTotal()
        pTotal()
    })
    $('.BTollQty,.BTollRate').change(function () {
        $('.PTollQty').val($('.BTollQty').val())
        $('.PTollRate').val($('.BTollRate').val())
        var i = $('.BTollQty').val() * $('.BTollRate').val()
        i = i.toFixed(2)
        $('.BTollTotal').val(i)
        var j = $('.PTollQty').val() * $('.PTollRate').val()
        j = j.toFixed(2)
        $('.PTollTotal').val(j)
        bTotal()
        pTotal()
    })
    $('.BDFQty,.BDFRate').change(function () {
        var i = $('.BDFQty').val() * $('.BDFRate').val()
        i = i.toFixed(2)
        $('.BDFTotal').val(i)
        bTotal()
    })
    $('.BSTQty,.BSTRate').change(function () {
        var i = $('.BSTQty').val() * $('.BSTRate').val()
        i = i.toFixed(2)
        $('.BSTTotal').val(i)
        bTotal()
    })
    $('.BMQty,.BMRate,.BMTax').change(function () {
        var i = $('.BMQty').val() * $('.BMRate').val()
        i = i.toFixed(2)
        var j = parseFloat(i + (i * (parseFloat($('.BMTax').val()) / 100)))
        j = j.toFixed(2)
        $('.BMTotal').val(j)
        bTotal()
    })

    function bTotal() {
        var a = parseFloat($('.BHTotal').val()) || 0,
            b = parseFloat($('.BLTotal').val()) || 0,
            c = parseFloat($('.BTTotal').val()) || 0,
            d = parseFloat($('.BTollTotal').val()) || 0,
            e = parseFloat($('.BDFTotal').val()) || 0,
            f = parseFloat($('.BSTTotal').val()) || 0,
            g = parseFloat($('.BMTotal').val()) || 0
        var t = a + b + c + d + e + f + g
        t = t.toFixed(2)
        $('.btotal').val(t)
        ValidateTotal()
    }
    $('.PHQty,.PHRate').change(function () {
        var i = $('.PHQty').val() * $('.PHRate').val()
        i = i.toFixed(2)
        $('.PHTotal').val(i)
        pTotal()
    })
    $('.PLQty,.PLRate').change(function () {
        var i = $('.PLQty').val() * $('.PLRate').val()
        i = i.toFixed(2)
        $('.PLTotal').val(i)
        var rate = $('.PLRate').val()
        if (rate.includes('%')) {
            rate = parseInt(rate.slice(0, -1)) / 100
            var k = $('.BLTotal').val() * rate
            k = k.toFixed(2)
            $('.PLTotal').val(k)
        }
        pTotal()
    })
    $('.PTQty,.PTRate').change(function () {
        var i = $('.PTQty').val() * $('.PTRate').val()
        i = i.toFixed(2)
        $('.PTTotal').val(i)
        var rate = $('.PTRate').val()
        if (rate.includes('%')) {
            rate = parseInt(rate.slice(0, -1)) / 100
            var j = $('.BTTotal').val() * rate
            j = j.toFixed(2)
            $('.PTTotal').val(j)
        }
        pTotal()
    })
    $('.PTollQty,.PTollRate').change(function () {
        var i = $('.PTollQty').val() * $('.PTollRate').val()
        i = i.toFixed(2)
        $('.PTollTotal').val(i)
        pTotal()
    })
    $('.PDFQty,.PDFRate').change(function () {
        var i = $('.PDFQty').val() * $('.PDFRate').val()
        i = i.toFixed(2)
        $('.PDFTotal').val(i)
        pTotal()
    })
    $('.PSTQty,.PSTRate').change(function () {
        var i = $('.PSTQty').val() * $('.PSTRate').val()
        i = i.toFixed(2)
        $('.PSTTotal').val(i)
        pTotal()
    })
    $('.PMQty,.PMRate,.PMTax').change(function () {
        var i = $('.PMQty').val() * $('.PMRate').val()
        i = i.toFixed(2)
        $('.PMTotal').val(parseFloat(i) + parseFloat($('.PMTax').val()))
        pTotal()
    })

    function pTotal() {
        var h = parseFloat($('.FeePercent').val())
        var a = parseFloat($('.PHTotal').val()) || 0,
            b = parseFloat($('.PLTotal').val()) || 0,
            c = parseFloat($('.PTTotal').val()) || 0,
            d = parseFloat($('.PTollTotal').val()) || 0,
            e = parseFloat($('.PDFTotal').val()) || 0,
            f = parseFloat($('.PSTTotal').val()) || 0,
            g = parseFloat($('.PMTotal').val()) || 0, y

        x = a + b + c + d + e + f + g
        x = x.toFixed(2)
        $('.ptotal').val(x)
        if (!h) {
            y = 0
        } else {
            h = h / 100
            y = (a + b + c) * h
            y = y.toFixed(2)
        }
        $('.BrokerFee').val(y)
        $('.pNetTot').val((a + b + c) - y)
        ValidateTotal()
    }

    function ValidateTotal() {

        var bill = parseFloat($('.btotal').val()), pay = parseFloat($('.pNetTot').val())
        if (pay > bill) {
            alert('Pay amount is more than Bill. Please verify again');
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
    var today = new Date()
    var start = moment().subtract(1, 'month').startOf('month');
    var end = moment().subtract(1, 'month').endOf('month');
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
    /* $('#CustDropDown').on('click', '.custdd', function () {
        var r = $('#DateRange').val()
        r = r.split('-')
        getAllTags(r[0], r[1])
    }) */
    $('#NewFtCust').change(function () {
        var r = $('#DateRange').val()
        r = r.split('-')
        getAllTags(r[0], r[1])
    })

    var allCusttags
    function getAllTags(start, end) {
        var cust = $('#NewFtCust').val()
        if (cust.includes('Customer Name')) {
            alert('Please select Customer')
            return
        }
        var data = {
            cust_name: $('#NewFtCust').val(),
            start: start,
            end: end
        }
        $.ajax({
            url: localStorage.getItem('url') + "ftb/getAllTags",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                allCusttags = result
                CustTags.clear().draw()
                $.each(result, function (keys, val) {
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
                        val.Fright_Bill,
                        val.job_name,
                        val.Truck_id || '',
                        loc,
                        bqty,
                        rate,
                        '$' + val.bTotal,
                    ]).draw(false);
                })
            }
        })
    }
    $('#CustTags tbody').on('click', 'tr', function () {
        if ($(this).hasClass('green-500')) {
            $(this).removeClass('green-500');
        } else {
            $(this).addClass('green-500');
        }
    })
    $('#SeleAll').click(function () {
        $('#CustTags tbody tr').addClass('green-500')
    })
    $('#Clear').click(function () {
        $('#CustTags tbody tr').removeClass('green-500')
    })

    $('#Preview').click(function () {
        var ftbills = []
        CustTags.rows().eq(0).each(function (index) {
            if (CustTags.row(index).node().className.includes('green-500')) {
                dat = CustTags.row(index).data()
                ftbills.push(dat[1])
            }
        });
        if (ftbills.length == 0) {
            alert('Please select tags to preview')
            return
        }
        var h = 0, l = 0, t = 0, to = 0, df = 0, st = 0, bm = 0, i = 0, qty = {},
            details = [], custId, rate, custName, jobId, jobName, jobLoc, jobType, total = 0, totalTag = 0, ftb = ''
        $.each(ftbills, function (keys, vals) {
            $.each(allCusttags, function (key, v) {
                if (vals == v.Fright_Bill) {
                    var bqty = '', rate = ''
                    if (v.BHQty) {
                        rate = rate + '$ ' + v.BHRate + '<br>'
                        bqty = bqty + v.BHQty + ' H ,<br> '
                        h += v.BHQty
                    }
                    if (v.BLQty) {
                        rate = rate + '$ ' + v.BLRate + '<br>'
                        bqty = bqty + v.BLQty + ' L ,<br>'
                        l += v.BLQty
                    } if (v.BTQty) {
                        rate = rate + '$ ' + v.BTRate + '<br>'
                        bqty = bqty + v.BTQty + ' T ,<br> '
                        t += v.BTQty
                    } if (v.BTollQty) {
                        rate = rate + '$ ' + v.BTollRate + '<br>'
                        bqty = bqty + v.BTollQty + ' Toll,<br> '
                        to += v.BTollQty
                    } if (v.BDFQty) {
                        rate = rate + '$ ' + v.BDFRate + '<br>'
                        bqty = bqty + v.BDFQty + ' D ,<br> '
                        df += v.BDFQty
                    } if (v.BSTQty) {
                        rate = rate + '$ ' + v.BSTRate + '<br>'
                        bqty = bqty + v.BSTQty + ' ST,<br> '
                        st += v.BSTQty
                    } if (v.BMQty) {
                        rate = rate + '$ ' + v.BMRate + '<br>'
                        bqty = bqty + v.BMQty + ' MF,<br> '
                        bm += v.BMQty
                    }
                    d = {}
                    totalTag++
                    custId = v.customer_id
                    custName = v.customer_name
                    jobId = v.job_id
                    jobName = v.job_name
                    jobLoc = v.job_location
                    jobType = v.job_type
                    d.rate = rate
                    ftb = ftb + v.Fright_Bill + '||'
                    d.date = v.date
                    d.ftb = v.Fright_Bill
                    d.qty = bqty
                    d.total = v.bTotal
                    d.truckid = v.Truck_id
                    d.jobName = v.job_name
                    d.driver = v.Driver
                    total = total + v.bTotal
                    details.push(d);
                }
            })
        })
        h = h.toFixed(2), l = l.toFixed(2), t = t.toFixed(2), df = df.toFixed(2), st = st.toFixed(2), bm = bm.toFixed(2)
        qty.Hours = parseFloat(h), qty.loads = parseFloat(l), qty.tons = parseFloat(t), qty.tolls = parseFloat(to), qty.dumpfee = parseFloat(df), qty.standbyTime = parseFloat(st), qty.material = parseFloat(bm)
        var now = new Date();
        //var invNum = moment(now).format('MMYY') + moment(now).week() + '-' + id;
        var data = {
            //invId: invNum,
            updatedBy: localStorage.username,
            updatedDate: now,
            status: 'Preview',
            detail: details,
            total: total,
            cust_id: custId,
            cust_name: custName,
            job_id: jobId,
            job_name: jobName,
            job_loc: jobLoc,
            job_type: jobType,
            ftb: ftb,
            totalTag: totalTag,
            qty: qty
        }
        console.log(data)
        $.ajax({
            url: localStorage.getItem('url') + "inv/PreviewInv",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><img src="busy.gif" /> Just a moment...</h1>' });
            },
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                $.unblockUI();
                if (result.msg == 'success') {
                    getAllInvs()
                    ftbillsList = [], allTags = [], allCusttags = []
                    var r = $('#DateRange').val()
                    r = r.split('-')
                    getAllTags(r[0], r[1])
                    InvAnimation()
                    showInvPrint(result.invRes, custId, totalTag);
                }
            }
        })
    })
    $('.NewFtCustSpan').click(function () {
        Allcust = JSON.parse(localStorage.getItem('Customers'))
        $('#NewFtCust').autocomplete({
            source: Allcust
        })
    })

    $('.print').click(function () {
        InvPdf()
    })
})