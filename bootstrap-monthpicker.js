/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * @version 0.0.1
 * @github https://github.com/wenzhixin/bootstrap-monthpicker
 * @blog http://wenzhixin.net.cn
 * 
 * A minor bug fixed by Jeffery Zhao <zzy8200@gmail.com>
 */

(function($) {

    'use strict';

    var months = [
        '一', '二', '三', '四',
        '五', '六', '七', '八',
        '九', '十', '十一', '十二'
    ];

    function bind(obj, func) {
        return function() {
            return func.apply(obj, Array.prototype.slice.call(arguments));
        };
    }

    function bindAll(obj) {
        var funcs = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < funcs.length; i++) {
            obj[funcs[i]] = bind(obj, obj[funcs[i]]);
        }
        return obj;
    }

    function val($el, value) {
        if (value) {
            return $el.is('input') ? $el.val(value) : $el.text(value);
        } else {
            return $el.is('input') ? $el.val() : $el.text();
        }
    }

    function getYM(value) {
        if ((/^\d{4}-\d{2}$/).test(value)) {
            return {
                year: +(value.split('-')[0]),
                month: +(value.split('-')[1]) - 1
            };
        }
        return null;
    }

    function Monthpicker($el) {
        this.$el = $el;

        bindAll(this, 'show', 'prev', 'next', 'select', 'hide');
    }

    Monthpicker.prototype = {
        constructor: Monthpicker,

        events: function() {
            this.$el.off('click').on('click', this.show);
            this.$prev.off('click').on('click', this.prev);
            this.$next.off('click').on('click', this.next);
            this.$content.find('li').off('click').on('click',this.select);
            this.$document.off('click').on('click', this.hide);
        },

        init: function(options) {
            var $div = $('<div class="mp-monthpicker"></div>'),
                that = this,
                html = [];

            this.options = options;

            $div.insertAfter(this.$el);
            $div.append(this.$el);
            if (this.$el.is('input')) {
                this.$el.prop('readonly', true);
            }

            this.$document = $(document);

            this.$dialog = $([
                '<div class="mp-dialog">',
                    '<div class="mp-title">',
                        '<i class="mp-year-prev glyphicon glyphicon-circle-arrow-left"></i>',
                        ' <span></span> ',
                        '<i class="mp-year-next glyphicon glyphicon-circle-arrow-right"></i>',
                    '</div>',
                    '<div class="mp-content">',
                        '<ul></ul>',
                    '</div>',
                '</div>'
            ].join(''));
            this.$title = this.$dialog.find('.mp-title span');
            this.$prev = this.$dialog.find('.mp-title .mp-year-prev');
            this.$next = this.$dialog.find('.mp-title .mp-year-next');
            this.$content = this.$dialog.find('.mp-content ul');
            this.$dialog.insertAfter(this.$el);
            $.each(months, function(i, m) {
                html.push('<li data-month="' + i + '"' +
                    (i === that.month ? ' class="active"' : '') + '>',
                        m,
                    '</li>');
            });
            this.$content.html(html.join(''));

            this.initDate();
            this.events();
        },

        initDate: function() {
            this.value = val(this.$el);
            if (this.value === '') {
                var date = new Date();
                this.year = date.getFullYear();
                this.month = date.getMonth();
            } else {
                this.year = +(this.value.split('-')[0]);
                this.month = +(this.value.split('-')[1]) - 1;
            }

            this.$title.text(this.year);
            this.$content.find('li').removeClass('active')
                .eq(this.month).addClass('active');

            this.updateViews();
        },

        updateViews: function() {
            var from = getYM(this.options.from),
                to = getYM(this.options.to);

            this.$prev.show();
            this.$next.show();
            this.$content.find('li').removeAttr('class');
            if (from) {
                if (this.year === from.year) {
                    this.$prev.hide();
                    this.$content.find('li:lt(' + from.month + ')').addClass('disabled');
                }
            }
            if (to) {
                if (this.year === to.year) {
                    this.$next.hide();
                    this.$content.find('li:gt(' + to.month + ')').addClass('disabled');
                }
            }
        },

        show: function() {
            if (this.$dialog.is(':visible')) {
                this.$dialog.hide();
                return;
            }
            this.initDate();
            this.$dialog.show();
        },

        hide: function(event) {
            if(!$(event.target).closest('.mp-monthpicker').length && !$(event.target).is('.mp-monthpicker')) {
                if($('.mp-dialog').is(":visible")) {
                    $('.mp-dialog').hide();
                }
            }
        },

        prev: function() {
            this.$title.text(--this.year);
            this.updateViews();
        },

        next: function() {
            this.$title.text(++this.year);
            this.updateViews();
        },

        select: function(event) {
            if($(event.currentTarget).attr('class')!='disabled'){
            this.month = $(event.currentTarget).data('month');
            this.value = [this.year, (this.month + 1 < 10 ? '0' : '') + (this.month + 1)].join('-');
            val(this.$el, this.value);
            this.options.onSelect(this.value);
            this.$dialog.hide();
            }
        }
    };

    $.fn.bootstrapMonthpicker = function() {
        var option = arguments[0],
            args = arguments,

            value,
            allowedMethods = [];

        this.each(function() {
            var $this = $(this),
                data = $this.data('bootstrapMonthpicker'),
                options = $.extend({}, $.fn.bootstrapMonthpicker.defaults, typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw "Unknown method: " + option;
                }
                value = data[option](args[1]);
            } else {
                if (!data) {
                    data = new Monthpicker($this);
                    data.init(options, true);
                    $this.data('bootstrapMonthpicker', data);
                } else {
                    data.init(options);
                }
            }
        });

        return value ? value : this;
    };

    $.fn.bootstrapMonthpicker.defaults = {
        from: '',
        to: '',
        onSelect: function() { return false; }
    };
})(jQuery);
