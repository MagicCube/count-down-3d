import TrackballControls from "three-trackballcontrols";
import Stats from "stats.js";

export default class Scene3D extends mx.Scene
{
    _trackballControls = null;
    _stats = null;

    constructor(id, { frame = {} })
    {
        super(id);
        this.setFrame(frame);

        this._scene = new THREE.Scene();

        this._initCamera();
        this._initRenderer();
        this._initTrackballControls();
        //this._initStats();

        this._initLights();
        this._initStage();
    }

    _initCamera()
    {
        this._camera = new THREE.PerspectiveCamera(60, this.frame.width / this.frame.height, 1, 1000);
    }

    _initRenderer()
    {
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(this.frame.width, this.frame.height);
        this.$container.append(this._renderer.domElement);
    }

    _initTrackballControls()
    {
        this._trackballControls = new TrackballControls(this.camera);

		this._trackballControls.rotateSpeed = 1.0;
		this._trackballControls.zoomSpeed = 1.2;
		this._trackballControls.panSpeed = 0.8;

		this._trackballControls.noZoom = false;
		this._trackballControls.noPan = false;

		this._trackballControls.staticMoving = true;
		this._trackballControls.dynamicDampingFactor = 0.3;

		this._trackballControls.keys = [ 65, 83, 68 ];
    }

    _initStats()
    {
        this._stats = new Stats();
        const $stats = $(this._stats.domElement);
        $stats.css({
            position: "absolute",
            left: 10,
            top: 10,
            zIndex: 100
        });
		this.$element.append($stats);
    }

    _initLights()
    {
        let light = null;

		light = new THREE.DirectionalLight(0xffffff);
		light.position.set(1, 1, 1);
		this.scene.add(light);

		light = new THREE.DirectionalLight(0x002288);
		light.position.set(-1, -1, -1);
		this.scene.add(light);

		light = new THREE.AmbientLight(0x222222);
		this.scene.add(light);
    }

    _initStage()
    {
        this._stage = new THREE.Object3D();
        this.scene.add(this._stage);
    }





    _scene = null;
    get scene()
    {
        return this._scene;
    }

    _stage = null;
    get stage()
    {
        return this._stage;
    }

    _camera = null;
    get camera()
    {
        return this._camera;
    }

    _renderer = null;
    get renderer()
    {
        return this._renderer;
    }


    render(time)
    {
        TWEEN.update(time);
        //this._stats.update();
        this._trackballControls.update();
        this._renderer.render(this.scene, this.camera);
    }
}
