var banneritem_carousel_initialized = false;
var banneritem = '';
var site_responsive = false;
var spotlite_carousel_initialized = false;
var spotlite = '';
var wr = null;

$(document).ready(function() {
	$('.site-help').on('click', function(e) {
		e.preventDefault();
		show_site_help($(this).attr('data-url'), e);
	});

	$('.addcart').on('click', function() {
		var pid = $(this).attr('data-productid');
		url = globals.baseUrl + '/Docs/addproducts?qty=1&mappingid=' + pid;
        handle_add_cart_click(url, $(this));
	});
	
	$(document).on('click', '.spotlite-toggle', function(e) {
		e.preventDefault();
		toggle_spotlite($(this));
	});
	
	$(document).on('click', '.featured-product-toggle', function(e) {
		e.preventDefault();
		toggle_featured_product($(this));
	});
	
	$(document).on('click', '.productresult-toggle', function(e) {
		e.preventDefault();
		toggle_productresult($(this));
	});

	$(document).on('click', '.show-coupon-details', function(e) {
		e.preventDefault();
		show_coupon_modal($(this));
	});

	$(document).on('click', '[data-component="browseByCategory"] .edit-panel-toggle, #mobile-drawer-content .edit-panel-toggle', function(e) {
		e.preventDefault();
		toggle_browse_by_category_accordion($(this));
	});

	$(document).on('click', '.dismiss-support-messages', function(e) {
		e.preventDefault();
		dismiss_support_messages();
	});

	$(document).on('click', '.scroll-to-main', function(e) {
		e.preventDefault();
		scroll_to_main_content();
	});

	$(window).resize(function() {
		handle_window_common_resize();
		
		clearTimeout(wr);
		wr = setTimeout(function() {
			storesite_respond();
		}, 500);
	});

	check_for_coupon_param();
	
	$(document).on('carouselAnimationStart', carousel_animation_start_handler);
	$(document).on('carouselAnimationStop', carousel_animation_stop_handler);
	
	CommonUtil.check_for_locale_text( [{ callback: 'init_storesite_scripts', context: window }] );
});

function init_storesite_scripts() {
	set_site_responsive();
	storesite_respond(true);
	setup_spotlite_carousel();
	setup_featured_products();
	setup_banneritem_carousel();
	setup_productresult();
	init_common_responsive();
}

/* AD CAMPAIGNS */
function check_ad_campaigns() {
	var i = 0;
	var t = setInterval(function() {
		if(i > 20 || $('.ccs-cc-inline').length > 0) {
			clearInterval(t);
			var mw = $('#body-main').width();

			$('.ccs-cc-inline').each(function() {
				$(this).css('maxWidth', mw).show();
			});
		}

		i++;
	}, 500);
}

/* COUPON */
function check_for_coupon_param() {
	var coupon_id = CommonUtil.get_param('coupon');

	if(coupon_id != '') {
		var c = $('.show-coupon-details[data-id="' + coupon_id + '"]');

		if(c.length > 0) {
			show_coupon_modal(c);
		}
	}
}

function show_coupon_modal(obj) {
	if(typeof mobile_drawer_hide === 'function' && $('#mobile-drawer').is(':visible')) {
		mobile_drawer_hide();
	}

	$('#coupon-details-modal').remove();
	var url = globals.baseUrl + '/Marketing/couponDetails/?id=' + obj.attr('data-id');
	var title = obj.closest('.coupon-component').find('.title:first').text();

	BootstrapComponent.modal({
		added_class : 'medium',
		ajax_content: url,
		buttons: '<button class="btn btn-primary close-modal">' + CommonUtil.get_locale_text('continue_shopping') + '</button>',
		content : '<div class="loading"></div>',
		id : 'coupon-details-modal',
		title : title
	});

	BootstrapComponent.open_modal($('#coupon-details-modal'));
}

/* EMAIL */
function handle_email_enter() {
	$('.controls').each(function() {
		if($(this).next().hasClass('tooltip')) {
			$(this).tooltip('destroy');
		}
	});
}

/* HELP */
function show_site_help(url, event) {
	CommonUtil.popup_generic(url, 'Help', 768, 1024, event);
}

/* FEATURED PRODUCTS */
function setup_featured_products() {
	if(globals.is508Compliant) {
		return;
	}

	if($('.storesite-featuredproducts').length > 0 && $('.featured-product-toggle').length > 0) {
		var view = typeof $.cookie(storage_featuredproductsview) == 'string' ? $.cookie(storage_featuredproductsview) : '';
	
		if(view == '') {
			view = $('.storesite-featuredproducts').hasClass('type-list') ? 'list' : 'grid';
		}
	
		$('.featured-product-toggle.toggle-' + view).trigger('click');
	}

	if($('.storesite-featuredproducts').length > 0) {
		$('.storesite-featuredproducts .gridbox').each(function() {
			var title = $.trim( $(this).find('.product-title').text() );
			var html = $(this).find('.info').html();
			var opts = {
				content : html,
				html : true,
				placement : 'top',
				title : title,
				trigger : 'hover'
			};
			BootstrapComponent.popover($(this).find('.featured-product-img-container'), opts);
		});
	}
}

function toggle_featured_product(obj) {
	var view = 'list';
	
	if(obj.hasClass('toggle-list')) {
		var view = 'list';
		$('.featured-product-toggle.toggle-grid').removeClass('active');
		$('.featured-product-toggle.toggle-list').addClass('active');
		$('.storesite-featuredproducts').addClass('type-list').removeClass('type-grid');
	} else {
		var view = 'grid';
		$('.featured-product-toggle.toggle-grid').addClass('active');
		$('.featured-product-toggle.toggle-list').removeClass('active');
		$('.storesite-featuredproducts').addClass('type-grid').removeClass('type-list');
	}
	
	CommonUtil.set_state(storage_featuredproductsview, view);
}

/* PRODUCT RESULTS */
function setup_productresult() {
	if($('.product-result-table').length > 0 && $('.productresult-toggle').length > 0) {
		var view = typeof $.cookie(storage_productresultview) == 'string' ? $.cookie(storage_productresultview) : '';
	
		if(view == '') {
			view = $('.product-result-table').hasClass('type-list') ? 'list' : 'grid';
		}
	
		$('.productresult-toggle.toggle-' + view).trigger('click');
	}
}

function toggle_productresult(obj) {
	var view = 'list';
	
	if(obj.hasClass('toggle-list')) {
		var view = 'list';
		$('.productresult-toggle.toggle-grid').removeClass('active');
		$('.productresult-toggle.toggle-list').addClass('active');
		$('.product-result-table').addClass('type-list').removeClass('type-grid');
	} else {
		var view = 'grid';
		$('.productresult-toggle.toggle-grid').addClass('active');
		$('.productresult-toggle.toggle-list').removeClass('active');
		$('.product-result-table').addClass('type-grid').removeClass('type-list');
	}
	
	CommonUtil.set_state(storage_productresultview, view);
}

/* WINDOW RESPOND */
function init_common_responsive() {
	if(site_responsive) {
		mobile_common_respond();
		
		$(document).on('click', '.btn-group .dropdown-menu .tablink', function(e) {
			e.preventDefault();
			handle_navtab_menu_click($(this));
		});

		$(document).on('show.bs.dropdown', function(event) {
			$('.dropdown-backdrop').off().remove();
		});

		$('.mediacontainer').each(function() {
			if($(this).is('[id]')) {
				var id = $(this).attr('id');
				$('#' + id).mediacontainer();
			}
		});
	}
}

function mobile_common_respond() {
	var w = $(window).width();
	var bw = $('#body-main').width();
	var body_main_padding = parseInt($('#body-main').css('paddingLeft'));
	body_main_padding = body_main_padding > 0 ? body_main_padding : 20;
	var bw_content = $('#body-main').width() - (2 * body_main_padding);
	
	handle_body_tabs();
	handle_custom_html_video();
	handle_tables();

	function handle_body_tabs() {
		$('#body-main').find('.nav.nav-tabs').each(function() {
			$(this).show();
			var h = $(this).height();
			var tab_height = $(this).find('li a:first').outerHeight();
			var tab_break = tab_height + 5;
			
			if(!$(this).is('[id]')) {
				var id = 'navtab-' + CommonUtil.unique_id();
				$(this).attr('id', id);
			}
			
			var id = $(this).attr('id');
			var menu_id = 'navtabmenu-' + id;
			var links = $(this).clone();
			links.attr('id', 'navlinks-' + id);
			links.attr('class', '');
			links.addClass('dropdown-menu');
			links.find('li a').each(function() {
				$(this).removeAttr('data-toggle');
				$(this).addClass('tablink');
			});
			
			if(h >= tab_break) {
				$(this).hide();
				
				if($('#' + menu_id).length < 1) {
					var html = ' \
						<div class="navtabmenu-wrapper" data-parent="' + id + '" id="' + menu_id + '"> \
							<div class="btn-group"> \
								<button class="btn btn-default" data-toggle="dropdown" type="button">' + CommonUtil.get_locale_text('view') + ':</button><button type="button" data-toggle="dropdown" class="btn btn-default dropdown-toggle"><span class="caret"></span><span style="visibility: hidden;">&nbsp;</span></button> \
							</div> \
						</div>';
					$(this).after(html);
					$('#' + menu_id).find('.btn-group').append(links);
				}
				
				$('#' + menu_id).show();
			} else {
				$(this).show();
				$('#' + menu_id).hide();
			}
		});
	}

	function handle_custom_html_video() {
		$('[data-component="customHtml"]').each(function() {
			$(this).find('iframe, video').each(function() {
				if($(this).is('[width]')) {
					var att_w = $(this).attr('width');
					
					if(att_w.indexOf('%') < 0) {
						att_w = parseInt(att_w) + 'px';
					
						if(!$(this).is('[data-maxwidth]')) {
							$(this).attr('data-maxwidth', att_w);
							$(this).attr('data-maxheight', $(this).height() + 'px');
						
							$(this).css('max-width', att_w);
							$(this).css('width', '100%');
						}
					
						var data_mw = $(this).attr('data-maxwidth');
						var data_mh = $(this).attr('data-maxheight');
						var ratio = parseInt(data_mw) / parseInt(data_mh);
					
						if($(this).width() <= parseInt(data_mw)) {
							var h = $(this).width() / ratio;
							$(this).css('height', h);
						}
					}
				}
			});
		});
	}
	
	function handle_tables() {
		$('table.costandard').each(function() {
			if($(this).width() > bw_content) {
				if(!$(this).parent().hasClass('mobile-table-wrapper')) {
					$(this).wrap('<div class="mobile-table-wrapper"></div>');
				}
			}
		});
	}
}

function set_site_responsive() {
	if($('body').hasClass('responsive-true')) {
		site_responsive = true;
	}
}

function storesite_respond(trigger_resize) {
	if(CommonUtil.is_ie_11()) {
		if($('#storesite-home-spotlite').length > 0 || $('#storesite-home-carousel').length > 0 || $('.storesite-home-customhtml').length > 0) {
			$('#storesite-home-spotlite').hide();
			$('#storesite-home-carousel').hide();
			$('.storesite-home-customhtml').hide();
			$('#body-main').append('<div id="temp-content">&nbsp;</div>');
			var mw = $('#body-main').width();

			if($('.storesite-home-customhtml').length > 0) {
				$('.storesite-home-customhtml').each(function() {
					var pl = $(this).css('padding-left');
					pl = parseInt(pl);
					pl = CommonUtil.is_number(pl) ? pl : 0;
					var pr = $(this).css('padding-right');
					pr = parseInt(pr);
					pr = CommonUtil.is_number(pr) ? pr : 0;
			
					var bl = $(this).css('border-left-width');
					bl = parseInt(bl);
					bl = CommonUtil.is_number(bl) ? bl : 0;
					var br = $(this).css('border-right-width');
					br = parseInt(br);
					br = CommonUtil.is_number(br) ? br : 0;
	
					mw = mw - pl - pr - bl - br;

					$(this).find('img').each(function() {
						$(this).css('max-width', mw + 'px');
					});
				});
			}

			$('#storesite-home-spotlite').show();
			$('#storesite-home-carousel').show();
			$('.storesite-home-customhtml').show();
			$('#temp-content').remove();
		
			if(trigger_resize) {
				$(window).trigger('resize');
			}
		}
	}

	check_ad_campaigns();
}

function handle_navtab_menu_click(obj) {
	if(!obj.hasClass('disabled')) {
		obj.closest('.dropdown-menu').find('li').each(function() {
			$(this).removeClass('active');
		});
		
		obj.closest('li').addClass('active');
		
		var href = obj.attr('href');
		var tab = obj.closest('.navtabmenu-wrapper').attr('data-parent');
		
		$('#' + tab).find('a[href="' + href + '"]').trigger('click');
	}
}

function handle_window_common_resize() {
	if(site_responsive) {
		mobile_common_respond();
	}
}

/* SPOTLITE */
function setup_spotlite_carousel() {
	if(globals.is508Compliant) {
		return;
	}

	var len = $('.storesite-spotlite .gridbox').length;
	
	if($('.storesite-spotlite').length > 0 && $('.spotlite-toggle').length > 0) {
		if(len < 2) {
			$('.spotlite-toggle.toggle-grid').addClass('disabled');
			$('.spotlite-toggle.toggle-list').trigger('click');
		} else {
			var view = typeof $.cookie(storage_spotliteview) == 'string' ? $.cookie(storage_spotliteview) : 'grid';
			$('.spotlite-toggle.toggle-' + view).trigger('click');
		}
		
		
	} else {
		if(len > 1) {		
			if(!spotlite_carousel_initialized) {
				var id = $('.storesite-spotlite').attr('id');
			
				CommonUtil.get_script('colcarousel', function() {
					spotlite = $('#' + id).colcarousel();
					spotlite_carousel_initialized = true;
				});
			}
		}
	}

	if($('.storesite-spotlite').length > 0) {
		$('.storesite-spotlite .gridbox').each(function() {
			var title = $.trim( $(this).find('.product-title').text() );
			var html = $(this).find('.info').html();
			var opts = {
				content : html,
				html : true,
				placement : 'bottom',
				title : title,
				trigger : 'hover'
			};
			BootstrapComponent.popover($(this).find('.colcarousel-img-container'), opts);
		});
	}
}

function toggle_spotlite(obj) {		
	var view = 'list';
	
	if(obj.hasClass('toggle-list')) {
		view = 'list';
		
		$('.spotlite-toggle.toggle-grid').removeClass('active');
		$('.spotlite-toggle.toggle-list').addClass('active');
		$('.storesite-spotlite').addClass('type-list').removeClass('type-grid');
		
		$('.storesite-spotlite *').not('figure').each(function() {
			$(this).removeAttr('style');
		});
		
		if(typeof spotlite === 'object') {
			spotlite.stop_autoplay();
		}
	} else {
		view = 'grid';
		
		$('.spotlite-toggle.toggle-grid').addClass('active');
		$('.spotlite-toggle.toggle-list').removeClass('active');
		$('.storesite-spotlite').addClass('type-grid').removeClass('type-list');
		
		if(!spotlite_carousel_initialized) {
			var id = $('.storesite-spotlite').attr('id');
			
			CommonUtil.get_script('colcarousel', function() {
				spotlite = $('#' + id).colcarousel();
				spotlite_carousel_initialized = true;
			});
		} else {
			spotlite.stop_autoplay();
			spotlite.respond();
			spotlite.adjust_items();
		}
	}
	
	CommonUtil.set_state(storage_spotliteview, view);
}

function carousel_animation_start_handler () {
	if($('.spotlite-toggle').length > 0) {
		$('.spotlite-toggle').each(function() {
			$(this).addClass('disabled');
		});
	}
}

function carousel_animation_stop_handler() {
	if($('.spotlite-toggle').length > 0) {
		$('.spotlite-toggle').each(function() {
			$(this).removeClass('disabled');
		});
	}
}

/* BANNER ITEM CAROUSEL */
function setup_banneritem_carousel() {
	if(globals.is508Compliant) {
		return;
	}

	var len = $('.storesite-banneritem-carousel .gridbox').length;

	if($('.storesite-banneritem-carousel').length > 0) {
		if(!banneritem_carousel_initialized) {
			CommonUtil.get_script('colcarousel', function() {
				$('.storesite-banneritem-carousel').each(function() {
					var id = $(this).attr('id');
					banneritem = $('#' + id).colcarousel( { min_width: 150 } );
				});

				banneritem_carousel_initialized = true;
			});
		}
	}
}

function toggle_browse_by_category_accordion(obj) {
	var collapse = obj.closest('.panel').find('.collapse');

	if(collapse.is(':hidden')) {
		collapse.collapse('show');
	} else {
		collapse.collapse('hide');
	}
}

function display_support_lightbox_messages() {
	var modal_content = '';
	var support_message_cookie = CommonUtil.get_cookie(storage_dismissedsupportmessages);
	var dismissed = [];

	if(support_message_cookie != '') {
		dismissed = support_message_cookie.split('|');
	}

	$('#content-main .support-message-modal-data').each(function() {
		var id = $(this).attr('data-id');

		if(!CommonUtil.in_array(dismissed, id)) {
			modal_content += '<div class="component-module support-message-modal-item-container" data-id="' + $(this).attr('data-id') + '">' + $(this).html() + '</div>';
		}
	});

	if(modal_content != '') {
		$('#support-message-modal').remove();
		BootstrapComponent.modal({
			buttons : '<div class="actions-left"><button class="btn btn-primary dismiss-support-messages">' + CommonUtil.get_locale_text('dismiss') + '</button></div><div class="actions-right"><button class="btn btn-danger close-modal" aria-hidden="true">' + CommonUtil.get_locale_text('close') + '</button></div>',
			content : modal_content,
			id : 'support-message-modal',
			title : CommonUtil.get_locale_text('message')
		});

		BootstrapComponent.open_modal($('#support-message-modal'));
	}
}

function dismiss_support_messages() {
	var ids = [];
	var id_list = '';
	var support_message_cookie = CommonUtil.get_cookie(storage_dismissedsupportmessages);

	$('#support-message-modal').find('.support-message-modal-item-container').each(function() {
		ids.push($(this).attr('data-id'));
	});

	if(support_message_cookie != '') {
		var dismissed = support_message_cookie.split('|');
		ids = $.merge(dismissed, ids);
	}

	id_list = ids.join('|');
	CommonUtil.set_state(storage_dismissedsupportmessages, id_list);
	BootstrapComponent.close_modals();
}

function scroll_to_main_content() {
	CommonUtil.scroll_to_obj('#body-main');
	$('#body-main-anchor').focus();
}
