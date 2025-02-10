var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.Black();

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -33.5), scene);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/nrush23/game_programming/main/week1/assets/", "penguin.glb", scene, (result)=>{

        result[0].rotationQuaternion = null;
        result[0].rotation.y = 0
    });

    var light = new BABYLON.HemisphericLight("SUN", new BABYLON.Vector3(0, 10, 0), scene);

    const gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 1;

    setInterval(function () {
        scene.clearColor = new BABYLON.Color3.Random();
    }, 500);

    const music = new BABYLON.Sound("jumper", "https://raw.githubusercontent.com/nrush23/game_programming/main/week1/assets/music/dolphin.mp3", scene, null, { loop: true, spatialSound: true, autoplay: true });
    music.setVolume(0.2);

    welcome(scene);

    return scene;
};

function welcome(scene) {
    var plane = BABYLON.MeshBuilder.CreatePlane("textPlane", {width: 50, height: 50}, scene);
    plane.position = new BABYLON.Vector3(0, 10, 0);
    plane.isPickable = false; // Prevent interaction

    // Create the GUI texture
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);

    var textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = "WELCOME BACK!";
    textBlock.color = "white"; // White text
    textBlock.fontSize = 100;
    textBlock.outlineWidth = 0; // No outline
    textBlock.outlineColor = "transparent"; // Ensure no outline
    textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    advancedTexture.addControl(textBlock);

}