import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, StandardMaterial, Color3, Texture, Vector4, SceneLoader } from "@babylonjs/core";

class App {
    // General Entire Application
    private _scene: Scene;
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;

    constructor() {
        this._canvas = this._createCanvas();

        // initialize babylon scene and engine
        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), this._scene);
        camera.attachControl(this._canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);

        // var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this._scene);

        /**** Materials *****/
        //color
        const groundMat = new StandardMaterial("groundMat", this._scene);
        groundMat.diffuseColor = new Color3(0, 1, 0);

        //texture
        const roofMat = new StandardMaterial("roofMat", this._scene);
        roofMat.diffuseTexture = new Texture(
            "https://assets.babylonjs.com/environments/roof.jpg", this._scene
        );
        const boxMat = new StandardMaterial("boxMat", this._scene);
        boxMat.diffuseTexture = new Texture(
            "https://assets.babylonjs.com/environments/cubehouse.png", this._scene
        );

        //options parameter to set different images on each side
        const faceUV = [];
        faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
        faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
        faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
        faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
        // top 4 and bottom 5 not seen so not set


        /**** World Objects *****/
        const box = MeshBuilder.CreateBox("box", {
            faceUV: faceUV,
            wrap: true,

        }, this._scene);
        box.material = boxMat;
        box.position.y = 0.5;
        const roof = MeshBuilder.CreateCylinder("roof", {
            diameter: 1.3,
            height: 1.2,
            tessellation: 3,
        }, this._scene);
        roof.material = roofMat;
        roof.scaling.x = 0.75;
        roof.rotation.z = Math.PI / 2;
        roof.position.y = 1.22;
        const ground = MeshBuilder.CreateGround("ground", {
            width: 10,
            height: 10,
        }, this._scene);
        ground.material = groundMat;

        let car;

        SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.babylon").then(() =>  {
            const wheelRB = this._scene.getMeshByName("wheelRB");
            const wheelRF = this._scene.getMeshByName("wheelRF");
            const wheelLB = this._scene.getMeshByName("wheelLB");
            const wheelLF = this._scene.getMeshByName("wheelLF");
            this._scene.beginAnimation(wheelRB, 0, 30, true);
            this._scene.beginAnimation(wheelRF, 0, 30, true);
            this._scene.beginAnimation(wheelLB, 0, 30, true);
            this._scene.beginAnimation(wheelLF, 0, 30, true);
            car = this._scene.getMeshByName("car");
            car.position.x = 2;
            car.position.y = 0.19;
          });

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Ctrl+Shift+Z
            if (ev.ctrlKey && ev.shiftKey && ev.key === 'Z') {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide();
                } else {
                    this._scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
    }

    //set up the canvas
    private _createCanvas(): HTMLCanvasElement {

        //create the canvas html element and attach it to the webpage
        this._canvas = document.createElement("canvas");
        this._canvas.style.width = "100%";
        this._canvas.style.height = "100%";
        this._canvas.id = "gameCanvas";
        document.body.appendChild(this._canvas);

        return this._canvas;
    }

}
new App();