;(function($){
	function dialog(element,options){
		this.options = $.extend(true,{
			className : 'exercises-dialog',
			show : true,
			modal : true,
			close : true,
			content : '',
			left : 0,
			top : 0,
			buttons : null,
			onOpen : null,
			onClose : null,
			onCreate : null
		},options);
		this.frame = $('<div class="'+this.options.className+'" style="display: none;"></div>').appendTo(element);
		this.inner = $('<div class="dialog-inner"></div>').appendTo(this.frame);
		this.content = $('<div class="dialog-content"></div>').appendTo(this.inner);
		this.switcher = $('<div class="dialog-switch"></div>').appendTo(this.content);
		this.modal = $('<div class="exercises-dialog-modal" style="display: none;"></div>').appendTo(element);
		this.setContent(this.options.content);
		this.setButton(this.options.buttons);
		this.options.show && this.open();
	}

	dialog.prototype.open = function(){
		this.frame.fadeIn(300);
		this.modal.show();
		$.isFunction(this.options.onOpen) && this.options.onOpen.call(this);
		return this;
	}
	dialog.prototype.close = function(){
		this.frame.fadeOut(300);
		this.modal.hide();
		$.isFunction(this.options.onClose) && this.options.onClose.call(this);
		return this;
	}
	dialog.prototype.setContent = function(content){
		var _origContaier = this.content.find('.dialog-contaier');
		var _nowContaier = $('<div class="dialog-contaier"></div>').css({'float': 'left', 'margin-left':-this.content.outerWidth(),'width' : this.content.width(),'opacity' : 0});
		this.switcher.css('width', this.content.width() * 2 + 10);
        //_nowContaier.text(content).prependTo(this.switcher);
        _nowContaier.html(content).prependTo(this.switcher);
		_nowContaier.css('margin-top', (this.content.height() - _nowContaier.height())/2)
		_nowContaier.animate({'margin-left' : 0, 'opacity' : 1},600);
		_origContaier.animate({'opacity' : 0},600);
		return this;
	}
	dialog.prototype.setButton = function(buttons){
		if($.isArray(buttons) && buttons.length){
			if(!this.toolButtons){
				this.toolButtons = $('<div class="dialog-tool"></div>').appendTo(this.inner);
			}
			this.toolButtons.empty();
			for(var i = 0; i < buttons.length; i++){
				$('<span class="dialog-btn dialog-'+buttons[i].name+'">'+buttons[i].text+'</span>')[buttons[i].eventName || 'click'](buttons[i].eventFun).appendTo(this.toolButtons);
			}
		}
		return this;
	};
	dialog.prototype.setClassName = function(className,top,left){
		this.frame.prop('class','')
			.addClass(className);
		this.frame.css({
			"top":top+'px',
			"left":left+'px'
		});
		return this;
	};
	$.fn.dialog = function(options){
		var _arguments = arguments;
		var _return = this;
		this.each(function(){
			var _dialog = $(this).data('dialog');
			if(!_dialog){
				_dialog = new dialog($(this),options);
				$(this).data('dialog', _dialog);
			}
			if(typeof options == 'string' && options in _dialog){
				if($.isFunction(_dialog[options])){
					_return = _dialog[options].apply(_dialog,Array.prototype.slice.call(_arguments,1));
				}else{
					_return = _dialog[options];
				}
			}
		});
		return _return;
	}
	function pointer(element,options){
		var _self = this;
		var _status = true;
		this.options = $.extend({
			className : 'exercises-pointer',
			show : true,
			width : 72,
			height: 24,
			left : 0,
			top : 0,
			target : null,
			onCreate : null
		},options);
		this.box = $('<div class="'+this.options.className+'"></div>').appendTo(element);
		this.box.css({
			width : this.options.width,
			height : this.options.height,
			left : this.options.left,
			top : this.options.top
		});
		this.options.show && this.show();
		setInterval(function(){
			if(_status){
				_self.box.addClass('exercises-pointer-activity');
				_status = false;
			}else{
				_self.box.removeClass('exercises-pointer-activity');
				_status = true;
			}
		},500);
		this.box.click(function(){
			typeof _self.options.target == 'string' && (location.href = _self.options.target);
		});
		$.isFunction(this.options.onCreate) && this.options.onCreate.call(this);
	}
	pointer.prototype.show = function(){
		this.box.show();
		if(this.box.offset().top + this.box.height() > $(window).height()){
			$('body,html').animate({'scrollTop':this.box.offset().top - 120},500)
		}else if(this.box.offset().top + this.box.height() - 120 < $(document).scrollTop()){
			$('body,html').animate({'scrollTop':this.box.offset().top + this.box.height() - 120},500)
		}
		return this;
	}
	pointer.prototype.hide = function(){
		this.box.hide();
		return this;
	}
	$.fn.pointer = function(options){
		var _arguments = arguments;
		var _return = this;
		this.each(function(){
			var _pointer = $(this).data('pointer');
			if(_pointer){
				if(typeof options == 'string' && options in _pointer){
					if($.isFunction(_pointer[options])){
						_return = _pointer[options].apply(_pointer,Array.prototype.slice.call(_arguments,1));
					}else{
						_return = _pointer[options];
					}
				}else{
					var _arr = [];
					if($.isArray(_pointer)){
						_arr = _pointer;
					}
					$(this).data('pointer',_arr.push(new pointer($(this),options)))
				}
			}else{
				$(this).data('pointer',new pointer($(this),options))
			}
		});
		return _return;
	}
	function tiper(element,options){
		this.options = $.extend({
			className : 'exercises-tiper',
			left : 0,
			top : 0,
			width: 'auto',
			height : 'auto',
			content : null,
			direction : 'top',
			onCreate : null
		},options);
		this.box = $('<div style="opacity: 0"></div>').addClass(this.options.className);
		this.box.appendTo(element);
		this.direction = $('<b class="angle"></b>');
		this.box.append(this.direction);
		this.box.css({
			'left' : this.options.left,
			'top' : this.options.top,
			'width' : this.options.width,
			'height' : this.options.height
		});
		typeof this.options.direction == 'string' && this.box.addClass(this.options.className + '-' + this.options.direction);
		typeof this.options.content == 'string' && this.box.append(this.options.content);
		this.show();
		$.isFunction(this.options.onCreate) && this.options.onCreate.call(this);
	}
	tiper.prototype.show = function(){
		this.box.css('margin-top',120);
		this.box.animate({'opacity':1,'margin-top' : 12},300);
		return this;
	}
	tiper.prototype.hide = function(){
		this.box.animate({'opacity':0,'margin-top' : 120},300);
		return this;
	}
	$.fn.tiper = function(options){
		var _arguments = arguments;
		var _return = this;
		this.each(function(){
			var _tiper = $(this).data('tiper');
			if(_tiper){
				if(typeof options == 'string' && options in _tiper){
					if($.isFunction(_tiper[options])){
						_return = _tiper[options].apply(_tiper,Array.prototype.slice.call(_arguments,1));
					}else{
						_return = _tiper[options];
					}
				}else{
					var _arr = [];
					if($.isArray(_tiper)){
						_arr = _tiper;
					}
					$(this).data('tiper',_arr.push(new tiper($(this),options)))
				}
			}else{
				$(this).data('tiper',new tiper($(this),options))
			}
		});
		return _return;
	};
	$.fn.highlight = function(css){
		var box = $('<div class="exercises-highlight"><b class="highlight-top"></b><b class="highlight-right"></b><b class="highlight-bottom"></b><b class="highlight-left"></b></div>');
		box.appendTo($(this));
		box.css($.extend({
			'position' : 'absolute',
			'opacity' : 0,
			'z-index' : 1000,
			'background-image' : 'url('+$('.scene-main img').attr('src')+')',
			'background-repeat' : 'no-repeat'
		},css));
		box.animate({opacity:1},600);
		if(box.offset().top + box.height() > $(window).height()){
			$('body,html').animate({'scrollTop': box.offset().top - 120},500)
		}else if(box.offset().top < $(document).scrollTop()){
			$('body,html').animate({'scrollTop':box.offset().top - 12},500)
		}
	}
	$.fn.removeHighlight = function(css){
		return this.each(function(){
			$('.exercises-highlight').remove();
		});
	}
	var Player = function(film){
		if($.isArray(film)){
			Player.film = film;
			Player.totalFrame = Player.film.length;
		}else{
			alert('请指定播放列表！');
		}
	}
	//播放上一帧
	Player.prevFrame = function(){
		Player.currentFrame = --Player.currentFrame ? Player.currentFrame : 0;
		Player.targetFrame(Player.currentFrame);
	}
	//播放下一帧
	Player.nextFrame = function(){
		Player.currentFrame = ++Player.currentFrame > Player.totalFrame ? Player.totalFrame - 1 : Player.currentFrame;
		Player.targetFrame(Player.currentFrame);
	}
	//从指定帧播放
	Player.targetFrame = function(number){
		Player.setFrame(number)
		$.isFunction(Player.film[Player.currentFrame]) && Player.film[Player.currentFrame].call(Player);
	}
	//获取当前播放帧
	Player.getFrame = function(){
		var _frame = location.hash ? location.hash.substr(1) : 1;
		return Player.setFrame(_frame - 1);
	}
	//设置当前播放帧
	Player.setFrame = function(number){
		if(!isNaN(number)){
			Player.currentFrame = number;
		}else{
			Player.currentFrame == 'undefined' && (Player.currentFrame = 0);
		}
		return Player.currentFrame;
	}
	$.Player = Player;
})(jQuery)
$(function(){
	document.body.onselectstart = document.body.ondrag = function(){
    	return false;
	}
})