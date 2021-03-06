$(function() {
    $('.ui.dropdown').dropdown();

    /**
     * User Warning
     */
    if ($('.wishlist-own').length) {
        $('body')
        .modal({
            title   : $('.wishlist-own .header').text(),
            content : $('.wishlist-own .text').html(),
            class   : '',
            blurring: true,
            closable: false,
            actions : [
                {
                    text : text.modal_wishlist_warning_approve,
                    class: 'approve primary'
                },
                {
                    text : text.modal_wishlist_warning_deny,
                    class: 'deny'
                }
            ],
            autoShow: true,
            onApprove: function() {
                window.close();
            },
            onDeny: function() {
                $('.wishlist-own').slideUp();
            }
        });
    }

    /**
     * Fulfil wish
     */
    $(document).on('click', '.ui.button.fulfil', function() {
        var button = $(this);
        var card   = button.closest('.ui.card');
        var column = card.closest('.column');

        /**
         * Update wish status
         */
        button.api({
            action    : 'update wish status',
            method    : 'PUT',
            data      : {
                wish_id     : card.attr('data-id'),
                wish_status : wish_status_temporary,
            },
            on        : 'now',
            onSuccess : function(response, element, xhr) {
                card.dimmer('show');
            },
        });
    });

    /** Confirm */
    $(document).on('click', '.card .button.confirm', function() {
        var button = $(this);
        var card   = button.closest('.card');

        button.api({
            action    : 'update wish status',
            method    : 'PUT',
            data      : {
                wish_id     : card.attr('data-id'),
                wish_status : wish_status_unavailable,
            },
            on        : 'now',
            onSuccess : function(response, element, xhr) {
                card.closest('.column').fadeOut(800);
            },
        });
    });

    /**
     * Save wishlist
     */
    $(document).on('click', '.button.save', function() {
        var buttonSave = $(this);

        buttonSave.addClass('disabled loading');

        var formData = new URLSearchParams();
        formData.append('wishlist', $('[data-wishlist]').attr('data-wishlist'));

        fetch('/src/api/wishlists-saved.php', {
            method : 'POST',
            body   : formData
        })
        .then(handleFetchError)
        .then(handleFetchResponse)
        .then(function(response) {
            switch (response.action) {
                case 'created':
                    button_set_saved_state(buttonSave);
                    break;

                case 'deleted':
                    button_set_default_state(buttonSave);
                    break;
            }

            buttonSave.removeClass('disabled loading');
        });
    });

    /** Determine if list is saved */
    fetch('/src/api/wishlists-saved.php', {
        method : 'GET',
    })
    .then(handleFetchError)
    .then(handleFetchResponse)
    .then(function(response) {
        var wishlists = response.data;
        var buttonSave = $('.button.save');

        wishlists.forEach(wishlist => {
            if (wishlist.hash == $_GET.wishlist) {
                button_set_saved_state(buttonSave);
                return;
            }
        });

        buttonSave.removeClass('disabled loading');
    });

    /** Set default state */
    function button_set_default_state(buttonSave) {
        buttonSave.find('.icon').removeClass('red');
        buttonSave.find('span').text(text.button_wishlist_save);
    }

    /** Set saved state */
    function button_set_saved_state(buttonSave) {
        buttonSave.find('.icon').addClass('red');
        buttonSave.find('span').text(text.button_wishlist_saved);
    }

});
