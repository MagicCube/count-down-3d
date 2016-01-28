import MainScene3D from "../scn/main-scene-3d";

export default class Application extends mx.Application
{
    constructor()
    {
        super("count-down-app");

        this._initMainScene();
    }

    _initMainScene()
    {
        this._mainScene = new MainScene3D("main-scene", {
            frame: { width: window.innerWidth, height: window.innerHeight }
        });
        this.addSubview(this.mainScene);
    }

    _mainScene = null;
    get mainScene()
    {
        return this._mainScene;
    }

    run(args)
    {
        super.run(args);
        this.loop();
    }

    loop()
    {
        this.mainScene.render();
        window.requestAnimationFrame(this.loop.bind(this));
    }
}
