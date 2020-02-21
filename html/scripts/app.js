(function ($) {
  'use strict';

  window.app = {
    name: 'MT',
    setting: {
      folded: false,
      container: false,
      color: 'primary',
      bg: ''
    }
  };

  var setting = 'jqStorage-' + app.name + '-Setting',
    storage = $.localStorage,
    color;

  if (storage.isEmpty(setting)) {
    storage.set(setting, app.setting);
  } else {
    app.setting = storage.get(setting);
  }
  var v = window.location.search.substring(1).split('&');
  for (var i = 0; i < v.length; i++) {
    var n = v[i].split('=');
    app.setting[n[0]] = (n[1] == "true" || n[1] == "false") ? (n[1] == "true") : n[1];
    storage.set(setting, app.setting);
  }

  setTheme();

  // init
  function setTheme() {

    $('body').removeClass($('body').attr('ui-class')).addClass(app.setting.bg).attr('ui-class', app.setting.bg);
    app.setting.folded ? $('#aside').addClass('folded') : $('#aside').removeClass('folded');
    $('#aside').length == 0 && (app.setting.container ? $('.app-header .navbar, .app-content').addClass('container') : $('.app-header .navbar, .app-content').removeClass('container'));

    $('.switcher input[value="' + app.setting.color + '"]').prop('checked', true);
    $('.switcher input[value="' + app.setting.bg + '"]').prop('checked', true);

    $('[data-target="folded"] input').prop('checked', app.setting.folded);
    $('[data-target="container"] input').prop('checked', app.setting.container);

    if (color != app.setting.color) {
      uiLoad.remove('css/theme/' + color + '.css');
      uiLoad.load('css/theme/' + app.setting.color + '.css');
      color = app.setting.color;
    }
  }

  // click to switch
  $(document).on('click.setting', '.switcher input', function (e) {
    var $this = $(this), $target;
    $target = $this.closest('[data-target]').attr('data-target');
    app.setting[$target] = $this.is(':checkbox') ? $this.prop('checked') : $(this).val();
    storage.set(setting, app.setting);
    setTheme(app.setting);
  });
  $(document).on('click.setting', '.sw input', function (e) {
    var $this = $(this), $target;
    $target = $this.closest('[data-target]').attr('data-target');
    app.setting[$target] = $this.is(':checkbox') ? $this.prop('checked') : $(this).val();
    storage.set(setting, app.setting);
    setTheme(app.setting);
    location.reload()
  });

  function checkInput(ob) {
    var invalidChars = /[^0-9]/gi
    if (invalidChars.test(ob.value)) {
      ob.value = ob.value.replace(invalidChars, "");
    }
  }

  $('#signOut').click(function () {
    localStorage.clear();
    window.location.href = 'signin.html';
  })

  $.ajax({
    url: localStorage.getItem('url') + "cust/customers",
    beforeSend: function (xhr) {
      $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
    },
    success: function (result) {
      $.unblockUI();
      var v = []
      $.each(result, function (key, val) {
        v.push(val.customer_name)
      })
      localStorage.setItem('Customers', JSON.stringify(v))
    }
  })
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    $($.fn.dataTable.tables(true)).DataTable()
      .columns.adjust();
  });
  var truckType = ['End-Dump', 'Super-Dump', 'Double-Bottom', 'Semi-Bottom', '10-wheeler', 'Flatbed', 'Highside', 'Transfer'],
    jobType = ['Hourly', 'Load', 'Ton'],
    //url = 'http://doaba.meegatrucnz.com:3000/'
    //url = 'http://sunnytrans.meegatrucnz.com:3000/'
    url = 'http://localhost:3000/'
  localStorage.setItem('url', url)
  localStorage.setItem('truckType', JSON.stringify(truckType))
  localStorage.setItem('jobType', JSON.stringify(jobType))


})(jQuery);
