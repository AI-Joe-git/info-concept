function SessionExpire() {
    var _this = this;
    var max_age = 7200;
    var t_expire = null;
    var time_to_check = 300000;
    var expire_time = 0;
    var expire_refresh_time = 0;
    var check_time = 0;

    this.init = function() {
        $(document).on('click', '.close-modal-session', function(e) {
            e.preventDefault();
            _this.hide_session_expire_modal();
        });

        $(document).on('click', '.continue-session', function(e) {
            e.preventDefault();
            _this.refresh_colmain_cookie();
        });

        _this.session_expire_check();
    };

    this.session_expire_check = function() {
        if(typeof globals.userId === 'string' && parseInt(globals.userId) > 0) {
            $.ajax({
                type : "GET",
                url : globals.baseUrl + '/authExpire/check',
                data : null,
                dataType : "json",
                success : function(responseData) {
                    if(typeof responseData.time === 'number') {
                        max_age = responseData.time;
                        _this.set_expire_check();
                    }
                },
                error : function(jqXHR, textStatus, errorThrown) {

                }
            });
        }
    };

    this.set_expire_check = function() {
        _this.set_expire_time();
        _this.set_check_time();

        if(t_expire != null) {
            clearInterval(t_expire);
        }

        t_expire = setInterval(function() {
            var now = new Date().getTime();

            if(now >= check_time) {
                clearInterval(t_expire);
                _this.show_session_expire_modal();
                _this.set_expire_refresh();
            }
        }, 300000);
    };

    this.set_expire_refresh = function() {
        var t = setInterval(function() {
            var now = new Date().getTime();

            if(now > expire_refresh_time) {
                CommonUtil.refresh_page();
            }
        }, 60000);
    };

    this.refresh_colmain_cookie = function() {
        $.ajax({
            type : "GET",
            url : globals.baseUrl + '/authExpire/refreshColmain',
            data : null,
            dataType : "json",
            success : function(responseData) {
                _this.hide_session_expire_modal();
                _this.session_expire_check();
            },
            error : function(jqXHR, textStatus, errorThrown) {

            }
        });
    };

    this.show_session_expire_modal = function() {
        $('.modal-session').remove();

        var html = '<div class="modal-session"> \
			<div class="modal-dialog" role="document"> \
				<div class="modal-content"> \
					<div class="modal-header "> \
						<a class="close close-modal" aria-hidden="true"><span class="icon-close-dark"></span></a> \
						<h3>' + CommonUtil.get_locale_text('warning') + '</h3> \
					</div> \
					<div class="modal-body" id="session-expire-modal-modalbody" style="max-height: 150px;"> \
						<p>' + CommonUtil.get_locale_text('session_expiring') + '</p> \
					</div> \
					<div class="modal-footer "> \
						<div class="modal-footer-buttons"> \
							<div class="actions-left"><button id="session-expire-ok-btn" class="btn btn-primary continue-session">OK</button></div> \
							<div class="actions-right"><button class="btn btn-danger close-modal-session">Cancel</button></div> \
						</div></div> \
					</div> \
			</div> \
			<div class="modal-session-backdrop"></div> \
		</div>';
        $('body').append(html);
    };

    this.hide_session_expire_modal = function() {
        $('.modal-session').remove();
    };

    this.set_expire_time = function() {
        var now = new Date().getTime();
        expire_time = now + (max_age * 1000);
        expire_refresh_time = expire_time + 300000;
    };

    this.set_check_time = function() {
        check_time = expire_time - time_to_check;
    };
}