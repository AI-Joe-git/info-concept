var global_close_icon = '<i class="material-icons md-icon-clear">&#xe14c;</i>';
var retained_selections_sticky_footer = true;
var custom_tabs_clone = '';

$(document).ready(function() {
	/* DECOR */
	$(document).on('click', '#header-navbar-browse', function(e) {
		e.preventDefault();
		handle_category_browse();
	});
	
	$(document).on('click', '#browse-category-modal-backdrop', function(e) {
		e.preventDefault();
		hide_category_browse_menu();
	});
	
	$(document).on('click', '.favorites-btn', function(e) {
		e.preventDefault();
		CommonUtil.check_logged_in('show_favorites');
	});
	
	$(document).on('click', '#header-navbar-browse-menu .edit-panel-toggle', function(e) {
		e.preventDefault();
		handle_browse_subcategories_click($(this));
	});
	
	$(document).on('mouseover', '#header-navbar-browse-menu .edit-panel-toggle', function() {
		show_browse_subcategories($(this));
	});
	
	$(document).on('click', '.site-legend-btn', function(e) {
		e.preventDefault();
		show_legend();
	});
	
	$(document).on('click', '#change-catalogs-btn', function(e) {
		e.preventDefault();
		show_catalog_select_menu();
	});
	
	$(document).on('click', '#change-store-btn', function(e) {
		e.preventDefault();
		show_subsidiary_select_menu();
	});
	
	
	/* PRODUCT RESULTS */
	$(document).on('click', '.toggle-productresult-sort', function(e) {
		e.preventDefault();
		handle_productresult_sort_toggle();
	});
	
	$(document).on('change', '#sortProductResultsBy', function(e) {
		handle_productresult_sortby();
	});
	
	$(document).on('BCModalShown', handle_modal_shown);
	
	$(window).resize(function() {
		handle_window_resize();
	});
	
	CommonUtil.check_for_locale_text( [{ callback: 'init_cybershift_scripts', context: window }] );
});

function init_cybershift_scripts() {
	custom_tab_menus();
	init_modalmenus();
	update_main_search();
	update_toggle_productresult_sort();
	update_form_controls();
	product_result_selectall_tooltip();
	product_overview_gallery();
	update_page_subnav();
	init_responsive();
}

/* CATALOG */
function show_catalog_select_menu() {
	$('#change-catalogs-btn').hide();
	$('#module-catalogs').show();
}

/* SUBSIDIARY */
function show_subsidiary_select_menu() {
	$('#change-store-btn').hide();
	$('#module-subsidiaries').show();
}

/* CATEGORIES */
function handle_category_browse() {
	if($('#browse-category-modal-backdrop').length > 0) {
		hide_category_browse_menu();
	} else {
		show_category_browse_menu();
	}
}

function handle_browse_subcategories_click(obj) {
	var url = obj.is('[data-mainurl]') ? obj.attr('data-mainurl') : '#';
	
	if(url != '#') {
		CommonUtil.redirect(url);
	}
}

function hide_category_browse_menu() {
	$('body').removeClass('modal-open modal-browse-open');
	$('#browse-category-modal-backdrop').remove();
	$('#header-navbar-browse-menu').hide();
}

function show_category_browse_menu() {
	$('body').addClass('modal-open modal-browse-open');
	$('#header-navbar-browse').before('<div class="modal-backdrop fade in" id="browse-category-modal-backdrop"></div>');
	$('#header-navbar-browse-menu').show();
}

function show_browse_subcategories(obj) {
	var menu = obj.closest('.panel').find('.panel-collapse');
	
	if($('#panel-collapse-wrapper').length < 1) {
		$('#header-navbar-browse-menu').prepend('<div id="panel-collapse-wrapper"></div>');
		
		var widths = [];
		var w = $('#header-navbar-browse-menu').width();
		
		$('#header-navbar-browse-menu .panel-collapse').each(function() {
			widths.push( $(this).outerWidth() );
		});

		widths.sort();
		widths.reverse();
		w = typeof widths[0] === 'number' ? widths[0] : w;
		$('#panel-collapse-wrapper').css('width', w);
		
		$('#header-navbar-browse-menu .panel-collapse').each(function() {
			$(this).css('width', w);
		});
	}
	
	var left = $('#header-navbar-browse-menu').outerWidth();
	$('#panel-collapse-wrapper').css('left', left);
	menu.css('left', left);
	var height = $('#header-navbar-browse-menu').outerHeight();
	$('#panel-collapse-wrapper').css('height', height);
	menu.find('.panel-body').css('height', height);
	obj.attr('href', '#');
	
	$('#header-navbar-browse-menu .panel-collapse').each(function() {
		$(this).removeClass('in');
		$(this).prop('aria-expanded', false);
		
	});
	
	var l = $('#header-navbar-browse-menu .edit-panel-toggle').length;
	var i = 0;
	$('#header-navbar-browse-menu .edit-panel-toggle').each(function() {
		$(this).removeClass('edit-panel-on');
		i++;
	});
	
	var t = setInterval(function() {
		if(i == l) {
			clearInterval(t);
			$('#header-navbar-browse-menu .edit-panel-toggle').each(function() {
				$(this).removeClass('edit-panel-on');
				i++;
			});
			
			$('#panel-collapse-wrapper').show();
			menu.addClass('in');
			menu.prop('aria-expanded', false);
			obj.addClass('edit-panel-on');
		}
	}, 100);
}

/* COMPANY FAVORITES */
function favorite_products_showmore() {
	if(typeof ssDecor === 'object') {
		ssDecor.favorite_products_setup();
	}
}

function show_favorites() {
	$('#favorites-modal').remove();

	BootstrapComponent.modal({
		ajax_content : globals.baseUrl + '/Favorites/allLists',
		id : 'favorites-modal',
		title : CommonUtil.get_locale_text('favorites')
	});

	BootstrapComponent.open_modal($('#favorites-modal'), { ajax_callback : 'favorite_products_showmore' });
}

/* CUSTOM TABS */
function custom_tab_menus() {
	var w = $(window).width();
	
	if(typeof custom_tabs_clone != 'object') {
		custom_tabs_clone = $('#top-nav-customtabs').clone();
	}
	
	$('#top-nav-customtabs').html( custom_tabs_clone.html() );

	var topnav_width = $('#top-nav-container').width();
	var topnav_half_width = topnav_width/2;
	var customtabs_width = $('#custom-tabs-navbar').width();
	
	if(site_responsive && w < 992) {
		topnav_half_width = topnav_width * 0.75;
	}

	if(customtabs_width > topnav_half_width) {
		var visible_tabs = $('#custom-tabs-navbar ul').children();
		var menu_tabs = {};
		$('#custom-tabs-navbar ul').empty();
		var len = visible_tabs.length;
		var hidden_tabs = [];
		var push_to_hidden = false;

		for(i=0; i<len; i++) {
			$('#custom-tabs-navbar ul').append(visible_tabs[i]);
			customtabs_width = $('#custom-tabs-navbar ul').width();
		
			if(push_to_hidden) {
				hidden_tabs.push(visible_tabs[i]);
			} else {
				if(customtabs_width > topnav_half_width) {
					$('#custom-tabs-navbar ul li:last').remove();
					hidden_tabs.push(visible_tabs[i]);
					push_to_hidden = true;
				}
			}
		}

		if(hidden_tabs.length > 0) {
			var menu_html = '<div class="modalmenu-menu hide" id="custom-tab-moreitems"><ul></ul></div>';
			var html = '<li class="crm-tab-bar"><a class="customtab-item modalmenu" href="#custom-tab-moreitems" id="custom-tab-more-btn"><i class="material-icons md-icon-more_horiz">&#xe5d3;</i></a>' + menu_html + '</li>';
			$('#custom-tabs-navbar ul').append(html);
			
			for(i=0; i<hidden_tabs.length; i++) {
				$('#custom-tab-moreitems ul').append(hidden_tabs[i]);
			}
		}
	}
}

/* DOCS */
function update_page_subnav() {
	if($('#body-main .document-navigation').length > 0) {
		$('#header-after-wrapper').append('<div class="content-module header-after" id="header-document-nav"></div>');
		$('.document-navigation').addClass('container').appendTo($('#header-after-wrapper #header-document-nav'));
	}
	
	if($('#body-main #colnav.page-hnav').length > 0) {
		$('#header-after-wrapper').append('<div class="content-module header-after" id="header-page-hnav"></div>');
		$('#colnav.page-hnav').addClass('container').appendTo($('#header-after-wrapper #header-page-hnav'));
	}
	
	if($('#body-main .breadcrumb').length > 0) {
		$('#header-after-wrapper').append('<div class="content-module header-after" id="header-breadcrumb"></div>');
		$('.breadcrumb').addClass('container').appendTo($('#header-after-wrapper #header-breadcrumb'));
	}
}

/* DRAWER */
function render_drawer_module(id, title, body, component) {
	var data_component = typeof component === 'string' ? 'data-component="' + component + '"' : '';
	var html = ' \
		<div class="sidenav-drawer-module" ' + data_component + ' id="mobile-drawer-' + id + '"> \
			<div class="item-label collapsible"> \
				<a aria-expanded="false" href="#drawercontent-' + id + '" data-toggle="collapse" class="collapsed drawer-accordion-toggle mobile-toggle">' + title + '</a> \
			</div> \
			<div aria-expanded="false" id="drawercontent-' + id + '" class="collapse drawer-accordion-content"> \
				<div id="drawer-' + id + '" class="content-module">' + body + '</div> \
			</div> \
		</div>';
	
	return html;
}

function setup_drawer() {
	if($('#side-left').length > 0) {
		var drawer_left = '';
		
		$('#side-left .component-module').each(function() {
			var body = $(this).find('.body').html();
			var component = $(this).is('[data-component]') ? $(this).attr('data-component') : '';
			var id = $(this).attr('id');
			var title = $.trim($(this).find('.title').text());

			if(title == '') {
				title = $(this).is('[title]') != '' ? $(this).attr('title') : '';
			}

			if(title != '') {
				drawer_left += render_drawer_module(id, title, body, component);
			}
		});
		
		$('#drawer-left-columns').html(drawer_left);
	}
	
	if($('#side-right').length > 0) {
		var drawer_right = '';
		
		$('#side-right .component-module').each(function() {
			var body = $(this).find('.body').html();
			var component = $(this).is('[data-component]') ? $(this).attr('data-component') : '';
			var id = $(this).attr('id');
			var title = $.trim($(this).find('.title').text());

			if(title == '') {
				title = $(this).is('[title]') != '' ? $(this).attr('title') : '';
			}

			if(title != '') {
				drawer_right += render_drawer_module(id, title, body, component);
			}
		});
		
		$('#drawer-right-columns').html(drawer_right);
	}
	
	$('#mobile-drawer .selecttomenu[data-selecttomenu-setup="true"]').each(function() {
		var id = $(this).attr('id');
		$(this).closest('.controls').find('.selecttomenu-btn').remove();
		$(this).removeAttr('data-selecttomenu-setup');
		$(this).removeAttr('style');
		$(this).attr('id', id + '-drawer');
	});
	
	init_selecttomenu();
}

/* FORMS */
function update_form_controls() {
	$('select').each(function() {
		if(!$(this).is('[multiple]')) {
			$(this).addClass('selecttomenu');
		}
	});
	
	init_selecttomenu();
	
	$('input:not([type=hidden])').each(function() {
		$(this).mdformcontrol();
	});
	
	$('.form-type-textarea textarea').each(function() {
		var txt = $.trim( $(this).closest('.form-group').find('label').text() );
		$(this).attr('placeholder', txt);
	});
}

/* LEGEND */
function show_legend() {
	if($('#mobile-help-modal').length > 0) {
		BootstrapComponent.close_modal($('#mobile-help-modal'));
	}
	
	$('#legend-modal').remove();

	BootstrapComponent.modal({
		content : $('#legend-modal-content').html(),
		id : 'legend-modal',
		title : CommonUtil.get_locale_text('site_legend')
	});

	BootstrapComponent.open_modal($('#legend-modal'));
}

/* MODAL */
function handle_modal_shown() {
	update_form_controls();
}

/* MODAL MENUS */
function init_modalmenus() {
	$('.modalmenu').each(function() {
		$(this).modalmenu({});
	});
}

/* MODAL MENUS FOR SELECTS */
function init_selecttomenu() {
	$('.selecttomenu').each(function() {
		$(this).selecttomenu({});
	});

	if($('#language'.length > 0 && $('#language').hasClass('selecttomenu') && !$('#language').is('[data-selecttomenu-setup]'))) {
		$('#language').selecttomenu({});
	}
}

/* PRODUCT OVERVIEW */
function product_overview_gallery() {
	if ($('#product-img-sources ul').children().length > 1) {
		CommonUtil.get_script('gallery', function() {
			$('#product-first-img').hide();
			
			$('#product-img-sources').colgallery({
				target : '#product-img-gallery'
			});
		});
	}
}

/* PRODUCT RESULTS */
function handle_productresult_sortby() {
	var sb = $('#sortProductResultsBy').val();
	var dir = $('#_search_sortOrder').val();
	dir = (dir != '') ? dir : 'ASC';
	resortTable(sb, dir);
}

function handle_productresult_sort_toggle() {
	var dir = $('#_search_sortOrder').val();
	dir = (dir != '') ? dir : 'ASC';
	var new_dir = dir == 'ASC' ? 'DESC' : 'ASC';
	$('#_search_sortOrder').val(new_dir);
	update_toggle_productresult_sort();
	$('#sortProductResultsBy').trigger('change');
}

function product_result_selectall_tooltip() {
	if($('#md-label-checkall').length > 0) {
		var msg = CommonUtil.get_locale_text('limit_n_selections');
		msg = CommonUtil.sprintf(msg, [ storage_productsearchresultselections_limit ]);
		
		$('#md-label-checkall').attr('data-toggle', 'tooltip');
		$('#md-label-checkall').attr('data-placement', 'top');
		$('#md-label-checkall').attr('title', msg);
		$('#md-label-checkall').tooltip();
	}
}

function resortTable(sort_by, sort_order) {
	var actionUrl = $("#" + formName).attr('action');
	var formId = "#" + formName;
	$(formId).find("#_search_sortBy").val(sort_by);
	$(formId).find("#_search_sortOrder").val(sort_order);
	$(formId).find("#_search_page").val(1);
	
	if(typeof ajax_doclist === 'boolean' && ajax_doclist === true) {
		var data = $(formId).serialize();
		if (actionUrl.indexOf('?')==-1){
			actionUrl = actionUrl + '?' + data;
		} else {
			actionUrl = actionUrl + '&' + data;
		}	
		load_page_ajax_content(ajaxDoclistContainer, actionUrl);
	} else {
		$(formId).submit();
	}
}

function update_product_filter_location() {
	if($('#side-left').length > 0) {
		$('#product-attribute-filter-container').prependTo('#side-left');
		$('#product-attribute-filter-container').removeAttr('class');
		
		$('#product-results-container').removeAttr('class');
		$('#product-results-container').addClass('col-xs-12');
	}
}

function update_toggle_productresult_sort() {
	if($('.toggle-productresult-sort').length > 0) {
		var dir = $('#_search_sortOrder').val();
		dir = (dir != '') ? dir : 'ASC';
		
		if(dir == 'ASC') {
			$('.toggle-productresult-sort .mdicon').removeClass('mdicon-sort-desc').addClass('mdicon-sort-asc');
		} else {
			$('.toggle-productresult-sort .mdicon').removeClass('mdicon-sort-asc').addClass('mdicon-sort-desc');
		}
	}
}

/* RESPONSIVE */
var mr = null;
function init_responsive() {
	if(site_responsive) {
		mobile_respond();
		setup_drawer();

		/* DRAWER */
		$(document).on('click', '#mobile-menu-btn', function(e) {
			mobile_drawer_show();
		});
	
		$(document).on('click', '.sidenav-drawer-close', function(e) {
			mobile_drawer_hide();
		});
		
		/* NAV ICONS */
		$(document).on('click', '#accountmobile-btn', function(e) {
			e.preventDefault();
			mobile_account_modal_show();
		});
		
		$(document).on('click', '#mobile-account-modal .close-modal', function(e) {
			e.preventDefault();
			mobile_account_modal_hide();
		});
		
		$(document).on('click', '#help-mobile-btn', function(e) {
			e.preventDefault();
			mobile_help_modal_show();
		});
		
		$(document).on('click', '#mobile-help-modal .close-modal', function(e) {
			e.preventDefault();
			mobile_help_modal_hide();
		});
		
		$(document).on('click', '#searchmobile-btn', function(e) {
			e.preventDefault();
			mobile_search_bar_modal_show();
		});
		
		$(document).on('click', '#mobile-search-bar-modal .close-modal', function(e) {
			e.preventDefault();
			mobile_search_bar_modal_hide();
		});
		
		$(document).on('click', '#recent-items-mobile-btn', function(e) {
			e.preventDefault();
			mobile_recent_items_modal_show();
		});
		
		$(document).on('click', '#mobile-recent-items-modal .close-modal', function(e) {
			e.preventDefault();
			mobile_recent_items_modal_hide();
		});

		$(window).resize(function() {
			clearTimeout(mr);
			mr = setTimeout(function() {
				custom_tab_menus();
			}, 1000);
		});
		
		$(document).on('moduleCategoriesLoaded', load_drawer_categories);
	}
}

function load_drawer_categories() {
	if($('#module-categories').length > 0) {
		var id = $('#module-categories').attr('id');
		var title = $.trim($('#module-categories').find('.title').text());
		var body = $('#module-categories').find('.body').html();
		var html = render_drawer_module(id, title, body);
		var cat = $('#mobile-drawer-module-categories');
		cat.after(html);
		cat.remove();
		
		$('#mobile-drawer-module-categories').find('.edit-panel-toggle').each(function() {
			var rand = CommonUtil.unique_id();
			var toggle_id = $(this).attr('id');
			var toggle_href = $(this).attr('href');
			$(this).attr('id', toggle_id + rand);
			$(this).attr('href', toggle_href + rand);
			
			var panel = $(this).closest('.panel');
			var panel_collapse = panel.find('.panel-collapse');
			var panel_collapse_id = panel_collapse.attr('id');
			panel_collapse.attr('id', panel_collapse_id + rand);
		});
	}
}

function mobile_drawer_hide() {
	$('#mobile-drawer-backdrop').remove();	
	$('#mobile-drawer').css('width', '0');
	$('body').removeClass('modal-open');
}

function mobile_drawer_show() {
	$('#mobile-drawer-backdrop').remove();
	
	$('#mobile-drawer').before('<div class="modal-backdrop fade in" id="mobile-drawer-backdrop"></div>');
	$('#mobile-drawer').css('width', '350px');
	$('body').addClass('modal-open');
		
	var t = setTimeout(function() {
		mobile_respond();
	}, 1000);
}

function mobile_respond() {
	var w = $(window).width();
	var bw = $('#body-main').width();
	
	handle_account_link();
	handle_searchbar();
	handle_footer();
	handle_drawer();
	handle_subnav_tabs();
	handle_recent_items();
	handle_help();
	
	function get_itemlabel(obj) {
		var obj_dc = obj.is('[data-component]') ? obj : obj.find('[data-component]:first');
		var txt = obj_dc.attr('data-component');
		txt = CommonUtil.split_camel_case(txt);
		
		if(obj.children('.item-label').length < 1) {
			var label_text = txt;
			
			if(obj.find('.item-label:first').length > 0) {
				label_text = obj.find('.item-label:first').text();
				label_text = $.trim(label_text);
			}
			
			var html = '<div class="capitalize item-label label-mobile" data-text="' + encodeURIComponent(label_text) + '">' + label_text + '</div>';
			obj.prepend(html);
		}

		var itemlabel = obj.find('.item-label:first');

		if(!itemlabel.is('[data-text]')) {
			itemlabel.attr('data-text', encodeURIComponent( $.trim(itemlabel.text()) ));
		}
		
		return itemlabel;
	}
	
	function handle_account_link() {
		if(w >= 992) {
			$('#tabitem-myaccount').removeAttr('style');
			$('#header-navbar-accountmobile').hide();
			
			if($('#mobile-account-modal').length > 0) {
				BootstrapComponent.close_modal($('#mobile-account-modal'));
				mobile_account_modal_hide();
			}
		} else {
			if($('#header-navbar-accountmobile').length < 1 && $('#tab-myaccount').is(':visible')) {
				var myaccount_clone = $('#tab-myaccount').clone();
				myaccount_clone.prependTo('#header-navbar-items');
				$('#header-navbar-homemobile').prependTo('#header-navbar-items');
				myaccount_clone.attr('id', 'accountmobile-btn');
				
				myaccount_clone.wrap('<div class="header-navbar-item" id="header-navbar-accountmobile"></div>');
				var html = '<i class="material-icons md-icon-account_circle">&#xe853;</i>' + myaccount_clone.text();
				myaccount_clone.html(html);
			
				var menu_clone = $('#modalmenu-tabitem-myaccount').clone();
				menu_clone.attr('id', 'modalmenu-tabitem-myaccountmobile');
				$('#header-navbar-accountmobile').append(menu_clone);
				var href = myaccount_clone.attr('href');
				
				if(href.indexOf('#') == 0) {
					myaccount_clone.attr('href', '#');
				}
			}
			
			$('#tabitem-myaccount').hide();
			$('#header-navbar-accountmobile').removeAttr('style');
		}
	}
	
	function handle_drawer() {
		var header_height = $('.sidenav-drawer-header').outerHeight(true);
		$('.sidenav-drawer-content').css('top', header_height);
		
		if(w >= 992) {
			if($('#mobile-drawer-backdrop').length > 0) {
				$('#drawer-close').trigger('click');
			}
			
			if($('#mobile-drawer #product-attribute-filters').length > 0) {
				$('#product-attribute-filters-placeholder').after($('#mobile-drawer #product-attribute-filters'));
			}
		} else {
			if($('.side-column #product-attribute-filters').length > 0) {
				$('#drawer-product-attribute-filters').empty();
				$('#drawer-product-attribute-filters').append($('.side-column #product-attribute-filters'));
			}

			if($('#dropmenu-content-tab-products').length > 0) {
				if($('#drawer-browse-categories').find('#mobile-drawer-products-tab-categories').length < 1) {
					var body = $('#dropmenu-content-tab-products').html();
					var component = 'module-products-tab-categories';
					var id = 'products-tab-categories';
					var title = $.trim($('#dropmenu-content-tab-products').find('.title').text());
					var html = render_drawer_module(id, title, body, component);
					$('#drawer-browse-categories').html(html);
					$('#drawer-browse-categories').find('.title').remove();
				}
			} else if($('#header-navbar-browse-container').length > 0) {
				if($('#drawer-browse-categories').find('#drawer-browse-container').length < 1) {
					$('#header-navbar-browse-container').clone().appendTo('#drawer-browse-categories');
					$('#drawer-browse-categories').find('#header-navbar-browse-container')
						.addClass('item-label sidenav-drawer-module')
						.attr('id', 'drawer-browse-container');
					$('#drawer-browse-categories').find('#header-navbar-browse')
						.addClass('collapsed drawer-accordion-toggle mobile-toggle')
						.attr('href', '#drawercontent-browsecategories')
						.attr('data-toggle', 'collapse')
						.attr('aria-expanded', 'false')
						.attr('id', 'drawer-browse-categories');
					$('#drawer-browse-container').after('<div class="collapse drawer-accordion-content" id="drawercontent-browsecategories"></div>');
					$('#drawer-browse-categories').find('#header-navbar-browse-menu').remove();
					
					var t = setInterval(function() {
						if(typeof ssDecor === 'object' && ssDecor.get_categories_loaded() === true && $('#header-navbar-browse-categories').length > 0) {
							clearInterval(t);
							
							$('#header-navbar').find('#accordion-categories').clone().appendTo('#drawercontent-browsecategories');
							$('#drawercontent-browsecategories').find('#accordion-categories').attr('id', 'drawer-accordion-categories');
							
							$('#drawer-accordion-categories').find('.edit-panel-toggle').each(function() {
								var href = $(this).attr('href').replace('#', '');
								href = 'drawer-' + href;
								$(this).attr('href', '#' + href);
								
								var pc = $(this).closest('.panel').find('.panel-collapse');
								pc.attr('id', href);
							});
						}
					}, 1000);
				}
			}
		}
	}
	
	function handle_footer() {
		if(w >= 992) {
			$('.accordion-mobile > .footer-column').each(function() {
				var itemlabel = $(this).find('.item-label:first');
				
				if(itemlabel.length > 0) {
					if(!itemlabel.is('[data-text]')) {
						itemlabel.attr('data-text', encodeURIComponent( $.trim(itemlabel.text()) ));
					}
			
					itemlabel.removeClass('collapsible');
			
					if(itemlabel.find('.footer-section-toggle').length > 0) {
						itemlabel.next('div').addClass('in').attr('aria-expanded', true).css('height', 'auto');
					}
			
					var text = decodeURIComponent(itemlabel.attr('data-text'));
					itemlabel.html(text);
				}
				
				$(this).find('.footer-accordion-content .item-label').each(function() {
					$(this).show();
				});
			});
		} else {
			$('.accordion-mobile > .footer-column').each(function() {
				var compnum = $(this).find('[data-component]').length;
				var itemlabel = get_itemlabel($(this));
				var text = decodeURIComponent(itemlabel.attr('data-text'));
				itemlabel.addClass('collapsible');
				var href = '';
				var id = 'panelcontent-' + CommonUtil.unique_id();
				href = id;

				if($(this).find('.footer-accordion-content').length < 1) {
					var content = $(this).find('.item-label:first').nextAll();
					content.wrapAll('<div class="collapse footer-accordion-content" id="' + id + '"></div>');
				}
				
				if(itemlabel.find('.footer-section-toggle').length < 1) {
					href = $(this).find('.footer-accordion-content').attr('id');
					var html = '<a class="collapsed footer-section-toggle mobile-toggle" data-toggle="collapse" href="#' + href + '">' + text + '</a>';
					itemlabel.html(html);
				}

				if(compnum > 1) {
					$(this).find('.footer-accordion-content').find('.item-label:first').hide();
				}
				
				itemlabel.find('.footer-section-toggle').addClass('collapsed').attr('aria-expanded', false);
				itemlabel.next('div').removeClass('in').attr('aria-expanded', false);
				
				$(this).find('.footer-accordion-content .item-label').each(function() {
					var item_text = $.trim( $(this).text() );
					
					if(item_text == text) {
						$(this).hide();
					}
				});
			});
		}
	}
	
	function handle_help() {
		if(w >= 992) {
			$('#header-navbar-help a.modalmenu').attr('id', 'help-btn');

			if($('#mobile-help-modal').length > 0) {
				BootstrapComponent.close_modal($('#mobile-help-modal'));
				mobile_help_modal_hide();
			}
		} else {
			$('#header-navbar-help a.modalmenu').attr('id', 'help-mobile-btn');
		}
	}
	
	function handle_recent_items() {
		if(w >= 992) {
			$('#header-navbar-recentitems a.modalmenu').attr('id', 'recent-items-btn');

			if($('#mobile-recent-items-modal').length > 0) {
				BootstrapComponent.close_modal($('#mobile-recent-items-modal'));
				mobile_recent_items_modal_hide();
			}
		} else {
			$('#header-navbar-recentitems a.modalmenu').attr('id', 'recent-items-mobile-btn');
		}
	}
	
	function handle_searchbar() {
		if(w >= 992) {
			if($('#mobile-search-bar-modal').length > 0) {
				BootstrapComponent.close_modal($('#mobile-search-bar-modal'));
				mobile_search_bar_modal_hide();
			}
			
			$('#header-navbar-search').show();
		} else {
			if($('#mobile-search-bar-modal').length < 1) {
				$('#header-navbar-search').hide();
			}
		}
	}

	function handle_subnav_tabs() {
		$('#header-after-wrapper').find('.nav').each(function() {
			$(this).show();
			var h = $(this).height();
			var tab_height = $(this).find('a:first').outerHeight();
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

			if(h >= tab_break) {
				$(this).hide();
				
				if($('#' + menu_id).length < 1) {
					var html = ' \
						<div class="navtabmenu-wrapper" data-parent="' + id + '" id="' + menu_id + '"> \
							<div class="btn-group"> \
								<button class="btn btn-default" data-toggle="dropdown" type="button">' + CommonUtil.get_locale_text('go_to') + ':</button><button type="button" data-toggle="dropdown" class="btn btn-default dropdown-toggle"><span class="caret"></span><span style="visibility: hidden;">&nbsp;</span></button> \
							</div> \
						</div>';
					$(this).after(html);
					$('#' + menu_id).find('.btn-group').append(links);
				}
				
				$('#' + menu_id).show();
				$('#header-after-wrapper').addClass('has-menu-links');
			} else {
				$(this).show();
				$('#' + menu_id).hide();
				$('#header-after-wrapper').removeClass('has-menu-links');
			}
		});
	}
}

/* MOBILE NAV */
function get_mobile_account_modal_content() {
	$('#mobile-account-modal').find('.loading').remove();
	var content = $('#modalmenu-tabitem-myaccountmobile').clone();
	var content_id = content.attr('id') + '-modalcontent';
	content.attr('id', content_id);
	content.removeAttr('class');
	content.find('#change-catalogs-btn').remove();
	content.find('.selecttomenu-btn').remove();
	content.find('.selecttomenu').removeAttr('data-selecttomenu-setup');
	content.find('.selecttomenu').show();
	content.appendTo( $('#mobile-account-modal-modalbody') );
	content.show();
	init_selecttomenu();
}

function mobile_account_modal_hide() {	
	var t = setTimeout(function() {
		$('#mobile-account-modal').remove();
	}, 1000);
}

function mobile_account_modal_show() {
	if($('#accountmobile-btn').attr('href') != '#') {
		CommonUtil.redirect( $('#accountmobile-btn').attr('href') );
	} else {
		$('#mobile-account-modal').remove();

		BootstrapComponent.modal({
			content: '<div class="loading"></div>',
			id: 'mobile-account-modal',
			show_close_btn: true,
			show_footer: false,
			title: CommonUtil.get_locale_text('account')
		});

		BootstrapComponent.open_modal($('#mobile-account-modal'), { callback: 'get_mobile_account_modal_content' });
	}
}

function get_mobile_help_modal_content() {
	var content = $('#modalmenu-header-navbar-help').html();
	$('#mobile-help-modal-modalbody').html(content);
}

function mobile_help_modal_hide() {
	var t = setTimeout(function() {
		$('#mobile-help-modal').remove();
	}, 1000);
}

function mobile_help_modal_show() {
	$('#mobile-help-modal').remove();

	BootstrapComponent.modal({
		content: '<div class="loading"></div>',
		id: 'mobile-help-modal',
		show_close_btn: true,
		show_footer: false,
		title: CommonUtil.get_locale_text('help')
	});

	BootstrapComponent.open_modal($('#mobile-help-modal'), { callback: 'get_mobile_help_modal_content' });
}

function get_mobile_recent_items_modal_content() {
	var content = $('#modalmenu-header-navbar-recentitems').html();
	$('#mobile-recent-items-modal-modalbody').html(content);
}

function mobile_recent_items_modal_hide() {
	var t = setTimeout(function() {
		$('#mobile-recent-items-modal').remove();
	}, 1000);
}

function mobile_recent_items_modal_show() {
	$('#mobile-recent-items-modal').remove();

	BootstrapComponent.modal({
		content: '<div class="loading"></div>',
		id: 'mobile-recent-items-modal',
		show_close_btn: true,
		show_footer: false,
		title: CommonUtil.get_locale_text('recent_products')
	});

	BootstrapComponent.open_modal($('#mobile-recent-items-modal'), { callback: 'get_mobile_recent_items_modal_content' });
}

function get_mobile_search_bar_modal_content() {
	$('#mobile-search-bar-modal').find('.loading').remove();
	$('#header-navbar-search').appendTo( $('#mobile-search-bar-modal-modalbody') );
	$('#header-navbar-search').show();
}

function mobile_search_bar_modal_hide() {
	$('#header-navbar-search-location').after($('#header-navbar-search'));
	$('#header-navbar-search').hide();

	var t = setTimeout(function() {
		$('#mobile-search-bar-modal').remove();
	}, 1000);
}

function mobile_search_bar_modal_show() {
	$('#mobile-search-bar-modal').remove();

	BootstrapComponent.modal({
		content: '<div class="loading"></div>',
		id: 'mobile-search-bar-modal',
		show_close_btn: true,
		show_footer: false,
		title: CommonUtil.get_locale_text('search')
	});

	BootstrapComponent.open_modal($('#mobile-search-bar-modal'), { callback: 'get_mobile_search_bar_modal_content' });
}

/* SEARCH */
function toggle_mobile_search_bar() {
	if($('#header-navbar-search').is(':visible')) {
		$('#header-navbar-search').hide();
	} else {
		$('#header-navbar-search').show();
	}
}

function update_main_search() {
	if($('#advanced-search-options').length > 0) {
		var opt = '<option data-href="' + $('#advanced-search-options').attr('href') + '">' + CommonUtil.get_locale_text('advsearch') + '</option>';
		$('#decor-search-type').append(opt);
	}
}

/* WINDOW RESIZE */
function handle_window_resize() {
	if(site_responsive) {
		mobile_respond();
	}
}
