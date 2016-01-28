export default class Scene3D extends mx.Scene
{
    constructor(id, { frame = {} })
    {
        super(id);
        this.setFrame(frame);

        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(75, this.frame.width / this.frame.height, 0.1, 1000);

        this._initRenderer();
    }

    _initRenderer()
    {
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(this.frame.width, this.frame.height);
        this.$container.append(this._renderer.domElement);
    }

    _scene = null;
    get scene()
    {
        return this._scene;
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


    render()
    {
        this._renderer.render(this.scene, this.camera);
    }
}
