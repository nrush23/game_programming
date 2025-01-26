var createScene = async function () {
    // This creates a basic Babylon Scene object (non-mesh)
    const engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(3, 3, -200), scene);
    camera.attachControl(canvas, true);

    var fontData = await (await fetch("https://assets.babylonjs.com/fonts/Droid Sans_Regular.json")).json();

    var myText = BABYLON.MeshBuilder.CreateText("myText", "HELLO WORLD", fontData, {
        size: 16,
        resolution: 64,
        depth: 10
    });

    return scene;
};