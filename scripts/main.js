requirejs(["pixi"], function(PIXI) {
    //var exampleSocket = new WebSocket("ws://localhost:3000/");
//var bol_connection_to_ws = false;
//exampleSocket.onopen = function (event) {
//    exampleSocket.send("{'text':'Heres some text that the server is urgently awaiting!'");
//};
//exampleSocket.onmessage = function (event) {
//    console.log(event.data);
//};


    var window_width = window.innerWidth
    var window_height = window.innerHeight;
    var texture_scale = 0.25;
    var int_ms_row_gen = 1000;//milliseconds

    var bol_game_over = false;
    var date = new Date();
    var int_ms_game_start = date.getTime();
    var int_row_number = 0;

    var renderer = PIXI.autoDetectRenderer(window_width, window_height);
    document.body.appendChild(renderer.view);
    var game_resources = null;

    PIXI.loader
        // add resources
        .add('glass_1', 'imgs/glass_1.jpeg')
        .add('glass_2', 'imgs/glass_2.jpeg')
        .add('glass_3', 'imgs/glass_3.jpeg')
        .add('glass_4', 'imgs/glass_4.jpeg')
        .add('glass_5', 'imgs/glass_5.jpeg')
        .load(onAssetsLoaded);


    var stage = new PIXI.Container();
    function onAssetsLoaded(loader, resources) {
        game_resources = resources;
    }

    function generate_new_row(){
        var cube_count = 0;

        while (true) {
            var glass_type = "glass_" + (Math.floor(Math.random() * 5) + 1);
            var texture = game_resources[glass_type].texture;

            var cube_width = texture.width * texture_scale;
            var cube_height = texture.height * texture_scale;

            var x_pos = cube_count * cube_width;
            if((x_pos + cube_width) >= window_width){
                //  if we cant fit another full block then break
                break;
            }

            var y_pos = int_row_number * cube_height;
            if(y_pos >= window_height){
                bol_game_over = true;
                console.log("GAME OVER");
                break;
            }

            var cube = new PIXI.Sprite(texture);

            cube.interactive = true;
            cube.buttonMode = true;

            //cube.anchor.set(0.5);
            cube.scale.set(texture_scale);

            cube
                .on('mousedown', onDragStart)
                .on('touchstart', onDragStart)
            //.on('mouseup', onDragEnd)
            //.on('mouseupoutside', onDragEnd)
            //.on('touchend', onDragEnd)
            //.on('touchendoutside', onDragEnd)
            //.on('mousemove', onDragMove)
            //.on('touchmove', onDragMove);

            cube.position.x = x_pos;
            cube.position.y = y_pos;

            stage.addChild(cube);
            cube_count++;
        }
        int_row_number++;
        console.log("Generated "+cube_count+" new cubes.");
    }

    function update(){
        var date = new Date();
        var int_ms_frame_start = date.getTime();
        var int_ms_since_last_frame = int_ms_frame_start - int_ms_game_start;

        if(int_ms_since_last_frame >= int_ms_row_gen) {
            int_ms_game_start = int_ms_frame_start;
            if(!bol_game_over && game_resources !== null){
                console.log("Second Tick");
                generate_new_row();
            }
        }
    }

    requestAnimationFrame(animate);
    function animate() {
        requestAnimationFrame(animate);
        update();
        renderer.render(stage);
    }


    function onDragStart(event) {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = event.data;
        this.alpha = 0.25;
        this.dragging = true;
    }

    function onDragEnd() {
        this.alpha = 1;

        this.dragging = false;

        // set the interaction data to null
        this.data = null;
    }

    function onDragMove() {
        if (this.dragging) {
            var newPosition = this.data.getLocalPosition(this.parent);
            this.position.x = newPosition.x;
            this.position.y = newPosition.y;
        }
    }

});
