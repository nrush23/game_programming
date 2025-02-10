var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.Black();
    
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/nrush23/game_programming/main/week1/assets/", "trevor_phillips.glb");

    var light = new BABYLON.HemisphericLight("SUN", new BABYLON.Vector3(0, 10, 0), scene);

    const gl = new BABYLON.GlowLayer("", scene);
    gl.intensity = 1;

    var box = new BABYLON.MeshBuilder.CreateBox("box", {size: 50});
    //Next time, show them to change the background colors to random colors
    //Next time, ask them to try and import different models from the class website
    //and do the same thing

    //Maybe next time show them 3d sketch website

    engine.runRenderLoop(()=>{
        scene.render();
    });
    var grow = false;
    scene.registerBeforeRender(()=>{
        if(gl.intensity <= 0){
            grow = true;
        }else if(gl.intensity >= 1){
            grow = false;
        }

        if(grow){
            gl.intensity += 0.1;
        }else{
            gl.intensity -= 0.1
        }

        console.log(gl.intensity);
    });
    return scene;
};