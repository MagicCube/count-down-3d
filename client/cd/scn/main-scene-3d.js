import Scene3D from "./scene-3d";

export default class MainScene3D extends Scene3D
{
    constructor(id)
    {
        super(id, {
            frame: { width: window.innerWidth, height: window.innerHeight }
        });

        this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
        this.camera.position.z = 500;
        this.renderer.setClearColor(this.scene.fog.color);

        this._initLights();
        this._initObjects();
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

    _initObjects()
    {
		var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
		var material =  new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );

		for ( var i = 0; i < 500; i ++ )
        {

			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.x = (Math.random() - 0.5) * 1000;
			mesh.position.y = (Math.random() - 0.5) * 1000;
			mesh.position.z = (Math.random() - 0.5) * 1000;
			mesh.updateMatrix();
			mesh.matrixAutoUpdate = false;
			this.scene.add(mesh);
		}
    }
}
