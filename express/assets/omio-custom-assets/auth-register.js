/*=========================================================================================
  File Name: auth-login.js
  Description: Auth login js file.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: PIXINVENT
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

$(function () {
    'use strict';

    var pageRegisterForm = $('.auth-register-form');

    // jQuery Validation
    // --------------------------------------------------------------------
    if (pageRegisterForm.length) {
        pageRegisterForm.validate({
            /*
            * ? To enable validation onkeyup
            onkeyup: function (element) {
              $(element).valid();
            },*/
            /*
            * ? To enable validation on focusout
            onfocusout: function (element) {
              $(element).valid();
            }, */
            rules: {
                'userName': {
                    required: true
                },
                'email': {
                    required: true,
                    email: true
                },
                'password': {
                    required: true
                },
                'firstName': {
                    required: true
                },
                'lastName': {
                    required: true
                },
                'forgotPasswordEmail': {
                    required: true,
                    email: true
                },
                'resetPasswordNew': {
                    required: true,
                },
                'reset-password-confirm': {
                    required: true,
                    equalTo: '#reset-password-new'
                }
            }
        });
    }
});
