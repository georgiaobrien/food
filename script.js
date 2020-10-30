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
         nextSlide.css('display', 'flex');
         jQuery.scrollTo(nextSlide, 1000, {});

     };




     // Lets fill in the council data
     var all_councils;
     $.getJSON('real_data.json', function (data) {
         all_councils = data;
     });

     var all_messages = {
         checking: "Checking ....",
         invalid: "Not a valid postcode. Please enter a valid postcode",
         only_england: "Sorry, currently we only have data on Councils in\n" +
             "England, Wales and Scotland. We hope to expand to cover Northern Ireland\n" +
             "soon!",
         no_data: "Sorry, we currently don't have any data about this postcode.",
         found_council: "<h2 class='high gw councilHeading'><span>Your local council is <strong>[council name]</strong>.</span></h2>",
         council_type: "[council type]",
         council_name: "[council name]",
         champion_yes: "<p><img src='images/Checked-black@4x.png' class='check'> Your council has a food champion</p>",
         champion_no: "<p><img src='images/Unchecked-black@4x.png' class='check'> Your council doesn't appear to have a food champion yet</p>",
         champion_dk: "<p><img src='images/Faded-black@4x.png' class='check'>  Your council has started the process of nominating a food champion</p>",
         partnership_yes: "<p><img src='images/Checked-black@4x.png' class='check'>  Your council works with a food partnership!</p>",
         partnership_no: "<p><img src='images/Unchecked-black@4x.png' class='check'> Your council doesn't appear to work with a food partnership yet</p>",
         partnership_dk: "<p><img src='images/Faded-black@4x.png' class='check'>  Your council has an emerging food partnership!</p>",
         write_to_leader: "<p class='wtl'><strong>It looks like your local council has the opportunity to take another step towards food justice.</strong> In these difficult times, overstretched councils need our ideas, inspiration and support more than ever. Will you write to your local council leader  [council leader title] [council leader first name] [council leader last name], and let them know about how Food Champions and Food Partnerships could support the work they're doing fighting food poverty?</p><p class='wtlLinkP'><button onclick='writeLeader();' class='btn btn-primary wtlLink'>Write to your council</button></p>",
         write_to_leader_dk: "<p class='wtl_dk'><strong>It looks like your council is taking action, but they haven't fully completed both steps yet.</strong> In these difficult times, overstretched councils need our ideas, inspiration and support more than ever. Will you write to your local council leader  [council leader title] [council leader first name] [council leader last name], and let them know that you support the steps they've taken so far and explain more about how Food Champions and Food Partnerships could support the work they're already doing fighting food poverty?</p><p class='wtlLinkP'><button onclick='writeLeader();' class='btn btn-primary wtlLink'>Write to your council</button></p>",
         council_leader_title: "[council leader title]",
         council_leader_first: "[council leader first name]",
         council_leader_last: "[council leader last name]",
         council_leader_email: "[council leader email]",
         e_positive: "<p>Good news! Your local council has already taken two important steps to food justice! <a href='https://twitter.com/intent/tweet?text=I%20used%20%23FoodJusticeFinder%20to%20see%20what%20action%20my%20local%20council%20has%20taken%20on%20food%20poverty%2C%20and%20I%27m%20proud%20that%20%40[twitter handle]%20have%20both%20a%20Food%20Champion%20and%20a%20Food%20Partnership.%20Find%20out%20more%20here%20%F0%9F%91%87&url=https%3A%2F%2Ffoodjusticefinder.com%3Futm_source%3Dtwitter%26utm_medium%3Dsocial%26utm_campaign%3Dfjf_cg_tw' onclick='javascript:window.open(this.href, &quot;&quot;, &quot;menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600&quot;);return false;'>Why not congratulate them on Twitter @[twitter handle]?</a></p><p>However, we all know there is still so much to do at a national level, and your council can help. Will you write to your local council leader  [council leader title] [council leader first name] [council leader last name], and ask for them to call on Westminster to adopt the three key recommendations in the Government-commissioned National Food Strategy?</p><p class='wtlLinkP'><button onclick='writeLeader();' class='btn btn-primary wtlLink'>Write to your council</button></p></div>",
         s_positive: "<p>Good news! Your local council has already taken two important steps to food justice! <a href='https://twitter.com/intent/tweet?text=I%20used%20%23FoodJusticeFinder%20to%20see%20what%20action%20my%20local%20council%20has%20taken%20on%20food%20poverty%2C%20and%20I%27m%20proud%20that%20%40[twitter handle]%20have%20both%20a%20Food%20Champion%20and%20a%20Food%20Partnership.%20Find%20out%20more%20here%20%F0%9F%91%87&url=https%3A%2F%2Ffoodjusticefinder.com%3Futm_source%3Dtwitter%26utm_medium%3Dsocial%26utm_campaign%3Dfjf_cg_tw' onclick='javascript:window.open(this.href, &quot;&quot;, &quot;menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600&quot;);return false;'>Why not congratulate them on Twitter @[twitter handle]?</a></p><p>However, we all know there is still so much to do at a national level, and your council can help. Will you write to your local council leader  [council leader title] [council leader first name] [council leader last name], and ask for them to support action in Holyrood to add a Right to Food into Scots Law?</p><p class='wtlLinkP'><button onclick='writeLeader();' class='btn btn-primary wtlLink'>Write to your council</button></p></div>",
         w_positive: "<p>Good news! Your local council has already taken two important steps to food justice! <a href='https://twitter.com/intent/tweet?text=I%20used%20%23FoodJusticeFinder%20to%20see%20what%20action%20my%20local%20council%20has%20taken%20on%20food%20poverty%2C%20and%20I%27m%20proud%20that%20%40[twitter handle]%20have%20both%20a%20Food%20Champion%20and%20a%20Food%20Partnership.%20Find%20out%20more%20here%20%F0%9F%91%87&url=https%3A%2F%2Ffoodjusticefinder.com%3Futm_source%3Dtwitter%26utm_medium%3Dsocial%26utm_campaign%3Dfjf_cg_tw' onclick='javascript:window.open(this.href, &quot;&quot;, &quot;menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600&quot;);return false;'>Why not congratulate them on Twitter @[twitter handle]?</a></p><p>However, we all know there is still so much to do at a national level, and your council can help. Will you write to your local council leader  [council leader title] [council leader first name] [council leader last name], and ask for them to support action in the Senedd to better measure food poverty in Wales by adding it to the National Milestones measured by the Welsh Government?</p><p class='wtlLinkP'><button onclick='writeLeader();' class='btn btn-primary wtlLink'>Write to your council</button></p></div>"


     };

     var yn = "The pandemic has brought the issue of food justice to the fore. Our communities’ responses have been a heartening example of co-operation in action. But what is troubling is the worst of the crisis is perhaps yet to come. As part of the co-operative movement, I am working with the Food Justice Finder campaign to bring about structural change to how we deal with food both nationally and locally. \n\nOn a local level, we know that areas which have a food champion and a food partnership are able to more effectively respond to local food issues – such as holiday hunger, child food poverty, access to affordable nutritious food or ability to prepare it – than those that do not. \n\nIt is great that you already have a food champion, but has your council considered going a step further and setting up a partnership to co-ordinate the work on food justice? Numerous councils from across the political spectrum are already working alongside the private, public and voluntary sectors in a food partnership, demonstrating that this approach cuts through party politics. If you need any help in putting this into action, then please contact the campaign at mail@foodjusticefinder.com.\n\nThank you very much for taking a stand against food poverty. I believe with local action, we truly can make a difference.";
     var ydk = "The pandemic has brought the issue of food justice to the fore. Our communities’ responses have been a heartening example of co-operation in action. But what is troubling is the worst of the crisis is perhaps yet to come. As part of the co-operative movement, I am working with the Food Justice Finder campaign to bring about structural change to how we deal with food both nationally and locally. \n\nOn a local level, we know that areas which have a food champion and a food partnership are able to more effectively respond to local food issues – such as holiday hunger, child food poverty, access to affordable nutritious food or ability to prepare it – than those that do not. \n\nIt is great that you already have a food champion, and I’m glad to hear there is an emerging food partnership. Food partnerships are brilliant ways for councils and the community to work together to fight food poverty, and it’s heartening to see councils from across the political spectrum putting them into action, demonstrating that this approach cuts through party politics. \n\nWhen the food partnership is fully in action, do let the campaign know at mail@foodjusticefinder.com so we can celebrate your good work. If you need any support with your emerging partnership, you can contact the campaign at the same address. Thank you very much for taking a stand against food poverty. I believe with local action, we truly can make a difference."; 
     var ny = "The pandemic has brought the issue of food justice to the fore. Our communities’ responses have been a heartening example of co-operation in action. But what is troubling is the worst of the crisis is perhaps yet to come. As part of the co-operative movement, I am working with the Food Justice Finder campaign to bring about structural change to how we deal with food both nationally and locally. \n\nOn a local level, we know that areas which have a food champion and a food partnership are able to more effectively respond to local food issues – such as holiday hunger, child food poverty, access to affordable nutritious food or ability to prepare it – than those that do not. \n\nIt is great that you already have a food partnership, but has your council considered appointing a single easily identifiable lead member for food act can act as a “food champion” to promote the work you are already doing? Having a food champion provides a point person who can draw together different work streams in a council, track progress and be a single point of contact for helpful external organisations like community kitchens or food banks. If you appoint a food champion, then please let the campaign know at mail@foodjusticefinder.com so we can celebrate your success!\n\nThank you very much for taking a stand against food poverty. I believe with local action, we truly can make a difference.";
     var ndk = "The pandemic has brought the issue of food justice to the fore. Our communities’ responses have been a heartening example of co-operation in action. But what is troubling is the worst of the crisis is perhaps yet to come. As part of the co-operative movement, I am working with the Food Justice Finder campaign to bring about structural change to how we deal with food both nationally and locally. \n\nOn a local level, we know that areas which have a food champion and a food partnership are able to more effectively respond to local food issues – such as holiday hunger, child food poverty, access to affordable nutritious food or ability to prepare it – than those that do not. \n\nIt is great to hear that there is an emerging food partnership in our area, and I’d encourage you to see it through to fruition as food partnerships are a brilliant way for councils and the community to work together to fight food poverty. When the food partnership is fully in action, do let the campaign know at mail@foodjusticefinder.com so we can celebrate your good work!\n\nSimilarly, has the council considered appointing a single easily identifiable lead member for food act can act as a “food champion” to promote the work you are already doing? Having a food champion provides a point person who can draw together different work streams in a council, track progress and be a single point of contact for helpful external organisations like community kitchens or food banks. Again, if you appoint a food champion, then please let the campaign know at mail@foodjusticefinder.com so we can celebrate your success!\n\nThank you very much for taking a stand against food poverty. I believe with local action, we truly can make a difference."; 
     var nn = "The pandemic has brought the issue of food justice to the fore. Our communities’ responses have been a heartening example of co-operation in action. But what is troubling is the worst of the crisis is perhaps yet to come. As part of the co-operative movement, I am working with the Food Justice Finder campaign to bring about structural change to how we deal with food both nationally and locally. \n\nOn a local level, we know that areas which have a food champion and a food partnership are able to more effectively respond to local food issues – such as holiday hunger, child food poverty, access to affordable nutritious food or ability to prepare it – than those that do not. \n\nI know that there is a huge amount that councils are already doing to tackle the challenge of food poverty, but has your council considered appointing a single easily identifiable lead member for food act can act as a “food champion” to promote your work? Having a food champion provides a point person who can draw together different work streams in a council, track progress and be a single point of contact for helpful external organisations like community kitchens or food banks.\n\nSimilarly, would you consider setting up a partnership to co-ordinate your work on food poverty? Numerous councils from across the political spectrum are already working alongside the private, public and voluntary sectors in a food partnership, demonstrating that this approach cuts through party politics.\n\nIf you need any questions about the process of setting up a food partnership or appointing a Food Champion, you can contact the campaign at mail@foodjusticefinder.com.\n\nThank you very much for taking a stand against food poverty. I believe with local action, we truly can make a difference."; 
     var dky = "The pandemic has brought the issue of food justice to the fore. Our communities’ responses have been a heartening example of co-operation in action. But what is troubling is the worst of the crisis is perhaps yet to come. As part of the co-operative movement, I am working with the Food Justice Finder campaign to bring about structural change to how we deal with food both nationally and locally. \n\nOn a local level, we know that areas which have a food champion and a food partnership are able to more effectively respond to local food issues – such as holiday hunger, child food poverty, access to affordable nutritious food or ability to prepare it – than those that do not. \n\nIt is great that you already have a food partnership, and I’m glad to hear you’ve taken steps to appointing a Food Champion as well. Having a Food Champion goes beyond just nominating a lead member for food: it’s about making sure that person is easily publicly identifiable so that helpful external organisations like community kitchens or food banks have a single point of contact, and that internally they become the point person who can draw together different work streams in a council and track progress. If there is someone at our council who fits that bill, let us know at mail@foodjusticefinder.com so we can celebrate your success!\n\nThank you very much for taking a stand against food poverty. I believe with local action, we truly can make a difference.";
     var dkn = "The pandemic has brought the issue of food justice to the fore. Our communities’ responses have been a heartening example of co-operation in action. But what is troubling is the worst of the crisis is perhaps yet to come. As part of the co-operative movement, I am working with the Food Justice Finder campaign to bring about structural change to how we deal with food both nationally and locally. \n\nOn a local level, we know that areas which have a food champion and a food partnership are able to more effectively respond to local food issues – such as holiday hunger, child food poverty, access to affordable nutritious food or ability to prepare it – than those that do not. \n\nI’m glad to hear you’ve taken steps to appointing a Food Champion. Having a Food Champion goes beyond just nominating a lead member for food: it’s about making sure that person is easily publicly identifiable so that helpful external organisations like community kitchens or food banks have a single point of contact, and that internally they become the point person who can draw together different work streams in a council and track progress. If there is someone at our council who fits that bill, let us know at mail@foodjusticefinder.com so we can celebrate your success!\n\nSimilarly, would you consider setting up a partnership to co-ordinate your work on food poverty? Numerous councils from across the political spectrum are already working alongside the private, public and voluntary sectors in a food partnership, demonstrating that this approach cuts through party politics.\n\nIf you need any questions about the process of setting up a food partnership or appointing a Food Champion, you can contact the campaign at mail@foodjusticefinder.com.\n\nThank you very much for taking a stand against food poverty. I believe with local action, we truly can make a difference."; 
     var dkdk ="The pandemic has brought the issue of food justice to the fore. Our communities’ responses have been a heartening example of co-operation in action. But what is troubling is the worst of the crisis is perhaps yet to come. As part of the co-operative movement, I am working with the Food Justice Finder campaign to bring about structural change to how we deal with food both nationally and locally. \n\nOn a local level, we know that areas which have a food champion and a food partnership are able to more effectively respond to local food issues – such as holiday hunger, child food poverty, access to affordable nutritious food or ability to prepare it – than those that do not. \n\nI know that there is a huge amount that councils are already doing to tackle the challenge of food poverty, and I’m glad to hear the council has taken steps both towards having a food champion and working with a food partnership. \n\nHaving a Food Champion goes beyond just nominating a lead member for food: it’s about making sure that person is easily publicly identifiable so that external organisations like community kitchens or food banks have a single point of contact, and that internally they become the point person who can draw together different work streams in a council and track progress. . If there is someone at our council who fits that bill, let us know at mail@foodjusticefinder.com so we can celebrate your success!\n\nAgain, it is great to hear that there is an emerging food partnership in our area, and I’d encourage you to see it through to fruition as food partnerships are a brilliant way for councils and the community to work together to fight food poverty. When the food partnership is fully in action, do let the campaign know at mail@foodjusticefinder.com so we can celebrate your good work!\n\nThank you very much for taking a stand against food poverty. I believe with local action, we truly can make a difference.";

     var englandEmail = "First, thank you so much for leading the way on food justice. It is great that our council has a food champion and is working with a food partnership.  We know that areas which have a food champion and a food partnership are able to more effectively respond to local food issues – such as holiday hunger, child food poverty, access to affordable nutritious food or ability to prepare it – than those that do not. \n\nWhilst councils are doing amazing work in very challenging circumstances, we know further national action is needed to support given the hardship families are facing because of Covid-19. \n\nWould your council consider supporting the three key recommendations in the Government-commissioned National Food Strategy and which Marcus Rashford’s Child Food Poverty Taskforce is calling for? In short these are: increasing the number of people eligible for free school meals, extending free school meals through the school holidays, and increasing the value of Healthy Start Vouchers, which provide fresh milk, fruit and veg to parents and pregnant women on low incomes. \n\nWe know that different councils will approach something like this in different ways. Some may wish to talk to their MPs and Ministers privately to encourage the Government, whilst others may wish to do so more publicly. Whichever method you choose to do, please consider it if you have not already done so. We know that councils making their voices heard, either publicly or privately, really makes a difference.";
     var scotlandEmail = "First, thank you so much for leading the way on food justice. It is great that our council has a food champion and is working with a food partnership.  We know that areas which have a food champion and a food partnership are able to more effectively respond to local food issues – such as holiday hunger, child food poverty, access to affordable nutritious food or ability to prepare it – than those that do not. It’s great to see our council has taken action on this important matter. \n\nHowever as you will undoubtably know, what we’re able to achieve locally is shaped by the national picture. In Scotland, one of the key issues in the fight against food poverty is enshrining a Right to Food in Scots Law. Some councils have already publicly called on their local MSPs to support this issue in Holyrood, so if you haven’t already, would you consider doing the same? Demonstrating public support for a Right to Food, at a time when so many are going hungry as a consequence of the pandemic, has never been more important."; 
     var walesEmail = "Thank you for leading the way on food justice. It is great that your council has a food champion and is working with a partnership; helping to take local action against food poverty. Councils are doing amazing work in very challenging circumstances, and we know that the support the Welsh Government has provided communities and councils has helped significantly. None of us could have foreseen the impact of Covid-19 on food poverty, and it is more important than ever that we have an effective way of measuring it nationally. \n\nThe co-operative movement, along with many others, think that the next iteration of national indicators or the new national milestones should measure food poverty. The Government’s own response in 2019 to the consultation on new Milestones acknowledged that food poverty was one of the very few issues which was repeatedly mentioned by those who responded. Would your council would consider encouraging the Welsh Government to adopt a measure of food poverty either as a milestone or as an indicator? \n\nWe know that different councils will approach something like this in different ways. Some may wish to talk to their Senedd Members and Ministers privately to encourage the Welsh Government to ensure the revised indicators and Milestones remains a live topic, whilst others may wish to do so more publicly. Whichever method you choose to do, please consider it if you have not already done so. We know that councils making their voices heard, either publicly or privately, really makes a difference.";
     

     function writeLeader() {
         nextSlide('.slide2');
     };

     var map = new L.Map("map", {
         scrollWheelZoom: false,
         zoomControl: false,
         dragging: false,
         doubleClickZoom: false,
         boxZoom: false
     });

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

                         // var map = new L.Map("map", {
                         //     scrollWheelZoom: false,
                         //     zoomControl: false,
                         //     dragging: false,
                         //     doubleClickZoom: false,
                         //     boxZoom: false
                         // });

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
                         if ("N" === country) {
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

                                 $('#postcode').attr('disabled', 'disabled');
                                 $('#button').attr('disabled', 'disabled');

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
                                 if ("Y" == has_partnership) {
                                     $("#message_partnership").html(all_messages.partnership_yes);
                                     has_partnership_result = "Y";
                                 } else if ("N" == has_partnership) {
                                     $("#message_partnership").html(all_messages.partnership_no);
                                     write_to_leader = true;
                                     has_partnership_result = "N";
                                 } else if ("DK" == has_partnership) {
                                     $("#message_partnership").html(all_messages.partnership_dk);
                                     write_to_leader = false;
                                     write_to_leader_dk = true;
                                     has_partnership_result = "DK";
                                 }

                                 has_champion = this_data["Lead Member"];
                                 has_champion_result = "unknown";
                                 if ("Y" == has_champion) {
                                     $("#message_champion").html(all_messages.champion_yes);
                                     has_champion_result = "Y";
                                 } else if ("N" == has_champion) {
                                     $("#message_champion").html(all_messages.champion_no);
                                     write_to_leader = true;
                                     has_champion_result = "N";
                                 } else if ("DK" == has_champion) {
                                     $("#message_champion").html(all_messages.champion_dk);
                                     write_to_leader = false;
                                     write_to_leader_dk = true;
                                     has_champion_result = "DK";
                                 }

                                 councilLeaderTitle = this_data["Leader Title"];
                                 councilLeaderFirst = this_data["Leader First Name"];
                                 councilLeaderLast = this_data["Leader Surname"];
                                 councilLeaderEmail = this_data["Leader Email Address"];

                                 $(".councilLeaderTitle").text(councilLeaderTitle);
                                 $(".councilLeaderTitleInput input").val(councilLeaderTitle);

                                 $(".councilLeaderFirst").text(councilLeaderFirst);
                                 $(".councilLeaderNameInput .name_first input").val(councilLeaderFirst);

                                 $(".councilLeaderLast").text(councilLeaderLast);
                                 $(".councilLeaderNameInput .name_last input").val(councilLeaderLast);

                                 $(".councilLeaderEmail").text(councilLeaderEmail);
                                 $(".councilLeaderEmailInput input").val(councilLeaderEmail);

                                 if (has_champion_result === "Y" && has_partnership_result === "N") {
                                     $(".yourMessage textarea").val(yn);
                                 } else if (has_champion_result === "Y" && has_partnership_result === "DK") {
                                     $(".yourMessage textarea").val(ydk);
                                 } else if (has_champion_result === "N" && has_partnership_result === "Y") {
                                     $(".yourMessage textarea").val(ny);
                                 } else if (has_champion_result === "N" && has_partnership_result === "DK") {
                                     $(".yourMessage textarea").val(ndk);
                                 } else if (has_champion_result === "N" && has_partnership_result === "N") {
                                     $(".yourMessage textarea").val(nn);
                                 } else if (has_champion_result === "DK" && has_partnership_result === "Y") {
                                     $(".yourMessage textarea").val(dky);
                                 } else if (has_champion_result === "DK" && has_partnership_result === "N") {
                                     $(".yourMessage textarea").val(dkn);
                                 } else if (has_champion_result === "DK" && has_partnership_result === "DK") {
                                     $(".yourMessage textarea").val(dkdk);
                                 } else if (has_champion_result === "Y" && has_partnership_result === "Y") {
                                     if ("S" === country) {
                                        $(".yourMessage textarea").val(scotlandEmail);
                                     } else if ("W" === country) {
                                        $(".yourMessage textarea").val(walesEmail);
                                     } else if ("E" === country) {
                                        $(".yourMessage textarea").val(englandEmail);
                                     }
                                 }


                                 if (write_to_leader == true & write_to_leader_dk == false) {

                                     message_to_write = all_messages.write_to_leader;

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

                            

                                 } else if (write_to_leader_dk == true) {

                                     message_to_write = all_messages.write_to_leader_dk;

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


                                 } else {

                                    if ("S" === country) {
                                        message_to_write = all_messages.s_positive;
                                    } else if ("W" === country) {
                                        message_to_write = all_messages.w_positive;
                                    } else if ("E" === country) {
                                        message_to_write = all_messages.e_positive;
                                    }

                                     
                                     message_to_write = message_to_write.replace(/\[twitter handle\]/g,
                                         this_data["Council Twitter"]);
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
         map.invalidateSize();
     };
     jQuery("#gform_1").submit(function (event) {
         console.log("Is this working?")
         event.preventDefault(); //prevent default action
         // document.domain = "foodjusticefinder.com";
         // var post_url = jQuery(this).attr("action"); //get form action url
         var post_url = "foodjusticefinder.com";
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

     $( "#slideReveal" ).click(function() {
        $('.explainerSlide').toggleClass('active');
      });

      $( "#boxReveal" ).click(function() {
        $('.explainer.mobile').toggleClass('active');
      });