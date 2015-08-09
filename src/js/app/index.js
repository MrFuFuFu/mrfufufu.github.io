(function() {

    'use strict';

    function getQueryString(name) {

        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
            r   = window.location.search.substr(1).match(reg);

        return (r != null) ? unescape(r[2]) : null;
    }

    var touchController = {

        _options : {
            targetEl  : $('body, html'),
            threshold : 30
        },

        _beginY       : 0,
        _endY         : 0,
        _upCallback   : $.noop,
        _downCallback : $.noop,

        _recordStart  : function(e){ this._beginY = e.touches[0].pageY; },
        _recordStop   : function(e){ this._endY   = e.touches[0].pageY; },
        _dispatch     : function(){
            this._endY - this._beginY + this._options.threshold < 0
                    && this._upCallback();
            this._endY - this._beginY - this._options.threshold > 0
                    && this._downCallback();
        },

        init: function(opts){

            var that = this;

            opts && opts.scrollUp   && (this._upCallback   = opts.scrollUp   );
            opts && opts.scrollDown && (this._downCallback = opts.scrollDown );

            this._options.targetEl.bind('touchstart', function(e){
                that._recordStart(e);
            }).bind('touchmove', function(e){
                that._recordStop(e);
                that._dispatch();
                return false;
            });
        }
    };

    var page = {

        _PAGE_SPEED : 0.5,

        _moving : false,

        _currIndex : 1,
        _pageCount : 1,

        _pageHeight : 0,

        _wrapperEl   : null,
        _pageGroupEl : null,
        _pageEls     : null,

        // Move to the current page
        _doMove: function() {
            this._pageGroupEl.attr('style', '-webkit-transform:translateY(-' +
                    this._pageHeight * (this._currIndex - 1) +
                    'px);-webkit-transition:all ' + this._PAGE_SPEED + 's;');
            $('body, html').scrollTop(0);
            return this;
        },

        // Fix elements' height
        _fixEls: function() {
            this._pageHeight = this._wrapperEl.height();
            this._pageEls.height(this._pageHeight);
            return this;
        },

        // Fix elements' height on 'resize'
        _bindResize: function() {

            var that = this,
                timeoutId = null;

            $(window).on('resize', function() {

                timeoutId && clearTimeout(timeoutId);

                timeoutId = setTimeout(function() {
                    that._fixEls()._doMove();
                }, 200);
            });

            return this;
        },

        switchTo: function(index) {

            var that = this;

            if (!this._moving && index > 0 && index <= this._pageCount) {

                this._moving = true;

                this._pageEls.removeClass('active');

                this._currIndex = index;
                this._doMove();

                this._pageEls.eq(index - 1).addClass('active');

                setTimeout(function() {
                    that._moving = false;
                }, this._PAGE_SPEED * 1000 * 2.5);
            }

            return this;
        },

        prev: function() {
            return this.switchTo(this._currIndex - 1);
        },

        next: function() {
            return this.switchTo(this._currIndex + 1);
        },

        init: function() {

            // this._wrapperEl   = $('#content_wrapper');
            this._wrapperEl   = $(window);
            this._pageGroupEl = $('#content_wrapper .page-group');
            this._pageEls     = $('#content_wrapper .page');

            this._pageCount = this._pageEls.length;
            this._currIndex = 1;

            this._bindResize()._fixEls().switchTo(1);

            setTimeout(function() {
                $('body, html').scrollTop(0);
            }, 1000);

            return this;
        }
    };

    $(function() {

        // Share
        wx_conf.debug = false;
        wx_conf.jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage'];

        wx.config(wx_conf);

        wx.ready(function() {
            wx.onMenuShareAppMessage({
                title  : '我们结婚啦！',
                desc   : '公元2015年5月30日 17时28分 紫金港国际饭店－紫金厅',
                imgUrl : __CDNPATH + '/data/share.png'
            });
            wx.onMenuShareTimeline({
                title  : '我们结婚啦！',
                imgUrl : __CDNPATH + '/data/share.png'
            });
        });

        page.init();
        $('#content_wrapper').css('opacity', 1);

        $('body, html').on('touchmove', function(e) {
            e.preventDefault();
            return false;
        });

        touchController.init({
            scrollUp: function() {
                page.next();
            },
            scrollDown: function() {
                page.prev();
            }
        });

        $('.page1 .btn').on('touchstart', function() {
            page.next();
            // return false;
        });
        $('.page1').on('touchmove', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        // Music
        var musicPlaying = true,
            musicEl = $('audio')[0];

        setTimeout(function() {
            musicEl.play();
        }, 3000);

        $('.music').on('touchstart', function() {

            if (musicPlaying) {
                musicPlaying = false;
                musicEl.pause();
                $(this).addClass('start');

            } else {
                musicPlaying = true;
                musicEl.play();
                $(this).removeClass('start');
            }

            return false
        });

        var oriName = getQueryString('name');

        if (oriName) {
            $('#name').html(decodeURIComponent(oriName.replace(/\+/g, '%')));
        } else {
            $('#name').html('我的朋友');
        }

    });


}());
