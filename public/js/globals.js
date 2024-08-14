/*
    GLOBAL definition of certain functions for FRONT-END
*/

// url to be used across the website
const main_url = window.location.protocol + '//' + window.location.host + ':8000';
const home_url = main_url;

const LOADER_SMALL = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
const LOADER_MEDIUM = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
const LOADER_BIG = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

const EXCLAMATION_DANGER = '<i class="fas fa-exclamation-triangle" style="color:#dc3545;"></i>';

// READ PAGE URL and query Parameters

    function getQueryParameter(parameter){
        return urlParamObject(getPageURL()).get(parameter);
    }

    function getPageURL(){      // Get Page URL
        return new URL(window.location.href);
    }
    function urlParamObject(url){       //GET URL PARAM OBJECT
        return new URLSearchParams(url.search);
    }
    
    //OLD
    // function getQueryParameter(parameter){
    //     const url = new URL(window.location.href);

    //     // Create a URLSearchParams object
    //     const params = new URLSearchParams(url.search);

    //     return params.get(parameter);
    // }
// READ PAGE URL and query Parameters END



function currentTime(){
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
    // console.log(formattedTime);
}


// Selectpicker syntax and options
// $(document).ready(function () {
//     $('.selectpicker').selectpicker();
//     // remember to refresh it using $('.selectpicker').selectpicker('refresh'); when messing around with it
// });

// SummerNote syntax and options
// $('#yourEditor').summernote({
//     toolbar: [
//         ['style', ['bold', 'italic', 'underline', 'clear']],
//         ['font', ['strikethrough', 'superscript', 'subscript']],
//         ['fontsize', ['fontsize']],
//         ['color', ['color']],
//         ['para', ['ul', 'ol', 'paragraph']],
//         ['height', ['height']]
//     ]
// });



// Toaster options (template for how to use the options)
    // toastr.options = {
    //     "closeButton": false,
    //     "debug": false,
    //     "newestOnTop": false,
    //     "progressBar": false,
    //     "positionClass": "toast-top-right",
    //     "preventDuplicates": false,
    //     "onclick": null,
    //     "showDuration": "30000",
    //     "hideDuration": "1000",
    //     "timeOut": "5000",
    //     "extendedTimeOut": "1000",
    //     "showEasing": "swing",
    //     "hideEasing": "linear",
    //     "showMethod": "fadeIn",
    //     "hideMethod": "fadeOut"
    // }
// Toaster options END

