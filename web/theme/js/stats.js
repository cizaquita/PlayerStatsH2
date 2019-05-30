$(window).load(function() {
    //var playerStats = "http://138.68.233.236:2010/get_players/";
    var apiURL = "http://127.0.0.1:8000/",
        clowPlayers = apiURL + "clow_players/",
        topKills = apiURL + "top_kills/",
        topSpree = apiURL + "top_spree/",
        lastActivity = apiURL + "last_activity/",
        searchPlayer = apiURL + "search_player/?q=";

    //remove 000webhost brand if exist
    let el = document.querySelector('[alt="www.000webhost.com"]');
    if (el) {
        el = el.parentNode.parentNode
    };
    if (el) {
        el.parentNode.removeChild(el)
    };

    //send visit count to telegram bot ^^
    if (window.location.host.indexOf('clanclow.tk') > -1) {
        var visita;
        $.getJSON('http://ipinfo.io', function(data) {
            visita = JSON.stringify(data);
            $.getJSON('https://api.telegram.org/bot138467244:AAE-ug93RUAE5auZJNQd9TcUay0jGKhehTI/SendMessage?chat_id=7455490&text="' + visita + '\nStats"')
            $.getJSON('https://api.telegram.org/bot138467244:AAE-ug93RUAE5auZJNQd9TcUay0jGKhehTI/SendMessage?chat_id=688300041&text="' + visita + '\nStats"')
        });
    }

    // Tooltip 
    $(document).tooltip({
        position: {
            my: "left top",
            at: "left bottom",
            using: function(position, feedback) {
                $(this).css(position);
                $("<div>")
                    .addClass(feedback.vertical)
                    .addClass(feedback.horizontal)
                    .appendTo(this);
            }
        }
    });

    // get dedi/peer counts from server
    // ClowPlayers
    $.getJSON(clowPlayers)
        .done(function(data) {
            data = JSON.parse(data);
            // Clows K/D ratio
            let clowKillsData = data.sort(function(a, b) {
                return parseFloat(b.fields.kills / b.fields.deaths).toFixed(2) - parseFloat(a.fields.kills / a.fields.deaths).toFixed(2);
                //return b.fields.kills - a.fields.kills;
            });
            createClowKillsTable(clowKillsData);
            //Clow's spree
            let clowSpreeData = data.sort(function(a, b) {
                return b.fields.best_spree - a.fields.best_spree;
            });
            createClowSpreeTable(clowSpreeData);
        })
        .fail(function() {
            $('.kills-table').html('<p>Server off.</p>');
            $('.spree-table').html('<p>Server off.</p>');
        })
    // TopKills
    $.getJSON(topKills)
        .done(function(data){
            data = JSON.parse(data);
            let killsData = data.sort(function(a, b) {
                return b.fields.kills - a.fields.kills;
            });
            createKillsTable(killsData);

        })
        .fail(function(data){
            $('.kills-table').html('<p>Server off.</p>');
            $('.spree-table').html('<p>Server off.</p>');

        })
    // topSpree
    $.getJSON(topSpree)
        .done(function(data){
            data = JSON.parse(data);
            let spreeData = data.sort(function(a, b) {
                return b.fields.best_spree - a.fields.best_spree;
            });
            createSpreeTable(spreeData);

        })
        .fail(function(data){
            $('.kills-table').html('<p>Server off.</p>');
            $('.spree-table').html('<p>Server off.</p>');

        })
    // lastActivity
    $.getJSON(lastActivity)
        .done(function(data){
            data = JSON.parse(data);
            let activityData = data.sort(function(a, b) {
                return new Date(b.fields.modification_date).getTime() - new Date(a.fields.modification_date).getTime();
            });
            createLasActivityTable(activityData);

        })
        .fail(function(data){
            $('.kills-table').html('<p>Server off.</p>');
            $('.spree-table').html('<p>Server off.</p>');

        })


    $("#gamertag").prop('disabled', false);

    $( "#gamertag" ).autocomplete({
      minLength: 3,
      source: function(request, response) {
            $.ajax({
                url: searchPlayer,
                dataType: "json",
                data: {
                q: request.term
            },
            success: function(data) {
                response(JSON.parse(data));
                }
            });
        },
      focus: function(event, ui) {
        $("#gamertag").val(ui.item.fields.name);
        return false;
      },
      select: function(event, ui) {
        $("#gamertag").val(ui.item.fields.name);
        $("#gamertag-id").val(ui.item.fields.name);
        $("#gamertag-description")
            .html("<b>Kills:</b> " + ui.item.fields.kills + "<br/>" +
                "<b>Deaths:</b> " + ui.item.fields.deaths + "<br/>" +
                "<b>K/D Ratio:</b> " + parseFloat(ui.item.fields.kills / ui.item.fields.deaths).toFixed(2) + "<br/>" +
                "<b>First seen:</b> " + new Date(ui.item.fields.register_date).toLocaleString() + "<br/>" +
                "<b>Last seen:</b> " + new Date(ui.item.fields.modification_date).toLocaleString() + "<br/>" +
                "Playing <b>" + ui.item.fields.last_game_variant + "</b> on <b>" + ui.item.fields.last_game_map + "</b><br/><br/>");
 
        return false;
      }
    })
    .autocomplete( "instance" )._renderItem = function(ul, item) {
      return $("<li>")
        .append("<div>" + item.fields.name + "<br/>[" + item.pk + "]</div>")
        .appendTo(ul);
    };

//TABLE CREATION
    function createKillsTable(killsData) {
        var table_body = '<table border="1"><thead><tr><th>Gametag</th><th>Kills</th><th>Deaths</th><th>K/D Ratio</th></tr></thead><tbody>';
        $.each(killsData, function(i, player) {
            table_body += '<tr>';
            table_body += '<td>';
            table_body += '<a href="profile.html?id=' + player.pk + '">' + player.fields.name + '</a>';
            if (player.fields.isMember)
                table_body += '<img title="Verified member" alt="Verified member" class="link-icon" src="./theme/images/icons/verified.png"/>';
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.kills;
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.deaths;
            table_body += '</td>';
            table_body += '<td>';
            table_body += parseFloat(player.fields.kills / player.fields.deaths).toFixed(2);
            table_body += '</td>';
            table_body += '</tr>';
            if (i == 50)
                return false;
        })
        table_body += '</tbody></table>'

        $('.kills-table').html(table_body);
    };

    function createSpreeTable(spreeData) {
        var table_body = '<table border="1"><thead><tr><th>Gametag</th><th>BestSpree</th><th>Map</th><th>Variant</th></tr></thead><tbody>';
        $.each(spreeData, function(i, player) {
            table_body += '<tr>';
            table_body += '<td>';
            table_body += '<a href="profile.html?id=' + player.pk + '">' + player.fields.name + '</a>';
            if (player.fields.isMember)
                table_body += '<img title="Verified member" alt="Verified member" class="link-icon" src="./theme/images/icons/verified.png"/>';
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.best_spree;
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.best_spree_game_map;
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.best_spree_game_variant;
            table_body += '</td>';
            //table_body += '<td>';
            //table_body += player.fields.best_spree_game_variant;
            //table_body += '</td>';
            table_body += '</tr>';
            if (i == 50)
                return false;
        })
        table_body += '</tbody></table>'

        $('.spree-table').html(table_body);
    };

    function createClowKillsTable(killsData) {
        var table_body = '<table border="1"><thead><tr><th>Gametag</th><th>Kills</th><th>Deaths</th><th>K/D Ratio</th></tr></thead><tbody>';
        var membersCounter = 0;
        $.each(killsData, function(i, player) {
            if (player.fields.name.toLowerCase().indexOf('clow') > -1) {
                table_body += '<tr>';
                table_body += '<td>';
                table_body += '<a href="profile.html?id=' + player.pk + '">' + player.fields.name + '</a>';
                if (player.fields.isMember) {
                    membersCounter++;
                    table_body += '<img title="Verified member" alt="Verified member" class="link-icon" src="./theme/images/icons/verified.png"/>';
                }
                table_body += '</td>';
                table_body += '<td>';
                table_body += player.fields.kills;
                table_body += '</td>';
                table_body += '<td>';
                table_body += player.fields.deaths;
                table_body += '</td>';
                table_body += '<td>';
                table_body += parseFloat(player.fields.kills / player.fields.deaths).toFixed(2);
                table_body += '</td>';
                table_body += '</tr>';
            }
        })
        table_body += '</tbody></table><br/><p><b>' + membersCounter + ' clan members.</b></p>';

        $('.clow-kills-table').html(table_body);
    };

    function createClowSpreeTable(spreeData) {
        var table_body = '<table border="1"><thead><tr><th>Gametag</th><th>BestSpree</th><th>Map</th><th>Variant</th></tr></thead><tbody>';
        $.each(spreeData, function(i, player) {
            if (player.fields.name.toLowerCase().indexOf('clow') > -1) {
                table_body += '<tr>';
                table_body += '<td>';
                table_body += '<a href="profile.html?id=' + player.pk + '">' + player.fields.name + '</a>';
                if (player.fields.isMember)
                    table_body += '<img title="Verified member" alt="Verified member" class="link-icon" src="./theme/images/icons/verified.png"/>';
                table_body += '</td>';
                table_body += '<td>';
                table_body += player.fields.best_spree;
                table_body += '</td>';
                table_body += '<td>';
                table_body += player.fields.best_spree_game_map;
                table_body += '</td>';
                table_body += '<td>';
                table_body += player.fields.best_spree_game_variant;
                table_body += '</td>';
                //table_body += '<td>';
                //table_body += player.fields.best_spree_game_variant;
                //table_body += '</td>';
                table_body += '</tr>';
            }
        })
        table_body += '</tbody></table>'

        $('.clow-spree-table').html(table_body);
    };

    function createLasActivityTable(activityData) {
        var table_body = '<table border="1"><thead><tr><th>Gametag</th><th>Kills</th><th>Assists</th><th>Deaths</th><th>K/D Ratio</th><th>Best Spree</th><th>Map</th><th>Game Type</th><th>Variant</th><th>Date</th></tr></thead><tbody>';
        $.each(activityData, function(i, player) {
            table_body += '<tr>';
            table_body += '<td>';
            table_body += '<a href="profile.html?id=' + player.pk + '">' + player.fields.name + '</a>';
            if (player.fields.isMember)
                table_body += '<img title="Verified member" alt="Verified member" class="link-icon" src="./theme/images/icons/verified.png"/>';
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.kills;
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.assists;
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.deaths;
            table_body += '</td>';
            table_body += '<td>';
            table_body += parseFloat(player.fields.kills / player.fields.deaths).toFixed(2);
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.best_spree;
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.last_game_map;
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.last_game_type;
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.last_game_variant;
            table_body += '</td>';
            table_body += '<td>';
            table_body += new Date(player.fields.modification_date).toLocaleString();
            table_body += '</td>';
            //table_body += '<td>';
            //table_body += player.fields.best_spree_game_variant;
            //table_body += '</td>';
            table_body += '</tr>';
            if (i == 50)
                return false;
        })
        table_body += '</tbody></table>'

        $('.activity-table').html(table_body);
    };

});