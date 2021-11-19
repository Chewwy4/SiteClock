import * as THREE from  "./jsm/three.module.js";

//		import Stats from "./jsm/libs/stats.module.js";

        //Collada Loader
        import { ColladaLoader } from "./jsm/loaders/ColladaLoader.js";

        //////PostProcessing
        import { EffectComposer } from "./jsm/postprocessing/EffectComposer.js";
        import { RenderPass } from "./jsm/postprocessing/RenderPass.js";
        import { ShaderPass } from "./jsm/postprocessing/ShaderPass.js";
        import { CopyShader } from "./jsm/shaders/CopyShader.js";
        import { BrightnessContrastShader } from "./jsm/shaders/BrightnessContrastShader.js";

        import { ColorCorrectionShader } from "./jsm/shaders/ColorCorrectionShader.js";
        import { OrbitControls} from "./jsm/controls/OrbitControls.js"
        import {SepiaShader} from "./jsm/shaders/SepiaShader.js";
        //FXAA Antialiasing
        import { FXAAShader } from "./jsm/shaders/FXAAShader.js";
        import { PointerLockControls } from './jsm/controls/PointerLockControls.js';

        import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
        import { KTX2Loader } from './jsm/loaders/KTX2Loader.js';
        import { MeshoptDecoder } from './jsm/libs/meshopt_decoder.module.js';

        import { RGBELoader } from './jsm/loaders/RGBELoader.js';
        import { RoughnessMipmapper } from './jsm/utils/RoughnessMipmapper.js';

        let container;
        let scene, renderer, composer;
        let stats, guimixer;
        let watchMesh;
        let controls;
        let Hand1;
        let Hand2;
        let Hand3;
        let skyboxGeo, skybox;
        const clock = new THREE.Clock();
        let mixer;
        let camera;
        let effectFXAA,
            pixelPass,
            params,
            brightnessContrastPass,
            colorCorrectionPass,
            sepiaPass;

        //button action
        let POSITION;
        let SELECTED;
        let PRESSED;

        const mouse = new THREE.Vector2();
        const target = new THREE.Vector2();
        const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );

     

        // window.onload = function (){
        // $("#txtQuoteWrapper").fadeIn(5000);
        // }



        init();
        animate();

        (function fadeTxt () {
            let quotes = $(".txtQuote");
            let quoteIndex = 0; //scan through the index with eq selector
            
            function showNextQuote () {

                ++quoteIndex;
                quotes.eq(quoteIndex % quotes.length)
                    .fadeIn(2000)
                    .delay(6000)
                    .fadeOut(2000,showNextQuote);
                    } 
                    showNextQuote();
            })();

        function init() {
            container = document.getElementById("threecontainer");
        //	document.body.appendChild(container);


            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20000);
            camera.position.set(-200,0,650);
            //camera.lookAt(new THREE.Vector3(, 6, 0));
            scene = new THREE.Scene();



            new RGBELoader()
					.setPath( './src/textures/equirectangular/' )
					.load( 'royal_esplanade_1k.hdr', function ( texture ) {

						texture.mapping = THREE.EquirectangularReflectionMapping;
						//scene.background = texture;
                        scene.environment = texture;
                        scene.background = new THREE.Color(0x000000);
                        // scene.add(new THREE.AmbientLight(0x2e2e2e, 0.5));

        //model 
		render();
        const ktx2Loader = new KTX2Loader()
        .setTranscoderPath( 'js/libs/basis/' )
        .detectSupport( renderer );
        
        const loader = new GLTFLoader().setPath( 'src/models/gltf/' );
        loader.setKTX2Loader( ktx2Loader );
        loader.setMeshoptDecoder( MeshoptDecoder );
        loader.load( 'scene(20).glb', function ( gltf ) {
 
            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    let mat = new THREE.MeshPhongMaterial;
                    let color = new THREE.Color(0xFF0000);
                    mat.color = color;
                   // mat.wireframe = true;
                    //roughnessMipmapper.generateMipmaps( child.material );
                   // child.material = mat;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
        
            } );
    

            watchMesh = gltf.scene;
            watchMesh.scale.x = watchMesh.scale.y = watchMesh.scale.z = 90;
            watchMesh.position.x = -25;
           // watchMesh.rotation.x = 90;
            scene.add( watchMesh);
            
            render();
                
                    
                    
                    
                    
           
            


        // collada
        // const loader1 = new ColladaLoader(loadingManager);
        // loader1.load("./src/Assets/Model/WatchAnimCam2T_1.dae", function (collada) {
        //     watchMesh = collada.scene;

            
        //     watchMesh.scale.x = watchMesh.scale.z = watchMesh.scale.y = 1;
            
            //watchMesh.matrixAutoUpdate = false;
            //watchMesh.updatematrix();
                
        
            // watchMesh.traverse(function (node) {
            //     if (node instanceof THREE.Mesh) 
            //     {node.castShadow = true;}
            //     {node.receiveShadow = true;}
             
               // { let mat1 = new THREE.MeshPhongMaterial;mat1.wireframe = true; node.material = mat1;}
            // });
           // watchMesh.sortFacesByMaterialIndex();
            //scene.add(watchMesh);

            // Load Textures
            let logoMat = new THREE.TextureLoader().load("./src/Assets/Image/symbol.png");
        // If texture is used for color information, set colorspace.
       // logoMat.encoding = THREE.sRGBEncoding;
        // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
        logoMat.flipY = false;
            let metalmap1 = new THREE.TextureLoader().load("./src/Assets/Image/watch/rustedmetal.jpg.jpg");
            let metalmap2 = new THREE.TextureLoader().load("./src/Assets/Image/watch/Textures-Metal1698322.jpg");

            //let lightMat = new THREE.TextureLoader().load("Assets/Image/pwatch.jpg");
            //Bump //cogs is cogsbmap
            let bmap = new THREE.TextureLoader().load("./src/Assets/Image/watch/bump.low.21.jpg");
            let screwsbmap = new THREE.TextureLoader().load("./src/Assets/Image/watch/brushedmetalb.jpg");
            let rubberbmap = new THREE.TextureLoader().load("./src/Assets/Image/rubberb.jpg");
            let LogoBmap = new THREE.TextureLoader().load("./src/Assets/Image/watch/Logo.jpg");
            // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
            LogoBmap.flipY = false;
            let watchFacePlaneTex1 = new THREE.TextureLoader().load("./src/Assets/Image/watch/watchface01.jpg");
            let watchFacePlaneTex2 = new THREE.TextureLoader().load("./src/Assets/Image/watch/watchface02.jpg");

        //LOGO
        var logomaterial = new THREE.MeshPhongMaterial( { 
        color: 0xcccccc, 
    //	ambient: 0x202020,  
    //	emissive: 0x101010,
        combine: THREE.MixOperation,
        shininess: 380.5,
        envMap: reflectionCube, 
        specular: 0x909090,
        bumpMap: LogoBmap,
        bumpScale  :  1.75, 
        refractionRatio: 0.45, 
        reflectivity: 0.3} );

            var chromematerial = new THREE.MeshPhongMaterial({
                //map: framemap,
                //emissive: 0x2E2E2E,
                color: 0x848484,
                //	ambient: 0x000000,
                //combine: THREE.MixOperation,
                specular: 0x424242,
                shininess: 275,
                bumpMap: bmap,
                bumpScale: 0.0010,
                envMap: reflectionCube,
                refractionRatio: 400.95,
                reflectivity: 0.45,
            });
            var watchGoldCogmaterial = new THREE.MeshPhongMaterial( { 
            color: 0x3b3b3b, 
            //map: metalmap2,
            //ambient: 0xffffff,
            emissive: 0xB58100,
            //combine: THREE.MixOperation,
            envMap: reflectionCube,
            specular: 0xc3c3c3, 
            shininess: 220,
            //bumpMap: cogsbmap,
            bumpScale  :  .4, 
            //refractionRatio: 55.95, 
            reflectivity: 1 } ); 
                //screws 
                var watchScrewsmaterial = new THREE.MeshPhongMaterial( { 
                color: 0x2e2e2e, 
                //ambient: 0x8EAAC2,  
                //emissive: 0x3b3b3b,
                combine: THREE.MixOperation,
                shininess:50.5,
                envMap: reflectionCube, 
                specular: 0xb3b3b3,
                //bumpMap: cogsbmap,
                bumpScale  :  0.3, 
                refractionRatio: 0.95, 
                reflectivity: 0.2 } );
                // underparts
                var watchchromematerial = new THREE.MeshPhongMaterial( { 
                //color: 0xaaaaaa, 
                color: 0xA4A4A4,
                //ambient: 0xffffff,  
                combine: THREE.MixOperation,
                //envMap: reflectionCube, 
                specular: 0xE6E6E6,
                shininess: 55,
                bumpMap: screwsbmap,
                bumpScale  :  10, 
                refractionRatio: 3.2,
                opacity: 0.5, 
                reflectivity: 0.6} );
            //screws Rounded
        var watchScrewsroundmaterial = new THREE.MeshPhongMaterial( { 
            color: 0x404040, 
            //ambient: 0x8EAAC2,  
            combine: THREE.MixOperation,
            shininess: 380.5,
            envMap: reflectionCube, 
            specular: 0x909090,
            //bumpMap: bmap,
            bumpScale  :  0.5, 
            refractionRatio: 0.95, 
            reflectivity: 0.5 } );
            //screws 2
        var watchScrewsmaterial2 = new THREE.MeshPhongMaterial( { 
            color: 0xffffff, 
            //ambient: 0x8EAAC2,  
            //emissive: 0xffffff,
            combine: THREE.MixOperation,
            shininess: 380.5,
            envMap: reflectionCube, 
            specular: 0x909090,
            bumpMap: bmap,
            bumpScale  :  0.3, 
            refractionRatio: 0.95, 
            reflectivity: 0.9 } );
        //panel Switches
        var PanelSwitchesmaterial = new THREE.MeshPhongMaterial( { 
    color: 0x848484, 
    map: metalmap2, 
    combine: THREE.MultiplyOperation,
    envMap: reflectionCube,
    specular: 0xffffff, 
    shininess: 150,
    bumpMap: metalmap1,
    bumpScale  :  2.1, 
    //refractionRatio: 55.95, 
    reflectivity: 0.85} ); 
        var watchScrewsmaterial2 = new THREE.MeshPhongMaterial( { 
        color: 0xffffff, 
        //ambient: 0x8EAAC2,  
        //emissive: 0xffffff,
        combine: THREE.MixOperation,
        shininess: 380.5,
        envMap: reflectionCube, 
        specular: 0x909090,
        //bumpMap: bmap,
        //bumpScale  :  0.3, 
        refractionRatio: 0.95, 
        reflectivity: 0.75 } );
        var watchmaterial2 = new THREE.MeshPhongMaterial( { 
    color: 0x909090, 
    //ambient: 0xffffff,  
    combine: THREE.MixOperation,
    //emissive: 0x404040,
    specular: 0x131311, 
    shininess: 305.5,
    envMap: reflectionCube, 
    bumpMap: metalmap1,
    bumpScale  :  4,
    //refractionRatio: 0.95, 
    reflectivity: .4  } );

    var watchmaterial = new THREE.MeshPhongMaterial( { 
                                                                                                
        color: 0x6E6E6E, 
        //ambient: 0xffffff,  
        combine: THREE.MixOperation,
        specular: 0xA4A4A4, 
        shininess: 125.5,
        envMap: reflectionCube, 
        //refractionRatio: 0.95, 
        reflectivity: 0.085  } );
        var watchHandsmaterial = new THREE.MeshPhongMaterial( { 																			
        color: 0x424242, 
        //ambient: 0xffffff,  
        combine: THREE.MixOperation,
        specular: 0xA4A4A4, 
        shininess: 25.5,
        envMap: reflectionCube, 
        //refractionRatio: 0.95, 
        reflectivity: 0.1 } );
            let watchFacePlaneMat= new THREE.MeshPhongMaterial( { 
            color: 0xffffff, 
            map: watchFacePlaneTex1,
            emissive: 0x000000,
            //combine: THREE.MixOperation,
            envMap: reflectionCube,
            specular: 0x585858, 
            shininess: 5,
            bumpMap: watchFacePlaneTex1,
            bumpScale  :  1, 
            //refractionRatio: 55.95, 
            reflectivity: 0 } ); 
            var glassmaterial = new THREE.MeshPhongMaterial({
    //ambient: 0x000000,
    combine: THREE.MixOperation,
    specular: 0x585858,
    shininess: 75,

    transparent: true,
    opacity: 0.4,
    alphaTest: 0.3,
    //alpha: true,
    envMap: reflectionCube,
   
    reflectivity: 0.15,
});
var alphamaterial = new THREE.MeshPhongMaterial({
    //ambient: 0x000000,
    combine: THREE.MixOperation,
    transparent: true,
    opacity: 0,
    alphaTest: 0.3,
    //alpha: true,
});

            //find objects to apply materials
            let screws = watchMesh.getObjectByName("ScrewzHierarchy", true);
            let screws2 = watchMesh.getObjectByName("ScrewzHierarchy2", true);
            let screwsround = watchMesh.getObjectByName("RoundScrews", true);
            let mainPlate = watchMesh.getObjectByName("WatchRimT", true);
            let cogs = watchMesh.getObjectByName("Cogs", true);
            let cogs3 = watchMesh.getObjectByName("cogs3", true);
            let cogs4 = watchMesh.getObjectByName("cogs4", true);
            let PanelSwitches = watchMesh.getObjectByName("Switches", true);
            let underparts = watchMesh.getObjectByName("Underparts", true);
            let Shinyunderparts = watchMesh.getObjectByName("Top", true);
            let goldCog = watchMesh.getObjectByName("goldCog", true);
            let logo = watchMesh.getObjectByName("LOGO", true);
            const Hand1 = watchMesh.getObjectByName ('Hand1', true);
            const Hand2 = watchMesh.getObjectByName ('Hand2', true);
            const Hand3 = watchMesh.getObjectByName ('Hand3', true);
            var watchFacePlane = watchMesh.getObjectByName('watchface', true);
            var glasscover = watchMesh.getObjectByName('glasscover', true);
 
            // Set  Material Function
            let setMaterial = function (node, material) {
                node.material = material;
                if (node.children) {
                    for (let i = 0; i < node.children.length; i++) {
                        setMaterial(node.children[i], material);
                    }
                }
            };

            // Set the material on each object

            // setMaterial(screws, watchScrewsmaterial);
            // setMaterial(screws2, watchScrewsmaterial2);
            // setMaterial(screwsround, watchScrewsroundmaterial);
            // setMaterial(mainPlate, watchmaterial);				
            // setMaterial(Shinyunderparts, watchmaterial);		
            // setMaterial(cogs3, watchmaterial);
            // setMaterial(cogs4, watchmaterial);
            // setMaterial(goldCog, watchGoldCogmaterial);
            // setMaterial(PanelSwitches, watchmaterial);
            // setMaterial(underparts, watchchromematerial);
            // setMaterial(logo, logomaterial);
            // setMaterial(cogs, watchmaterial);
            // setMaterial(Hand1, watchGoldCogmaterial);


            //  setMaterial (watchFacePlane, alphamaterial);
            //  setMaterial (glasscover, glassmaterial);

   let now = new Date().getTime();
    let CurrentDate = new Date();

    let minutes = CurrentDate.getMinutes();
    let seconds = CurrentDate.getSeconds();
    let hours = CurrentDate.getHours();
    let milliseconds = CurrentDate.getMilliseconds();
    let smoothSeconds = seconds + ( milliseconds / 1000 );
    let smoothMinutes = minutes + ( seconds / 1000 );
    let smoothHour = hours + ( minutes / 1000 );

    Hand3.rotation.z = THREE.Math.degToRad( -0.5 *( (60 * hours) + minutes));
    Hand2.rotation.z = -THREE.Math.degToRad( 6 * smoothMinutes );
    Hand1.rotation.z = THREE.Math.degToRad( 6 * smoothSeconds );	

    setInterval(function(){
    Hand3.rotateZ ((-2 * Math.PI) / 86400 );
    Hand2.rotateZ ((-2 * Math.PI) / 3600);
    Hand1.rotateZ  ((-2 * Math.PI) / 60); 
},999);
//show/hide
document.getElementById("switchFaceBtn1").onclick = function () {
console.log('clicked to remove watch face');
//watchMesh.position.y = 450;
setMaterial (watchFacePlane, alphamaterial);
};
document.getElementById("switchFaceBtn2").onclick = function () {
console.log('clicked to replace watch face');
setMaterial (watchFacePlane, watchFacePlaneMat);
};		

window.addEventListener("load", onLoadFunction);
    function onLoadFunction(e){
    //do the magic you want 
    if (window.innerWidth <= 600) {
        camera.position.set(10, -250, 1300);
        //watchMesh.position.x = 130;
    }
    if (window.innerWidth <= 800) {
    
    }
    else {
    camera.position.set(-200,0,650);
    }
}
})});  
        

            
        //Lights
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 1.25 );
        hemiLight.position.set( 0, 100, 0 );
        scene.add( hemiLight );

        const dirLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
        dirLight.position.set( 1000, 1600, 1000 );
        dirLight.castShadow = true;
        scene.add( dirLight );

            const dlight2 = new THREE.DirectionalLight( 0xffffff, 2 );
            dlight2.position.set( -120, -750, -550);	
            dlight2.lookAt(new THREE.Vector3(2, 1, 0));				
           dlight2.castShadow = true;
           dlight2.shadow.mapSize.width = 1024;
           dlight2.shadow.mapSize.Height = 1024;			
            dlight2.shadow.camera.near = 0.1;
            dlight2.shadow.camera.far = 2000;
            dlight2.shadow.camera.fov = 2000;
            dlight2.shadowCameraVisible = true;
            dlight2.shadow.bias = 0.0005;
            dlight2.shadow.radius = 2150;
            scene.add( dlight2 );

        //     const light = new THREE.PointLight(0xF7F8E0, 12500, 2000);
        //     light.position.set(-50, 700, 500);
        //     light.angle = Math.PI / 9;
        //     light.castShadow = true;
        //     light.shadow.radius = 0.005;
        //     light.shadow.camera.near = 15;
        //     light.shadow.camera.far = 2000;
        //     light.shadow.mapSize.width = 2048;
        //     light.shadow.mapSize.height = 2048;
        //     light.shadow.bias = 0.0005;
        //     scene.add(light);

        //     const light2 = new THREE.PointLight(0xA9BCF5, 100, 4000);
        //     light2.position.set(-100, -200, 1100);
        //     //light.angle = Math.PI / 9;
        //     light2.castShadow = true;
        //     light2.shadow.radius = 0.005;
        //     light2.shadow.camera.near = 25;
        //     light2.shadow.camera.far = 1000;
        //     light2.shadow.mapSize.width = 2048;
        //     light2.shadow.mapSize.height = 2048;
        //     light2.shadow.bias = 0.0005;
        //  //   scene.add(light2);

        //     const light3 = new THREE.SpotLight(0xffffff, 500, 2000);
        //     light3.position.set(-100, 2250, -500 );
        //     //light.angle = Math.PI / 6;
        //     //light3.castShadow = true;
        //     light3.shadow.radius = 0.005;
        //     light3.shadow.camera.near = 25;
        //     light3.shadow.camera.far = 1000;
        //     light3.shadow.mapSize.width = 2048;
        //     light3.shadow.mapSize.height = 2048;
        //     light3.shadow.bias = 0.0005;
        //     scene.add(light3);

            //Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            	renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 0.7;
				renderer.outputEncoding = THREE.sRGBEncoding;
            //renderer.shadowMap.enabled = true;
          //  renderer.shadowMap.type = THREE.PCFShadowMap;
           // renderer.physicallyCorrectLights = true;	
            container.appendChild(renderer.domElement);

        
    
            // Postprocessing
            
        //	controls.update();

            composer = new EffectComposer(renderer);
            const renderPass = new RenderPass(scene, camera);
            composer.addPass(renderPass);
            effectFXAA = new ShaderPass(FXAAShader);

            const pixelRatio = renderer.getPixelRatio();
            effectFXAA.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
            effectFXAA.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );
            composer.addPass(effectFXAA);

            brightnessContrastPass = new ShaderPass(BrightnessContrastShader);
            brightnessContrastPass.uniforms["brightness"].value = 0.10;
            brightnessContrastPass.uniforms["contrast"].value = 0.15;
            composer.addPass(brightnessContrastPass);

            colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
            colorCorrectionPass.renderToScreen = true;
            colorCorrectionPass.uniforms["powRGB"].value = new THREE.Vector3(
                2,
                2,
                2
            );
            colorCorrectionPass.uniforms["mulRGB"].value = new THREE.Vector3(
                1.75,
                1.75,
                1.75
            );
            composer.addPass(colorCorrectionPass);


            sepiaPass = new ShaderPass(SepiaShader);
            sepiaPass.uniforms["amount"].value = 0.5;
            composer.addPass(sepiaPass) 


            //stats = new Stats();
            //container.appendChild(stats.dom);
            window.addEventListener("resize", onWindowResize);
            document.addEventListener( 'mousemove', onMouseMove, false );
        
            }


                            //cubemap
            const path = 'https://threejs.org/examples/textures/cube/pisa/';
            const format = '.png';
            const urls = [
                path + 'px' + format, path + 'nx' + format,
                path + 'py' + format, path + 'ny' + format,
                path + 'pz' + format, path + 'nz' + format
            ];

            const reflectionCube = new THREE.CubeTextureLoader().load( urls );
            const refractionCube = new THREE.CubeTextureLoader().load( urls );
            refractionCube.mapping = THREE.CubeRefractionMapping;	

            
        // loading manager

        const loadingManager = new THREE.LoadingManager(function () {});

       
//initialisation done
//loader ends here

//run time functions

        
    function onMouseMove( event ) {
            mouse.x = ( event.clientX - windowHalf.x );
            mouse.y = ( event.clientY - windowHalf.x );
            }
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            const pixelRatio = renderer.getPixelRatio();

            effectFXAA.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
            effectFXAA.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );
            if (window.innerWidth <= 600) {
    camera.position.set(10, -250, 1300);
    }
    else {
    camera.position.set(-200,0,650);
    }
        }


        //

        function animate() {
    
            target.x = ( 1 - mouse.x ) * 0.00012;
              target.y = ( 1 - mouse.y ) * 0.00012;
    
        
              
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
    

            render();
            composer.render();
            //stats.update();

            //rotate cogs
            if (watchMesh !== undefined) {
                let cogs0 = watchMesh.getObjectByName("Cogs", true);				
                cogs0.rotation.z += delta * 0.3;
               let cogs03 = watchMesh.getObjectByName("cogs3", true);
               cogs03.rotation.z += delta * 0.6;
                let cogs04 = watchMesh.getObjectByName("cogs4", true);
                cogs04.rotation.z += delta * 0.4;
                let gCog = watchMesh.getObjectByName("goldCog", true);
                gCog.rotation.z -= delta * 0.2;
                
                watchMesh.rotation.x += 0.4 * ( target.y - watchMesh.rotation.x );
                watchMesh.rotation.y += 0.4 * ( target.x - watchMesh.rotation.y );
            }
        }

        function render() {

            const delta = clock.getDelta();

            if ( mixer !== undefined ) {

                mixer.update( delta );

            }

            renderer.render( scene, camera );

            //composer.render();
            //renderer.render(scene, camera);
        }