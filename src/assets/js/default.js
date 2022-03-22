/**
 * Service Worker
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
    navigator.serviceWorker
        .register('/serviceWorker.js')
        .then(res => console.log('service worker registered'))
        .catch(err => console.log('service worker not registered', err))
    })
}

const urlParams = new URLSearchParams($_GET);

$(function() {
    /**
     * Fomantic UI
     */
    /** API */
    $.fn.api.settings.api = {
        'get wishlists'        : '/src/api/wishlists.php',
        'delete wishlist'      : '/src/api/wishlists.php',
        'update wish status'   : '/src/api/wishes.php',
        'delete wish'          : '/src/api/wishes.php',
    };

    /** Default callbacks */
    $.fn.api.settings.onResponse = function(response) {
        return response;
    }
    $.fn.api.settings.successTest = function(response) {
        return response.status == 'OK' || response.success || false;
    }
    $.fn.api.settings.onComplete = function(response, element, xhr) {
        element.removeClass('loading');
    }
    $.fn.api.settings.onSuccess = function(response, element, xhr) {
        element.dropdown({
            values     : response.results,
            placeholder: text.wishlist_no_selection
        })

        if ($_GET.wishlist) {
            element.dropdown('set selected', $_GET.wishlist);
        } else {
            if (response.results[0]) {
                element.dropdown('set selected', response.results[0].value);
            }
        }
    }
    $.fn.api.settings.onFailure = function(response, element, xhr) {
        if ('string' === typeof response) {
            response = response.replace('<br />', '');
        }

        $('body')
        .modal({
            title   : 'Failure',
            content : response,
            class   : '',
            actions : [
                {
                    text : text.modal_failure_approve,
                    class: 'primary'
                }
            ],
            autoShow: true
        });
    }
    $.fn.api.settings.onError = function(response, element, xhr) {
        if ('string' === typeof response) {
            response = response.replace('<br />', '');
        }

        $('body')
        .modal({
            title   : 'Error',
            content : response,
            class   : '',
            actions : [
                {
                    text : text.modal_failure_approve,
                    class: 'primary'
                }
            ],
            autoShow: true
        });
    }
    /** */

    /** Toasts */
    $.fn.toast.settings.displayTime    = 'auto';
    $.fn.toast.settings.minDisplayTime = 3000;
    $.fn.toast.settings.showProgress   = 'bottom';
    $.fn.toast.settings.class          = 'success';
    $.fn.toast.settings.showIcon       = true;
    $.fn.toast.settings.title          = text.modal_success_title;

    /**
     * Menu
     */
    $(document).on('click', '.menu.toggle', function() {
        $('.menu.sidebar').sidebar('show');
    });

});

/**
 * Functions
 */
function handleFetchError(response) {
    if (!response.ok) {
        console.log('handleFetchError');
        console.log(response);

        showError(response.statusText);
        throw Error(response.statusText);
    }

    return response;
}

function handleFetchResponse(response) {
    var isText = response.headers.get('content-type')?.includes('text/html');
    var isJSON = response.headers.get('content-type')?.includes('application/json');

    if (isText) {
        return response.text().then(function(text) {
            if (text.toLowerCase().includes('error') || text.toLowerCase().includes('exception')) {
                showError(text);
            }
        })
    } else if (isJSON) {
        return response.json().then(function(json) {
            if (json.warning) {
                showWarning(json.warning)
            }

            return json;
        });
    }
}

function handleFetchCatch(error) {
    console.log(error);

    return error;
}

function showError(error) {
    error = error.replace('<br />', '');

    $('body')
        .modal({
            title   : 'Error',
            content : error,
            class   : '',
            actions : [
                {
                    text : text.modal_failure_approve,
                    class: 'primary'
                }
            ],
            autoShow: true
        });
}

function showWarning(warning) {
    warning = warning.replace('<br />', '');

    $('body')
        .modal({
            title   : 'Warning',
            content : warning,
            class   : '',
            actions : [
                {
                    text : text.modal_warning_approve,
                    class: 'primary'
                }
            ],
            autoShow: true,
        });
}
