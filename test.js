
        var locs = [];
        $(function() { 
            postActionBatch($("table[id='report_list']").find("input[type=checkbox]"), 0);
        });
        
        function report(doc, cbox, url, fhBoxes, index, locs) {
            var delim = '-';
            var lang = 'en';
            var svr = '80';
            var subject = $(".quickedit-label").text();

            

            $(".grey", doc).each(function () { $(this).remove() });
            var time = $("td:contains('Battle time')", doc).last().next().text().trim();
            var attacker = $("th:contains('Attacker:')", doc).next().text().replace(/-/g, 'QX');
            var origin = $("td:contains('Origin:')", doc).next().find('a').text().replace(/-/g, 'QX').replace(/#/g, 'QP');
            var originHref = $("td:contains('Origin:')", doc).next().find('a').attr('href');
            var defender = $("th:contains('Defender:')", doc).next().text().replace(/-/g, 'QX');
            var defenderhref = $("th:contains('Defender:')", doc).next().find('a').attr('href');
            var destination = $("td:contains('Destination:')", doc).next().find('a').text().replace(/-/g, 'QX').replace(/#/g, 'QP');
            var destinationHref = $("td:contains('Destination:')", doc).next().find('a').attr('href');
            var espionage = $("table[id='attack_spy_resources']", doc);
            var buildingsLeft = $("table[id='attack_spy_buildings_left']", doc);
            var buildingsRight = $("table[id='attack_spy_buildings_right']", doc);
            var haul = $("th:contains('Haul:')", doc).next();
            alert(haul.innerHTML);
            var capacity = $(haul).next();
            var forwarded = $("td:contains('Forwarded by:')", doc);
            var spiked = $("p:contains('None of your troops have returned')", doc).length;

            var battleStrength = $("td:contains('Battle strength:')", doc);
            if (battleStrength.length > 0) {
                var rx = /Battle strength:\s*(\d+)%/i;
                var match = rx.exec($(battleStrength).text());
                if (typeof (match) != 'undefined')
                    battleStrength = match[1];
                else
                    battleStrength = 100;
            }
            else
                battleStrength = 100;

            var report = new Array();
            report.push('report' + delim + lang + delim + svr + delim + time);

            if ($(forwarded).length > 0)
                report.push(1);
            else
                report.push(0);

            var href = getUrlVars(url);
            report.push(href['view']);

            report.push(attacker);
            report.push(origin);
            
            href = getUrlVars(originHref);
            report.push(href['id']);

            report.push(defender);
            if (typeof (defenderhref) != 'undefined') {
                href = getUrlVars(defenderhref);
                report.push(href['id']);
            }
            else
                report.push("0");

            report.push(destination);
            if (typeof (destinationHref) != 'undefined') {
                href = getUrlVars(destinationHref);
                report.push(href['id']);
            }
            else
                report.push("0");

            if (haul.length > 0) {
                var arr = haul.text().trim().replace(/\./g, "").split("  ");
                if (arr.length == 3) {
                    report.push('h=wood|' + arr[0].trim());
                    report.push('h=clay|' + arr[1].trim());
                    report.push('h=iron|' + arr[2].trim());
                }
                else if (arr.length < 0) {
                    var bWood = false;
                    var bStone = false;
                    var bIron = false;
                    var html = haul.html();

                    for (var i = 0; i < arr.length; i++) {
                        if (html.indexOf('wood') > 0) {
                            html = html.replace(/wood/gi, '');
                            report.push('h=wood|' + arr[i].trim());
                            bWood = true;
                        }
                        else if (html.indexOf('stone') > 0) {
                            html = html.replace(/stone/gi, '');
                            report.push('h=stone|' + arr[i].trim());
                            bStone = true;
                        }
                        else if (html.indexOf('iron') > 0) {
                            html = html.replace(/iron/gi, '');
                            report.push('h=iron|' + arr[i].trim());
                            bIron = true;
                        }
                    }

                    if (!bWood)
                        report.push('h=wood|0');
                    if (!bStone)
                        report.push('h=stone|0');
                    if (!bIron) {
                        report.push('h=iron|0');
                    }
                }
            }

            if (espionage.length > 0) {
                var arr = $(espionage).find('td').text().trim().replace(/\./g, "").split("  ");
                if (arr.length == 3) {
                    report.push('e=wood|' + arr[0].trim());
                    report.push('e=clay|' + arr[1].trim());
                    report.push('e=iron|' + arr[2].trim());
                }
                else {
                    var bWood = false;
                    var bStone = false;
                    var bIron = false;
                    var html = $(espionage).find('td').html();
                    for (var i = 0; i < arr.length; i++) {
                        if (html.indexOf('wood') > 0) {
                            html = html.replace(/wood/gi, '');
                            report.push('e=wood|' + arr[i].trim());
                            bWood = true;
                        }
                        else if (html.indexOf('stone') > 0) {
                            html = html.replace(/stone/gi, '');
                            report.push('e=stone|' + arr[i].trim());
                            bStone = true;
                        }
                        else if (html.indexOf('iron') > 0) {
                            html = html.replace(/iron/gi, '');
                            report.push('e=iron|' + arr[i].trim());
                            bIron = true;
                        }
                    }

                    if (!bWood)
                        report.push('rs=wood|0');
                    if (!bStone)
                        report.push('rs=stone|0');
                    if (!bIron)
                        report.push('rs=iron|0');
                }
            }

            if (capacity.length > 0) {
                if (capacity.text().indexOf('/') > 0) {
                    report.push("f=" + $(capacity).text());
                } 
            }

            if (buildingsLeft.length > 0) {
                $(buildingsLeft).find("tr:has(td)").each(function () {
                    var b = $(this).find('td').eq(0).text().trim();
                    var l = $(this).find('td').eq(1).text().trim();
                    if (b != '' && l != '')
                        report.push('b=' + b + '|' + l);
                });
            }

            if (buildingsRight.length > 0) {
                $(buildingsRight).find("tr:has(td)").each(function () {
                    var b = $(this).find('td').eq(0).text().trim();
                    var l = $(this).find('td').eq(1).text().trim();
                    if (b != '' && l != '')
                        report.push('b=' + b + '|' + l);
                });
            }

            report.push('s=' + battleStrength);
            report.push('x=' + spiked);
            report.push('c=' + cbox);

            var data = report.join(delim);
            $.getScript('http://twfarmhand.net/Rpc.aspx?id=cd871c858d9443288eb32f5ac457d7b4&d=' + data, function() { postActionBatch(fhBoxes, index); });
        } /* end q() */

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

        function postActionBatch(fhBoxes, index) {
            if (fhBoxes.length >= index) {
                var cb = fhBoxes[index];
                index++;

                var name = $(cb).attr('name');
                if (name.indexOf('id') == 0) {
                    var a = $(cb).parent().parent().find('a[href*=view]');
                    var rx = /\d\d\d.\d\d\d/
                    var m = $(a).text().match(rx);

                    var bFound = false;
                    for (var l in locs) {
                        if (locs[l] == m[0])
                            bFound = true;
                    }

                    if (!bFound) {
                        locs.push(m[0]);
                        $.get($(a).attr("href"), function (data) {
                            var html = $.parseHTML(data);
                            var dom = $("<div></div>").append(html);
                            report(dom, name, $(a).attr("href"), fhBoxes, index);
                        });
                    }
                    else {
                        $(cb).prop('checked', true);
                        postActionBatch(fhBoxes, index);
                    }
                }
            }
        }
        
