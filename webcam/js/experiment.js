// Normalize getUserMedia and URL
// https://gist.github.com/f2ac64ed7fc467ccdfe3

//normalize window.URL
window.URL || (window.URL = window.webkitURL || window.msURL || window.oURL);

//normalize navigator.getUserMedia
navigator.getUserMedia || (navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

if (typeof navigator.getUserMedia === "function") {

    (function() {

        var video = document.createElement('video'),
            content = document.querySelector('.transforming-content'),
            canvas = document.querySelector('canvas'),
            context = canvas.getContext('2d'),
            mask = new Image(),
            originalFace,

            // Quick hack for two experiment types
            SCALE_EXPERIMENT = 'scale',
            MASK_EXPERIMENT = 'mask',
            experimentType = /mask/.test(canvas.className) ? MASK_EXPERIMENT : SCALE_EXPERIMENT,

            // toString for older gUM implementation, see comments on https://gist.github.com/f2ac64ed7fc467ccdfe3
            gUMOptions = {video: true, toString: function(){ return "video"; }};

        video.setAttribute('autoplay', true);
        mask.src = "img/mask.png";
        context.fillStyle = "rgba(0, 0, 200, 0.5)";
        navigator.getUserMedia(gUMOptions, handleWebcamStream, errorStartingStream);

        function handleWebcamStream(stream) {

            video.src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream) : stream;
            processWebcamVideo();
        }

        function errorStartingStream() {
            alert('Uh-oh, the webcam didn\'t start. Do you have a webcam? Did you give it permission? Refresh to try again.');
        }

        function processWebcamVideo() {

            var startTime = +new Date(),
                changed = false,
                scaleFactor = 1,
                faces;

            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            faces = detectFaces();

            if(experimentType === MASK_EXPERIMENT) {
                drawMasks(faces);
            } else {
                highlightFaces(faces);

                if(originalFace && faces.length > 0) {
                    scaleContent(faces[0]);
                }

                if( ! originalFace && faces.length === 1) {
                    originalFace = faces[0];
                }
            }

            // Log process time
            // console.log(+new Date() - startTime);

            // And repeat.
            setTimeout(processWebcamVideo, 50);
        }

        function detectFaces() {
            // What do these parameters mean?
            // I couldn't find any documentation, and used what was found here:
            // https://github.com/liuliu/ccv/blob/unstable/js/index.html

            return ccv.detect_objects({canvas : (ccv.pre(canvas)), cascade: cascade, interval: 2, min_neighbors: 1});
        }

        // Draw found faces onto the canvas
        function highlightFaces(faces) {
            if(!faces) {
                return false;
            }

            for (var i = 0; i < faces.length; i++) {
                var face = faces[i];
                context.fillRect(face.x, face.y, face.width, face.height);
            }
        }

        function drawMasks(faces) {
            if(!faces) {
                return false;
            }

            for (var i = 0; i < faces.length; i++) {
                var face = faces[i];
                context.drawImage(mask, face.x * 0.9, face.y * 0.9, face.width * 1.3, face.height * 1.3);
            }
        }

        function scaleContent(newFace) {
            var scaleFactor = originalFace.height / newFace.height;
            content.style.setProperty('-o-transform', 'scale('+scaleFactor+')');
            content.style.setProperty('-webkit-transform', 'scale('+scaleFactor+')');
        }

        /* Face object example:
        {
            confidence: 0.16752329000000035,
            height: 48.500000000000014,
            neighbors: 1,
            width: 48.500000000000014,
            x: 80.50000000000001,
            y: 104.50000000000003
        }
        */

    })();
}
