var inputMap = {};
var pipes = [];
var sphere;
var jump = false;
var green;
var red;
var score = 0;
var best = 0;

var PLAY = true;
const MIN_HEIGHT = -7.5;
const MAX_HEIGHT = 10;
const GAP_WIDTH = 3;
var SPAWN_TIME = 3000;


var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    createPhysics(scene);
    initialize(scene);
    setupInput(scene);

    // gameLogic(scene);
    // createPipe(scene, 2);
    return scene;
};

function initialize(scene) {
    var background = new BABYLON.Layer('', "https://raw.githubusercontent.com/nrush23/game_programming/main/assets/flappy_background.jpg", scene, true)
    green = new BABYLON.StandardMaterial("green", scene);
    green.diffuseColor = new BABYLON.Color3(0, 1, 0);
    red = new BABYLON.StandardMaterial("red", scene);
    red.diffuseColor = new BABYLON.Color3(0.85, 1, 0);
    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 1, -20), scene);
    camera.inputs.removeByType("FreeCameraMouseInput");
    camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
    camera.attachControl(canvas, true);
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 1;
}

function createPhysics(scene) {
    // Create our sphere and ground
    scene.onNewMeshAddedObservable.add((mesh) => {
        mesh.renderOutline = true;
        mesh.outlineColor = BABYLON.Color3.Black();
    });

    const promise = BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/nrush23/game_programming/main/assets/", "flappy_fix3.glb", scene);
    promise.then((result) => {

        const importedMesh = result.meshes[0];
        importedMesh.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(Math.PI, Math.PI / 2, 0);
        importedMesh.position = new BABYLON.Vector3(-6, 4, 0);
        importedMesh.computeWorldMatrix(true);

        const halfExtents = new BABYLON.Vector3(2, 1, 1);
        const center = BABYLON.Vector3.Zero();
        const rotation = BABYLON.Quaternion.Identity();

        importedMesh.body = new BABYLON.PhysicsBody(importedMesh, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);
        importedMesh.body.setMassProperties({ mass: 0.6 });

        const importedShape = new BABYLON.PhysicsShapeBox(center, rotation, halfExtents, scene);
        importedMesh.body.shape = importedShape;
        sphere = importedMesh;

        scene.onBeforeRenderObservable.add(() => {
            if (sphere && sphere.body) {
                const velocityY = sphere.body.getLinearVelocity().y;
                const maxDipAngle = Math.PI / 3; // 30 degrees max

                // Calculate dip angle based on vertical velocity
                let dipAngle = BABYLON.Scalar.Clamp(-velocityY * 0.2, -maxDipAngle, maxDipAngle);

                // Create a quaternion for the dip rotation around X-axis
                let targetQuaternion = BABYLON.Quaternion.FromEulerAngles(dipAngle, Math.PI / 2, 0);

                sphere.body.transformNode.rotationQuaternion = targetQuaternion;

                const plugin = scene.getPhysicsEngine().getPhysicsPlugin();
                plugin._hknp.HP_Body_SetOrientation(sphere.body._pluginData.hpBodyId, [
                    targetQuaternion.x,
                    targetQuaternion.y,
                    targetQuaternion.z,
                    targetQuaternion.w
                ]);
            }
        });

        gameLogic(scene);
    });

    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 30, height: 10 }, scene);
    ground.position.y = MIN_HEIGHT;

    var roof = BABYLON.MeshBuilder.CreateGround("roof", { width: 30, height: 10 }, scene);
    roof.position.y = 10;
    // Initialize physics
    var hk = new BABYLON.HavokPlugin();
    // enable physics in the scene with a gravity
    scene.enablePhysics(new BABYLON.Vector3(0, -4.6, 0), hk);

    // Create a static box shape.
    var groundAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);
    var roofAggregate = new BABYLON.PhysicsAggregate(roof, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);
    ground.isVisible = false;
    roof.isVisible = false;
}

function setupInput(scene) {
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
}

function gameLogic(scene) {
    scene.onPointerDown = function () {
        sphere.body.applyImpulse(new BABYLON.Vector3(0, 1.5, 0), sphere.absolutePosition);
    }
    scene.onBeforeRenderObservable.add(() => {
        if (PLAY) {
            for (let i = pipes.length - 1; i >= 0; i--) {
                let pipe = pipes[i];
                pipe.position.x -= 0.02;

                pipe.getChildMeshes().forEach(function (childMesh) {
                    if (sphere.intersectsMesh(childMesh)) {
                        console.log("Imported mesh intersects with " + childMesh.name);
                    }
                });

                if (pipe.position.x < -15) {
                    pipe.dispose()
                    pipes.splice(i, 1);
                    score += 1
                    console.log(score)
                }
            }
        }
    });

    setInterval(() => {
        createPipe(scene, Math.floor(Math.random() * (MAX_HEIGHT + 1)));
    }, SPAWN_TIME);

};

function createPipe(scene, height) {
    //Calculate our radius from the centers since their origins are in the middle of the mesh
    const bot_radius = height / 2;
    const top_radius = (MAX_HEIGHT + Math.abs(MIN_HEIGHT) - height - GAP_WIDTH) / 2;

    //Now make a transform node to hold all components
    var pipe = new BABYLON.TransformNode("p1", scene);

    //Don't make the bottom if the height is too small
    if (height > GAP_WIDTH) {
        //Create the bottom cylinder so it has the given height and position its center at its radius
        var bot = BABYLON.MeshBuilder.CreateCylinder("c1", { height: height, diameter: 2 }, scene)
        bot.position = new BABYLON.Vector3(0, MIN_HEIGHT + bot_radius, 0);
        var y_bot = createAccessory(scene, bot_radius, true);
        y_bot.parent = bot;
        bot.material = green;
        bot.parent = pipe;
    }

    //Create the top cylinder so it has the remaining height and center it its length from the top
    var top = BABYLON.MeshBuilder.CreateCylinder("c1_top", { height: top_radius * 2, diameter: 2 }, scene);
    top.position = new BABYLON.Vector3(0, MAX_HEIGHT - top_radius, 0);
    var y_top = createAccessory(scene, -top_radius, false);
    y_top.parent = top;
    top.parent = pipe;
    top.material = green;

    //Set position and add to our pipe array
    pipe.position = new BABYLON.Vector3(12, 0, 0);
    pipes.push(pipe);
}

function createAccessory(scene, height, bottom) {
    var yellow = BABYLON.MeshBuilder.CreateCylinder("y1", { height: 0.25, diameter: 2.25 }, scene);
    if (bottom) {
        yellow.position.y += 0.25 / 2;
    } else {
        yellow.position.y -= 0.25 / 2;
    }
    yellow.position.y += height
    yellow.material = red;
    return yellow;
}