$(function(){

    var el = document.createElement('div'),
        transformProps = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
        transformProp = support(transformProps);

    function support(props) {
        for(var i = 0, l = props.length; i < l; i++) {
            if(typeof el.style[props[i]] !== "undefined") {
                return props[i];
            }
        }
    }

    var $sphere = $('#sphere'),
        sphere = {
            rounds: 8,
            panels: 24,
            panelWidth: 100,
            el: $sphere.find('.container'),
            build: function(p, r) {

                var panels = p || this.panels,
                    rounds = r || this.rounds,
                    rotationPerPanel = 360/panels,
                    rotationPerRound = 360/2/rounds,
                    yRotation,
                    xRotation,
                    width = this.panelWidth,
                    zTranslate = (width/2) / Math.tan(rotationPerPanel * Math.PI/180),
                    $container = this.el,
                    $ul,
                    $li,
                    i, j;

                this.el.html('');
                for(i = 0; i < rounds; i++) {
                    $ul = $('<ul>');
                    xRotation = rotationPerRound * i;
                    $ul[0].style[transformProp] = "rotateX("+ xRotation + "deg)";
                    for(j = 0; j < panels; j++) {
                        $li = $('<li>');
                        yRotation = rotationPerPanel * j;
                        $li[0].style[transformProp] = "rotateY("+ yRotation +"deg) translateZ("+ zTranslate +"px)";
                        $ul.append($li);
                    }
                    $container.append($ul);
                }
            }
        },
        mouse = {
            start : {}
        },
        touch = document.ontouchmove !== undefined,
        viewport = {
            x: 0,
            y: 0,
            el: $('#sphere .container')[0],
            move: function(coords) {
                if(coords) {
                    if(typeof coords.x === "number") this.x = coords.x;
                    if(typeof coords.y === "number") this.y = coords.y;
                }
                this.el.style[transformProp] = "rotateX("+this.x+"deg) rotateY("+this.y+"deg)";
            },
            reset: function() {
                this.move({x: 0, y: 0});
            }
        };

    sphere.build();

    $(document).keydown(function(evt) {
        switch(evt.keyCode) {
            case 37: // left
                viewport.move({y: viewport.y - 90});
                break;

            case 38: // up
                evt.preventDefault();
                viewport.move({x: viewport.x + 90});
                break;

            case 39: // right
                viewport.move({y: viewport.y + 90});
                break;

            case 40: // down
                evt.preventDefault();
                viewport.move({x: viewport.x - 90});
                break;

            case 27: //esc
                viewport.reset();
                break;

            default:
                break;
        };
    }).bind('mousedown touchstart', function(evt) {
        delete mouse.last;

        evt.originalEvent.touches ? evt = evt.originalEvent.touches[0] : null;
        mouse.start.x = evt.pageX;
        mouse.start.y = evt.pageY;
        $(document).bind('mousemove touchmove', function(event) {
            // Only perform rotation if one touch or mouse (e.g. still scale with pinch and zoom)
            if(!touch || !(event.originalEvent && event.originalEvent.touches.length > 1)) {
                event.preventDefault();
                // Get touch co-ords
                event.originalEvent.touches ? event = event.originalEvent.touches[0] : null;
                $sphere.trigger('move-viewport', {x: event.pageX, y: event.pageY});
            }
        });

        $(document).bind('mouseup touchend', function () {
            $(document).unbind('mousemove touchmove');
        });
    });

    $sphere.bind('move-viewport', function(evt, movedMouse) {

        // Reduce movement on touch screens
        var movementScaleFactor = touch ? 4 : 1;

        if (!mouse.last) {
            mouse.last = mouse.start;
        } else {
            if (forward(mouse.start.x, mouse.last.x) != forward(mouse.last.x, movedMouse.x)) {
                mouse.start.x = mouse.last.x;
            }
            if (forward(mouse.start.y, mouse.last.y) != forward(mouse.last.y, movedMouse.y)) {
                mouse.start.y = mouse.last.y;
            }
        }

        viewport.move({
            x: viewport.x + parseInt((mouse.start.y - movedMouse.y)/movementScaleFactor),
            y: viewport.y - parseInt((mouse.start.x - movedMouse.x)/movementScaleFactor)
        });

        mouse.last.x = movedMouse.x;
        mouse.last.y = movedMouse.y;

        function forward(v1, v2) {
            return v1 >= v2;
        }
    });

    /* Change sphere style */
    $('#controls').bind('submit change', function(evt) {
        evt.preventDefault();
        $sphere.attr('class','').addClass($(evt.target).val());
    });
});
