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

    var changePasswordForm = $('.change-password-form');

    // jQuery Validation
    // --------------------------------------------------------------------
    if (changePasswordForm.length) {
        changePasswordForm.validate({
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
                newPassword: {
                    required: true,
                },
                password: {
                    required: true
                },
                retypePassword: {
                    required: true,
                    equalTo: '#account-new-password'
                }
            }
        });
    }
});
