function init(){
  d3.select(".memory-overlay").select(".close-button").on("click",function(d){
    d3.select(".memory-overlay").classed("overlay-hidden",true);
  });

  d3.select(".memory-header").select(".overlay-open").on("click",function(d){
    d3.select(".memory-overlay").classed("overlay-hidden",false);
  });

}

export default { init }
