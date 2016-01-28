import Scene3D from "../scn/scene-3d";

export default class Application extends mx.Application
{
    _mainScene = null;

    constructor()
    {
        super("count-down-app");

        this._mainScene = new Scene3D("main-scene", {
            frame: { width: window.innerWidth, height: window.innerHeight }
        });
        this.addSubview(this._mainScene);
        console.log(this._mainScene.$element.parent());
    }

    run(args)
    {
        super.run(args);

        this._mainScene.render();
    }
}
