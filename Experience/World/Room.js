import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";


export default class Room {
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        this.roomChildren = {};

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };
        
        this.setModel();
        this.onMouseMove();
    }
    
    setModel(){
        this.actualRoom.children.forEach((child)=>{
            child.castShadow = true;
            child.receiveShadow = true;

            if(child instanceof THREE.Group){
                child.children.forEach((groupchild)=>{
                    child.castShadow = true;
                    child.receiveShadow = true;
                });
            }

            // console.log(child);

            if(child.name === "Lwall"){
                child.children[2].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                });
            }

            if(child.name === "Sbody"){
                child.position.x = 3.54509;
              child.position.z = -3.35919;
            }
            
            if(child.name === "Plane.002 " ||  
            child.name === "Upper" || 
            child.name === "sofa" ||
            child.name === "Lwall" ||
            child.name === "Rwall" ||
            child.name === "Middle" ||
            child.name === "Desks" ||
            child.name === "sdesk" ||
            child.name === "Coffee" ){
                child.scale.set(0,0,0);
            }
         

            this.roomChildren[child.name.toLowerCase()] = child;
        });

        const width = 1.5;
        const height = 0.4;
        const intensity = 0.8;
        const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
        rectLight.position.set( 2.7, 9, -4 );
        rectLight.rotation.x = -Math.PI / 2;
        rectLight.rotation.z = Math.PI / 4;
        this.actualRoom.add( rectLight );

        this.roomChildren["rectLight"] = rectLight;


        // const rectLightHelper = new RectAreaLightHelper( rectLight );
        // rectLight.add( rectLightHelper );

        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(0.11, 0.11, 0.11);
        this.actualRoom.rotation.y = Math.PI; // change ligh position later, and remove line //
    }

    onMouseMove(){
        window.addEventListener("mousemove", (e)=>{
            this.rotation = ((e.clientX - window.innerWidth / 2)*2) /window.innerWidth;
            this.lerp.target = this.rotation*0.1;
        });
    }

    resize(){
    }
    
    
    update(){
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.actualRoom.rotation.y = this.lerp.current;
    }
}