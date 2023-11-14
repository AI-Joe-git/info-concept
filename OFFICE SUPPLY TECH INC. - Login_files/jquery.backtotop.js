(function($) {
    $.fn.backtotop = function() {
        var _this = this;
        var window_scroll;

        this.init = function() {
            $(document).on('click', '.back-to-top-return', function() {
                _this.back_to_top();
            });

            $(document).on('click', '.back-to-top-hide-btn', function() {
                _this.remove_back_link();
            });

            $(window).scroll(function() {
                clearTimeout(window_scroll);
                window_scroll = setTimeout(function() {
                    _this.back_link();
                }, 500);
            });

            _this.back_link();
        };

        this.back_to_top = function() {
            CommonUtil.scroll_to_obj('body');
        };

        this.back_link = function() {
            var st = $(window).scrollTop();
            var wh = $(window).height();

            if(st > wh) {
                _this.add_back_link();
            } else {
                _this.remove_back_link();
            }
        };

        this.add_back_link = function() {
            var html = '<div class="back-to-top-btn-group" id="back-to-top-affix"> \
                <div class="back-to-top-hide hide" href="javascript:;"> \
                    <a class="back-to-top-hide-btn ctrl-icon-x" href="javascript:;"></a> \
                </div>\
                <a alt="' + CommonUtil.get_locale_text('back_to_top') + '" title="' + CommonUtil.get_locale_text('back_to_top') + '" class="back-to-top-return back-to-top-icon-group" href="javascript:;">\
                    <span class="ctrl-icon-arrow-up"></span> \
                </a> \
            </div>';

            if($('#back-to-top-affix').length < 1) {
                $('body').append(html);
            }
        };

        this.remove_back_link = function() {
            $('#back-to-top-affix').remove();
        };

        _this.init();
    };
}(jQuery));
