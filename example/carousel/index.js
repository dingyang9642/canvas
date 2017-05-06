var animationMap = new AnimationMap('animationMap');
var carouselLayer = new CarouselLayer('carouselLayer', {
    zIndex: 2,
    opacity: 1,
    datas: {

    }
});




animationMap.addLayer(carouselLayer);



window.onresize = function() {
    animationMap.reSize();
};