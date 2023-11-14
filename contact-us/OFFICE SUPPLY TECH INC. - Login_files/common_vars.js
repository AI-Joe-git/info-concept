CommonUtil.check_for_locale_text([
	{ callback: 'setup_search_options' },
	{ callback: 'setup_storesite_search_options' }
]);

/* AUTOLOAD */
var autoload = {
    'loaded' : [],
    'scripts' : [],
    'queue' : []
};

var autoload_scripts = [
	{ 'type' : 'affix', 'files' : { 'js' : 'jquery.elementaffix.js', 'css' : [] } },
	{ 'type' : 'buttoncomplete', 'files' : { 'js' : 'jquery.buttoncomplete.js', 'css' : [] } },
	{ 'type' : 'buttoncompletemenu', 'files' : { 'js' : 'jquery.buttoncompletemenu.js', 'css' : [] } },
	{ 'type' : 'colcarousel', 'files' : { 'js' : 'jquery.colcarousel.js', 'css' : [] } },
	{ 'type' : 'colorbox', 'files' : { 'js' : 'colorbox/jquery.colorbox-min.js', 'css' : [globals.staticResourceBaseUrl + '/js/colorbox/colorbox.css'] } },
	{ 'type' : 'colorpicker', 'files' : { 'js' : 'colorpicker/js/colorpicker.js', 'css' : [globals.staticResourceBaseUrl + '/js/colorpicker/css/colorpicker.css'] } },
	{ 'type' : 'connectedmenus', 'files' : { 'js' : 'jquery.connectedmenus.js', 'css' : [] } },
	{ 'type' : 'editinline', 'files' : { 'js' : 'jquery.editinline.js', 'css' : [] } },
	{ 'type' : 'filecabinet', 'files' : { 'js' : 'FileCabinet.js', 'css' : [] } },
	{ 'type' : 'foldtoascii', 'files' : { 'js' : 'fold_to_ascii.js', 'css' : [] } },
	{ 'type' : 'gallery', 'files' : { 'js' : 'jquery.colgallery.js', 'css' : [] } },
	{ 'type' : 'googlechart', 'files' : { 'js' : 'GoogleChart.js', 'css' : [] } },
	{ 'type' : 'inputautocomplete', 'files' : { 'js' : 'jquery.inputautocomplete.js', 'css' : [] } },
	{ 'type' : 'lineitemreorder', 'files' : { 'js' : 'jquery.lineitemreorder.js', 'css' : [] } },
	{ 'type' : 'linkedstatelist', 'files' : { 'js' : 'jquery.linkedstatelist.js', 'css' : [] } },
	{ 'type' : 'jqgrid', 'files' : { 'js' : 'jquery.jqGrid.min.js', 'css' : [globals.staticResourceBaseUrl + '/css/ui.jqgrid.css'] } },
	{ 'type' : 'jqgridlang', 'files' : { 'js' : 'i18n/grid.locale-en.js', 'css' : [] } },
	{ 'type' : 'jqueryui', 'files' : { 'js' : 'jquery-ui-1.9.2.custom.min.js', 'css' : [globals.staticResourceBaseUrl + '/css/smoothness/jquery-ui-1.9.2.custom.css'] } },
	{ 'type' : 'jstable', 'files' : { 'js' : 'jquery.jstable.js', 'css' : [] } },
	{ 'type' : 'stickyfooter', 'files' : { 'js' : 'jquery.stickyfooter.js', 'css' : [] } },
	{ 'type' : 'savebutton', 'files' : { 'js' : 'jquery.savebutton.js', 'css' : [] } },
	{ 'type' : 'tablesort', 'files' : { 'js' : 'jquery.tablesort.js', 'css' : [] } },
	{ 'type' : 'texteditor', 'files' : { 'js' : 'RichTextEditor.js', 'css' : [] } },
	{ 'type' : 'fileuploader', 'files' : { 'js' : 'FileUploader.js', 'css' : [] } }
];

/* AUTOSAVE ON AWAY */
var autosave_event = null;
var autosave_original_form_data = '';
var autosave_page = false;
var autosave_redirect_url = '';
var autosave_redirect_url_override = '';

/* COMPONENTS */
var CUSTOM_HTML_COMPONENT_PREFIX = 'customHtmlId';
var CUSTOM_CAROUSEL_COMPONENT_PREFIX = 'customCarouselId';

/* DOCS */
var ajax_doclist = false;
var storage_currentdocumentid = 'currentDocumentId';
var storage_currentpagelocation = 'currentPageLocation';
var storage_doclistpage = 'docListPage';
var storage_allcontactspage = 'allContactsPage';
var storage_pagehistorylocation = 'pageHistoryLocation';
var storage_docactions = 'docActions';
var storage_posubmissionattempts = 'poSubmissionAttempts';

/* FAVORITES */
var storage_favoritesviewurl = 'favoritesViewUrl';

/* FILE CABINET */
var storage_filecabinetview = 'fileCabinetView';

/* FILE UPLOAD */
var allowed_file_types = [
	{ 'type' : 'application/msword', 'ext' : 'doc', 'display' : 'MS Word', 'signature' : ['D0CF11E0'] }, 
	{ 'type' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'ext' : 'docx', 'display' : 'MS Word', 'signature' : ['504B34'] }, 
	{ 'type' : 'application/vnd.ms-excel', 'ext' : 'xls', 'display' : 'MS Excel', 'signature' : ['D0CF11E0'] }, 
	{ 'type' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'ext' : 'xlsx', 'display' : 'MS Excel', 'signature' : ['504B34'] }, 
	{ 'type' : 'application/vnd.ms-powerpoint', 'ext' : 'ppt', 'display' : 'MS Powerpoint', 'signature' : ['D0CF11E0'] }, 
	{ 'type' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'ext' : 'pptx', 'display' : 'MS Powerpoint', 'signature' : ['504B34'] }, 
	{ 'type' : 'application/pdf', 'ext' : 'pdf', 'display' : 'PDF', 'signature' : ['25504446'] }, 
	{ 'type' : 'text/csv', 'ext' : 'csv', 'display' : 'CSV', 'signature' : [] }, 
	{ 'type' : 'text/plain', 'ext' : 'txt', 'display' : 'Text', 'signature' : [] }, 
	{ 'type' : 'text/rtf', 'ext' : 'rtf', 'display' : 'Rich Text Format', 'signature' : ['7B5C7274'] }, 
	{ 'type' : 'text/html', 'ext' : 'html', 'display' : 'HTML', 'signature' : [] }, 
	{ 'type' : 'image/png', 'ext' : 'png', 'display' : 'PNG', 'signature' : ['89504E47'] }, 
	{ 'type' : 'image/gif', 'ext' : 'gif', 'display' : 'GIF', 'signature' : ['47494638'] }, 
	{ 'type' : 'image/jpeg', 'ext' : 'jpg', 'display' : 'JPG', 'signature' : ['FFD8FFDB','FFD8FFE0','FFD8FFE1'] },
	{ 'type' : 'image/jpeg', 'ext' : 'jpeg', 'display' : 'JPEG', 'signature' : ['FFD8FFDB','FFD8FFE0','FFD8FFE1'] },
	{ 'type' : 'image/x-icon', 'ext' : 'ico', 'display' : 'ICO', 'max_width' : '32', 'max_height' : '32', 'signature' : ['0010', 'FFD8FFE0'] },
	{ 'type' : 'application/vnd.ms-outlook', 'ext' : 'msg', 'display' : 'MSG', 'signature' : [] },
	{ 'type' : 'message/rfc822', 'ext' : 'eml', 'display' : 'EML', 'signature' : [] }
];

var allowed_filecabinet_file_types = [
	{ 'type' : 'application/msword', 'ext' : 'doc', 'display' : 'MS Word', 'signature' : ['D0CF11E0'] },
	{ 'type' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'ext' : 'docx', 'display' : 'MS Word', 'signature' : ['504B34'] },
	{ 'type' : 'application/vnd.ms-excel', 'ext' : 'xls', 'display' : 'MS Excel', 'signature' : ['D0CF11E0'] },
	{ 'type' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'ext' : 'xlsx', 'display' : 'MS Excel', 'signature' : ['504B34'] },
	{ 'type' : 'application/vnd.ms-powerpoint', 'ext' : 'ppt', 'display' : 'MS Powerpoint', 'signature' : ['D0CF11E0'] },
	{ 'type' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'ext' : 'pptx', 'display' : 'MS Powerpoint', 'signature' : ['504B34'] },
	{ 'type' : 'application/pdf', 'ext' : 'pdf', 'display' : 'PDF', 'signature' : ['25504446'] },
	{ 'type' : 'text/csv', 'ext' : 'csv', 'display' : 'CSV', 'signature' : [] },
	{ 'type' : 'text/plain', 'ext' : 'txt', 'display' : 'Text', 'signature' : [] },
	{ 'type' : 'text/rtf', 'ext' : 'rtf', 'display' : 'Rich Text Format', 'signature' : ['7B5C7274'] },
	{ 'type' : 'text/html', 'ext' : 'html', 'display' : 'HTML', 'signature' : [] },
	{ 'type' : 'application/vnd.ms-outlook', 'ext' : 'msg', 'display' : 'MSG', 'signature' : [] },
	{ 'type' : 'message/rfc822', 'ext' : 'eml', 'display' : 'EML', 'signature' : [] },
	{ 'type' : 'application/pdf', 'ext' : 'pdf', 'display' : 'PDF', 'signature' : ['25504446'] }
];

var allowed_image_file_types = [
	{ 'type' : 'image/png', 'ext' : 'png', 'display' : 'PNG', 'max_width' : '', 'max_height' : '', 'signature' : ['89504E47'] }, 
	{ 'type' : 'image/gif', 'ext' : 'gif', 'display' : 'GIF', 'max_width' : '', 'max_height' : '', 'signature' : ['47494638'] }, 
	{ 'type' : 'image/jpeg', 'ext' : 'jpg', 'display' : 'JPG', 'max_width' : '', 'max_height' : '', 'signature' : ['FFD8FFDB','FFD8FFE0','FFD8FFE1'] },
	{ 'type' : 'image/jpeg', 'ext' : 'jpeg', 'display' : 'JPEG', 'max_width' : '', 'max_height' : '', 'signature' : ['FFD8FFDB','FFD8FFE0','FFD8FFE1'] },
	{ 'type' : 'image/x-icon', 'ext' : 'ico', 'display' : 'ICO', 'max_width' : '32', 'max_height' : '32', 'signature' : ['0010', 'FFD8FFE0'] }
];

var import_file_types = [
	{ 'type' : 'application/vnd.ms-excel', 'ext' : 'xls', 'display' : 'MS Excel', 'signature' : ['D0CF11E0'] },
	{ 'type' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'ext' : 'xlsx', 'display' : 'MS Excel', 'signature' : ['504B34'] },
	{ 'type' : 'text/csv', 'ext' : 'csv', 'display' : 'CSV', 'signature' : [] },
	{ 'type' : 'text/tab-separated-values', 'ext' : 'tsv', 'display' : 'TSV', 'signature' : [] }
];

var excluded_file_types = [
	{ 'type' : 'application/octet-stream', 'ext' : 'exe', 'display' : 'EXE', 'signature' : ['4D5A500','4D5A'] }
];

/* IMAGEPICKER */
var imagepicker_loaded = [];

/* LOCALE */
var locale_text;

/* LOGIN MESSAGE */
var storage_initial_login = 'initialLogin';

/* JS LOADED */
var js_document_loaded = false;
var js_list_loaded = false;
var js_quote_loaded = false;
var js_rma_loaded = false;

/* NAVIGATE AWAY */
var navigateaway_original_form_data = '';

/* SEARCH OPTIONS - populate #decor-search-field */
var search_options = [];
var storesite_search_options = [];

function setup_search_options() {
	search_options["ds_products"] = [
		{ 'locale_key' : 'keyword', 'name' : 'Keyword', 'value' : 'all' },
		{ 'locale_key' : 'part_number_hashtag', 'name' : 'Part #', 'value' : 'part_number' }
	];
	search_options["ds_productsnew"] = [
		{ 'locale_key' : 'keyword', 'name' : 'Keyword', 'value' : 'all' },
		{ 'locale_key' : 'part_number_hashtag', 'name' : 'Part #', 'value' : 'part_number' }
	];
	search_options["ds_laborservices"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'name', 'name' : 'Name', 'value' : 'name' },
		{ 'locale_key' : 'vendor', 'name' : 'Vendor', 'value' : 'mfr' },
		{ 'locale_key' : 'item_number_hashtag', 'name' : 'Item #', 'value' : 'pn' }
	];
	search_options["ds_paragraphs"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'title', 'name' : 'Title', 'value' : 'title' },
		{ 'locale_key' : 'description', 'name' : 'Description', 'value' : 'description' }
	];
	search_options["dsk-ProductsSS"] = [
		{ 'locale_key' : 'keyword', 'name' : 'Keyword', 'value' : 'all' },
		{ 'locale_key' : 'mfr_partnum_hashtag', 'name' : 'Mfr Part #', 'value' : 'part_no_storesite' }
	];
	search_options["ds_customers"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'email', 'name' : 'E-mail', 'value' : 'email' },
		{ 'locale_key' : 'company', 'name' : 'Company', 'value' : 'customer_name_with_location_code' },
		{ 'locale_key' : 'customer_number_hashtag', 'name' : 'Customer #', 'value' : 'customer_number_hidden' },
		{ 'locale_key' : 'contact', 'name' : 'Contact', 'value' : 'contact' },
		{ 'locale_key' : 'city', 'name' : 'City', 'value' : 'company_city' },
		{ 'locale_key' : 'state', 'name' : 'State', 'value' : 'company_state_abbname' },
        { 'locale_key' : 'contact_catalog', 'name' : 'Contact Catalog', 'value' : 'contact_catalog' },
        { 'locale_key' : 'price_profile', 'name' : 'Price Profile', 'value' : 'price_profile' },
		{ 'locale_key' : 'price_tier', 'name' : 'Price Tier', 'value' : 'price_tier' },
		{ 'locale_key' : 'unspsc_profile', 'name' : 'UNSPSC Profile', 'value' : 'unspsc_profile' }
	];
	search_options["ds_catalogs"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'rule', 'name' : 'Rule', 'value' : 'rule' }
	];
	search_options["dsk-SunQuote"] = [
		{ 'locale_key' : 'sun_quote_num_hashtag', 'name' : 'Sun Quote #', 'value' : 'sun_quote_number' }
	];
	search_options["ds_recyclebin_customer"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' }
	];
	search_options["ds_quotesorders1"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'doc_number_hashtag', 'name' : 'Doc #', 'value' : 'quote_number_search' },
		{ 'locale_key' : 'type', 'name' : 'Type', 'value' : 'document_type_search' },
		{ 'locale_key' : 'description', 'name' : 'Description', 'value' : 'description' },
		{ 'locale_key' : 'company', 'name' : 'Company', 'value' : 'customer_name' },
		{ 'locale_key' : 'contact', 'name' : 'Contact', 'value' : 'contact_name' },
		{ 'locale_key' : 'customer_po', 'name' : 'Customer PO', 'value' : 'endUserPoNumber' },
		{ 'locale_key' : 'modified_by', 'name' : 'Modified By', 'value' : 'savedByName' },
		{ 'locale_key' : 'created_by', 'name' : 'Created By', 'value' : 'createdByName_hidden' }
	];
	search_options["ds_invoice"] = [ 
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'doc_number_hashtag', 'name' : 'Doc #', 'value' : 'quoteNumber' },
		{ 'locale_key' : 'type', 'name' : 'Type', 'value' : 'document_type_search' },
		{ 'locale_key' : 'description', 'name' : 'Description', 'value' : 'description' },
		{ 'locale_key' : 'company', 'name' : 'Company', 'value' : 'customer_name' },
		{ 'locale_key' : 'contact', 'name' : 'Contact', 'value' : 'contact_name' },
		{ 'locale_key' : 'customer_po', 'name' : 'Customer PO', 'value' : 'endUserPoNumber' },
		{ 'locale_key' : 'modified_by', 'name' : 'Modified By', 'value' : 'savedByName' },
		{ 'locale_key' : 'created_by', 'name' : 'Created By', 'value' : 'createdByName_hidden' }
	];
	search_options["ds_proposals"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'doc_number_hashtag', 'name' : 'Doc #', 'value' : 'quoteNumber' },
		{ 'locale_key' : 'description', 'name' : 'Description', 'value' : 'description' },
		{ 'locale_key' : 'company', 'name' : 'Company', 'value' : 'customerLink' },
		{ 'locale_key' : 'contact', 'name' : 'Contact', 'value' : 'contactLink' }
	];
	search_options["ds_rma"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'doc_number_hashtag', 'name' : 'Doc #', 'value' : 'quoteNumber' },
		{ 'locale_key' : 'description', 'name' : 'Description', 'value' : 'description' },
		{ 'locale_key' : 'company', 'name' : 'Company', 'value' : 'customerLink' },
		{ 'locale_key' : 'contact', 'name' : 'Contact', 'value' : 'contactLink' }
	];
	search_options["ds_porma"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'rma_number_hashtag', 'name' : 'RMA #', 'value' : 'quoteNumber' },
		{ 'locale_key' : 'description', 'name' : 'Description', 'value' : 'description' },
		{ 'locale_key' : 'supplier', 'name' : 'Supplier', 'value' : 'partyName' },
		{ 'locale_key' : 'buyer', 'name' : 'Buyer', 'value' : 'createdBy' }
	];
	search_options["ds_quotesrecyclebin"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'doc_number_hashtag', 'name' : 'Doc #', 'value' : 'quote_number' },
		{ 'locale_key' : 'type', 'name' : 'Type', 'value' : 'document_type' },
		{ 'locale_key' : 'description', 'name' : 'Description', 'value' : 'description' },
		{ 'locale_key' : 'company', 'name' : 'Company', 'value' : 'customer_name' },
		{ 'locale_key' : 'contact', 'name' : 'Contact', 'value' : 'contact_name' },
		{ 'locale_key' : 'customer_po', 'name' : 'Customer PO', 'value' : 'endUserPoNumber' },
		{ 'locale_key' : 'modified_by', 'name' : 'Modified By', 'value' : 'saved_by_name' },
		{ 'locale_key' : 'created_by', 'name' : 'Created By', 'value' : 'created_by_name' },
		{ 'locale_key' : 'document_notes', 'name' : 'Document Notes', 'value' : 'external_notes' },
		{ 'locale_key' : 'internal_notes', 'name' : 'Internal Notes', 'value' : 'internal_notes' },
		{ 'locale_key' : 'total', 'name' : 'Total', 'value' : 'total' }
	];
	search_options["ds_po"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'po_number_hashtag', 'name' : 'PO #', 'value' : 'quote_number' },
		{ 'locale_key' : 'supplier', 'name' : 'Supplier', 'value' : 'vendor_name_no_link' },
		{ 'locale_key' : 'type', 'name' : 'Type', 'value' : 'po_type' },
		{ 'locale_key' : 'description', 'name' : 'Description', 'value' : 'description' },
		{ 'locale_key' : 'buyer_name', 'name' : 'Buyer Name', 'value' : 'buyer' },
		{ 'locale_key' : 'end_user_po', 'name' : 'End User PO', 'value' : 'end_user_po_number' },
		{ 'locale_key' : 'confirmation_number_hashtag', 'name' : 'Confirmation #', 'value' : 'confirmation_number' },
		{ 'locale_key' : 'document_notes', 'name' : 'Document Notes', 'value' : 'external_notes' }
	];
	search_options["ds_recyclebin_po"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'po_number_hashtag', 'name' : 'PO #', 'value' : 'quote_number' },
		{ 'locale_key' : 'supplier', 'name' : 'Supplier', 'value' : 'vendor_name' },
		{ 'locale_key' : 'type', 'name' : 'Type', 'value' : 'is_autofulfill' },
		{ 'locale_key' : 'description', 'name' : 'Description', 'value' : 'description' },
		{ 'locale_key' : 'buyer_name', 'name' : 'Buyer Name', 'value' : 'created_by_name' },
		{ 'locale_key' : 'end_user_po', 'name' : 'End User PO', 'value' : 'end_user_po_number' },
		{ 'locale_key' : 'confirmation_number_hashtag', 'name' : 'Confirmation #', 'value' : 'confirmation_number' },
		{ 'locale_key' : 'document_notes', 'name' : 'Document Notes', 'value' : 'external_notes' },
		{ 'locale_key' : 'internal_notes', 'name' : 'Internal Notes', 'value' : 'internal_notes' },
		{ 'locale_key' : 'total', 'name' : 'Total', 'value' : 'total' }
	];
	search_options["dsk-Order"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'doc_number_hashtag', 'name' : 'Doc #', 'value' : 'quote_number' },
		{ 'locale_key' : 'type', 'name' : 'Type', 'value' : 'document_type' },
		{ 'locale_key' : 'description', 'name' : 'Description', 'value' : 'description' },
		{ 'locale_key' : 'contact', 'name' : 'Contact', 'value' : 'contact_name' },
		{ 'locale_key' : 'po_number_hashtag', 'name' : 'PO #', 'value' : 'end_user_po_number' },
		{ 'locale_key' : 'modified_by', 'name' : 'Modified By', 'value' : 'saved_by_name' },
		{ 'locale_key' : 'created_by', 'name' : 'Created By', 'value' : 'created_by_name' },
		{ 'locale_key' : 'document_notes', 'name' : 'Document Notes', 'value' : 'external_notes' },
		{ 'locale_key' : 'total', 'name' : 'Total', 'value' : 'total' }
	];
	search_options["ds_priceprofile"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'rule', 'name' : 'Rule', 'value' : 'rule' }
	];
	search_options["ds_recyclebin_price"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' }
	];
	search_options["ds_productnews"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'title', 'name' : 'Title', 'value' : 'title' },
		{ 'locale_key' : 'summary', 'name' : 'Summary', 'value' : 'hometext' },
		{ 'locale_key' : 'content', 'name' : 'Content', 'value' : 'bodytext' }
	];
	search_options["ds_salesteam"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' }
	];
	search_options["ds_recyclebin_sales"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' }
	];
	search_options["ds_suppliers"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' }
	];
	search_options["ds_recyclebin_suppliers"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' }
	];
}

function setup_storesite_search_options() {
	storesite_search_options["ds_products_ss"] = [
		{ 'locale_key' : 'keyword', 'name' : 'Keyword', 'value' : 'all' },
		{ 'locale_key' : 'mfr_partnum_hashtag', 'name' : 'Mfr Part #', 'value' : 'part_no_storesite' }
	];

	storesite_search_options["ds_order"] = [
		{ 'locale_key' : 'all', 'name' : 'All', 'value' : 'all' },
		{ 'locale_key' : 'doc_number_hashtag', 'name' : 'Doc #', 'value' : 'quote_number_search' },
		{ 'locale_key' : 'type', 'name' : 'Type', 'value' : 'document_type_search' },
		{ 'locale_key' : 'description', 'name' : 'Description', 'value' : 'description' },
		{ 'locale_key' : 'contact', 'name' : 'Contact', 'value' : 'contact_name' },
		{ 'locale_key' : 'po_number_hashtag', 'name' : 'PO #', 'value' : 'endUserPoNumber' },
		{ 'locale_key' : 'modified_by', 'name' : 'Modified By', 'value' : 'savedByName' },
		{ 'locale_key' : 'created_by', 'name' : 'Created By', 'value' : 'createdByName_hidden' },
		{ 'locale_key' : 'document_notes', 'name' : 'Document Notes', 'value' : 'externalNotes' },
		{ 'locale_key' : 'total', 'name' : 'Total', 'value' : 'total' }
	];
}

/* SELECTED SEARCH - select the #decor-search-type based on the page */
var selected_search = [];
selected_search['ds_products'] = [ {path:'/Quotes/standard_view.epl?Action=create', rank:0}, {path:'/Rmas/standard',rank:0}, {path:'/Proposals/standard',rank:0}, {path:'/Pos/postandard',rank:0} ];
selected_search['ds_productsnew'] = [ {path:'/Products/all', rank:0}, {path:'/Products/category', rank:0}, {path:'/Products/manufacturer', rank:0}, {path:'/Products/supplier', rank:0} ];
selected_search['ds_laborservices'] = [ {path:'/Commodity/service', rank:0}, {path:'/Commodity/labor', rank:0}, {path:'/Commodity/search', rank:0}, {path:'/Products/?id=V', rank:0} ];
selected_search['ds_paragraphs'] = [ {path:'/Products/paragraph', rank:0} ];
selected_search['ds_quotesorders1'] = [ {path:'/Docs/list', rank:0} , {path:'/Docs/listQuotes', rank:0} , {path:'/Docs/listOrders', rank:0} , {path:'/Quotes/list_quotes', rank:0}, {path:'/Quotes/standard',rank:0}, {path:'/Quotes/view_quote',rank:0} ];
selected_search['ds_invoice'] = [ {path:'/Docs/listInvoices', rank:1} ];
selected_search['ds_proposals'] = [ {path:'/Proposals/list', rank:0} ];
selected_search['ds_rma'] = [ {path:'/Rmas/list', rank:0} ];
selected_search['ds_po'] = [ {path:'/Pos/poList', rank:0}, {path:'/Pos', rank:0} ];
selected_search['ds_sns'] = [ {path:'/Docs/serial', rank:0} ];
selected_search['ds_customers'] = [ {path:'/Customers/', rank:0}, {path:'/Quotes/customer_view', rank:0} ];
selected_search['ds_suppliers'] = [ {path:'/Suppliers/view', rank:0}, {path:'/Quotes/supplier_view', rank:0}, {path:'/Quotes/view_suppliers', rank:0}, {path:'/Settings/Suppliers', rank:0}, {path:'/Suppliers/', rank:0} ];
selected_search['ds_priceprofile'] = [ {path:'/Pricing_Profiles', rank:0}, {path:'/Pricing/list', rank:0}, {path:'/Pricing/standard', rank:0} ];
selected_search['ds_salesteam'] = [ {path:'/SalesTeam', rank:0}, {path:'/Preferences/preferences', rank:0}, {path:'/User/role/list', rank:0} ];
selected_search['ds_catalogs'] = [ {path:'/Catalogs', rank:0} ];
selected_search['ds_productnews'] = [ {path:'/News/', rank:0} ];
selected_search['ds_quotesrecyclebin'] = [ {path:'/Docs/list?deleted=true', rank:0} ];
selected_search['ds_recyclebin_po'] = [ {path:'/Quotes/list_pos.epl?deleted', rank:0} ];
selected_search['ds_recyclebin_suppliers'] = [ {path:'/Quotes/list_deleted_suppliers', rank:0} ];
selected_search['ds_recyclebin_customer'] = [ {path:'/Customers/list?deleted=true', rank:0} ];
selected_search['ds_recyclebin_sales'] = [ {path:'/Sales_Team/view_deleted_sales', rank:0} ];
selected_search['ds_recyclebin_price'] = [ {path:'/Pricing_Profiles/list_pricing.epl?ShowDeleted=1', rank:1} ];

/* MAIN TAB - set the active tab */
var main_tabs = [];
main_tabs['tab-home'] = [ {path:'home/index', rank:0}, {path:globals.basePerlUrl, rank:0, exact:true}, {path:globals.basePerlUrl + '/', rank:0, exact:true} ];
main_tabs['tab-customers'] = [ {path:'/Customers', rank:0}, {path:'company_contact', rank:0}, {path:'view_customers', rank:0}, {path:'view_deleted_customers', rank:0} ];
main_tabs['tab-products'] = [ {path:'/Category', rank:0}, {path:'/Search', rank:0}, {path:'/Products', rank:0} ];
main_tabs['tab-none'] = [ {path:'/Commodity/tags', rank:0} ];
main_tabs['tab-services'] = [ {path:'/Commodity/search', rank:0}, {path:'/Commodity/items/list', rank:0}, {path:'/Products/?id=V', rank:0} ];
main_tabs['tab-docs'] = [ {path:'/Docs', rank:0}, {path:'/Docs/linkedpos', rank:0}, {path:'/Proposals', rank:0}, {path:'/Rmas/standard', rank:0}, {path:'Rmas/selectedSupplier', rank:0}, {path:'/Rmas/allSuppliers', rank:0}, {path:'/Rmas/list', rank:0} ];
main_tabs['tab-supplier'] = [{path:'/Suppliers/view', rank:0}, {path:'/supplier_view', rank:0}, {path:'/view_suppliers', rank:0}, {path:'/Suppliers/list', rank:0} ];
main_tabs['tab-po'] = [{path:'/Rmas/poList', rank:0}, {path:'/Pos/poList', rank:0}, {path:'/list_pos', rank:0}, {path:'/purchase_order', rank:0}, {path:'/Rmas/postandard', rank:0} ];
main_tabs['tab-document-active'] = [ {path:'/billingshipping', rank:0}, {path:'/Docs/billingshipping', rank:1}, {path:'/Docs/paymentDelivery', rank:1} ];

var main_tabs_storesite = [];
main_tabs_storesite['tab-home'] = [ {path:'/sDashboard', rank:0} ];
main_tabs_storesite['tab-products'] = [ {path:'/Products', rank:0} ];
main_tabs_storesite['tab-cart'] = [ {path:'/Docs/cart', rank:0} ];
main_tabs_storesite['tab-checkout'] = [ {path:'/Docs/continuecheckout', rank:1}, {path:'/Docs/paymentDelivery', rank:1}, {path:'/Docs/reviewOrder', rank:1}, {path:'/Docs/finalizePayment', rank:1}, {path:'&quote_validation=', rank:1} ];
main_tabs_storesite['tab-activity'] = [ {path:'/Docs/list', rank:1}, , {path:'/Rmas/standard', rank:0},  {path:'/Docs/cart', rank:0} ];

/* LEFT NAV - set the active left nav */
var left_navs = [];
/* Admin */
left_navs['crm-controlpane-acctcoladmin'] = [ {path:'/account_services', rank:0} ];
left_navs['crm-controlpane-catalog_admin'] = [ {path:'/Catalogs', rank:0}, {path:'/edit_catalog', rank:0} ];
left_navs['crm-controlpane-companysettings'] = [ {path:'/Settings/admin_disclaimers', rank:0}, {path:'/Settings/addresses', rank:0}, {path:'/Settings/external_links', rank:0}, {path:'/Settings/reseller_custom_fields', rank:0}, {path:'/Settings/intl_addresses', rank:0}, {path:'/Settings/survey', rank:0}, {path:'/Settings/companydetails', rank:0}, {path:'/Address', rank:0} ];
left_navs['crm-controlpane-cpas_admin'] = [ {path:'/Settings/cpas_admin', rank:0} ];
left_navs['crm-controlpane-deliverymethods'] = [ {path:'/Settings/delivery_methods', rank:0}, {path:'/Settings/generic_shipping', rank:0}, {path:'/Settings/Carrier', rank:0} ];
left_navs['crm-controlpane-designer'] = [ {path:'/pageschemas', rank:0}, {path:'/Settings/esign', rank:0}];
left_navs['crm-controlpane-favadmin'] = [ {path:'/Favorites', rank:0} ];
left_navs['crm-controlpane-gallery'] = [ {path:'/Settings/gallery', rank:0} ];
left_navs['crm-controlpane-importexport'] = [ {path:'/ImportExport/ASCII', rank:0}, {path:'/ImportExport/index', rank:0}, {path:'/ImportExport/XML', rank:0}, {path:'/ImportExport/XmlSettings', rank:0} ];
left_navs['crm-controlpane-integration'] = [ {path:'/Integration', rank:0} ];
left_navs['crm-controlpane-itemsadmin'] = [ {path:'/Commodity/edit', rank:0}, {path:'/Commodity/labor/list', rank:0}, {path:'/Commodity/service/list', rank:0}, {path:'/Products/item_admin', rank:0}, {path:'/Products/view_custom_items', rank:0}, {path:'/Products/Edit/?mapping_id', rank:0}, {path:'/Products/Paragraphs', rank:0}, {path:'/Products/Bundles', rank:0}, {path:'/Products/custom_categories.epl', rank:0}, {path:'/CatLedgerCodes/view', rank:0}, {path:'/Products/custom_manufacturers', rank:0}, {path:'/Products/category_display', rank:0} ];
left_navs['crm-controlpane-marketcoupons'] = [ {path:'/Marketing', rank:0} ];
left_navs['crm-controlpane-paymentoptions'] = [ {path:'/Settings/admin_payment', rank:0} ];
left_navs['crm-controlpane-personsalesteam'] = [ {path:'/Sales_Team', rank:0}, {path:'/User', rank:0} ];
left_navs['crm-controlpane-priceprofiles'] = [ {path:'/Pricing_Profiles', rank:0} ];
left_navs['crm-controlpane-punchoutoutgoing'] = [ {path:'/Settings/punch_out_connections', rank:0}, {path:'/Settings/view_punch_out', rank:0} ];
left_navs['crm-controlpane-rmas'] = [ {path:'/Reports/Rmas', rank:0}, {path:'report_type=rma', rank:0} ];
left_navs['crm-controlpane-storesite'] = [ {path:'/Settings/External/create_store', rank:0}, {path:'/Settings/External/storesite', rank:0}, {path:'/Settings/create_edit_message', rank:0}, {path:'/Settings/support_messages', rank:0} ];
left_navs['crm-controlpane-suppdistributors'] = [ {path:'/Settings/Suppliers', rank:0} ];
left_navs['crm-controlpane-systememails'] = [ {path:'/Settings/Email', rank:0} ];
left_navs['crm-controlpane-taxprofile'] = [ {path:'/Settings/modify_tax_profile', rank:0} ];
left_navs['crm-controlpane-unspsc'] = [ {path:'/Unspsc', rank:0} ];
/* Reports */
left_navs['crm-controlpane-companysales'] = [ {path:'/Reports/Sales', rank:0}, {path:'Reports/saved_reports.epl?report_type=so', rank:0} ];
left_navs['crm-controlpane-customerreport'] = [ {path:'/Reports/Customer', rank:0}, {path:'Reports/saved_reports.epl?report_type=cu', rank:0} ];
left_navs['crm-controlpane-posales'] = [ {path:'/Reports/Purchases', rank:0}, {path:'/Reports/saved_reports.epl?report_type=po', rank:0} ];
left_navs['crm-controlpane-sitespeed'] = [ {path:'/Reports/sitespeed', rank:0}, {path:'/Reports/saved_reports.epl?report_type=rma', rank:0} ];
left_navs['crm-controlpane-storesiteviews'] = [ {path:'/Reports/storesite', rank:0} ];
/* CS */
left_navs['crm-controlpane-ads'] = [ {path:'/Admin/ads', rank:0} ];
left_navs['crm-controlpane-alerts'] = [ {path:'/Admin/alerts', rank:0} ];
left_navs['crm-controlpane-attributes'] = [ {path:'/Admin/product_attributes', rank:0} ];
left_navs['crm-controlpane-crons'] = [ {path:'/Admin/Dashboard', rank:0} ];
left_navs['crm-controlpane-database'] = [ {path:'/Admin/authkeys', rank:0}, {path:'/Admin/details', rank:0}, {path:'/Admin/fields', rank:0}, {path:'/Admin/index', rank: 0}, {path:'/Admin/misc', rank: 0}, {path:'/Admin/passwords', rank:0} ];
left_navs['crm-controlpane-downloads'] = [ {path:'/Admin/download', rank: 0} ];
left_navs['crm-controlpane-help'] = [ {path:'/Admin/HelpCenter', rank: 0} ];
left_navs['crm-controlpane-internalreports'] = [ {path:'/Admin/Reports', rank: 0} ];
left_navs['crm-controlpane-mass_email'] = [ {path:'/Admin/mass_email', rank:0} ];
left_navs['crm-controlpane-messages'] = [ {path:'/Admin/edit_message', rank:0}, {path:'/Admin/messages', rank:0} ];
left_navs['crm-controlpane-metamap'] = [ {path:'/Admin/Metamap', rank:0} ];
left_navs['crm-controlpane-news'] = [ {path:'/Admin/News', rank:0} ];
left_navs['crm-controlpane-partners'] = [ {path:'/Admin/edit_brand', rank:0}, {path:'/Admin/partners', rank:0} ];
left_navs['crm-controlpane-punchout'] = [ {path:'/Admin/Punchout', rank:0} ];
left_navs['crm-controlpane-systemerrors'] = [ {path:'/display_alert', rank:0} ];
left_navs['crm-controlpane-userlist'] = [ {path:'/Admin/userlist', rank:0} ];

/* ORGANIZER */
var storage_organizerminiitemid = 'decorOrganizerMiniItemID';
var storage_organizerminifieldtype = 'decorOrganizerMiniFieldType';
var storage_organizerminiitemtype = 'decorOrganizerMiniItemType';
var storage_organizerminidata = 'decorOrganizerMiniData';
var storage_organizershowcomplete = 'decorOrganizerShowComplete';
var storage_organizerminiposition = 'decorOrganizerMiniPosition';
var storage_organizerministate = 'decorOrganizerMiniState';

/* PRODUCTS */
var storage_productsearchresultlocationsearch = 'productSearchResultLocationSearch';
var storage_productsearchresultselections = 'productSearchResultSelections';
var storage_productsearchresultselections_limit = 10;
var retained_selections_delim = '[|]';
var retained_selections_data_delim = '[::]';
var storage_productsearchurl = 'productSearchUrl';
var storage_productsearchurlvars = 'productSearchUrlVars';
var storage_productsearch = 'productsearch';
var storage_categorylistaccordion = 'categorylistaccordion';
var storage_numproductresults = 'productNumResults';

var storage_searchresultaccordion = 'productSearchResultAccordion';

/* QUOTAS */
var storage_quota_errors = 'quotaErrors';

/* QTY DISCOUNT */
var storage_qtydiscount_errors = 'qtydiscountErrors';

/* RETAINED SELECTIONS */
var storage_retainedselectionstoggle = 'retainedSelectionsToggle';

/* SCRATCH PAD */
storage_scratchpaddescription = 'scratchpadDescription';

/* SELECTORS */
var storage_selectorssearchurl = 'selectorsSearchUrl';
var storage_selectorssearchresults = 'selectorsSearchResults';

/* SERIAL/SHIPPING */
var storage_serialshippingtoggle = 'serialShippingToggle';
var storage_serialshippingtogglebydoc = 'serialShippingToggleByDoc';

/* STORESITE DASHBOARD */
var storage_spotliteview = 'spotliteView';
var storage_featuredproductsview = 'featuredproductsView';

/* STORESITE MESSAGES */
var storage_dismissedsupportmessages = 'dismissedSupportMessages';

/* STORESITE PRODUCTS */
var storage_productresultview = 'productresultView';

/* STORESITE SEARCH */
var storage_storesite_search_type = 'storesiteSearchType';
var storage_storesite_search_string = 'storesiteSearchString';
var storage_storesite_search_field = 'storesiteSearchField';
var storage_storesite_search_style = 'storesiteSearchStyle';

var exclude_window_onmessage_pages = [ 'Docs/finalizePayment' ];
