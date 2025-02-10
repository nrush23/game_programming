var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.Red();
    
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/nrush23/game_programming/main/week1/assets/", "trevor_phillips.glb");

    var light = new BABYLON.HemisphericLight("SUN", new BABYLON.Vector3(0, 10, 0), scene);

    const gl = new BABYLON.GlowLayer("", scene);
    gl.intensity = 1;

    //Next time, show them to change the background colors to random colors
    //Next time, ask them to try and import different models from the class website
    //and do the same thing

    return scene;
};