     // #########################################
     // CUSTOM JS
     // #########################################

     (function (l) {
        'use strict';
        l(['jquery'], function ($) {
            var k = $.scrollTo = function (a, b, c) {
                return $(window).scrollTo(a, b, c);
            };
            k.defaults = {
                axis: 'xy',
                duration: 0,
                limit: true
            };

            function isWin(a) {
                return !a.nodeName || $.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) !== -1;
            }
            $.fn.scrollTo = function (f, g, h) {
                if (typeof g === 'object') {
                    h = g;
                    g = 0;
                }
                if (typeof h === 'function') {
                    h = {
                        onAfter: h
                    };
                }
                if (f === 'max') {
                    f = 9e9;
                }
                h = $.extend({}, k.defaults, h);
                g = g || h.duration;
                var j = h.queue && h.axis.length > 1;
                if (j) {
                    g /= 2;
                }
                h.offset = both(h.offset);
                h.over = both(h.over);
                return this.each(function () {
                    if (f === null) return;
                    var d = isWin(this),
                        elem = d ? this.contentWindow || window : this,
                        $elem = $(elem),
                        targ = f,
                        attr = {},
                        toff;
                    switch (typeof targ) {
                        case 'number':
                        case 'string':
                            if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
                                targ = both(targ);
                                break;
                            }
                            targ = d ? $(targ) : $(targ, elem);
                            if (!targ.length) return;
                        case 'object':
                            if (targ.is || targ.style) {
                                toff = (targ = $(targ)).offset();
                            }
                    }
                    var e = $.isFunction(h.offset) && h.offset(elem, targ) || h.offset;
                    $.each(h.axis.split(''), function (i, a) {
                        var b = a === 'x' ? 'Left' : 'Top',
                            pos = b.toLowerCase(),
                            key = 'scroll' + b,
                            prev = $elem[key](),
                            max = k.max(elem, a);
                        if (toff) {
                            attr[key] = toff[pos] + (d ? 0 : prev - $elem.offset()[pos]);
                            if (h.margin) {
                                attr[key] -= parseInt(targ.css('margin' + b), 10) || 0;
                                attr[key] -= parseInt(targ.css('border' + b + 'Width'), 10) || 0;
                            }
                            attr[key] += e[pos] || 0;
                            if (h.over[pos]) {
                                attr[key] += targ[a === 'x' ? 'width' : 'height']() * h.over[pos];
                            }
                        } else {
                            var c = targ[pos];
                            attr[key] = c.slice && c.slice(-1) === '%' ? parseFloat(c) / 100 * max : c;
                        }
                        if (h.limit && /^\d+$/.test(attr[key])) {
                            attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
                        }
                        if (!i && h.axis.length > 1) {
                            if (prev === attr[key]) {
                                attr = {};
                            } else if (j) {
                                animate(h.onAfterFirst);
                                attr = {};
                            }
                        }
                    });
                    animate(h.onAfter);

                    function animate(a) {
                        var b = $.extend({}, h, {
                            queue: true,
                            duration: g,
                            complete: a && function () {
                                a.call(elem, targ, h);
                            }
                        });
                        $elem.animate(attr, b);
                    }
                });
            };
            k.max = function (a, b) {
                var c = b === 'x' ? 'Width' : 'Height',
                    scroll = 'scroll' + c;
                if (!isWin(a)) return a[scroll] - $(a)[c.toLowerCase()]();
                var d = 'client' + c,
                    doc = a.ownerDocument || a.document,
                    html = doc.documentElement,
                    body = doc.body;
                return Math.max(html[scroll], body[scroll]) - Math.min(html[d], body[d]);
            };

            function both(a) {
                return $.isFunction(a) || $.isPlainObject(a) ? a : {
                    top: a,
                    left: a
                };
            }
            $.Tween.propHooks.scrollLeft = $.Tween.propHooks.scrollTop = {
                get: function get(t) {
                    return $(t.elem)[t.prop]();
                },
                set: function set(t) {
                    var a = this.get(t);
                    if (t.options.interrupt && t._last && t._last !== a) {
                        return $(t.elem).stop();
                    }
                    var b = Math.round(t.now);
                    if (a !== b) {
                        $(t.elem)[t.prop](b);
                        t._last = this.get(t);
                    }
                }
            };
            return k;
        });
    })(typeof define === 'function' && define.amd ? define : function (a, b) {
        'use strict';
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = b(require('jquery'));
        } else {
            b(jQuery);
        }
    });

    var nextSlide = function nextSlide(el) {
        var marginHeight = jQuery('.top_margin').height();
        var nextSlide = jQuery(el).closest('.slide').next();
        // if (el === '.slide1') {
        //   jQuery('.first_name').html(userInfo.firstname);
        // }
        nextSlide.show();
        jQuery.scrollTo(nextSlide, 1000, {});
    };


    // Lets fill in the council data
    var all_councils;
    $.getJSON('council_data.json', function (data) {
        all_councils = data;
    });

    var all_messages = {
        checking: "Checking ....",
        invalid: "Not a valid postcode. Please enter a valid postcode",
        only_england: "Sorry, currently we only have data on Councils in\n" +
            "England. We hope to expand to cover councils in Scotland, Wales and Northern Ireland\n" +
            "soon!",
        no_data: "Sorry, we currently don't have any data about this postcode",
        found_council: "<p>Your local [council type] council is <strong>[council name]</strong>.</p>",
        council_type: "[council type]",
        council_name: "[council name]",
        champion_yes: "<p><i class='fas fa-check-circle'></i> Your council has a food poverty champion!</p>",
        champion_no: "<p><i class='fas fa-times-circle'></i> Your council does not have a food poverty champion.</p>",
        champion_dk: "<p><i class='fas fa-question-circle'></i> Your council hasn't provided data about having a food poverty champion.</p>",
        partnership_yes: "<p><i class='fas fa-check-circle'></i> Your council has a food partnership!</p>",
        partnership_no: "<p><i class='fas fa-times-circle'></i> Your council does not have a partnership.</p>",
        partnership_dk: "<p><i class='fas fa-question-circle'></i> Your council hasn't provided data about having a food partnership.</p>",
        write_to_leader: "<p class='wtl'>It looks like your council could take another step to food justice. Will you write to your council leader, [council leader title] [council leader first name] [council leader last name], now and ask them to take action?</p><p class='wtlLinkP'><button onclick='writeLeader();' class='btn btn-primary wtlLink'>Write to your council</button></p>",
        write_to_leader_dk: "<p class='wtl_dk'>Uh oh: it looks like your council hasn't made this information on their food poverty work public. Will you email them now and if they have a food champion and food partnership, and if not to set one up?</p> <p><button onclick='writeLeader();' class='btn btn-primary wtlLink'>Write to your council</button></p></div>",
        council_leader_title: "[council leader title]",
        council_leader_first: "[council leader first name]",
        council_leader_last: "[council leader last name]",
        council_leader_email: "[council leader email]",
        all_positive: '<p>Good news! Your local council is taking action on food poverty. Why not congratulate them on Twitter?</p><p><a href="https://twitter.com/[twitter handle]" class="btn btn-primary congratulate"><i class="fab fa-twitter"></i> Congratulate @[twitter handle]</a></p>'


    };

    var yn = "A customised message will be inserted here: in this case, based on Champion = Yes and Partnership = No";
    var ydk = "A customised message will be inserted here: in this case, based on Champion = Yes and Partnership = DK";
    var ny = "A customised message will be inserted here: in this case, based on Champion = No and Partnership = Yes";
    var ndk = "A customised message will be inserted here: in this case, based on Champion = No and Partnership = DK";
    var nn = "A customised message will be inserted here: in this case, based on Champion = No and Partnership = No";
    var dky = "A customised message will be inserted here: in this case, based on Champion = DK and Partnership = Yes";
    var dkn = "A customised message will be inserted here: in this case, based on Champion = DK and Partnership = No";
    var dkdk = "A customised message will be inserted here: in this case, based on Champion = DK and Partnership = DK";

    function writeLeader() {
        nextSlide('.slide2');
    };

    function checkPostocode() {
        //catch submitions of the form
        //console.log("we submited");

        new_postcode = $("#postcode").val()
        $(".address_zip input").val(new_postcode)

        if (new_postcode != '') {
            $("#message").html(all_messages.checking);
            $("#message_partnership").html("");
            $("#message_champion").html("");
            $("#message_result").html("");

            $.ajax({
                type: "POST",
                url: "https://mapit.mysociety.org/postcode/" + $("#postcode").val() +
                    "?api_key=iovwufdV5M81VSQT6QrP2XcZci7lGbW5qe8zFF3R",
                crossDomain: true,
                dataType: 'jsonp',
                success: function (result, status, xhr) {
                    //console.log(result);
                    // Clear out any existing results elements
                    // $("#map_container").html(
                    //     "<div id='map' style='width: 100%; height: 100vh;'></div>");

                    if (400 == result['code']) {
                        console.log("Not a valid postcode ")
                        $("#message").html(all_messages.invalid);
                    } else if (404 == result['code']) {
                        console.log("MapIt doesnt know about this postcode ")
                        $("#message").html(all_messages.no_data);
                    } else {
                        
                        district = result['shortcuts']['council']['district']
                        
       
                        if (district == undefined) {
                           council_shortcode = result['shortcuts']['council']
                        } else {
                           council_shortcode = result['shortcuts']['council']['county']
                        }
                        


                        // #########################################
                        // leaflet (map generation) code starts here
                        // #########################################

                        var map = new L.Map("map", {
                            scrollWheelZoom: false,
                            zoomControl: false,
                            dragging: false,
                            doubleClickZoom: false,
                            boxZoom: false
                        });

                        map.attributionControl.setPrefix('');

                        var point = new L.LatLng(result.wgs84_lat, result.wgs84_lon);
                        map.setView(point, 14);

                        var layers = {
                            osm: new L.TileLayer(
                                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                    attribution: 'Map © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                                    maxZoom: 14,
                                    minZoom: 4
                                }),
                            marker: new L.Marker(point)
                        };
                        map.addLayer(layers.marker);
                        map.addLayer(layers.osm);


                        var addArea = function addArea(map, layers, area_id) {
                            var data = {
                                simplify_tolerance: '0.0001'
                            };
                            var api_key = $(map.getContainer()).data('key');
                            if (api_key) {
                                data.api_key = api_key;
                            }
                            $.ajax({
                                dataType: 'json',
                                url: 'https://mapit.mysociety.org/area/' + area_id +
                                    '.geojson' +
                                    "?api_key=iovwufdV5M81VSQT6QrP2XcZci7lGbW5qe8zFF3R",
                                data: data
                            }).done(function (geojson) {
                                layers[area_id] = new L.GeoJSON(geojson, {
                                    style: {
                                        color: '#4FADED',
                                        weight: 3,
                                        opacity: 1
                                    }
                                });
                                map.addLayer(layers[area_id]);
                                map.fitBounds(layers[area_id].getBounds());

                            }).fail(function () {
                                // This might happen if the area has no polygons.
                                // (We try to exclude these using areasToIgnore, but some
                                // might slip through.) Seems silly to feed back the error
                                // to the user, so just deselect the button and move on.
                                $('[data-areaid="' + area_id + '"]').removeClass(
                                    'selected');

                            });
                        }

                        addArea(map, layers, council_shortcode);

                        // #########################################
                        // leaflet (map generation) code ends   here
                        // #########################################


                        // First lets check the country
                        country = result["areas"][council_shortcode]["country"]
                        if ("E" != country) {
                            $("#message").html(all_messages.only_england);
                        } else {
                            council = result["areas"][council_shortcode]["name"]
                            this_data = all_councils[council];
                            if (undefined == this_data) {
                                console.log(
                                    "We don't have data for this, even though it is a valid postcode"
                                )
                                $("#message_result").html(all_messages.no_data);
                            } else {

                               $('#postcode').attr('disabled','disabled');
                               $('#button').attr('disabled','disabled');

                                council_type = this_data["Council Type"];
                                council_name = council;

                                $("#message").html(all_messages.found_council.replace("[council type]",
                                    council_type).replace("[council name]", council));

                                $(".councilType").text(council_type);
                                $(".councilTypeInput input").val(council_type);

                                $(".councilName").text(council_name);
                                $(".councilNameInput input").val(council_name);


                                write_to_leader = false;
                                write_to_leader_dk = false;

                               has_partnership_result = "unknown";

                                has_partnership = this_data["Partnership"];
                                if ("y" == has_partnership) {
                                    $("#message_partnership").html(all_messages.partnership_yes);
                                    has_partnership_result = "y";
                                } else if ("n" == has_partnership) {
                                    $("#message_partnership").html(all_messages.partnership_no);
                                    write_to_leader = true;
                                    has_partnership_result = "n";
                                } else if ("dk" == has_partnership) {
                                    $("#message_partnership").html(all_messages.partnership_dk);
                                    write_to_leader = true;
                                    write_to_leader_dk = true;
                                    has_partnership_result = "dk";
                                }

                                has_champion = this_data["Lead Member"];
                                has_champion_result = "unknown";
                                if ("y" == has_champion) {
                                    $("#message_champion").html(all_messages.champion_yes);
                                    has_champion_result = "y";
                                } else if ("n" == has_champion) {
                                    $("#message_champion").html(all_messages.champion_no);
                                    write_to_leader = true;
                                    has_champion_result = "n";
                                } else if ("dk" == has_champion) {
                                    $("#message_champion").html(all_messages.champion_dk);
                                    write_to_leader = true;
                                    write_to_leader_dk = true;
                                    has_champion_result = "dk";
                                }

                                if (write_to_leader) {
                                    message_to_write = all_messages.write_to_leader;

                                    councilLeaderTitle = this_data["Leader Title"];
                                    councilLeaderFirst = this_data["Leader First Name"];
                                    councilLeaderLast = this_data["Leader Surname"];
                                    councilLeaderEmail = this_data["Leader Email Address"];

                                    message_to_write = message_to_write.replace(
                                        "[council leader title]", this_data["Leader Title"]);
                                    message_to_write = message_to_write.replace(
                                        "[council leader first name]", this_data[
                                            "Leader First Name"]);
                                    message_to_write = message_to_write.replace(
                                        "[council leader last name]", this_data["Leader Surname"]);
                                    message_to_write = message_to_write.replace(
                                        "[council leader email address]", this_data[
                                            "Leader Email Address"]);
                                    $("#message_result").html(message_to_write);

                                    $(".councilLeaderTitle").text(councilLeaderTitle);
                                    $(".councilLeaderTitleInput input").val(councilLeaderTitle);      
                                    
                                    $(".councilLeaderFirst").text(councilLeaderFirst);
                                    $(".councilLeaderNameInput .name_first input").val(councilLeaderFirst);   

                                    $(".councilLeaderLast").text(councilLeaderLast);
                                    $(".councilLeaderNameInput .name_last input").val(councilLeaderLast);   

                                    $(".councilLeaderEmail").text(councilLeaderEmail);
                                    $(".councilLeaderEmailInput input").val(councilLeaderEmail);
                                    
                                           if(has_champion_result === "y" && has_partnership_result=== "n") {
                                               $(".yourMessage textarea").val(yn);
                                           } else if (has_champion_result === "y" && has_partnership_result=== "dk") {
                                               $(".yourMessage textarea").val(ydk);
                                           } else if (has_champion_result === "n" && has_partnership_result=== "y") {
                                               $(".yourMessage textarea").val(ny);
                                           } else if (has_champion_result === "n" && has_partnership_result=== "dk") {
                                               $(".yourMessage textarea").val(ndk);
                                           } else if (has_champion_result === "n" && has_partnership_result=== "n") {
                                               $(".yourMessage textarea").val(nn);
                                           } else if (has_champion_result === "dk" && has_partnership_result=== "y") {
                                               $(".yourMessage textarea").val(dky);
                                           } else if (has_champion_result === "dk" && has_partnership_result=== "n") {
                                               $(".yourMessage textarea").val(dkn);
                                           } else if (has_champion_result === "dk" && has_partnership_result=== "dk") {
                                               $(".yourMessage textarea").val(dkdk);
                                           }
                                           
                                    

                                } else {
                                    message_to_write = all_messages.all_positive;
                                    message_to_write = message_to_write.replace(/\[twitter handle\]/g,
                                        this_data["Council Twitter"]);
                                    $("#message_result").html(message_to_write);
                                }
                            }
                        }
                    }
                },
                error: function (xhr, status, error) {
                    alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
                }
            });
        }
        nextSlide('.slide1');
    };
    jQuery("#gform_1").submit(function (event) {
        console.log("Is this working?")
        event.preventDefault(); //prevent default action
        document.domain = "foodjusticefinder.com";
        var post_url = jQuery(this).attr("action"); //get form action url
        var request_method = jQuery(this).attr("method"); //get form GET/POST method
        var form_data = jQuery(this).serialize(); //Encode form elements for submission
  
        jQuery.ajax({
          url: post_url,
          type: request_method,
          data: form_data
        });
     
 nextSlide('.slide3');
     });

     jQuery(".slideShare .btn-facebook").click(function (e) {
       jQuery(".slideShare .btn-skip").text("Next");
   });
   
   jQuery(".slideShare .btn-twitter").click(function (e) {
       jQuery(".slideShare .btn-skip").text("Next");
   });
   
   jQuery(".mpSkip").click(function (e) {
       nextSlide('.slide3');
   });
   
   jQuery(".slideShare .btn-skip").click(function (e) {
       nextSlide('.slide4');
   });

