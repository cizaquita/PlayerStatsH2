$(window).load(function() {
    var apiURL = "http://67.207.82.102:1337/",
    //var apiURL = "http://127.0.0.1:8000/",
        clowPlayers = apiURL + "clow_players/",
        topKills = apiURL + "top_kills/",
        topSpree = apiURL + "top_spree/",
        lastActivity = apiURL + "last_activity/",
        searchPlayer = apiURL + "search_player/?q=",
        getMOTDapi = apiURL + "get_motd/";

    //remove 000webhost brand if exist
    let el = document.querySelector('[alt="www.000webhost.com"]');
    if (el) {
        el = el.parentNode.parentNode
    };
    if (el) {
        el.parentNode.removeChild(el)
    };

    //send visit count to telegram bot ^^
    if (window.location.host.indexOf('halocol.tk') > -1) {
        var visita;
        $.getJSON('http://ipinfo.io', function(data) {
            visita = JSON.stringify(data);
            $.getJSON('https://api.telegram.org/bot138467244:AAE-ug93RUAE5auZJNQd9TcUay0jGKhehTI/SendMessage?chat_id=7455490&text="' + visita + '\nHaloColStats"')
            //$.getJSON('https://api.telegram.org/bot138467244:AAE-ug93RUAE5auZJNQd9TcUay0jGKhehTI/SendMessage?chat_id=688300041&text="' + visita + '\nStats"')
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
    //message of the day
    getMOTD();

    // get dedi/peer counts from server
    // ClowPlayers
    /*$.getJSON(clowPlayers)
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
        */
    // TopKills
    $.getJSON(topKills)
        .done(function(data){
            data = JSON.parse(data);
            let killsData = data.sort(function(a, b) {
                return b.fields.kills - a.fields.kills;
            });
            createKillsTable(killsData);

            let ratioData = data.sort(function(a, b) {
                let ratioa = (a.fields.kills / a.fields.deaths);
                let ratiob = (b.fields.kills / b.fields.deaths);
                return ratiob - ratioa;
            });
            createRatioTable(ratioData);

            let levelData = data.sort(function(a, b) {
                let levela = (a.fields.kills * (a.fields.kills / a.fields.deaths)) / 1000;
                let levelb = (b.fields.kills * (b.fields.kills / b.fields.deaths)) / 1000;
                return levelb - levela;
            });
            createLevelTable(levelData);

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
                //getMOTD();
                response(JSON.parse(data));
                }
            });
        },
      focus: function(event, ui) {
        $("#gamertag").val(ui.item.fields.name);
        return false;
      },
      select: function(event, ui) {
        let kdRatio = parseFloat(ui.item.fields.kills / ui.item.fields.deaths).toFixed(2),
            multiplier = parseFloat(ui.item.fields.kills * kdRatio).toFixed(0),
            level = Math.round(multiplier/1000).toFixed(0);
        $("#gamertag").val(ui.item.fields.name);
        $("#gamertag-id").val(ui.item.fields.name);
        $("#gamertag-description")
            .html("<b>Kills:</b> " + ui.item.fields.kills + "<br/>" +
                "<b>Deaths:</b> " + ui.item.fields.deaths + "<br/>" +
                "<b>K/D Ratio:</b> " + kdRatio + "<br/>" +
                "<b>First seen:</b> " + new Date(ui.item.fields.register_date).toLocaleString() + "<br/>" +
                "<b>Last seen:</b> " + new Date(ui.item.fields.modification_date).toLocaleString() + "<br/>" +
                "Playing <b>" + ui.item.fields.last_game_variant + "</b> on <b>" + ui.item.fields.last_game_map + "</b><br/><br/>");
        $("#medalla")
            .html(asignarMedalla(level, 150) + "<h2>Level: " + level + "</h2><br/>")
 
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
        var table_body = '<table border="1"><thead><tr><th>Gametag</th><th>Kills</th><th>Deaths</th><th>K/D Ratio</th><th>Medal</th></tr></thead><tbody>';
        $.each(killsData, function(i, player) {
            let kdRatio = parseFloat(player.fields.kills / player.fields.deaths).toFixed(2),
                multiplier = parseFloat(player.fields.kills * kdRatio).toFixed(0),
                level = Math.round(multiplier/1000).toFixed(0);
            table_body += '<tr>';
            table_body += '<td>';
            table_body += '<a href="profile.html?id=' + player.pk + '">' + player.fields.name + '</a>';
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.kills;
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.deaths;
            table_body += '</td>';
            table_body += '<td>';
            table_body += kdRatio;
            table_body += '</td>';
            table_body += '<td style="text-align: center;">';
            table_body += asignarMedalla(level, 30);
            if (player.fields.isVIP)
                table_body += '<img title="VIP member" alt="VIP member" class="link-icon" width="24px" height="24px" src="./theme/images/icons/VIP.png"/>';
            table_body += '</td>';
            table_body += '</tr>';
            if (i == 50)
                return false;
        })
        table_body += '</tbody></table>'

        $('.kills-table').html(table_body);
    };

//TABLE CREATION
    function createLevelTable(levelData) {
        var table_body = '<table border="1"><thead><tr><th>#</th><th>Gametag</th><th>Kills</th><th>Deaths</th><th>K/D Ratio</th><th>Level</th><th>Medal</th></tr></thead><tbody>',
            counter = 1;
        $.each(levelData, function(i, player) {
            let kdRatio = parseFloat(player.fields.kills / player.fields.deaths).toFixed(2),
                multiplier = parseFloat(player.fields.kills * kdRatio).toFixed(0),
                level = Math.round(multiplier/1000).toFixed(0);
            table_body += '<tr>';
            table_body += '<td>';
            table_body += counter;
            table_body += '</td>';
            table_body += '<td>';
            table_body += '<a href="profile.html?id=' + player.pk + '">' + player.fields.name + '</a>';
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.kills;
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.deaths;
            table_body += '</td>';
            table_body += '<td>';
            table_body += kdRatio;
            table_body += '</td>';
            table_body += '<td>';
            table_body += level;
            table_body += '</td>';
            table_body += '<td style="text-align: center;">';
            table_body += asignarMedalla(level, 30);
            if (player.fields.isVIP)
                table_body += '<img title="VIP member" alt="VIP member" class="link-icon" width="24px" height="24px" src="./theme/images/icons/VIP.png"/>';
            table_body += '</td>';
            table_body += '</tr>';
            counter++;
        })
        table_body += '</tbody></table>'

        $('.level-table').html(table_body);
    };

//TABLE CREATION
    function createRatioTable(levelData) {
        var table_body = '<table border="1"><thead><tr><th>Gametag</th><th>Kills</th><th>Deaths</th><th>K/D Ratio</th><th>Level</th><th>Medal</th></tr></thead><tbody>';
        $.each(levelData, function(i, player) {
            let kdRatio = parseFloat(player.fields.kills / player.fields.deaths).toFixed(2),
                multiplier = parseFloat(player.fields.kills * kdRatio).toFixed(0),
                level = Math.round(multiplier/1000).toFixed(0);
            table_body += '<tr>';
            table_body += '<td>';
            table_body += '<a href="profile.html?id=' + player.pk + '">' + player.fields.name + '</a>';
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.kills;
            table_body += '</td>';
            table_body += '<td>';
            table_body += player.fields.deaths;
            table_body += '</td>';
            table_body += '<td>';
            table_body += kdRatio;
            table_body += '</td>';
            table_body += '<td>';
            table_body += level;
            table_body += '</td>';
            table_body += '<td style="text-align: center;">';
            table_body += asignarMedalla(level, 30);
            if (player.fields.isVIP)
                table_body += '<img title="VIP member" alt="VIP member" class="link-icon" width="24px" height="24px" src="./theme/images/icons/VIP.png"/>';
            table_body += '</td>';
            table_body += '</tr>';
            if (i == 50)
                return false;
        })
        table_body += '</tbody></table>'

        $('.ratio-table').html(table_body);
    };

    function createSpreeTable(spreeData) {
        var table_body = '<table border="1"><thead><tr><th>Gametag</th><th>BestSpree</th><th>Map</th><th>Variant</th></tr></thead><tbody>';
        $.each(spreeData, function(i, player) {
            table_body += '<tr>';
            table_body += '<td>';
            table_body += '<a href="profile.html?id=' + player.pk + '">' + player.fields.name + '</a>';
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
                    table_body += '<img title="Verified member" alt="Verified member" class="link-icon" width="24px" height="24px" src="./theme/images/icons/verified.png"/>';
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
                    table_body += '<img title="Verified member" alt="Verified member" class="link-icon" width="24px" height="24px" src="./theme/images/icons/verified.png"/>';
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
        var table_body = '<table border="1"><thead><tr><th>Gametag</th><th>Kills</th><th>Assists</th><th>Deaths</th><th>K/D Ratio</th><th>Medal</th><th>Best Spree</th><th>Map</th><th>Game Type</th><th>Variant</th><th>Date</th></tr></thead><tbody>';
        $.each(activityData, function(i, player) {
            let kdRatio = parseFloat(player.fields.kills / player.fields.deaths).toFixed(2),
                multiplier = parseFloat(player.fields.kills * kdRatio).toFixed(0),
                level = Math.round(multiplier/1000).toFixed(0);
            table_body += '<tr>';
            table_body += '<td>';
            table_body += '<a href="profile.html?id=' + player.pk + '">' + player.fields.name + '</a>';
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
            table_body += kdRatio;
            table_body += '</td>';
            table_body += '<td style="text-align: center;">';
            table_body += asignarMedalla(level, 30);
            if (player.fields.isVIP)
                table_body += '<img title="VIP member" alt="VIP member" class="link-icon" width="24px" height="24px" src="./theme/images/icons/VIP.png"/>';
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

    function getMOTD(){

        // MOTD
        $.getJSON(getMOTDapi)
            .done(function(data){
                data = JSON.parse(data);
                let last = data.sort(function(a, b) {
                    return new Date(a.fields.creation_date).getTime() - new Date(b.fields.creation_date).getTime();
                });
                $.each(last, function(i, motd) {
                    $('#motd').html('<b>' + motd.fields.title + ':</b> ' + motd.fields.message + '<p style="font-size: 10px;">' + new Date(motd.fields.creation_date).toLocaleString() + '<p/>');
                });
            })
            .fail(function(data){
            });
    }

    function asignarMedalla(level, size){
        //TODO: Refacto to make it dynamic
        // I'll refactor this I swear
        let returnMedal = 'noLevel';
        // 1 to 10
        if(level && (level > 0 && level < 3))
            returnMedal = '<img title="Category 1 WOOD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 1.1.png"/>';
        if(level && (level > 2 && level < 5))
            returnMedal = '<img title="Category 1 BRONZE medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 1.2.png"/>';
        if(level && (level > 4 && level < 7))
            returnMedal = '<img title="Category 1 SILVER medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 1.3.png"/>';
        if(level && (level > 6 && level < 9))
            returnMedal = '<img title="Category 1 GOLD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 1.4.png"/>';
        if(level && (level > 8 && level < 11))
            returnMedal = '<img title="Category 1 DIAMOND medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 1.5.png"/>';

        // 10 to 20
        if(level && (level > 10 && level < 13))
            returnMedal = '<img title="Category 2 WOOD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 2.1.png"/>';
        if(level && (level > 12 && level < 15))
            returnMedal = '<img title="Category 2 BRONZE medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 2.2.png"/>';
        if(level && (level > 14 && level < 17))
            returnMedal = '<img title="Category 2 SILVER medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 2.3.png"/>';
        if(level && (level > 16 && level < 19))
            returnMedal = '<img title="Category 2 GOLD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 2.4.png"/>';
        if(level && (level > 18 && level < 21))
            returnMedal = '<img title="Category 2 DIAMOND medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 2.5.png"/>';

        // 20 to 30
        if(level && (level > 20 && level < 23))
            returnMedal = '<img title="Category 3 WOOD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 3.1.png"/>';
        if(level && (level > 22 && level < 25))
            returnMedal = '<img title="Category 3 BRONZE medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 3.2.png"/>';
        if(level && (level > 24 && level < 27))
            returnMedal = '<img title="Category 3 SILVER medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 3.3.png"/>';
        if(level && (level > 26 && level < 29))
            returnMedal = '<img title="Category 3 GOLD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 3.4.png"/>';
        if(level && (level > 28 && level < 31))
            returnMedal = '<img title="Category 3 DIAMOND medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 3.5.png"/>';


        // 30
        if(level && (level > 30 && level < 33))
            returnMedal = '<img title="Category 4 WOOD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 4.1.png"/>';
        if(level && (level > 32 && level < 35))
            returnMedal = '<img title="Category 4 BRONZE medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 4.2.png"/>';
        if(level && (level > 34 && level < 37))
            returnMedal = '<img title="Category 4 SILVER medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 4.3.png"/>';
        if(level && (level > 36 && level < 39))
            returnMedal = '<img title="Category 4 GOLD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 4.4.png"/>';
        if(level && (level > 38 && level < 41))
            returnMedal = '<img title="Category 4 DIAMOND medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 4.5.png"/>';


        // 40
        if(level && (level > 40 && level < 43))
            returnMedal = '<img title="Category 5 WOOD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 5.1.png"/>';
        if(level && (level > 42 && level < 45))
            returnMedal = '<img title="Category 5 BRONZE medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 5.2.png"/>';
        if(level && (level > 44 && level < 47))
            returnMedal = '<img title="Category 5 SILVER medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 5.3.png"/>';
        if(level && (level > 46 && level < 49))
            returnMedal = '<img title="Category 5 GOLD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 5.4.png"/>';
        if(level && (level > 48 && level < 51))
            returnMedal = '<img title="Category 5 DIAMOND medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 5.5.png"/>';


        // 50
        if(level && (level > 50 && level < 53))
            returnMedal = '<img title="Category 6 WOOD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 6.1.png"/>';
        if(level && (level > 52 && level < 55))
            returnMedal = '<img title="Category 6 BRONZE medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 6.2.png"/>';
        if(level && (level > 54 && level < 57))
            returnMedal = '<img title="Category 6 SILVER medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 6.3.png"/>';
        if(level && (level > 56 && level < 59))
            returnMedal = '<img title="Category 6 GOLD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 6.4.png"/>';
        if(level && (level > 58 && level < 61))
            returnMedal = '<img title="Category 6 DIAMOND medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 6.5.png"/>';

        // 60
        if(level && (level > 60 && level < 63))
            returnMedal = '<img title="Category 7 WOOD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 7.1.png"/>';
        if(level && (level > 62 && level < 65))
            returnMedal = '<img title="Category 7 BRONZE medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 7.2.png"/>';
        if(level && (level > 64 && level < 67))
            returnMedal = '<img title="Category 7 SILVER medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 7.3.png"/>';
        if(level && (level > 66 && level < 69))
            returnMedal = '<img title="Category 7 GOLD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 7.4.png"/>';
        if(level && (level > 68 && level < 71))
            returnMedal = '<img title="Category 7 DIAMOND medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 7.5.png"/>';

        // 70
        if(level && (level > 70 && level < 73))
            returnMedal = '<img title="Category 8 WOOD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 8.1.png"/>';
        if(level && (level > 72 && level < 75))
            returnMedal = '<img title="Category 8 BRONZE medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 8.2.png"/>';
        if(level && (level > 74 && level < 77))
            returnMedal = '<img title="Category 8 SILVER medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 8.3.png"/>';
        if(level && (level > 76 && level < 79))
            returnMedal = '<img title="Category 8 GOLD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 8.4.png"/>';
        if(level && (level > 78 && level < 81))
            returnMedal = '<img title="Category 8 DIAMOND medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 8.5.png"/>';

        // 80
        if(level && (level > 80 && level < 83))
            returnMedal = '<img title="Category 9 WOOD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 9.1.png"/>';
        if(level && (level > 82 && level < 85))
            returnMedal = '<img title="Category 9 BRONZE medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 9.2.png"/>';
        if(level && (level > 84 && level < 87))
            returnMedal = '<img title="Category 9 SILVER medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 9.3.png"/>';
        if(level && (level > 86 && level < 89))
            returnMedal = '<img title="Category 9 GOLD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 9.4.png"/>';
        if(level && (level > 88 && level < 91))
            returnMedal = '<img title="Category 9 DIAMOND medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level 9.5.png"/>';

        // 90
        if(level && (level > 90 && level < 93))
            returnMedal = '<img title="Category SemiPRO WOOD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level SemiPro.1.png"/>';
        if(level && (level > 92 && level < 95))
            returnMedal = '<img title="Category SemiPRO BRONZE medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level SemiPro.2.png"/>';
        if(level && (level > 94 && level < 97))
            returnMedal = '<img title="Category SemiPRO SILVER medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level SemiPro.3.png"/>';
        if(level && (level > 96 && level < 99))
            returnMedal = '<img title="Category SemiPRO GOLD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level SemiPro.4.png"/>';
        if(level && (level > 98 && level < 101))
            returnMedal = '<img title="Category SemiPRO DIAMOND medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level SemiPro.5.png"/>';


        // 100
        if(level && (level > 100 && level < 103))
            returnMedal = '<img title="Category PRO WOOD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level Pro.1.png"/>';
        if(level && (level > 102 && level < 105))
            returnMedal = '<img title="Category PRO BRONZE medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level Pro.2.png"/>';
        if(level && (level > 104 && level < 107))
            returnMedal = '<img title="Category PRO SILVER medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level Pro.3.png"/>';
        if(level && (level > 106 && level < 109))
            returnMedal = '<img title="Category PRO GOLD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level Pro.4.png"/>';
        if(level && (level > 108 && level < 111))
            returnMedal = '<img title="Category PRO DIAMOND medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level Pro.5.png"/>';


        // 110
        if(level && (level > 110 && level < 113))
            returnMedal = '<img title="Category SuperPRO WOOD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level SuperPro.1.png"/>';
        if(level && (level > 112 && level < 115))
            returnMedal = '<img title="Category SuperPRO BRONZE medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level SuperPro.2.png"/>';
        if(level && (level > 114 && level < 117))
            returnMedal = '<img title="Category SuperPRO SILVER medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level SuperPro.3.png"/>';
        if(level && (level > 116 && level < 119))
            returnMedal = '<img title="Category SuperPRO GOLD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level SuperPro.4.png"/>';
        if(level && (level > 118 && level < 121))
            returnMedal = '<img title="Category SuperPRO DIAMOND medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level SuperPro.5.png"/>';

        // 120
        if(level && (level > 120 && level < 123))
            returnMedal = '<img title="Category UltraPRO WOOD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level UltraPro.1.png"/>';
        if(level && (level > 122 && level < 125))
            returnMedal = '<img title="Category UltraPRO BRONZE medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level UltraPro.2.png"/>';
        if(level && (level > 124 && level < 127))
            returnMedal = '<img title="Category UltraPRO SILVER medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level UltraPro.3.png"/>';
        if(level && (level > 126 && level < 129))
            returnMedal = '<img title="Category UltraPRO GOLD medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level UltraPro.4.png"/>';
        if(level && (level > 128 && level < 131))
            returnMedal = '<img title="Category UltraPRO DIAMOND medal!" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/Level UltraPro.5.png"/>';


        return returnMedal;//'<img title="Category ' + level + ' medal" class="link-icon" width="' + size + 'px" height="' + size + 'px" src="./theme/images/medals/' + medalal + '.png"/>';
    }

});
