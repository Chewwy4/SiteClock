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

        let left; 
        let right;

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

        //hrd environment

            new RGBELoader()
					.setPath( './src/textures/equirectangular/' )
					.load( 'royal_esplanade_1k.hdr', function ( texture ) {

						texture.mapping = THREE.EquirectangularReflectionMapping;
						//scene.background = texture;
                        scene.environment = texture;
                        scene.background = new THREE.Color(0xffffff);
                        // scene.add(new THREE.AmbientLight(0x2e2e2e, 0.5));

        //model 
		render();
        const ktx2Loader = new KTX2Loader()
        .setTranscoderPath( 'js/libs/basis/' )
        .detectSupport( renderer );
        
        const loader = new GLTFLoader().setPath( 'src/models/' );
        loader.setKTX2Loader( ktx2Loader );
        loader.setMeshoptDecoder( MeshoptDecoder );
        loader.load( 'newgltbfromblender.glb', function ( gltf ) {
            watchMesh = gltf.scene;
            watchMesh.traverse( function ( child ) {

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


// let mainPlate = watchMesh.getObjectByName("WatchRimT", true);
            

//         var chromematerial = new THREE.MeshLambertMaterial({
//                 //map: framemap,
//                 emissive: 0xFF0000,
//                 color: 0x848484,
//                 //	ambient: 0x000000,
//                 //combine: THREE.MixOperation,
//                // specular: 0x424242,
//                // shininess: 275,
//               //  bumpMap: bmap,
//                // bumpScale: 0.0010,
//                 //envMap: reflectionCube,
//                // refractionRatio: 400.95,
//                 //reflectivity: 0.75,
//             });

            

//                         // Set  Material Function
//                         let setMaterial = function (node, material) {
//                             node.material = material;
//                             if (node.children) {
//                                 for (let i = 0; i < node.children.length; i++) {
//                                     setMaterial(node.children[i], material);
//                                 }
//                             }
//                         };
            
//             // Set the material on each object
//             setMaterial(mainPlate, chromematerial);


            watchMesh.scale.x = watchMesh.scale.y = watchMesh.scale.z = 100;
            watchMesh.position.x = -25;
            scene.add( watchMesh);
            render();
                

            //show current time 
            //get each clock hand  
            const Hand1 = watchMesh.getObjectByName ('Hand1', true);
            const Hand2 = watchMesh.getObjectByName ('Hand2', true);
            const Hand3 = watchMesh.getObjectByName ('Hand3', true);

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


//show/hide face
    // const watchFacePlane = watchMesh.getObjectByName('watchface', true);
    // const glasscover = watchMesh.getObjectByName('glasscover', true);
// document.getElementById("switchFaceBtn1").onclick = function () {
// console.log('clicked to remove watch face');

// setMaterial (watchFacePlane, alphamaterial);
// };
// document.getElementById("switchFaceBtn2").onclick = function () {
// console.log('clicked to replace watch face');
// setMaterial (watchFacePlane, watchFacePlaneMat);
// };		

    })
        });  
        

        //Lights
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.25 );
        hemiLight.position.set( 0, 100, 0 );
        scene.add( hemiLight );

        const dirLight = new THREE.DirectionalLight( 0xffffff, 1.25);
        dirLight.position.set( 125, 145, 325 );
        dirLight.lookAt(new THREE.Vector3(2, 1, 0));	
        scene.add( dirLight );
        
        const dlight2 = new THREE.DirectionalLight( 0xffffff, 1.25 );
            dlight2.position.set( 120, -750, -550);	
            dlight2.lookAt(new THREE.Vector3(2, 1, 0));				
            scene.add( dlight2 );

            var spotLight = new THREE.SpotLight( 0xffffff, 0.75 );
            spotLight.position.set( -130, 70, 100 );
            spotLight.angle = 1.4;
            spotLight.penumbra = 0.85;
            spotLight.decay = 0;
            spotLight.distance = 0;
            spotLight.castShadow = true;     
            spotLight.shadow.mapSize.width = 2048; // default
            spotLight.shadow.mapSize.height = 2048; // default
            spotLight.shadow.camera.top = 50; // default
            spotLight.shadow.camera.bottom = -50; // default
            spotLight.shadow.camera.left = 125; // default
            spotLight.shadow.camera.right = 125; // default
            spotLight.shadow.camera.near = 10; // default
            spotLight.shadow.camera.far = 500; // default
            spotLight.shadow.bias = 0.0001; // default   
            spotLight.shadow.focus = 1; // default
            scene.add( spotLight );
        
            spotLight.target.position.set( 50, 0, 0 );
            scene.add( spotLight.target );
            //Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, precision: 'mediump' });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 0.75; 
            renderer.shadowMap.enabled = true;
			//renderer.outputEncoding = THREE.sRGBEncoding;
           // renderer.shadowMap.type = THREE.PCFShadowMap;
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
            sepiaPass.uniforms["amount"].value = 0.75;
            composer.addPass(sepiaPass) 
            //stats = new Stats();
            //container.appendChild(stats.dom);
        }    
            window.addEventListener("resize", onWindowResize);
            document.addEventListener( 'mousemove', onMouseMove, false );
//initialisation done

//on load change camera position on screen size
window.addEventListener("load", onLoadFunction);
    function onLoadFunction(e){
 
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
       
        //rotate camera when moving camera
    function onMouseMove( event ) {
            mouse.x = ( event.clientX - windowHalf.x );
            mouse.y = ( event.clientY - windowHalf.x );
            }

            //maintain screen size ratio. change camera position on screen size
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
    //move camera
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