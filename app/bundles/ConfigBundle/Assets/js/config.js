//ConfigBundle

Mautic.removeConfigValue = function(action, el) {
    Mautic.executeAction(action, function(response) {
    	if (response.success) {
            mQuery(el).parent().addClass('hide');
        }
	});
};

/**
 *
 * @returns string|false
 */
Mautic.parseQuery = function (query) {
    var vars = query.split('&');
    var queryString = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof queryString[key] === 'undefined') {
            queryString[key] = decodeURIComponent(value);
            // If second entry with this name
        } else if (typeof queryString[key] === 'string') {
            var arr = [queryString[key], decodeURIComponent(value)];
            queryString[key] = arr;
            // If third or later entry with this name
        } else {
            queryString[key].push(decodeURIComponent(value));
        }
    }
    return queryString;
}

Mautic.parseUrlHashParameter = function(url) {
    var url = url.split('#');
    if ('undefined' != typeof url[1]) {
        return url[1];
    }

    return false;
}

Mautic.observeConfigTabs = function() {

    if (!mQuery('#config_coreconfig_last_shown_tab').length) {
        return;
    }

    var parameters = Mautic.parseQuery(window.location.search.substr(1));
    if ('undefiend' != typeof parameters['tab']) {
        mQuery('#config_coreconfig_last_shown_tab').val(parameters['tab']);
        mQuery('a[data-toggle="tab"]').each(function (i, tab) {
            if (mQuery(tab).attr('href') == ('#' + parameters['tab'])) {
                mQuery(tab).tab('show');
            }
        });
    }

    mQuery('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var tab = Mautic.parseUrlHashParameter(e.target.href);
        if (tab) {
            mQuery('#config_coreconfig_last_shown_tab').val(tab);
        }
    });
}

Mautic.resetEmailsToNotification = function(obj) {
    const send_to_owner = obj.value;
    if (parseInt(send_to_owner, 10) === 1)
    {
        mQuery(obj).closest('.panel-body').find('.notification_email_addresses').val('');
    }
};

Mautic.configDnsTestExecute = function(element, action, key) {
    const $button = mQuery(element),
        $container = $button.closest('.config-dsn-container');

    $container.find('.fa-spinner').removeClass('hide');

    Mautic.ajaxActionRequest(action, {key: key}, function(response) {
        const theClass = (response.success) ? 'has-success' : 'has-error',
            theMessage = response.message;
        $container.find('.config-dsn-test-container').removeClass('has-success has-error').addClass(theClass);
        $container.find('.help-block .status-msg').html(theMessage);
        $container.find('.fa-spinner').addClass('hide');
    });
};

Mautic.configDnsTestDisable = function(element) {
    const $container = mQuery(element).closest('.config-dsn-container');

    $container.find('.help-block .status-msg').html('');
    $container.find('.help-block .save-config-msg').removeClass('hide');
    $container.find('.config-dsn-test-button').prop('disabled', true).addClass('disabled');
};

mQuery(Mautic.observeConfigTabs);
