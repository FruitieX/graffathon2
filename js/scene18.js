function Scene18() {

};

Scene18.prototype.init = function() {

    canvas.style['background-color'] = 'rgba(0, 0, 0, 1.0)';
};

Scene18.prototype.deinit = function() {
    renderer.setClearColor(0x000000, 1);
    canvas.style['background-color'] = 'rgba(255, 255, 255, 0.0)';
};

Scene18.prototype.update = function(dt, t) {

    canvasCtx.font = '100px helvetiker';
    canvasCtx.fillStyle = '#ffffff';
    canvasCtx.strokeStyle = '#ffffff';
    canvasCtx.lineWidth = 4;

    canvasCtx.fillText('graffathon 2015', width / 4, height / 2);
    canvasCtx.strokeText('graffathon 2015', width / 4, height / 2);

    
};
