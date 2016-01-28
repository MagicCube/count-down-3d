import digitFont from "../font/digit";

import Scene3D from "./scene-3d";

export default class MainScene3D extends Scene3D
{
    _colors = [ 0x33b5e5, 0x0099cc, 0xaa66cc, 0x669900, 0xffbb33, 0xff8800, 0xff4444, 0xcc0000 ];

    _ballRadius = 10;
    _ballGeometry = null;

    _balls = [];
    _ballPool = [];
    _redBalls = [];

    _logoMatrix = [];
    _logoBallCount = 0;

    _red = null;
    _redFlipY = 0;

    constructor(id)
    {
        super(id, {
            frame: { width: window.innerWidth, height: window.innerHeight }
        });

        this.scene.fog = new THREE.FogExp2(0xcccccc, 0.0011);
        this.camera.position.z = 600;
        this.renderer.setClearColor(this.scene.fog.color);

        this._loadLogo();
        this._initRedBalls();
        this.startCountDown();
    }

    _initRedBalls()
    {
        this._red = new THREE.Object3D();
        this.stage.add(this._red);

        let maxCount = 0;
        for (let i = 0; i < digitFont.length; i++)
        {
            const matrix = digitFont[i];
            let count = 0;
            for (let y = 0; y < matrix.length; y++)
            {
                const row = matrix[y];
                for (let x = 0; x < row.length; x++)
                {
                    const cell = row[x];
                    if (cell === 1)
                    {
                        count++;
                    }
                }
            }
            if (count > maxCount)
            {
                maxCount = count;
            }
        }

        for (let i = 0; i < maxCount; i++)
        {
            const ball = this._createBall(0xff0000);
            this._redBalls.push(ball);
        }
    }



    _digit = 9;
    get digit()
    {
        return this._digit;
    }
    set digit(digit)
    {
        this._digit = digit;
        if (this._digit !== 0)
        {
            this.displayBalls(this.digit);
        }
        else
        {
            this._redBalls.forEach(ball => {
                this._red.remove(ball);
            });
        }
        this.rainBalls(this.digit);
    }



    startCountDown()
    {
        this.digit = 9;
        const countDownTimer = setInterval(() => {
            const digit = this.digit - 1;
            if (digit >= 0)
            {
                this.digit = digit;
                this._redFlipY += Math.PI * 2;
                new TWEEN.Tween(this._red.rotation)
                    .to({ y: this._redFlipY }, 400)
                    .start();
            }
            else
            {
                clearInterval(countDownTimer);
                setTimeout(() => {
                    this._balls.forEach(ball => {
                        this._ballPool.push(ball);
                    });
                    this._balls.splice(0, this._balls.length);
                    this.startExplosion();
                }, 2000);
            }
        }, 1500);
    }

    prepareForLogo()
    {
        while (this._ballPool.length < this._logoBallCount)
        {
            const ball = this._createBall();
            this.stage.add(ball);
            this._ballPool.push(ball);
        }
    }

    startExplosion()
    {
        this.prepareForLogo();
        new TWEEN.Tween(this.stage.rotation)
            .to({ y: Math.PI }, 400)
            .start();
        this._ballPool.forEach(ball => {
            new TWEEN.Tween(ball.position)
                .to({
                    x: (Math.random() - 0.5) * 1000,
                    y: (Math.random() - 0.5) * 1000,
                    z: (Math.random() - 0.5) * 1000
                }, 400)
                .easing(TWEEN.Easing.Quadratic.In)
                .start();
        });

        setTimeout(this.displayMatrix.bind(this, this._logoMatrix), 400);
    }

    getPosition(col, row, z = 0, matrix = null)
    {
        if (matrix === null)
        {
            matrix = digitFont[0];
        }
        // Re-align to center
        col -= matrix[0].length / 2 - 1;
        row -= matrix.length / 2;

        return {
            x: 1 * col * this._ballRadius * 2.2,
            y: -1 * row * this._ballRadius * 2.2,
            z
        }
    }

    displayMatrix(matrix)
    {
        for (let y = 0; y < matrix.length; y++)
        {
            const row = matrix[y];
            for (let x = 0; x < row.length; x++)
            {
                const cell = row[x];
                if (cell === 1)
                {
                    const ball = this._passMeBall();
                    const pos = this.getPosition(x, y, 0, matrix);
                    new TWEEN.Tween(ball.position)
                        .to(pos, Math.random() > 0.6 ? Math.random() * 5000 : Math.random() * 10000)
                        .easing(TWEEN.Easing.Quadratic.In)
                        .start();
                }
            }
        }

        new TWEEN.Tween(this.stage.rotation)
            .to({ y: Math.PI * 10 }, 11000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    }

    displayBalls(digit)
    {
        let ballIndex = 0;
        const matrix = digitFont[digit];
        for (let y = 0; y < matrix.length; y++)
        {
            const row = matrix[y];
            for (let x = 0; x < row.length; x++)
            {
                const cell = row[x];
                if (cell === 1)
                {
                    const ball = this._redBalls[ballIndex++];
                    const pos = this.getPosition(x, y);
                    $.extend(ball.position, pos);
                    this._red.add(ball);
                }
            }
        }

        for (let i = ballIndex; i < this._redBalls.length; i++)
        {
            const ball = this._redBalls[i];
            this._red.remove(ball);
        }
    }

    rainBalls(digit)
    {
        const matrix = digitFont[digit];
        for (let y = 0; y < matrix.length; y++)
        {
            const row = matrix[y];
            for (let x = 0; x < row.length; x++)
            {
                const cell = row[x];
                if (cell === 1)
                {
                    const ball = this._passMeBall();
                    this._balls.push(ball);
                    const pos = this.getPosition(x, y, 10);
                    $.extend(ball.position, pos);
                    this.stage.add(ball);

                    $.extend(ball, {
                        g: 0.5 + Math.random(),
                        vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                        vz: (Math.random() - 0.5) * 10,
                        vy: -1
                    });
                }
            }
        }
    }

    render(time)
    {
        super.render(time);

        this._balls.forEach(ball => {
            ball.position.x += ball.vx;
            ball.position.y -= ball.vy;
            ball.position.z += ball.vz;
            ball.vy += ball.g;

            if (ball.position.y < -260)
            {
                ball.vy = - ball.vy * 0.8;
                if (Math.abs(ball.vy) < 3)
                {
                    ball.vy = 0;
                }
            }
        });
    }

    _passMeBall()
    {
        if (this._ballPool.length === 0)
        {
            const ball = this._createBall();
            this.stage.add(ball);
            this._ballPool.push(ball);
        }
        return this._ballPool.pop();
    }

    _createBall(color = null)
    {
        if (color === null)
        {
            color = this._colors[parseInt(this._colors.length * Math.random())];
        }
        if (this._ballGeometry === null)
        {
            this._ballGeometry = new THREE.SphereGeometry(this._ballRadius, 32, 32);
        }
		const material =  new THREE.MeshPhongMaterial({ color, shading: THREE.FlatShading });
        const ball = new THREE.Mesh(this._ballGeometry, material);
        return ball;
    }







    _loadLogo()
    {
        const img = new Image();
        img.src = '/images/logo.png';
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        img.onload = () => {
            ctx.drawImage(img, 0, 0);

            let count = 0;
            for (let y = 0; y < img.height; y++)
            {
                const row = [];
                this._logoMatrix.push(row);
                for (let x = 0; x < img.width; x++)
                {
                    row[x] = ctx.getImageData(x, y, 1, 1).data[0] > 200 ? 0 : 1;
                    if (row[x] === 1)
                    {
                        count++;
                    }
                }
            }
            this._logoBallCount = count;
        };
    }
}
