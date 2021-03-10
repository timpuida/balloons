<template>
  <div class="wrapper" id="wrapper">
    <div class="game-wrap" 
    ref="game-wrap"
    @click="getCoords($event)"
    >
       <p style="position: absolute; right: 5px;
          font-size:0.75rem">
         fps: {{fps}}
       </p>
        <button 
         style="font-weight:900;
         position:absolute;
         right:5px;
         top:40px;
         z-index:5;
         padding:0.25rem"
         @click.stop="togglePauseGame"
         >{{ stopGame?"►":"||" }}</button>
       <div style="position: absolute; left: 5px;">
         <p style="font-size:0.75rem">SCORE: {{totalScore}} </p>
         <p style="font-size:0.75rem">LOST: {{totalLost}}</p>
        
       </div>
       <game-shooter :angleWeapon="angleWeapon"></game-shooter>

     <game-arrow
        v-for="(arrow, index) in arrows"
        :key="'a'+index"
        :arrowData="arrow"
        :documentLeft="documentProperties.left"
     >
     <!-- {{Math.floor(arrow.top)}}  -->
     </game-arrow>
     
  </div>
  <game-balloon
    v-for="(balloon,index) of balloons"
    :key="index"
    
    @getWidth='getWidth'
    :balloon="balloon"
  >
</game-balloon>
<game-audio 
@audioLoaded=audioPlayLoaded>
</game-audio>
</div>
</template>

<script>

  import gameBalloon from './gameBalloon.vue'
  import gameShooter from './gameShooter.vue'
  import gameArrow from './gameArrow.vue'
  import gameAudio from './gameAudio.vue'
  export default {
    name: 'gameWrapper',
    components: {
      gameBalloon,
      gameShooter,
      gameArrow,
      gameAudio
    },
    data(){
      return {
        balloons: [],
        arrows:[],
        minX: 0,
        balloonWidth: 40,
        balloonHeight: 60,
        stopGame: true,
        times: 0, //temp value
        interval: null,
        fps: 0,
        clientX:0,
        clientY:0,
        documentProperties: {}, 
        documentHeight: document.documentElement.clientHeight,
        angleWeapon: 90,
        arrowHeight: 30,
        isAvailableToShot:true,
        audioData:null
      }
    },
    methods: {
     getCoords(e){
       this.clientX = Math.floor(( e.clientX*100)/window.innerWidth );
       this.clientY = Math.floor((e.clientY*100)/ this.documentHeight);
       this.calcAngle()
     },
     getWidth(data){
       this.balloonWidth = parseFloat(data.width);
       this.balloonHeight = parseFloat(data.height);
     },
     calcAngle(){
       if(this.stopGame) return
       let coordX = this.clientX -50;
       let coordY = this.clientY;
       let angle = Math.atan( (coordY * this.documentHeight) / Math.abs(coordX * window.innerWidth))*180/Math.PI;
       if (coordX > 0){
         this.angleWeapon= 180-angle;
       }else{
         this.angleWeapon = angle;
       }
     },
     createBlnOnField(min, max) {
       if (this.stopGame===true) return false;
        // случайное число от min до (max+1)
        let rand = Math.floor(min + Math.random() * (max + 1 - min));
        this.left=rand;
        this.balloons.push({
         isExist: 1,
         isBurst: null,
         left: rand,
         bottom: 0,
         stopMotion:false
       });

      },
      pushArrow(){
       let coordX = this.clientX - 50;

       let coordY = this.clientY;
       let angle = this.angleWeapon 
       this.arrows.push({
           isExist:true,
          left: this.documentProperties.width/2 +  this.documentProperties.left ,
          top:0,
          angle: angle,
          arrowGoalX: coordX,
          arrowGoalY: coordY,
        })
     },
     GameAnimation(){
       
       if (this.stopGame) {
         window.clearInterval(this.interval);
         return false;
       }
      this.times++; //temp value
      let prev=performance.now();

      window.requestAnimationFrame((time)=>{

        this.fps=Math.floor(1/((time - prev)/1000));// расчет частоты
        

        //движение шарика вверх
        for( let i=0; i < this.balloons.length; i++){
         if (Math.abs(this.balloons[i].bottom)<this.documentHeight-this.balloonHeight){
           if(!this.balloons[i].stopMotion && this.balloons[i].isExist){
            //  this.balloons[i].bottom -= 5;
             this.balloons[i].bottom -= ((time-prev)/1000)*60*5 ;
           }
         }else {
           this.balloons[i].isExist = false;
           this.balloons[i].isBurst = 0;
         }

       }

      //движение стрелы
       for (let k = 0; k < this.arrows.length; k++){
        this.arrows[k].top += ((time-prev)/1000)*60*this.arrows[k].arrowGoalY*this.documentHeight/10000; 
        this.arrows[k].left += ((time-prev)/1000)*60*(this.arrows[k].arrowGoalX)*(window.innerWidth)/10000;

        //попадание стрелы в шарик
        for (let b = 0; b < this.balloons.length; b++){
          if ( 
              //проверка высоты 
              (this.arrows[k].top > (this.documentHeight - Math.abs(this.balloons[b].bottom) - this.balloonHeight - this.arrowHeight)) &&
              (this.arrows[k].top + this.arrowHeight < (this.documentHeight - Math.abs(this.balloons[b].bottom)  )) 
             && //проверка долготы 
             (this.arrows[k].left > (this.balloons[b].left)  + this.arrowHeight*Math.cos(this.arrows[k].angle* Math.PI/ 180 ))
             && (this.arrows[k].left < (this.balloons[b].left + this.balloonWidth +this.arrowHeight*Math.cos(this.arrows[k].angle* Math.PI/ 180 )))
             ){

              if (this.balloons[b].isBurst === null){
                this.balloons[b].isBurst=1; 
                this.audioPlay();

              }
              this.balloons[b].isExist=false; 

           }
         }
          //вылет стрелы за область видимости
         if (this.arrows[k].top> this.documentHeight || 
            this.arrows[k].left<this.documentProperties.left || 
            this.arrows[k].left>this.documentProperties.right) {

           this.arrows[k].isExist=false;
           this.deleteArrow(k)
        }

      }
        prev = time;
      if ( this.times < 100000 ) {
       requestAnimationFrame(this.GameAnimation)

     }else{
       window.clearInterval(this.interval);

     }
   })
    },
    togglePauseGame(){
      this.stopGame = !this.stopGame;
      if (!this.stopGame) this.startGame()
      
    },
    
    startGame(){
        this.documentProperties=this.$refs.['game-wrap'].getBoundingClientRect();
        this.minX = this.documentProperties.left;
       document.addEventListener('click', (e)=>{
         if (this.stopGame) return
         if(e.target.closest('button')) return
          e.preventDefault()
          if(this.isAvailableToShot){
          this.pushArrow();
        }
        this.isAvailableToShot=false
      })
      this.GameAnimation();
      this.startInterval();


    },
    startInterval(){
      if (!this.stopGame) {
      this.interval = setInterval(()=>{
        this.isAvailableToShot=true;
        this.createBlnOnField(this.minX, this.maxX);
     }, 1400)
    }},
    deleteArrow(k){
      this.arrows.splice(k,1);
    },
    audioPlayLoaded(audio){
      this.audioData = audio; 
    },
    audioPlay(){
      this.audioData.currentTime = 0;
      this.audioData.play();
    }
  },
  computed:{
   maxX(){
     return this.documentProperties.right-this.balloonWidth;
   },
   totalScore(){
    return this.balloons.reduce((prev, item)=>{
      return prev + Number(item.isBurst)
    },0)
  },
  totalLost(){
    let existBls = this.balloons.reduce((sum, item)=>{
      return sum + item.isExist
    },0)
    let noExist = this.balloons.length - Number(existBls);
    return noExist - this.totalScore

  }
},
mounted(){
    window.onblur=()=> this.stopGame= true;
},
}
</script>

<style>
.game-wrap{
   position: absolute;
   top: 0;
   right: 0;
   left: 0;
   bottom: 0;
   max-width: 450px;
  margin: auto; 
   background: #3870a9;
 background:#ffacab url('~@/assets/bg.gif') no-repeat bottom/contain;
}
.wrapper{
  position: absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  background:#ffacab ;
  
}
p{
  pointer-events: none;
  user-select:none;
  z-index: 6;
}
</style>
