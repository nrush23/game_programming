var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.Black();
    
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // Import the patty
    BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/nrush23/game_programming/main/week1/assets/", "golden_patty.glb", scene)
        .then((result) => {
            var mesh = result.meshes[0];
            camera.setTarget(mesh.position);
        });


    //To make glow
    const gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 1;

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var greetings = new BABYLON.GUI.TextBlock();
    greetings.color = "white";
    greetings.fontSize = 48;
    greetings.text = "HELLO WORLD";
    advancedTexture.addControl(greetings);

    const music = new BABYLON.Sound("fetty", "https://raw.githubusercontent.com/nrush23/game_programming/main/week1/assets/music/fetty.mp3", scene, null, { loop: true, spatialSound: true, autoplay: true });
    music.setVolume(0.2);

    return scene;
};