
    $.fn.multiselect = function (fn, options) {
        if (typeof fn == 'object') {
            options = fn;
            fn = 'init';
        }
        if (typeof fn == 'undefined') {
            fn = 'init';
        }
        //return direct methods
        var directMethods = {
            'widget' : function () {
                return  $(this).data('multiselect-widget');
            },
            'modal' : function () {
                return  $(this).data('multiselect-modal');
            }
        }
        var args = arguments;
        Array.prototype.shift.call(args);
        if (args.length > 0) {
            args.shift();
        }
        if (typeof directMethods[fn] == 'function') {
            return directMethods[fn].apply(this, args)
        }
        
        var methods = {
            init    : function (options) {
                var config = $.extend({}, {}, options || {
                    list: 1,
                    body: 'body'
                }, $(this).data());
                var $$ = $(this).hide();
                $$.data('multiselect', config);
                var $div  = $('<div class="input-append dropdown-multiselect">').insertAfter($$);
                $$.data('multiselect-widget', $div);
                var $span = $('<span class="input-xlarge uneditable-input label">').appendTo($div);
                var $btn  = $('<span class="add-on"><i class="icon-chevron-down"></i></span>').appendTo($div);
                var $modal = $('<div class="modal hide fade modal-multiselect">')
                        .appendTo($(config.body));
                if ($$.attr('id')) {
                    $modal.attr('id', 'modal-multiselect-' + $$.attr('id'));
                }
                $div.click(function () {$modal.modal('show');});
                $$.data('multiselect-modal', $modal);
                var $menu = $('<div class="modal-body" role="multiselect">').appendTo($modal);
                var $controls = $('<div class="modal-footer" role="multiselectcontrols">').appendTo($modal);
                $("<span>").addClass('btn')
                        .appendTo($controls)
                        .text('Close')
                        .click(function (e) {
                    $modal.modal('hide');
                    e.stopPropagation();
                });
                if ($$.attr('multiple')) {
                    $controls.append($("<span class='btn btn-mini pull-left'>").html('<i class="icon-check-empty"></i>uncheck all').click(function () {
                        $$.val('');
                        $menu.find(":checkbox").attr('checked', false);
                        $$.multiselect('refreshLabel');
                    }));
                    $controls.append($("<span class='btn btn-mini pull-left'>").html('<i class="icon-check"></i>check all').click(function () {
                        $menu.find(":checkbox").each(function () {
                            if ($(this).is(':checked') == false) {
                                $(this).attr('checked', true);
                                click.apply(this);
                            }
                        });
                        
                    }));
                }
                $$.multiselect('refresh')
            },
            refresh      : function () {
                var $menu = $(this).multiselect('modal').find('[role=multiselect]').empty();
                var $controls = $(this).multiselect('modal').find('[role=multiselectcontrols]');
                var $$ = $(this);
                var val  = $$.val();
                var type = ($$.attr('multiple')) ? 'checkbox' : 'radio';
                var click = function () {
                    var check = $(this).is(":checked");
                    var self = this;
                    if ($$.attr('multiple')) {
                        var values = $$.val() || [];
                        if (check) {
                            values.push($(this).val());
                        } else {
                            values.splice($.inArray($(this).val(), values), 1);
                        }
                        $$.val(values).multiselect('refreshLabel').trigger('change');
                        return $(this);
                    } else {
                        $menu.find("input[type=radio]").each(function () {
                            if (this !== self) {
                                $(this).attr('checked', false);
                            }
                        });
                        $$.multiselect('modal').modal('hide');
                    }
                    $$.val($(this).val()).multiselect('refreshLabel').trigger('change');
                    return $(this);
                };
                var $lastParent = $$;
                var $appendTo = $('<ul class="multiselect-menu">').appendTo($menu);
                $$.find('option').each(function () {
                    if ($(this).parent().is($lastParent) == false) {
                        $lastParent = $(this).parent();
                        if ($lastParent.is('optgroup')) {
                            $appendTo = $('<ul>').appendTo($('<li>').appendTo($appendTo).append($('<label class="optgroup">').text($lastParent.attr('label'))));
                        }
                    }
                    $("<li>").appendTo($appendTo)
                        .append($('<label>')
                            .append(
                                $('<input type="' + type + '">')
                                    .attr({
                                        checked: (typeof val == 'string') ? val == $(this).val() : $.inArray($(this).val(), val) > -1,
                                        value  : $(this).val()
                                    }).click(click)
                            )
                            .append($(this).text()));
                });
                $$.multiselect('refreshLabel');
            },
            refreshLabel : function () {
                var self = this;
                var $$ = $(this).multiselect('widget');
                var txt = '';
                var options = $(this).data('multiselect');
                var val = $(this).val() || [];
                if (typeof val == 'string') {
                    txt = $(this).find('[value="' + val + '"]').text();
                } else {
                    var len = (val) ? val.length : 0;
                    if (len > options.list || len == 0) {
                        txt = len + ' of ' + $(this).find('option').length + ' selected';
                    } else {
                        var texts = [];
                        $.each(val, function (index, v) {
                            texts.push($(self).find('[value=' + v + ']').text());
                        });
                        txt = texts.join(', ');
                    }
                }
                $$.find('.label').text(txt);
            }
        };
        return $(this).each( function () {
            methods[fn].apply(this, args)
        })
    };