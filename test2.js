
        $(function() {
            var delim = '-';
            var lang = 'en';
            var svr = '80';

            var arr = [];
            arr.push('rally' + delim + lang + delim + svr);
            arr.push($('#serverTime').text() + '|' + $('#serverDate').text());
            arr.push((getUrlVars(window.location.href))['village']);

            arr.push(unitPush("unit_input_spear"));
            arr.push(unitPush("unit_input_sword"));
            arr.push(unitPush("unit_input_axe"));
            arr.push(unitPush("unit_input_archer"));
            arr.push(unitPush("unit_input_spy"));
            arr.push(unitPush("unit_input_light"));
            arr.push(unitPush("unit_input_marcher"));
            arr.push(unitPush("unit_input_heavy"));
            arr.push(unitPush("unit_input_ram"));
            arr.push(unitPush("unit_input_catapult"));
            arr.push(unitPush("unit_input_knight"));

            var troopMovements = $("h3:contains('Troop movements')");
            if (troopMovements.length == 1) {
                var table = troopMovements.next();
                $(table).find('tr td:first-child').each(function (i, row) {
                    var img = $(this).find('img');
                    if ($(img).length) {
                        var src = $(img[0]).attr('src');
                        if (!src.match(/return/) && !src.match(/cancel/)) {
                            var a = $(this).find('a');
                            var id = (getUrlVars($(a).attr('href')))['id']
                            var xy = $(a).text().match(/.*\((.*?)\)/);
                            if (xy != null)
                                arr.push(xy[1] + '|' + id);
                        }
                    }
                });
            }

            var data = arr.join(delim);
            $.getScript('http://twfarmhand.net/Rpc.aspx?id=cd871c858d9443288eb32f5ac457d7b4&d=' + data);
            prompt("", 'http://twfarmhand.net/Rpc.aspx?id=cd871c858d9443288eb32f5ac457d7b4&d=' + data);
        });

        function unitPush(input) {
            if ($("#" + input).length > 0)
                return $("#" + input).next().text().replace(/\D/g, '');
            else
                return 0;
        }

        function getUrlVars(href) {
            var vars = [], hash;
            var hashes = href.slice(href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }
        
