$(document).ready(function () {

        $('#beside').removeClass('folded');
        var MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var target = 1000000 / 12, tarData = [0], AnnualData = [0], d = 0
        for (var i = 1; i < MONTHS.length; i++) {
                d = d + target
                tarData.push(d)
        }
        console.log(tarData)
        var today = new Date()
        var start = moment().subtract(6, 'days');
        var end = moment();
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
                TagsEntered(start, end)
                revThisWeek(start, end)
                InvThisWeek(start, end)
        }

        var tagData
        TagsEntered()
        function TagsEntered(s, e) {
                var data = {
                        from: s,
                        to: e
                }
                $.ajax({
                        url: localStorage.getItem('url') + "dash/TagsEntered",
                        type: 'post',
                        data: JSON.stringify(data),
                        http2: true,
                        contentType: 'application/json',
                        beforeSend: function (xhr) {
                                $.blockUI({ message: '<h1><img src="busy.gif" /> Just a moment...</h1>' });
                        },
                        success: function (result) {
                                $.unblockUI();
                                //AnnualData = result.annualSum
                                tagData = result
                                console.log(result)
                                //var ftData = [1,7,9]
                                result
                                var PiConfigs = {
                                        type: 'doughnut',
                                        data: {
                                                datasets: [{
                                                        data: result.donut,
                                                        backgroundColor: [
                                                                window.chartColors.red,
                                                                window.chartColors.orange,
                                                                window.chartColors.blue,
                                                        ],
                                                        label: 'Dataset 1'
                                                }],
                                                labels: [
                                                        'Created',
                                                        'Entered',
                                                        'Invoiced'
                                                ]
                                        },
                                        options: {
                                                responsive: true,
                                                legend: {
                                                        position: 'right',
                                                },
                                                title: {
                                                        display: true,
                                                        text: 'Fright Bills'
                                                },
                                                animation: {
                                                        animateScale: true,
                                                        animateRotate: true
                                                }
                                        }
                                };


                                var PiCtxs = document.getElementById('chart-area').getContext('2d');
                                window.myDoughnut = new Chart(PiCtxs, PiConfigs);
                                $('#TrucksDisp').empty()
                                $('#TrucksDisp').append(result.disp)
                                $('#TagsEnt').empty()
                                $('#TagsEnt').append(result.donut[1])
                        }
                })
        }
        revThisWeek()
        function revThisWeek(s, e) {
                var data = {
                        from: s,
                        to: e
                }
                $.ajax({
                        url: localStorage.getItem('url') + "dash/RevThisWeek",
                        type: 'post',
                        data: JSON.stringify(data),
                        http2: true,
                        contentType: 'application/json',
                        beforeSend: function (xhr) {
                                $.blockUI({ message: '<h1><img src="busy.gif" /> Just a moment...</h1>' });
                        },
                        success: function (result) {
                                $.unblockUI();
                                console.log(result)
                                $('#RevThisWeek').empty()
                                $('#RevThisWeek').append('$ ' + result.RevThisWeek)
                        }
                })
        }
        InvThisWeek()
        function InvThisWeek(s, e) {
                var data = {
                        from: s,
                        to: e
                }
                $.ajax({
                        url: localStorage.getItem('url') + "dash/InvThisWeek",
                        type: 'post',
                        data: JSON.stringify(data),
                        http2: true,
                        contentType: 'application/json',
                        beforeSend: function (xhr) {
                                $.blockUI({ message: '<h1><img src="busy.gif" /> Just a moment...</h1>' });
                        },
                        success: function (result) {
                                $.unblockUI();
                                console.log(result)
                                $('#InvThisWeek').empty()
                                $('#InvThisWeek').append(result)
                        }
                })
        }

        var MissingTags = $('#MissingTags').DataTable({
                dom: 'Bfrtip',
                buttons: [
                        'excel', 'pdf', 'print'
                ]
        });
        var PendingInv = $('#PendingInv').DataTable({
                dom: 'Bfrtip',
                buttons: [
                        'excel', 'pdf', 'print'
                ]
        })
        getMissingTags()
        function getMissingTags() {
                $.ajax({
                        url: localStorage.getItem('url') + "dash/MissingTags",
                        type: 'get',
                        http2: true,
                        contentType: 'application/json',
                        beforeSend: function (xhr) {
                                $.blockUI({ message: '<h1><img src="busy.gif" /> Just a moment...</h1>' });
                        },
                        success: function (result) {
                                $.unblockUI();
                                console.log(result)
                                // $('#MissingTags').empty()
                                // $('#MissingTags').append(result.length)
                                MissingTags.clear().draw();
                                $.each(result, function (key, val) {
                                        MissingTags.row.add([
                                                val.customer_id,
                                                val.customer_name,
                                                moment(val.DispDate).format('MM-DD-YYYY'),
                                                val.Driver || ''
                                        ]).draw(false);
                                })


                        }
                })
        }

        getUnpaidInv()
        function getUnpaidInv() {
                $.ajax({
                        url: localStorage.getItem('url') + "dash/getUnpaidInv",
                        type: 'get',
                        http2: true,
                        contentType: 'application/json',
                        beforeSend: function (xhr) {
                                $.blockUI({ message: '<h1><img src="busy.gif" /> Just a moment...</h1>' });
                        },
                        success: function (result) {
                                $.unblockUI();
                                console.log(result)
                                // $('#MissingTags').empty()
                                // $('#MissingTags').append(result.length)
                                PendingInv.clear().draw();
                                $.each(result, function (key, val) {
                                        PendingInv.row.add([
                                                val.customer_id,
                                                val.customer_name,
                                                moment(val.InvDate).format('MM-DD-YYYY'),
                                                val.invId
                                        ]).draw(false);
                                })


                        }
                })
        }
        RevThisYear()
        function RevThisYear() {
                $.ajax({
                        url: localStorage.getItem('url') + "dash/RevThisYear",
                        type: 'get',
                        http2: true,
                        contentType: 'application/json',
                        beforeSend: function (xhr) {
                                $.blockUI({ message: '<h1><img src="busy.gif" /> Just a moment...</h1>' });
                        },
                        success: function (result) {
                                $.unblockUI();
                                //AnnualData = result.annualSum
                                AnnualData.push(result.annualSum)
                                console.log(result.annualSum)
                                var lineConfig = {
                                        type: 'bar',
                                        data: {
                                                labels: month,
                                                datasets: [{
                                                        type: 'bar',
                                                        label: 'Expenses',
                                                        backgroundColor: window.chartColors.red,
                                                        borderColor: window.chartColors.red,
                                                        data: [
                                                                12, 20, 98, 32, 43
                                                        ],
                                                }, {
                                                        type: 'bar',
                                                        label: 'Income',
                                                        backgroundColor: window.chartColors.blue,
                                                        borderColor: window.chartColors.blue,
                                                        data: result.annualSum,
                                                }, {
                                                        type: 'line',
                                                        label: 'Revenue',
                                                        backgroundColor: window.chartColors.blue,
                                                        borderColor: window.chartColors.blue,
                                                        fill: false,
                                                        data: [48, 28, 57, 300, 350, 150],
                                                },
                                                {
                                                        type: 'line',
                                                        label: 'Target',
                                                        backgroundColor: window.chartColors.green,
                                                        borderColor: window.chartColors.green,
                                                        fill: false,
                                                        data: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
                                                }]
                                        },
                                        options: {
                                                title: {
                                                        text: 'Expenses vs Income vs Revenue'
                                                }
                                        }
                                };
                                var lineCtx = document.getElementById('AnnualLine').getContext('2d');
                                window.myLine = new Chart(lineCtx, lineConfig);
                        }
                })
        }


})