/**
 * 轮播图图层类
 * @author dingyang[dingyang9642@126.com]
 */
class CarouselLayer extends AnimationLayer {
    /**
     * ProgressLayer类构造函数
     * @return {object}    默认实例化对象
     */
    constructor(id, options) {
        super(id, options);  // 调用父类的constructor(id, options)
        this._datas = this.getRenderOptions(this.datas);
    }

    /**
     * 获取绘制进度条配置参数
     * @param  {object} options 用户自定义配置参数
     * @return {object}         和默认参数合并
     */
    getRenderOptions (options) {
        options = (options) ? options : {};
        var defaultOptions = {
            imgSize: {
                w: 349, // 图片大小，只支持px像素单位
                h: 220
            },
            slipTime: 500,
            interval: 2500,
            imgs: [{
                    url: './cl.jpg'
                }, {
                    url: './ceshi.jpg'
                }
            ]
        };
        var newOptions = Util.extend(defaultOptions, options);
        return newOptions;
    }

    onAdd (animationMap) {
        super.onAdd(animationMap);
        // onAdd会执行canvas要素创建，此时需要改变canvas的长度
        var imgsLength = this._datas.imgs.length;
        var containerSize = animationMap.getSize(); // 获取容器大小{w: h:}
        this._container.width = containerSize.w * (imgsLength + 2);
        this._container.style.left = (0 - containerSize.w) + 'px';
        this._container.style.width = containerSize.w * (imgsLength + 2) + 'px';
        // 执行图层渲染
        this.render();
    }

    reSize () {
        super.reSize();
        // 此时需要改变canvas的长度
        var imgsLength = this._datas.imgs.length;
        var containerSize = this._size; // 获取容器大小{w: h:}
        this._container.width = containerSize.w * (imgsLength + 2);
        this._container.style.left = (0 - containerSize.w) + 'px';
        this._container.style.width = containerSize.w * (imgsLength + 2) + 'px';
        // 执行canvas样式重设结束
        this.render();
    }

    drawImage () {
        var self = this;
        var layerSize = self._size;
        var imageOptions = this._datas;
        var totalImgs = imageOptions.imgs;
        var imgsLength = totalImgs.length;
        var newImages = [];
        for (var i = 0; i < imgsLength; i++) {
            var tmpImg = totalImgs[i];
            var newImgOption = {
                url: tmpImg.url,
                swidth: imageOptions.imgSize.w,
                sheight: imageOptions.imgSize.h,
                x: (i + 1) * layerSize.w,
                y: 0,
                width: layerSize.w,
                height: layerSize.h
            };
            newImages.push(newImgOption);
        }
        self.clearLayer();
        var firstImageOption = Util.deepCopy(newImages[0], {});
        firstImageOption.x = (imgsLength + 1) * layerSize.w;
        var lastImageOption = Util.deepCopy(newImages[imgsLength - 1], {});
        lastImageOption.x = 0;
        newImages.unshift(lastImageOption);
        newImages.push(firstImageOption);
        CanvasUtil.drawImages(this.id, newImages);
        // 设置当前页数
        this.totalPageSize = (imgsLength + 2);
        this.currentPageSize = 2;
    }

    clearLayer () {
        var _size = this.getSize();
        var _w = _size.w;
        var _h = _size.h;
        super.clearLayer();
        CanvasUtil.clearLayer(this.id, _w, _h);
    }

    loop () {
        var self = this;
        var containerSize = this._size; // 获取容器大小{w: h:}
        var curPageSize = self.currentPageSize;
        var imageOptions = this._datas;
        var slipTime = imageOptions.slipTime;
        
        var totalSize = self.totalPageSize;
        this._container.style.transform = 'translate(' +  (0 - ((curPageSize - 1) * containerSize.w)) + 'px, 0)';
        this._container.style.transition = slipTime + 'ms linear';
        self.currentPageSize++;
    }
    
    render () {
        var self = this;
        var imageOptions = self._datas;
        var interval = imageOptions.interval;
        var slipTime = imageOptions.slipTime;
        self.drawImage();
        setInterval(
            function (argument) {
                self.loop();
        }, interval + slipTime);
    }
}