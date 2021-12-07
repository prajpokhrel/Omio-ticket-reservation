/*=========================================================================================
  File Name: form-validation.js
  Description: jquery bootstrap validation js
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: PIXINVENT
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

$(function () {
  'use strict';

  var bootstrapForm = $('.needs-validation'),
    jqForm = $('#jquery-val-form'),
    picker = $('.picker'),
    select = $('.select2');

  // select2
  select.each(function () {
    var $this = $(this);
    $this.wrap('<div class="position-relative"></div>');
    $this
      .select2({
        placeholder: 'Select value',
        dropdownParent: $this.parent()
      })
      .change(function () {
        $(this).valid();
      });
  });

  // Picker
  if (picker.length) {
    picker.flatpickr({
      allowInput: true,
      onReady: function (selectedDates, dateStr, instance) {
        if (instance.isMobile) {
          $(instance.mobileInput).attr('step', null);
        }
      }
    });
  }

  // Bootstrap Validation
  // --------------------------------------------------------------------
  if (bootstrapForm.length) {
    Array.prototype.filter.call(bootstrapForm, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          form.classList.add('invalid');
        }
        form.classList.add('was-validated');
        event.preventDefault();
        // if (inputGroupValidation) {
        //   inputGroupValidation(form);
        // }
      });
      // bootstrapForm.find('input, textarea').on('focusout', function () {
      //   $(this)
      //     .removeClass('is-valid is-invalid')
      //     .addClass(this.checkValidity() ? 'is-valid' : 'is-invalid');
      //   if (inputGroupValidation) {
      //     inputGroupValidation(this);
      //   }
      // });
    });
  }

  // jQuery Validation
  // --------------------------------------------------------------------
  if (jqForm.length) {
    jqForm.validate({
      rules: {
        'basic-default-name': {
          required: true
        },
        'basic-default-email': {
          required: true,
          email: true
        },
        'basic-default-password': {
          required: true
        },
        'confirm-password': {
          required: true,
          equalTo: '#basic-default-password'
        },
        'select-country': {
          required: true
        },
        'fp-date-time': {
            required: true
        },
        firstName: {
          required: true
        },
        lastName: {
          required: true
        },
        email: {
          required: true
        },
        contactNumber: {
          required: true
        },
        citizenshipNumber: {
          required: true
        },
        licenseNumber: {
          required: true
        },
        driverImage: {
          required: true
        },
        busServiceName: {
          required: true
        },
        busNumber: {
          required: true
        },
        busServiceLogo: {
          required: true
        },
        seatCapacity: {
          required: true
        },
        busStatus: {
          required: true
        },
        driverId: {
          required: true
        },
        selectedBus: {
          required: true
        },
        seatType: {
          required: true
        },
        distancedSeatCharge: {
          required: true
        },
        reserveSeatCharge: {
          required: true
        },
        fromSource: {
          required: true
        },
        toDestination: {
          required: true
        },
        assignedBusId: {
          required: true
        },
        midPlaceBetweenRoutes: {
          required: true
        },
        routeFare: {
          required: true
        },
        departureDate: {
          required: true
        },
        departureTime: {
          required: true
        },
        arrivalDate: {
          required: true
        },
        estimatedArrivalTime: {
          required: true
        },
        dob: {
          required: true
        },
        customFile: {
          required: true
        },
        fullName: {
          required: true
        },
        departureDateRange: {
          required: true
        },
        idNumber: {
          required: true
        },
        validationRadiojq: {
          required: true
        },
        validationBiojq: {
          required: true
        },
        validationCheck: {
          required: true
        }
      }
    });
  }
});
