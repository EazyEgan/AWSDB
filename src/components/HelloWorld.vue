<!-- Ignore -->

<template>
  <div class="hello">
    <button v-on:click="makedb">Create</button>
    <div>
      Movie name: <input v-model="title">
      Release year: <input v-model="year">
      <button v-on:click="getinfo">Query</button>
    </div>
    <div>
      <button v-on:click="deldb">Delete</button>
    </div>

    <li v-for="item in movInfo" :key = "item.title">
      <div class = "container">
        <div><b>Movie Title:</b> {{item.title["S"]}}</div>
        <div><b>Year Released:</b> {{item.year["N"]}}</div>

        <div v-if=item.genres><b>Movie Genres:</b> {{item.genres["L"]}}</div>
        <div v-if=item.rating><b>Movie Rating:</b> {{item.rating["N"]}}</div>
        <br>
      </div>
    </li>



  </div>




</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    title: String,
    year:String,
    movInfo: Object,
    genres: Object

  },

  methods:{
    getinfo : getInfo,
    makedb : makeDB,
    deldb : delDB

  }
}

function makeDB(){

  console.log("makeDB called ")
  let prom = fetch("http://localhost:3000/actiondb/" + "make",
      {
      })

  prom.then( response => response.json())
      .then (response =>
      {
        console.log(response.result);
        console.log("Made db");


      })}

function delDB(){


  console.log("getInfo called " + this.title + " " +  this.year)
  let prom = fetch("http://localhost:3000/actiondb/"+ "del",
      {
      })

  prom.then( response => response.json())
      .then (response =>
      {
        console.log(response.result);
        console.log("Deleted db");


      })}


function getInfo (){
  console.log("getInfo called " + this.title + " " +  this.year)
  let prom = fetch("http://localhost:3000/db/"+ this.title + "/" + this.year,
      {
      })

  prom.then( response => response.json())
      .then (response =>
      {
        this.movInfo = response.result;
        console.log("Received movinfo");
        if(this.movInfo.genres){
          this.genres = this.movInfo.genres["L"];
        }


      })}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
