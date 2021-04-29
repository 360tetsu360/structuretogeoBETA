var scene
var group
var bSize = 0;
var data;
var issub = true;
$(function() {
  var elem = document.getElementById('sizerange');
  var target = document.getElementById('sizevalue');
  var rangeValue = function (elem, target) {
    return function(evt){
      target.innerHTML =  "size:"+elem.value;
      bSize = elem.value;
    }
  }
  elem.addEventListener('input', rangeValue(elem, target));
  $('#file').change(function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function() {
      data = reader.result
      nbt.parse(data, function(error, data) {
        if (error) {
          throw error;
        }
        towakariyasui(data);
      });
    }

    reader.readAsArrayBuffer(file);
  });
});
function block(bloock_t){
  this.name = bloock_t.name.value;
  this.states = bloock_t.states.value;
}
function vec3_t(x1,y1,z1){
  this.x = x1;
  this.y = y1;
  this.z = z1;
}
function vec2_t(x1,y1){
  this.x = x1;
  this.y = y1;
}
function cube(origin,size){
  this.origin = origin;
  this.size = size; 
  this.uv = vec2_t(0,0);
}
var hasLoaded = false;
var json = {
	"format_version": "1.12.0",
	"minecraft:geometry": [
		{
			"description": {
				"identifier": "geometry.humanoid",
				"texture_width": 64,
				"texture_height": 32,
				"visible_bounds_width": 4,
				"visible_bounds_height": 4,
				"visible_bounds_offset": [0, 1, 0]
			},"bones": [
        {
					"name": "structer",
					"pivot": [0, 0, 0],
					"mirror": false,
					"cubes": []
        }
      ]
    }
  ]
}
var blocks_t = [];
var cubes= [];
var cubesData = [];
function towakariyasui(data){
  cubes = [];
  var blocks = data.value.structure.value.palette.value.default.value.block_palette.value.value;
  for (let i = 0; i < blocks.length; i++) {
    blocks_t.push(new block(blocks[i]));
  }
  var poses = data.value.size.value.value
  var bData = data.value.structure.value.block_indices.value.value[0].value;
  while(group.children.length > 0){ 
    group.remove(group.children[0]); 
  }
  var index = 0;
  for (let x = 0; x < poses[0]; x++) {
    var xmen = [];
    for (let y = 0; y < poses[1]; y++) {
      var yjik = [];
      for (let z = 0; z < poses[2]; z++) {
        if(blocks_t[bData[index]].name != "minecraft:air"){
          cubesData.push(new cube(new vec3_t(x,y,z),new vec3_t(1,1,1)));
          var ishas = false;
          for (let i = 0; i < yjik.length; i++) {
            if(z == yjik[i].origin.z + yjik[i].size.z){
              yjik[i].size = new vec3_t(yjik[i].size.x,yjik[i].size.y,yjik[i].size.z + 1);
              ishas = true;
            }
          }
          if(!ishas){
            yjik.push(new cube(new vec3_t(x,y,z),new vec3_t(1,1,1)));
          }
        }
        index++;
      }
      for (let p = 0; p < yjik.length; p++) {
        const element = yjik[p];
        var ishasy = false;
        for (let o = 0; o < xmen.length; o++) {
          if(
            element.origin.y == xmen[o].origin.y + xmen[o].size.y  &&
            element.origin.x == xmen[o].origin.x && element.origin.z == xmen[o].origin.z&&
            element.size.x == xmen[o].size.x && element.size.z == xmen[o].size.z
          ){
            xmen[o].size = new vec3_t(xmen[o].size.x,xmen[o].size.y + 1,xmen[o].size.z);
            ishasy = true;
          }
        }
        if(!ishasy){
          xmen.push(element);
        }
      }
    }
    for (let p = 0; p < xmen.length; p++) {
      const element = xmen[p];
      var ishasx = false;
      for (let o = 0; o < cubes.length; o++) {
        if(
          element.origin.x == cubes[o].origin.x + cubes[o].size.x &&
          element.origin.y == cubes[o].origin.y && element.origin.z == cubes[o].origin.z &&
          element.size.y == cubes[o].size.y && element.size.z == cubes[o].size.z
        ){
          cubes[o].size = new vec3_t(cubes[o].size.x + 1,cubes[o].size.y,cubes[o].size.z);
          ishasx = true;
        }
      }
      if(!ishasx){
        cubes.push(element);
      }
    }
  }
  
  for (let i = 0; i < cubes.length; i++) {



    var color = Math.round(Math.random() * 155 + 100) * 0x10000 + Math.round(Math.random() * 155 + 100) * 0x100 + Math.round(Math.random() * 200 + 100) * 0x1
    const element = cubes[i];
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(
      element.size.x,
      element.size.y,
      element.size.z
        ), new THREE.MeshLambertMaterial({color: color}));
    mesh.position.x = element.origin.x + element.size.x/2;
    mesh.position.y = element.origin.y + element.size.y/2;
    mesh.position.z = element.origin.z + element.size.z/2;
    group.add(mesh);
  }
  console.log(cubes.length);
  const c = document.getElementById("cubes");
  c.textContent = "cubes:" + cubes.length;
  hasLoaded = true;
}
function showCubes(array){
  while(group.children.length > 0){ 
    group.remove(group.children[0]); 
  }
  for (let i = 0; i < array.length; i++) {
    var color = Math.round(Math.random() * 155 + 100) * 0x10000 + Math.round(Math.random() * 155 + 100) * 0x100 + Math.round(Math.random() * 155 + 100) * 0x1
    const element = array[i];
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(
      element.size.x,
      element.size.y,
      element.size.z
        ), new THREE.MeshLambertMaterial({color: color}));
    mesh.position.x = element.origin.x + element.size.x/2;
    mesh.position.y = element.origin.y + element.size.y/2;
    mesh.position.z = element.origin.z + element.size.z/2;
    group.add(mesh);
  }
  const c = document.getElementById("cubes");
  c.textContent = "cubes:" + array.length;
}

window.addEventListener('load', init);
function Download(){
  if(hasLoaded){
    if(issub){
      for (let i = 0; i < cubes.length; i++) {
        const element = cubes[i];
        var a = {"origin": [element.origin.x * bSize, element.origin.y * bSize,element.origin.z * bSize], "size": [element.size.x * bSize, element.size.y * bSize, element.size.z * bSize], "uv": [0, 0]};
        json["minecraft:geometry"][0].bones[0].cubes.push(a);
      }
      let blob = new Blob([JSON.stringify(json,null,"  ")],{type:"text/plan"});
      let link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'geo.json';
      link.click();
    }
    else if(!issub){
      for (let i = 0; i < cubesData.length; i++) {
        const element = cubesData[i];
        var a = {"origin": [element.origin.x * bSize, element.origin.y * bSize,element.origin.z * bSize], "size": [element.size.x * bSize, element.size.y * bSize, element.size.z * bSize], "uv": [0, 0]};
        json["minecraft:geometry"][0].bones[0].cubes.push(a);
      }
      let blob = new Blob([JSON.stringify(json,null,"  ")],{type:"text/plan"});
      let link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'geo.json';
      link.click();
    }
  }else{
    alert("Select a file first");
  }
}

function subdivide(){
  var checkbox = document.getElementById("subdividedbox");
  var checkboxlabel = document.getElementById("issub");
  if(checkbox.checked){
    showCubes(cubes);
  }else if(!checkbox.checked){
    showCubes(cubesData);
  }
  if(checkbox.checked != issub){
  }
  issub = checkbox.checked;
  checkboxlabel.textContent = issub;
}
function init() {
  
  const parent = document.getElementById("canvas");
  const width = parent.clientWidth;
  const height = parent.clientHeight;
  const canvasElement = document.querySelector('#myCanvas')
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    alpha : true
  });
  renderer.setSize(width, height);
  scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(50, 50, 50);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  const controls = new THREE.OrbitControls(camera, canvasElement);
  group = new THREE.Group();
  scene.add(group);                                   
  const light = new THREE.HemisphereLight(0xCCCCCC, 0xAAAAAA, 1.0);
  scene.add(light);
  tick();
  function tick() {
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}
