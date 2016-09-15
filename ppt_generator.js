(function ($) {
    'use strict';

    window.PPT = {
        maxLineLength: 10,
        maxLines: 4,

        bgURL: 'slide.png',

        circles: [
            //first row
            {
                x: 58+7,
                y: 58+8,
                r: 58,
                text: 'REAÇÃO DE\n LULA'
            },
            {
                x: 58+7+(58*2)+6,
                y: 58+8,
                r: 58,
                text: 'DEPOI-\nMENTOS'
            },
            {
                x: 58+7+(58*2)+6+(58*2)+13,
                y: 58+8,
                r: 58,
                text: 'PETROLÃO\n+\nPROINO-\nCRACIA',
                wrapperClass: 'azul'
            },
            {
                x: 58+7+(58*2)+6+(58*2)+13+(58*2)+17,
                y: 58+4,
                r: 58,
                text: 'GOVER-\nNABILIDADE\nCORROM\n-PIDA'
            },
            {
                x: 58+7+(58*2)+6+(58*2)+13+(58*2)+17+(58*2)+8,
                y: 58+4,
                r: 58,
                text: 'PODER DE DECISÃO'
            },
            //second row
            {
                x: 58+7,
                y: 58+8+(58*2)+4,
                r: 58,
                text: 'EXPRES-\nSIVIDA\nDE'
            },
            {
                x: 58+7+(58*2)+6+(58*2)+13+(58*2)+17+(58*2)+9,
                y: 58+8+(58*2)-1,
                r: 58,
                text: 'PERPE-\nTUAÇÃO\nCRIMINOSA\nNO PODER'
            },
            //third row
            {
                x: 58+7,
                y: 58+6+(58*2)+4+(58*2),
                r: 58,
                text: 'MAIOR\nBENEFI\n-CIADO'
            },
            {
                x: 58+7+(58*2)+6+(58*2)+13,
                y: 58+4+(58*2)+4+58,
                r: 82,
                wrapperClass: 'azul lula',
                font: '24px Calibre, Arial',
                text: 'LULA'
            },
            {
                x: 58+7+(58*2)+6+(58*2)+13+(58*2)+17+(58*2)+9,
                y: 58+4+(58*2)+4+(58*2),
                r: 58,
                text: 'PESSOAS\nPRÓXI-\nMAS NA\nLAVAJATO'
            },

            //last row
            {
                x: 58+7,
                y: 58+4+(58*2)+4+(58*2)+(58*2)+5,
                r: 58,
                text: 'ENRI-\nQUECI-\nMENTO\nILÍCITO'
            },
            {
                x: 58+7+(58*2)+6,
                y: 58+4+(58*2)+4+(58*2)+(58*2)+5,
                r: 58,
                text: 'VÉRTICE\nCOMUM'
            },
            {
                x: 58+7+(58*2)+6+(58*2)+15,
                y: 58+4+(58*2)+4+(58*2)+(58*2)+5,
                r: 58,
                text: 'JOSÉ\nDIRCEU'
            },
            {
                x: 58+7+(58*2)+6+(58*2)+13+(58*2)+17,
                y: 58+4+(58*2)+4+(58*2)+(58*2)+5,
                r: 58,
                text: 'PESSOAS\nPRÓXI-\nMAS NO\nMENSALÃO'
            },
            {
                x: 58+7+(58*2)+6+(58*2)+13+(58*2)+17+(58*2)+10,
                y: 58+4+(58*2)+4+(58*2)+(58*2)+3,
                r: 58,
                text: 'MENSALÃO'
            },
        ],

        textStyle: {
            font: "14px Calibre, Arial",
            textAlign: "center",
            lineHeightMultiplier: 1.4
        },

        labelHtml: '<div class="input-wrapper"><textarea type="text" class="ppt-label-input" maxlength="40" rows="1"></textarea></div>',
        textareaFinder: '.input-wrapper',

        init: function () {
            this.$canvas = $('#ppt-generator');
            this.$body = $('body');
            this.ctx = this.$canvas[0].getContext('2d');
            this.width = this.$canvas.width();
            this.height = this.$canvas.height();

            this.loadPPTImage(function () {
                this.bindEvents();
                this.draw();
            }.bind(this));
        },

        bindEvents: function () {
            this.$body.on('click', function (e) {
                if ($(e.target).is('textarea')) return;

                this.finishEdition();

                if (!$(e.target).is('canvas')) return;
                this.checkCollision(e.offsetX, e.offsetY);
            }.bind(this));
        },

        loadPPTImage: function (callback) {
            var image = new Image();

            image.setAttribute('crossOrigin', 'anonymous');
            image.onload = callback;

            image.src = this.bgURL;


            this.imageBg = image;
        },

        checkCollision: function(x, y) {
            this.circles.some(function (circle) {
                var dx, dy;

                dx = circle.x - x;
                dy = circle.y - y;

                if ((dx * dx) + (dy * dy) <= (circle.r * circle.r)) {
                    this.showLabelDialog(circle);
                    return true;
                }

                return false;
            }, this);
        },

        showLabelDialog: function (circle) {
            var $input = $(this.labelHtml),
                width,
                height,
                offset = this.$canvas.offset(),
                x = circle.x,
                y = circle.y;

            $(this.textareaFinder).remove();

            $input.data('circle', circle);

            if (circle.wrapperClass) {
                $input.addClass(circle.wrapperClass);
            }

            $input.find('textarea').val(circle.text || '');
            $input.appendTo('body');
            autosize($input.find('textarea'));

            width = $input.outerWidth(),
            height = $input.outerHeight(),
            $input.css({
                top: offset.top + (y - (height / 2)),
                left: offset.left + (x - (width / 2))
            });
            $input.find('textarea').select();
        },

        finishEdition: function () {
            var $textarea, circle, $wrapper;

            $wrapper = $(this.textareaFinder);
            $textarea = $wrapper.find('textarea');
            if (!$textarea.length) return;

            circle = $wrapper.data('circle');
            circle.text = ($textarea.val() || '').trim().toUpperCase();
            $wrapper.remove();

            this.draw();
        },

        draw: function () {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.drawImage(this.imageBg, 0, 0, this.width, this.height);
            this.writeTexts();

            //this.drawHitArea();
        },

        writeTexts: function () {
            this.ctx.fillStyle = "#fff";
            this.ctx.font = this.textStyle.font;
            this.ctx.textAlign = this.textStyle.textAlign;

            this.circles.forEach(function (circle) {
                var lines, cleanLines = [], lineBroken, lineHeight, i, x, y;

                if (!circle.text) return;

                this.ctx.font = circle.font ? circle.font : this.textStyle.font;

                x = circle.x;
                y = circle.y;

                lineHeight = this.ctx.measureText('M').width * this.textStyle.lineHeightMultiplier;
                lines = circle.text.split('\n');
                for (i = 0; i < lines.length; i += 1) {
                    lines[i] = lines[i].trim();
                    if (lines[i] === '') continue;

                    lineBroken = this.breakLine(lines[i], this.maxLineLength, '-');

                    cleanLines = cleanLines.concat(lineBroken);
                }

                cleanLines = cleanLines.slice(0, this.maxLines);

                y = y - ((lineHeight * (cleanLines.length - 1)) / 2) + (lineHeight/2);

                for (i = 0; i < cleanLines.length; i += 1) {
                    this.ctx.fillText(cleanLines[i], x, y);
                    y += lineHeight;
                }
            }, this);
        },

        breakLine: function(text, size, concactenator) {
            var lines = [];

            concactenator = concactenator || '';
            while (text.length > size) {
                lines.push(text.substring(0, size) + concactenator);
                text = text.substring(size);
            }
            if (text.length) lines.push(text);

            return lines;
        },

        generateImage: function () {
            return this.$canvas[0].toDataURL();
        },

        drawHitArea: function () {
            var style = this.ctx.fillStyle;

            console.log()

            this.ctx.fillStyle = "rgba(200, 200, 255, 0.5)";
            this.circles.forEach(function (circle) {
                this.ctx.beginPath();
                this.ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
                this.ctx.fill();
            }, this);

            this.ctx.fillStyle = style;
        },

        saveImage: function () {
            var img = this.generateImage();

            window.location.href = img;
        }
    };
}(jQuery));
