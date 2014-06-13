/*
* MediqQueryListener proof of concept using CSS transitions by Paul Hayes
* November 5th 2011
*
* Based on the excellent matchMedia polyfill
* https://github.com/paulirish/matchMedia.js
*
* matchMedia() polyfill - test whether a CSS media type or media query applies
* authors: Scott Jehl, Paul Irish, Nicholas Zakas
* Copyright (c) 2011 Scott, Paul and Nicholas.
* Dual MIT/BSD license
*/

mql = (function(doc, undefined) {

    var bool,
        docElem = doc.documentElement,
        refNode = docElem.firstElementChild || docElem.firstChild,
        idCounter = 0;

    return function(q, cb) {

        var id = 'mql-' + idCounter++,
            callback = function() {
                // perform test and send results to callback
                cb({
                    matches: (div.offsetWidth == 42),
                    media: q
                });
            },
            div = doc.createElement('div');

        div.className = 'mq'; // mq class in CSS declares width: 0 and transition on width of duration 0.001ms
        div.style.cssText = "position:absolute;top:-100em";
        div.id = id;
        div.innerHTML = '&shy;<style media="' + q + '"> #' + id + ' { width: 42px; }</style>';

        // add transition event listeners
        div.addEventListener('webkitTransitionEnd', callback, false);
        div.addEventListener('transitionend', callback, false);       //Firefox
        div.addEventListener('oTransitionEnd', callback, false);      //Opera

        docElem.insertBefore(div, refNode);

        // original polyfill removes element, we need to keep element for transitions to continue and events to fire.

        return {
            matches: div.offsetWidth == 42,
            media: q
        };
    };

})(document);

$(function() {

    var $dynamic = $('.dynamic');

    // example usage
    mql('all and (max-width: 700px)', change);
    mql('all and (max-width: 500px)', change);
    mql('all and (min-width: 1200px)', change);

    function change(mql) {
        console.log(mql);
        $dynamic.prepend('<p>' + mql.media + ' &mdash; ' + mql.matches + '</p>');
    }

});
