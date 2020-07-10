 /* global d3 */
 import loadData from './load-data'
 import enterView from 'enter-view'
 import * as Annotate from 'd3-svg-annotation';
 import isMobile from './utils/is-mobile.js'
 import truncate from './utils/truncate';
 import howler from 'howler';



 // dom variables
 let width;
 let height;
 let fadedOpacity = 0
 const mob = isMobile.any()

 // data variables
 let data;
 let previewData;

 const howlerList = []
 const howlerObj = {}
 let currentlyPlayingSong;

 const proclaimersDreSongs = ["Proclaimers, The|||I'm Gonna Be", "Dr. Dre|||Nuthin' But A G Thang"]
 const noDiggitySongs = ["BLACKstreet|||No Diggity"]
 const AceOfBaseSongs = ["Ace Of Base|||The Sign"]
 let colorScale;
 let masterPopularSongList = ["Popular average",

   "Will Smith|||Wild Wild West",

   "Paula Abdul|||Opposites Attract",
   "Jennifer Lopez|||If You Had My Love",
   "Backstreet Boys, The|||Quit Playing Games",

   "Coolio|||Gangsta's Paradise",
   "House Of Pain|||Jump Around",
   "Whitney Houston|||I Will Always Love You",
   "R. Kelly|||I Believe I Can Fly",
   "Sir Mix-A-Lot|||Baby Got Back",
   "Los Del Rio|||Macarena",

   "Dr. Dre|||Nuthin' But A G Thang",
   "Notorious B.I.G., The|||Hypnotize",
   "Phil Collins|||Do You Remember?",
   "Crash Test Dummies|||Mmm Mmm Mmm Mmm",

   "Bell Biv DeVoe|||Poison",
   "Color Me Badd|||All 4 Love",
   "Boyz II Men|||Motownphilly",
   "Warren G|||Regulate",

   "Next|||Too Close",

   "K-Ci and JoJo|||All My Life",
   "Bone Thugs N Harmony|||Tha Crossroads",
   "Savage Garden|||Truly Madly Deeply",
   "Bryan Adams|||Everything I Do I Do It For You"
 ]

 const colorScaleList = [
   "#000",

   "#1b9e77",

   "#d95f02",
   "#7570b3",
   "#e7298a",

   "#66a61e",
   "#a6761d",
   "#e7298a",
   "#7570b3",
   "#1b9e77",
   "#d95f02",

   "#1b9e77",
   "#d95f02",
   "#7570b3",
   "#e7298a",

   "#a6761d",
   "#66a61e",
   "#1f78b4",
   "#1b9e77",

   "#7570b3",

   "#1b9e77",
   "#d95f02",
   "#a6761d",
   "#66a61e"

 ]

 const underperformingSongs = [
   "Will Smith|||Wild Wild West",
   "Paula Abdul|||Opposites Attract",
   "Jennifer Lopez|||If You Had My Love",
   "Backstreet Boys, The|||Quit Playing Games",
   "Popular average"
 ]

 const overperformingSongs = [
   "Coolio|||Gangsta's Paradise",
   "House Of Pain|||Jump Around",
   "Whitney Houston|||I Will Always Love You",


   "Los Del Rio|||Macarena",
   "Popular average"
 ]

 const millennialOnlySongs = [
   "Next|||Too Close",
   "K-Ci and JoJo|||All My Life",
   "Bone Thugs N Harmony|||Tha Crossroads",
   "Savage Garden|||Truly Madly Deeply",
   //    "Bryan Adams|||Everything I Do I Do It For You",
   "Popular average"
 ]




 // chart svgs
 let $svgProclaimersDre;
 let $svgProclaimersDreG;
 let $svgProclaimersDreSongGs;

 let $svgNoDiggity;
 let $svgNoDiggityG;

 let $svgAceOfBase;
 let $svgAceOfBaseG;

 let $svgScroll;
 let $svgScrollG;
 let $svgScrollSongGs;
 let $svgScrollSongLines;
 let $svgScrollSongGLabels;
 let $svgScrollSongGLabelsTextG;

 let $svgScrollAnnos;

 let $svgMean;
 let $svgMeanG;
 let $svgMeanSongGs;
 let $svgMeanSongLines;
 let $svgMeanSongLinesBackground;

 const WRAP = 300

 let $svgLollipop;
 let $svgLollipopG;
 let $svgLollipopSongsG;
 let $lollipopButtons;

 let lollipopOrder = 'btn-millennial-order'

 const margin = {
   left: 50,
   right: 30,
   top: 60,
   bottom: 60
 }




 //  helpers

 function yearToBirthYear(yearVal) {
   let formattedYear;
   if (yearVal < 0) {
     formattedYear = Math.abs(yearVal)
   } else if (yearVal === 0) {
     formattedYear = "Born"
   } else if (yearVal > 0) {
     formattedYear = Math.abs(yearVal)
   }
   return formattedYear

 }


 function cleanSongName(song) {
   return song.replace(/[\W_]+/g, "_").toLowerCase()
 }

 function getScaleMinMax(data) {
   let scaleObj = {}

   scaleObj.yMin = d3.min(data, d => {
     return d3.min(d.values, value => value.recognition)
   })

   scaleObj.xMin = d3.min(data, d => {
     return d3.min(d.values, value => value.generation)
   })

   scaleObj.yMax = d3.max(data, d => {
     return d3.max(d.values, value => value.recognition)
   })

   scaleObj.xMax = d3.max(data, d => {
     return d3.max(d.values, value => value.generation)
   })

   return scaleObj
 }

 function handleLollipopButton() {
   const selectedButton = d3.select(this).attr('id')


 }

 function setupHowlerList() {


   for (let i = 0; i < previewData.length; i++) {
     howlerList[previewData[i].artist_song] = new Howl({
       src: [`${previewData[i].song_url}.mp3`],
       volume: .5,
       preload: false
     });
   }

   const inTextSamples = [{
       artist_song: 'no-diggity',
       song_url: `https://p.scdn.co/mp3-preview/d887520d295cec271b8396b4c131f5f55348c3a3`
     },
     {
       artist_song: 'the-sign',
       song_url: 'https://p.scdn.co/mp3-preview/304efabb42448c99202a7659e43b502a6324d981'
     }, {
       artist_song: 'wild-wild-west',
       song_url: 'https://p.scdn.co/mp3-preview/3adf0f00d728e3ab23c7dd167dbaedfdcd2ef6fe'
     }
   ]

   for (let i = 0; i < inTextSamples.length; i++) {
     howlerList[inTextSamples[i].artist_song] = new Howl({
       src: [`${inTextSamples[i].song_url}.mp3`],
       volume: .5,
       preload: false
     });
   }



 }

 function setupHowlerPlayback() {
   d3.selectAll('div.song-example').on('click', d => {
     Object.keys(howlerList).forEach(key => howlerList[key].stop());
     if (d.key === currentlyPlayingSong) {
       howlerList[d.key].stop()
       currentlyPlayingSong = null
       return
     }

     howlerList[d.key].once('load', function () {
       howlerList[d.key].play();
       currentlyPlayingSong = d.key
     });
     howlerList[d.key].load()


   })

   d3.selectAll('g.lollipop-song-g').select("sound-icon-g").on('click', d => {
     Object.keys(howlerList).forEach(key => howlerList[key].stop());

     if (d.artist_song === currentlyPlayingSong) {
       howlerList[d.artist_song].stop()
       currentlyPlayingSong = null
       return
     }

     howlerList[d.artist_song].once('load', function () {
       howlerList[d.artist_song].play()
       currentlyPlayingSong = d.artist_song
     });
     howlerList[d.artist_song].load()



   })

   d3.selectAll('.howler-icon').on('click', (d, i, n) => {
     console.log("clicking icon");
     const howlIcon = n[i]
     const howlSong = howlIcon.getAttribute('data-attribute')

     Object.keys(howlerList).forEach(key => howlerList[key].stop());

     if (howlSong === currentlyPlayingSong) {
       howlerList[howlSong].stop()
       currentlyPlayingSong = null
       return
     }

     howlerList[howlSong].once('load', function () {
       howlerList[howlSong].play();
       currentlyPlayingSong = howlSong
     });
     howlerList[howlSong].load()



   })


 }

 // setup
 function setupDOM() {

   d3.select(".see-more").on("click",function(d){
     d3.select(this).remove();
     d3.select(".chart-container__lollipop").classed("expanded",true);
   })

   //    d3.selectAll('.howler-icon').html('<svg class="testclass"></svg>   ')
   d3.xml('assets/images/sound.svg')
     .then(svg => {
       d3.selectAll('.howler-icon')
         .append('span')
         .attr('class', 'sound-icon-span')
         .nodes()
         .forEach(n => n.append(svg.documentElement.cloneNode(true)))
     })


   $svgProclaimersDre = d3.select('svg.chart__proclaimers-dre')
   $svgNoDiggity = d3.select('svg.chart__no-diggity')
   $svgAceOfBase = d3.select('svg.chart__ace-of-base')
   $svgScroll = d3.select('svg.chart__scroll')

   $svgMean = d3.select('svg.chart__mean-recognition')

   $svgLollipop = d3.select('svg.chart__lollipop')
   $lollipopButtons = d3.selectAll('.btn-lollipop')

   $lollipopButtons.on('click', handleLollipopButton)


   colorScale = d3.scaleOrdinal()
     .domain(masterPopularSongList)
     .range(colorScaleList)

 }

 function removeOldCharts() {
   d3.select('svg.line-chart').selectAll('g').remove()
   d3.select('svg.chart__no-diggity').selectAll('g').remove()
   d3.select('svg.chart__ace-of-base').selectAll('g').remove()
   d3.select('svg.chart__mean-recognition').selectAll('g').remove()
   d3.selectAll('div.chart-contents').select('svg').selectAll('g').remove()
   d3.selectAll('div.song-examples').selectAll('div.song-example').remove()
   d3.select('svg.chart__lollipop').selectAll('g').remove()
 }

 function resize() {

   removeOldCharts()
   width = window.innerWidth;
   height = window.innerHeight;
   if (width < 550) {
     margin.left = 50;
   }
   d3.selectAll('.story-step')
     .style('height', `${height}px`)


   makeAllCharts()
 }

 function setupAnnotations(scaleX, scaleY, annotations) {
   const type = Annotate.annotationLabel
   const makeAnnotations = Annotate.annotation()
     .editMode(false)
     //also can set and override in the note.padding property
     //of the annotation object
     .notePadding(20)
     .type(type)
     //accessors & accessorsInverse not needed
     //if using x, y in annotations JSON
     .accessors({
       x: d => scaleX(d.generation),
       y: d => scaleY(d.recognition)
     })
     .annotations(annotations)


   return makeAnnotations

 }


 function setupEnterView() {

   enterView({
     selector: '.lollipop-g',
     enter(el) {
       d3.select('header')
         .classed('out-of-dom', true)

     },
     exit(el) {
       d3.select('header')
         .classed('out-of-dom', false)

     },
     progress(el, progress) {},
     offset: 1, // enter at middle of viewport
     once: false, // trigger just once
   });
 }

 // making charts
 function makeProclaimersDreChart(data) {

   const annotations = [{
       note: {
         label: "Dr. Dre - Nuthin' But A G Thang",
         bgPadding: 5
       },
       //can use x, y directly instead of data
       data: {
         generation: mob ? 1993 + 0 : 1993 + 5,
         recognition: mob ? 0.5 : 0.35
       },
       className: "dre-anno",
       //   dy: 137,
       //   dx: 162
     },
     {
       note: {
         label: "The Proclaimers - I'm Gonna Be",
         bgPadding: 5
       },
       //can use x, y directly instead of data
       data: {
         generation: mob ? 1993 + 2 : 1993 + 5,
         recognition: 0.94137931
       },
       className: "proclaimers-anno",
       //   dy: 137,
       //   dx: 162
     }
   ]

   let scaleProclaimersDreX;
   let scaleProclaimersDreY;

   let chartWidth = Math.min(width, 800) - margin.left - margin.right;
   let chartHeight = mob ? chartWidth - margin.top - margin.bottom : chartWidth * .6 - margin.top - margin.bottom

   $svgProclaimersDre
     .attr('width', chartWidth + margin.left + margin.right)
     .attr('height', chartHeight + margin.top + margin.bottom)
     .attr("class", "line-chart")

   $svgProclaimersDreG = $svgProclaimersDre
     .append('g')
     .attr('class', 'chart proclaimers-dre-g')
     .attr('transform', `translate(${margin.left},${margin.top})`)

   const proclaimersDreData = data.filter(song => {
     return proclaimersDreSongs.includes(song.key)
   }).map(song => ({
     ...song,
     values: song.values.map(songYear => ({
       ...songYear,
       generation: +songYear.generation + 1993
     }))
   }))

   const scaleObj = getScaleMinMax(proclaimersDreData)

   scaleProclaimersDreX = d3.scaleLinear()
     .domain([scaleObj.xMin, scaleObj.xMax])
     .range([0, chartWidth])

   scaleProclaimersDreY = d3.scaleLinear()
     .domain([0, 1])
     .range([chartHeight, 0])


   const line = d3.line()
     .curve(d3.curveCardinal)
     .x(d =>
       scaleProclaimersDreX(d.generation))
     .y(d => scaleProclaimersDreY(d.recognition))

   const ticksNum = mob ? 5 : 5

   $svgProclaimersDreG
     .append('g')
     .attr('transform', `translate(0,${chartHeight})`)
     .attr('class', 'axis x proclaimers-dre')
     .call(d3.axisBottom(scaleProclaimersDreX).tickFormat(d3.format('')).ticks(ticksNum))

   $svgProclaimersDreG.selectAll('.x.axis')
     .selectAll('g.tick')
     .select('text')
     .attr('class', d => {
       return 'class'
     })
     .text(d => d)


   $svgProclaimersDreG
     .append('g')
     .attr('class', 'axis y proclaimers-dre')
     .call(
       d3.axisLeft(scaleProclaimersDreY)
       .tickSize(-chartWidth)
       .tickFormat(d3.format('.0%'))
       .ticks(5))

   $svgProclaimersDreG.select(".y").selectAll(".tick").select("text")
     .attr("transform", "translate(-10,0)")

   $svgProclaimersDreG.append("text")
     .attr("y", 0)
     .attr("x", 0)
     .attr("dy", "1em")
     .attr('class', 'label-axis')
     .style("text-anchor", "middle")
     .attr('transform', `translate(${chartWidth/2},${chartHeight+40})`)
     .text("Birth year");

   let $svgProclaimersDreSongGs = $svgProclaimersDreG
     .selectAll('g.song-g')
     .data(proclaimersDreData)
     .join('g')
     .attr('class', d => `song-g ${cleanSongName(d.key)}`)

   $svgProclaimersDreSongGs
     .append('path')
     .attr('class', 'line proclaimers-dre')
     .attr('d', d => line(d.values))

   const makeAnnotations = setupAnnotations(scaleProclaimersDreX, scaleProclaimersDreY, annotations)

   $svgProclaimersDreG
     .append("g")
     .attr("class", "annotation-group")
     .call(makeAnnotations)

   $svgProclaimersDreG.select(".annotation-group").clone("deep");

   $svgProclaimersDreG.selectAll(".annotation-group").classed("background-fill", function (d, i) {
     if (i == 0) {
       return true;
     }
     return false;
   })

   const $svgProclaimersDreYLabels = $svgProclaimersDreG
     .append("g")
     .attr("class", "labels-axis-y")

   $svgProclaimersDreYLabels
     .append("text")
     .attr("y", -40)
     .attr("x", 0)
     .attr("dx", 0)
     .attr('class', 'label-axis label-axis-y-bg')
     .style("text-anchor", "start")
     .attr('transform', `translate(-34,0)`)
     .selectAll("tspan")
     .data(["% of People", "Who Know", "Song"])
     .enter()
     .append("tspan")
     .text(function (d) {
       return d;
     })
     .attr("dy", function (d, i) {
       return 1.1 + "em";
     })
     .attr("x", -10);

   $svgProclaimersDreYLabels
     .append("text")
     .attr("y", -40)
     .attr("x", 0)
     .attr("dx", 0)
     .attr('class', 'label-axis label-axis-y')
     .style("text-anchor", "start")
     .attr('transform', `translate(-34,0)`)
     .selectAll("tspan")
     .data(["% of People", "Who Know", "Song"])
     .enter()
     .append("tspan")
     .text(function (d) {
       return d;
     })
     .attr("dy", function (d, i) {
       return 1.1 + "em";
     })
     .attr("x", -10);

 }

 function makeNoDiggityChart() {

   let chartWidth = Math.min(width, 800) - margin.left - margin.right;
   let chartHeight = mob ? chartWidth - margin.top - margin.bottom : chartWidth * .6 - margin.top - margin.bottom

   const CHART_SCREEN_PCT_WIDTH = mob ? 0.95 : 0.75
   const thisChartPaddingLeft = +d3.select('section.lede').style('padding-left').split('px')[0]
   const thisChartPaddingRight = +d3.select('section.lede').style('padding-right').split('px')[0]


   const chartWidthPadding = (1 - CHART_SCREEN_PCT_WIDTH) * width / 2
   let scaleNoDiggityX;
   let scaleNoDiggityY;

   const noDiggityData = data.filter(song => {
     return noDiggitySongs.includes(song.key)
   }).map(song => ({
     ...song,
     values: song.values.map(songYear => ({
       ...songYear,
       generation: +songYear.generation + 1996
     }))
   }))

   const svgWidth = mob ? chartWidth : width
   $svgNoDiggity
     .attr('width', chartWidth + margin.left + margin.right)
     .attr('height', chartHeight + margin.top + margin.bottom)


   $svgNoDiggityG = $svgNoDiggity
     .append('g')
     .attr('class', 'chart no-diggity-g')
     .attr('transform', `translate(${margin.left},${margin.top})`)

   const scaleObj = getScaleMinMax(noDiggityData)

   scaleNoDiggityX = d3.scaleLinear()
     .domain([scaleObj.xMin, scaleObj.xMax])
     .range([0, chartWidth])

   scaleNoDiggityY = d3.scaleLinear()
     .domain([0, scaleObj.yMax])
     .range([chartHeight, 0])


   const line = d3.line()
     .curve(d3.curveCardinal)
     .x(d =>
       scaleNoDiggityX(d.generation))
     .y(d => scaleNoDiggityY(d.recognition))


   const tickNum = mob ? 4 : 5
   $svgNoDiggityG
     .append('g')
     .attr('transform', `translate(0,${chartHeight})`)
     .attr('class', 'axis x no-diggity')
     .call(d3.axisBottom(scaleNoDiggityX).tickFormat(d3.format('')).ticks(tickNum))


   $svgNoDiggityG
     .append('g')
     .attr('class', 'axis y no-digity')
     .call(
       d3.axisLeft(scaleNoDiggityY)
       .tickSize(-chartWidth)
       .tickFormat(d3.format('.0%'))
       .ticks(5))

   $svgNoDiggityG.select(".y").selectAll(".tick").select("text")
     .attr("transform", "translate(-10,0)")

   $svgNoDiggityG.append("text")
     .attr("y", 0)
     .attr("x", 0)
     .attr("dy", "1em")
     .attr('class', 'label-axis')
     .style("text-anchor", "middle")
     .attr('transform', `translate(${chartWidth/2},${chartHeight+40})`)
     .text("Birth Year");


   // creating individual song groups
   let $svgNoDiggitySongGs = $svgNoDiggityG
     .selectAll('g.song-g')
     .data(noDiggityData)
     .join('g')
     .attr('class', d => `song-g ${cleanSongName(d.key)}`)


   //adding circles to each song path
   $svgNoDiggitySongGs
     .selectAll('circle.song-year')
     .data(d => d.values)
     .join('circle')
     .attr('class', d => `${cleanSongName(d.artist_song)} song-year-circles`)
     .attr('cx', d => scaleNoDiggityX(d.generation))
     .attr('cy', d => scaleNoDiggityY(d.recognition))
     .attr('r', 5)

   // adding line paths to song group elements
   $svgNoDiggitySongGs
     .append('path')
     .attr('class', 'line no-diggity')
     .attr('d', d => line(d.values))

   const annotations = [{
       note: {
         title: "11-year-olds",
         label: "at moment of No Diggity's release",
         bgPadding: mob ? 0 : 20
       },
       //can use x, y directly instead of data
       data: {
         generation: (-11 + 1996),
         recognition: 0.8979591836734694
       },
       className: "show-bg",
       dy: mob ? chartHeight / 3 : chartHeight / 7
     },
     {
       note: {
         title: "5-year-olds",
         label: "at the time of its release still recognize it today",
         bgPadding: mob ? 2 : 20
       },
       //can use x, y directly instead of data
       data: {
         generation: (-5 + 1996),
         recognition: 0.8679245283
       },
       className: "show-bg note-five-yr-old",
       dy: chartHeight / 4,
       //   dx: 162
     },
     {
       note: {
         title: "Born",
         label: "when song was released",
         bgPadding: mob ? 0 : 20
       },
       //can use x, y directly instead of data
       data: {
         generation: 1996,
         recognition: 0.5526315789
       },
       className: "show-bg",
       dy: mob ? 5 : chartHeight / 6,
       //   dx: 162
     }
   ]

   const makeAnnotations = setupAnnotations(scaleNoDiggityX, scaleNoDiggityY, annotations)

   $svgNoDiggityG
     .append("g")
     .attr("class", "annotation-group")
     .call(makeAnnotations)

   $svgNoDiggityG.select(".annotation-group").clone("deep");

   $svgNoDiggityG.selectAll(".annotation-group").classed("background-fill", function (d, i) {
     if (i == 0) {
       return true;
     }
     return false;
   })



   const $svgNoDiggityYLabels = $svgNoDiggityG
     .append("g")
     .attr("class", "labels-axis-y")

   $svgNoDiggityYLabels
     .append("text")
     .attr("y", -40)
     .attr("x", 0)
     .attr("dx", 0)
     .attr('class', 'label-axis label-axis-y-bg')
     .style("text-anchor", "start")
     .attr('transform', `translate(-34,0)`)
     .selectAll("tspan")
     .data(["% of People", "Who Know", "Song"])
     .enter()
     .append("tspan")
     .text(function (d) {
       return d;
     })
     .attr("dy", function (d, i) {
       return 1.1 + "em";
     })
     .attr("x", -10);

   $svgNoDiggityYLabels
     .append("text")
     .attr("y", -40)
     .attr("x", 0)
     .attr("dx", 0)
     .attr('class', 'label-axis label-axis-y')
     .style("text-anchor", "start")
     .attr('transform', `translate(-34,0)`)
     .selectAll("tspan")
     .data(["% of People", "Who Know", "Song"])
     .enter()
     .append("tspan")
     .text(function (d) {
       return d;
     })
     .attr("dy", function (d, i) {
       return 1.1 + "em";
     })
     .attr("x", -10);

 }

 function makeAceOfBace(data) {

   let scaleAceOfBaseX;
   let scaleAceOfBaseY;



   let chartWidth = Math.min(width, 800) - margin.left - margin.right;
   let chartHeight = mob ? chartWidth - margin.top - margin.bottom : chartWidth * .6 - margin.top - margin.bottom


   const svgWidth = mob ? chartWidth : width
   $svgAceOfBase
     .attr('width', chartWidth + margin.left + margin.right)
     .attr('height', chartHeight + margin.top + margin.bottom)


   $svgAceOfBaseG = $svgAceOfBase
     .append('g')
     .attr('class', 'chart ace-of-base-g')
     .attr('transform', `translate(${margin.left},${margin.top})`)

   const AceOfBaseData = data.filter(song => {
     return AceOfBaseSongs.includes(song.key)
   })

   const scaleObj = getScaleMinMax(AceOfBaseData)

   scaleAceOfBaseX = d3.scaleLinear()
     .domain([scaleObj.xMin, scaleObj.xMax])
     .range([0, chartWidth])

   scaleAceOfBaseY = d3.scaleLinear()
     .domain([0, scaleObj.yMax])
     .range([chartHeight, 0])


   addBirthBackground($svgAceOfBaseG, scaleAceOfBaseX, scaleAceOfBaseY, scaleObj, chartWidth, chartHeight)

   const line = d3.line()
     .curve(d3.curveCardinal)
     .x(d =>
       scaleAceOfBaseX(d.generation))
     .y(d => scaleAceOfBaseY(d.recognition))

   const ticksNum = mob ? 5 : 10

   $svgAceOfBaseG
     .append('g')
     .attr('transform', `translate(0,${chartHeight})`)
     .attr('class', 'axis x ace-of-base')
     .call(d3.axisBottom(scaleAceOfBaseX).tickFormat(d3.format('')).ticks(ticksNum))



   $svgAceOfBaseG.selectAll('.x.axis')
     .selectAll('g.tick')
     .select('text')
     .attr('class', d => {

       return 'class'
     })
     .text(d => yearToBirthYear(d))


   $svgAceOfBaseG.selectAll('.x.axis')
     .selectAll('g.tick')
     .select('text')
     .text(d => yearToBirthYear(d))
     .attr('text-anchor', (d, i, n) => {
       if (i === 0) {
         return 'middle'
       }
       if (i === 10) {
         return 'end'
       } else return
     })
     .each((d, i, n) => {
       if (i === 0) {
         d3.select(n[i]).append('tspan').text('years old').attr('dy', '1em').attr('x', '0')
       }
       if (i === 10) {
         d3.select(n[i])
           .append('tspan')
           .text('years old')
           .attr('dy', '1em').attr('x', -1)
       }
     })



   $svgAceOfBaseG
     .append('g')
     .attr('class', 'axis y ace-of-base')
     .call(
       d3.axisLeft(scaleAceOfBaseY)
       .tickSize(-chartWidth)
       .tickFormat(d3.format('.0%'))
       .ticks(5))
   //  .attr('transform', `translate(${margin.left},${margin.bottom})`)



   $svgAceOfBaseG.select(".y").selectAll(".tick").select("text")
     .attr("transform", "translate(-10,0)")

   $svgAceOfBaseG.append("text")
     .attr("y", 0)
     .attr("x", 0)
     .attr("dy", "1em")
     .attr('class', 'label-axis')
     .style("text-anchor", "middle")
     .attr('transform', `translate(${chartWidth/2},${chartHeight+40})`)
     .text("Age in 1993, when “The Sign” debuted");


   let $svgAceOfBaseSongGs = $svgAceOfBaseG
     .selectAll('g.song-g')
     .data(AceOfBaseData)
     .join('g')
     .attr('class', d => `song-g ${cleanSongName(d.key)}`)



   //adding circles to each song path
   $svgAceOfBaseSongGs
     .selectAll('circle.song-year')
     .data(d => d.values)
     .join('circle')
     .attr('class', d => `${cleanSongName(d.artist_song)} song-year-circles`)
     .attr('cx', d => scaleAceOfBaseX(d.generation))
     .attr('cy', d => scaleAceOfBaseY(d.recognition))
     .attr('r', 5)


   $svgAceOfBaseSongGs
     .append('path')
     .attr('class', 'line ace-of-base')
     .attr('d', d => line(d.values))



   const $svgAceOfBaseGYLabels = $svgAceOfBaseG
     .append("g")
     .attr("class", "labels-axis-y")

   $svgAceOfBaseGYLabels
     .append("text")
     .attr("y", -40)
     .attr("x", 0)
     .attr("dx", 0)
     .attr('class', 'label-axis label-axis-y-bg')
     .style("text-anchor", "start")
     .attr('transform', `translate(-34,0)`)
     .selectAll("tspan")
     .data(["% of People", "Who Know", "Song"])
     .enter()
     .append("tspan")
     .text(function (d) {
       return d;
     })
     .attr("dy", function (d, i) {
       return 1.1 + "em";
     })
     .attr("x", -10);

   $svgAceOfBaseGYLabels
     .append("text")
     .attr("y", -40)
     .attr("x", 0)
     .attr("dx", 0)
     .attr('class', 'label-axis label-axis-y')
     .style("text-anchor", "start")
     .attr('transform', `translate(-34,0)`)
     .selectAll("tspan")
     .data(["% of People", "Who Know", "Song"])
     .enter()
     .append("tspan")
     .text(function (d) {
       return d;
     })
     .attr("dy", function (d, i) {
       return 1.1 + "em";
     })
     .attr("x", -10);

 }

 function makeNarrativeChart(data, selectedChart, songsArray) {

   function rotateAndCenter(d){
     let dataPoint = popularSongsMap.get(d.note.key).values.filter(function(d){
       return d.generation == -2;
     })[0].recognition;

     let curveOne = popularSongsMap.get(d.note.key).values.filter(function(d){
       return d.generation == -3;
     })[0].recognition;

     let curveTwo = popularSongsMap.get(d.note.key).values.filter(function(d){
       return d.generation == -1;
     })[0].recognition;


     let delta_x = scaleXObj(-1) - scaleXObj(-3);
     let delta_y = scaleYObj(curveOne) - scaleYObj(curveTwo);
     let theta_radians = -Math.atan2(delta_y, delta_x) * 180 / Math.PI
     if(d.note.key != "Popular average"){
       theta_radians = 0;
     }
     return "translate("+chartWidth/2+","+(scaleYObj(dataPoint)+20)+"), rotate("+theta_radians+")";
   }

   const songChart = selectedChart


   //non-reusable //TODO make these ternary operator assignments that are dependent on mob/not mob (if mob, full-width chart + stacked song titles; if desktop, half widht)

   const chartWidth = Math.min(width, 800) - margin.left - margin.right;
   const chartHeight = mob ? chartWidth - margin.top - margin.bottom : chartWidth * .6 - margin.top - margin.bottom

   const CHART_SCREEN_PCT_WIDTH = mob ? 0.95 : 0.65


   const chartWidthPadding = mob ? (1 - CHART_SCREEN_PCT_WIDTH) * width / 2 : (0.7 - CHART_SCREEN_PCT_WIDTH) * width / 2

   const songsToHighlight = songsArray

   const popularSongs = data.filter(song => songsToHighlight.includes(song.key)).sort((a, b) => {
     if (a.key === 'Popular average') {
       return 1
     } else return -1
   })

   let popularSongsMap = d3.map(popularSongs,function(d){
     return d.key;
   })

   const annotations = popularSongs.map(song => {

     const songAnno = {}

     const note = {}
     note.label = song.key.replace('|||', ' - ')
     note.bgPadding = {
       'right': 10,
       'bottom': 0
     }
     note.key = song.key
     note.wrap = mob ? 10 : WRAP
     note.padding = 0

     const data = {}

     const nonZeroArray = song.values.filter(item => item.recognition > 0)
     const maxXValue = d3.max(nonZeroArray, item => item.generation)
     const className = cleanSongName(song.key)
     data.recognition = nonZeroArray[nonZeroArray.length - 1].recognition;
     data.generation = maxXValue;

     songAnno.className = className + ' ' + 'invisible';
     songAnno.key = song.key
     songAnno.note = note
     songAnno.data = data

     return songAnno
   })

   let scaleXObj;
   let scaleYObj;

   const $svgObj = d3.select(`svg.chart__${songChart}-songs`); //TODO change out variable
   const $svgObjG = $svgObj.append('g')
   let $svgObjSongGs;
   let $svgObjSongLines;

   $svgObj
     .attr('width', chartWidth + margin.left + margin.right)
     .attr('height', chartHeight + margin.top + margin.bottom)

   $svgObjG
     .attr('class', `chart ${songChart}-g`) //TODO change out variable
     .attr('transform', `translate(${margin.left},${margin.top})`)


   const scaleObj = getScaleMinMax(popularSongs)

   scaleXObj = d3.scaleLinear()
     .domain([scaleObj.xMin, scaleObj.xMax])
     .range([0, chartWidth])


   scaleYObj = d3.scaleLinear()
     .domain([0, scaleObj.yMax])
     .range([chartHeight, 0])




   addBirthBackground($svgObjG, scaleXObj, scaleYObj, scaleObj, chartWidth, chartHeight)


   const line = d3.line()
     .curve(d3.curveCardinal)
     .x(d =>
       scaleXObj(d.generation))
     .y(d => scaleYObj(d.recognition))

   const ticksNum = mob ? 5 : 10

   $svgObjG
     .append('g')
     .attr('transform', `translate(0,${chartHeight})`)
     .attr('class', `axis x ${songChart}`) //TODO change out variable
     .call(d3.axisBottom(scaleXObj).tickFormat(d3.format('')).ticks(ticksNum))


   $svgObjG.selectAll('.x.axis')
     .selectAll('g.tick')
     .select('text')
     .text(d => yearToBirthYear(d))
     .attr('text-anchor', (d, i, n) => {
       if (i === 0) {
         return 'middle'
       }
       if (i === 11) {
         return 'end'
       } else return
     })
     .each((d, i, n) => {
       if (i === 0) {
         d3.select(n[i]).append('tspan').text('years old').attr('dy', '1em').attr('x', '0')
       }
       if (i === 11) {
         d3.select(n[i])
           .append('tspan')
           .text('years')
           .attr('dy', '1em').attr('x', -1)

         d3.select(n[i])
           .append('tspan')
           .text('until born')
           .attr('dy', '1em').attr('x', -1)
       }
     })

   $svgObjG
     .append('g')
     .attr('class', `axis y ${songChart}`) //TODO change out variable
     .call(d3.axisLeft(scaleYObj)
       .tickSize(-chartWidth)
       .tickFormat(d3.format('.0%'))
       .ticks(5)
     )


   //  AXES

   $svgObjG.append("text")
     .attr("y", 0)
     .attr("x", 0)
     .attr("dy", "1em")
     .attr('class', 'label-axis')
     .style("text-anchor", "middle")
     .attr('transform', `translate(${chartWidth/2},${chartHeight+40})`)
     .text("Age in year that song was released");

   $svgObjSongGs = $svgObjG
     .selectAll('g.song-g')
     .data(popularSongs)
     .join('g')
     .attr('class', d => `song-g ${cleanSongName(d.key)}`)

   const $svgObjSongBackgroundLines = $svgObjSongGs
     .append('path')
     .attr('class', `background-line ${songChart}-recognition`) //TODO change variable
     .attr('d', d => line(d.values))
     .style("opacity",.7)


   $svgObjSongLines = $svgObjSongGs
     .append('path')
     .attr('class', `line ${songChart}-recognition`) //TODO change variable
     .attr('d', d => line(d.values))
     .style('opacity', function(d,i){
       if(d.key === 'Popular average'){
         return 1;
       }
       else {
         return 1-(i/5);
       }
     })
     .style('stroke', d => {
       const color = d.key === 'Popular average' ? '#ad1b64' : '#106bb3'
       return color
     })

   const makeAnnotations = setupAnnotations(scaleXObj, scaleYObj, annotations)
   const makeAnnotationsBackground = setupAnnotations(scaleXObj, scaleYObj, annotations)


   $svgObjG
     .append("g")
     .attr("class", "annotation-group-mean-background")
     .call(makeAnnotationsBackground)


   $svgObjG
     .append("g")
     .attr("class", "annotation-group-mean")
     .call(makeAnnotations)



    $svgObjG.select('.annotation-group-mean')
      .selectAll('g.annotation.label')
      .classed('invisible', d => {
        if (d.note.label === 'Popular average') {
          return false
        }
        return true
      })
      .attr("transform",rotateAndCenter)


   $svgObjG.select('.annotation-note-content')
     .attr('transform', `translate(0,0)`)


   // Adding song examples
   const $songExamplesBox = d3.select(`.song-examples.${songChart}-songs`) //TODO change variable
   $songExamplesBox.style('margin-top', `${margin.top}px`)


   //TODO choose more songs so that this doesn't look too sparse
   const $songExamples = $songExamplesBox.selectAll('div.song-example')
     .data(popularSongs.filter(song => song.key !== 'Popular average'))
     .join('div')
     .attr('class', 'song-example')

   const $songExamplesTitles = $songExamples
     .append('p')
     .attr('class', 'song-example__title')
     .style('opacity', function(d,i){
        return 1-(i/10);
     })
     .style('color', d => {
       const color = d.key === 'Popular average' ? '#ad1b64' : '#106bb3'
       return color
     })

   d3.xml('assets/images/sound.svg')
     .then(svg => {


       d3.select(`figure.${songChart}-songs`)
         .select('div.song-examples')
         .selectAll('.song-example')
         .selectAll('p.song-example__title')
         .append('span')
         .attr('class', 'sound-icon-span')
         .nodes()
         .forEach(n => n.append(svg.documentElement.cloneNode(true)))

     })
     .then(() => {
       $songExamplesTitles
         .append('span')
         .attr('class', 'song-example__title-text')
         .text(d => d.key.split('|||')[1])
     })

   const $songExamplesArtists = $songExamples
     .append('p')
     .attr('class', 'song-example__artist')
     .text(d => d.key.split('|||')[0])

   $songExamplesArtists
     .append('span')
     .attr('class', 'song-example__year')
     .text(d => `, ${d.year}`)

   const $svgObjGYLabels = $svgObjG
     .append("g")
     .attr("class", "labels-axis-y")

   $svgObjGYLabels
     .append("text")
     .attr("y", -40)
     .attr("x", 0)
     .attr("dx", 0)
     .attr('class', 'label-axis label-axis-y-bg')
     .style("text-anchor", "start")
     .attr('transform', `translate(-34,0)`)
     .selectAll("tspan")
     .data(["% of People", "Who Know", "Song"])
     .enter()
     .append("tspan")
     .text(function (d) {
       return d;
     })
     .attr("dy", function (d, i) {
       return 1.1 + "em";
     })
     .attr("x", -10);

   $svgObjGYLabels
     .append("text")
     .attr("y", -40)
     .attr("x", 0)
     .attr("dx", 0)
     .attr('class', 'label-axis label-axis-y')
     .style("text-anchor", "start")
     .attr('transform', `translate(-34,0)`)
     .selectAll("tspan")
     .data(["% of People", "Who Know", "Song"])
     .enter()
     .append("tspan")
     .text(function (d) {
       return d;
     })
     .attr("dy", function (d, i) {
       return 1.1 + "em";
     })
     .attr("x", -10);

   $svgObjGYLabels
     .append("text")
     .attr("y", -40)
     .attr("x", 0)
     .attr("dx", 0)
     .attr('class', 'label-axis label-axis-y')
     .style("text-anchor", "start")
     .attr('transform', `translate(-34,0)`)
     .selectAll("tspan")
     .data(["% of People", "Who Know", "Song"])
     .enter()
     .append("tspan")
     .text(function (d) {
       return d;
     })
     .attr("dy", function (d, i) {
       return 1.1 + "em";
     })
     .attr("x", -10);


   //creating voronoi
   const voronoi = d3.voronoi()
   const flatArray = d3.merge(popularSongs.map(d => d.values))


   voronoi
     .x(d => scaleXObj(d.generation))
     .y(d => scaleYObj(d.recognition))
     .extent([
       [0, 0],
       [chartWidth, chartHeight]
     ])

   //    console.log(flatArray)

   const $voronoiGroup = $svgObjG
     .append('g')
     .attr('class', 'g-voronoi')

   const $voronoiPaths = $voronoiGroup
     .selectAll('path')
     .data(voronoi.polygons(flatArray))
     .enter()
     .append('path')
     .attr("d", d => (d ? "M" + d.join("L") + "Z" : null)) //this step draws the paths from the voronoi data
     .on('mouseenter', song => {




       //    console.log(song.data)
       const currentSongs = ['Popular average', song.data.artist_song];

       $svgObjSongBackgroundLines.classed('background-line-highlight', d => {
         if (currentSongs.includes(d.key)) return true //TODO add sorting by data value to actually have lines at the top
         else return false
       })


       $svgObjSongLines
         .style('opacity', d => {
           const opacity = currentSongs.includes(d.key) ? 1 : .07
           return opacity
         })
         .style('stroke', d => {
           let color;
           if ((d.key === song.data.artist_song) && (song.data.artist_song !== 'Popular average')) {
             color = '#0a563f'
           } else if (d.key === 'Popular average') {
             color = '#52370c'
           } else {
             color = '#383838'
           }
           return color
         })

       $songExamples
         .classed('selected-songs', d => d.key === song.data.artist_song ? true : false)
     })
     .on('mouseleave', song => {

       $svgObjSongLines
         .style('opacity', d => {
           const opacity = d.key === 'Popular average' ? 1 : .07
           return opacity
         })
         .style('stroke', d => {
           const color = d.key === 'Popular average' ? '#52370c' : '#383838'
           return color
         })

       $songExamples
         .classed('selected-songs', false)

     })
   //  .attr('transform', `translate(${margin.left},${margin.bottom})`)

   $songExamples.on('mouseenter', song => {
       const currentSongs = ['Popular average', song.key];
       $svgObjSongLines
         .style('opacity', d => {
           const opacity = currentSongs.includes(d.key) ? 1 : .07
           return opacity
         })
         .style('stroke', d => {
           let color;
           if (d.key === song.key) {
             color = '#0a563f'
           } else if (d.key === 'Popular average') {
             color = '#52370c'
           } else {
             color = '#383838'
           }
           return color
         })

       $songExamples
         .classed('selected-songs', d => d.key === song.key ? true : false)
     })
     .on('mouseleave', song => {
       $svgObjSongLines
         .style('opacity', d => {
           const opacity = d.key === 'Popular average' ? 1 : .07
           return opacity
         })
         .style('stroke', d => {
           const color = d.key === 'Popular average' ? '#52370c' : '#383838'
           return color
         })

       $songExamples
         .classed('selected-songs', false)
     })

   const songExamplesContainerHeight = chartHeight
   if (!mob) {
     $songExamplesBox.style('height', `${songExamplesContainerHeight}px`)
   }


 }

 function addBirthBackground($svgObjG, scaleX, scaleY, scaleObj, chartWidth, chartHeight) {

   $svgObjG.append('rect')
     .attr('class', 'birth-background')
     .attr('x', scaleX(0))
     .attr('y', scaleY(1))
     .attr('height', scaleY(0) - scaleY(1))
     .attr('width', chartWidth - scaleX(0))
     .style('fill', 'url(#Gradient2)')

   $svgObjG.append('rect')
     .attr('class', 'birth-background-border')
     .attr('id', 'rect1')
     .attr('x', scaleX(0))
     .attr('y', scaleY(1))
     .attr('height', scaleY(0) - scaleY(1))
     .attr('width', scaleX(0.1) - scaleX(0))
   //  .style('fill', 'url(#Gradient1)')

   $svgObjG.append('text')
     .attr('class', 'birth-background-anno')
     .text('NOT BORN AT SONG RELEASE')
     .attr('x', scaleX(0.5))
     .attr('y', scaleY(.03))


 }

 function makeMeanChart(data) {
   const CHART_SCREEN_PCT_WIDTH = mob ? 0.95 : 0.75

   const thisChartPaddingLeft = +d3.select('section.scroll').style('padding-left').split('px')[0]
   const thisChartPaddingRight = +d3.select('section.scroll').style('padding-right').split('px')[0]

   const chartWidth = Math.min(width, 800) - margin.left - margin.right;
   const chartHeight = mob ? 0.6 * height : Math.min(0.6 * height,chartWidth*.5);

   //    const chartWidth = CHART_SCREEN_PCT_WIDTH * width

   //whatever width we decided for the chart, take the remaining width of screen,
   //and  use that as padding on the left
   const chartWidthPadding = (1 - CHART_SCREEN_PCT_WIDTH) * width / 2

   const popularSongs = data
     .filter(song => song.key === 'Popular average' || song.values[0].recognition >= 0.9)
     .sort((a, b) => {
       if (a.key === 'Popular average') {
         return 1
       } else return -1
     })


   let popularSongsMap = d3.map(popularSongs,function(d){
     return d.key;
   })

   const annotationsMean = popularSongs.map(song => {

     const songAnno = {}

     const note = {}
     note.label = song.key.replace('|||', ' - ')
     note.bgPadding = {
       'right': 10,
       'bottom': 0
     }
     note.key = song.key
     note.wrap = mob ? 10 : WRAP
     note.padding = 0

     const data = {}

     const nonZeroArray = song.values.filter(item => item.recognition > 0)
     const maxXValue = d3.max(nonZeroArray, item => item.generation)
     const className = cleanSongName(song.key)
     data.recognition = nonZeroArray[nonZeroArray.length - 1].recognition;
     data.generation = maxXValue;

     songAnno.className = className + ' ' + 'invisible';
     songAnno.key = song.key
     songAnno.note = note
     songAnno.data = data

     return songAnno
   })


   let scaleMeanX;
   let scaleMeanY;


   //svg width remains at full

   const svgWidth = mob ? chartWidth : width
   $svgMean
     .attr('width', chartWidth + margin.left + margin.right)
     .attr('height', chartHeight + margin.top + margin.bottom)

   $svgMeanG = $svgMean
     .append('g')
     .attr('class', 'chart mean-g')
     .attr('transform', `translate(${margin.left},${margin.top})`)

   const scaleObj = getScaleMinMax(popularSongs)

   //    console.log(scaleObj)

   scaleMeanX = d3.scaleLinear()
     .domain([scaleObj.xMin, scaleObj.xMax])
     .range([0, chartWidth])


   scaleMeanY = d3.scaleLinear()
     .domain([0, scaleObj.yMax])
     .range([chartHeight, 0])


   addBirthBackground($svgMeanG, scaleMeanX, scaleMeanY, scaleObj, chartWidth, chartHeight)

   const line = d3.line()
     .curve(d3.curveCardinal)
     .x(d =>
       scaleMeanX(d.generation))
     .y(d => scaleMeanY(d.recognition))



   const ticksNum = mob ? 5 : 10
   $svgMeanG
     .append('g')
     .attr('class', 'axis x scroll')
     .attr('transform', `translate(0,${chartHeight})`)
     .call(d3.axisBottom(scaleMeanX).tickFormat(d3.format('')).ticks(ticksNum))

   $svgMeanG.selectAll('.x.axis')
     .selectAll('g.tick')
     .select('text')
     .attr('class', d => {
       return 'class'
     })
     .text(d => yearToBirthYear(d))
     .attr('text-anchor', (d, i, n) => {
       if (i === 0) {
         return 'middle'
       }
       if (i === 11) {
         return 'end'
       } else return
     })
     .each((d, i, n) => {
       if (i === 0) {
         d3.select(n[i]).append('tspan').text('years old').attr('dy', '1em').attr('x', '0')
       }
       if (i === 11) {
         d3.select(n[i])
           .append('tspan')
           .text('years')
           .attr('dy', '1em').attr('x', -1)


         d3.select(n[i])
           .append('tspan')
           .text('until born')
           .attr('dy', '1em').attr('x', -1)
       }
     })

   $svgMeanG
     .append('g')
     .attr('class', 'axis y scroll')
     .call(d3.axisLeft(scaleMeanY)
       .tickSize(-chartWidth)
       .tickFormat(d3.format('.0%'))
       .ticks(5)
     )

   $svgMeanG.append("text")
     .attr("y", 0)
     .attr("x", 0)
     .attr("dy", "1em")
     .attr('class', 'label-axis')
     .style("text-anchor", "middle")
     .attr('transform', `translate(${chartWidth/2},${chartHeight+40})`)
     .text("Age in year that song was released");

   $svgMeanSongGs = $svgMeanG
     .selectAll('g.song-g')
     .data(popularSongs)
     .join('g')
     .attr('class', d => `song-g ${cleanSongName(d.key)}`)

   //  .attr('transform', `translate(${margin.left},${margin.top})`)

   $svgMeanSongLinesBackground = $svgMeanSongGs
     .append('path')
     .attr('class', 'background-line mean-recognition')
     .attr('d', d => line(d.values))
     .style('opacity', d => {
       //    console.log(d.key)
       const opacity = d.key === 'Popular average' ? 1 : null;
       return opacity
     })


   $svgMeanSongLines = $svgMeanSongGs
     .append('path')
     .attr('class', 'line mean-recognition')
     .attr('d', d => line(d.values))
     .style('opacity', d => {
       //    console.log(d.key)
       const opacity = d.key === 'Popular average' ? 1 : .07
       return opacity
     })
     .style('stroke', d => {
       const color = d.key === 'Popular average' ? '#ad1b64' : '#383838'
       return color
     })

   const $svgMeanGYLabels = $svgMeanG
     .append("g")
     .attr("class", "labels-axis-y")

   $svgMeanGYLabels
     .append("text")
     .attr("y", -40)
     .attr("x", 0)
     .attr("dx", 0)
     .attr('class', 'label-axis label-axis-y-bg')
     .style("text-anchor", "start")
     .attr('transform', `translate(-34,0)`)
     .selectAll("tspan")
     .data(["% of People", "Who Know", "Song"])
     .enter()
     .append("tspan")
     .text(function (d) {
       return d;
     })
     .attr("dy", function (d, i) {
       return 1.1 + "em";
     })
     .attr("x", 0)
     ;

   $svgMeanGYLabels
     .append("text")
     .attr("y", -40)
     .attr("x", 0)
     .attr("dx", 0)
     .attr('class', 'label-axis label-axis-y')
     .style("text-anchor", "start")
     .attr('transform', `translate(-34,0)`)
     .selectAll("tspan")
     .data(["% of People", "Who Know", "Song"])
     .enter()
     .append("tspan")
     .text(function (d) {
       return d;
     })
     .attr("dy", function (d, i) {
       return 1.1 + "em";
     })
     .attr("x", 0);



   if (mob) {
     $svgMeanG.select('.annotation-y-axis')
       .select('.annotation-note-content')
       .attr('transform', 'translate(0,0)')
   }


   const makeAnnotations = setupAnnotations(scaleMeanX, scaleMeanY, annotationsMean)
   const makeAnnotationsBackground = setupAnnotations(scaleMeanX, scaleMeanY, annotationsMean)

   $svgMeanG
     .append("g")
     .attr("class", "annotation-group-mean-background")
     .call(makeAnnotationsBackground)


   $svgMeanG
     .append("g")
     .attr("class", "annotation-group-mean")
     .call(makeAnnotations)

   $svgMeanG.select('.annotation-group-mean')
     .attr('transform', `translate(${0},0)`)

    function rotateAndCenter(d){
      let dataPoint = popularSongsMap.get(d.note.key).values.filter(function(d){
        return d.generation == -2;
      })[0].recognition;

      let curveOne = popularSongsMap.get(d.note.key).values.filter(function(d){
        return d.generation == -3;
      })[0].recognition;

      let curveTwo = popularSongsMap.get(d.note.key).values.filter(function(d){
        return d.generation == -1;
      })[0].recognition;


      let delta_x = scaleMeanX(-1) - scaleMeanX(-3);
      let delta_y = scaleMeanY(curveOne) - scaleMeanY(curveTwo);
      let theta_radians = -Math.atan2(delta_y, delta_x) * 180 / Math.PI
      if(d.note.key != "Popular average"){
        theta_radians = 0;
      }
      return "translate("+chartWidth/2+","+(scaleMeanY(dataPoint)+20)+"), rotate("+theta_radians+")";
    }


   $svgMeanG.select('.annotation-group-mean')
     .selectAll('g.annotation.label')
     .classed('invisible', d => {
       if (d.note.label === 'Popular average') {
         return false
       }
       return true
     })
     .attr("transform",rotateAndCenter)



   $svgMeanG.select('.annotation-group-mean-background')
     .selectAll('g.annotation.label')
     .classed('invisible', d => {
       if (d.note.label === 'Popular average') {
         return false
       }
       return true
     })
     .attr("transform",rotateAndCenter)

   //creating voronoi
   const voronoi = d3.voronoi()
   const flatArray = d3.merge(popularSongs.map(d => d.values))

   voronoi
     .x(d => scaleMeanX(d.generation))
     .y(d => scaleMeanY(d.recognition))
     .extent([
       [0, 0],
       [(chartWidth),
         (chartHeight)
       ]
     ])

   const $voronoiGroup = $svgMeanG
     .append('g')
     .attr('class', 'g-voronoi')

   const $voronoiPaths = $voronoiGroup
     .selectAll('path')
     .data(voronoi.polygons(flatArray))
     .enter()
     .append('path')
     .attr("d", d => (d ? "M" + d.join("L") + "Z" : null)) //this step draws the paths from the voronoi data
     .on('mouseenter', d => {
       const currentSong = cleanSongName(d.data.artist_song);

       $svgMeanSongLines
         .style('stroke', "#383838")

       $svgMeanG
         .select(`g.${currentSong}`)
         .select('path.background-line')
         .classed('background-line-highlight', true)

       $svgMeanG
         .select(`g.${currentSong}`)
         .select('path.line')
         .style('stroke',"#ad1b64")
         .style('opacity', 1)

       $svgMeanG.select('.annotation-group-mean')
         .selectAll('g.annotation.label')
         .classed('invisible', d => {
           if (cleanSongName(d.note.label) === currentSong) {
             return false
           }
           return true
         })

       $svgMeanG.select('.annotation-group-mean-background')
         .selectAll('g.annotation.label')
         .classed('invisible', d => {
           if (cleanSongName(d.note.label) === currentSong) {
             return false
           }
           return true
         })

     })
     .on('mouseleave', d => {


       $svgMeanG
         .selectAll(`.song-g`)
         .select('path.background-line')
         .classed('background-line-highlight', false)

       $svgMeanSongLines
         .style('opacity', d => {
           const opacity = d.key === 'Popular average' ? 1 : .07
           return opacity
         })
         .style('stroke', d => {
           const color = d.key === 'Popular average' ? '#ad1b64' : '#383838'
           return color
         })

       $svgMeanG.select('.annotation-group-mean-background')
         .selectAll('g.annotation.label')
         .classed('invisible', d => {
           if (d.note.label === 'Popular average') {
             return false
           }
           return true
         })

       $svgMeanG.select('.annotation-group-mean')
         .selectAll('g.annotation.label')
         .classed('invisible', d => {
           if (d.note.label === 'Popular average') {
             return false
           }
           return true
         })



     })


 }


 function makeScrollChart(data) {
   const chartHeight = 0.6 * height
   const CHART_SCREEN_PCT_WIDTH = 0.75
   const chartWidth = CHART_SCREEN_PCT_WIDTH * width

   //whatever width we decided for the chart, take the remaining width of screen,
   //and  use that as padding on the left
   const chartWidthPadding = (1 - CHART_SCREEN_PCT_WIDTH) * width / 2

   const popularSongs = data.filter(song => masterPopularSongList.includes(song.key) || song.values[0].recognition >= 0.95)

   const annotationsScroll = popularSongs.map(song => {

     const songAnno = {}

     const note = {}
     note.label = song.key.replace('|||', ' - ')
     note.bgPadding = 20
     note.key = song.key
     note.wrap = WRAP
     note.padding = 4

     const data = {}

     const nonZeroArray = song.values.filter(item => item.recognition > 0)
     const maxXValue = d3.max(nonZeroArray, item => item.generation)
     const className = cleanSongName(song.key)
     data.recognition = nonZeroArray[nonZeroArray.length - 1].recognition;
     data.generation = maxXValue;

     songAnno.className = className + ' ' + 'invisible';
     songAnno.key = song.key
     songAnno.note = note
     songAnno.data = data

     return songAnno
   })

   console.log(annotationsScroll)

   let scaleScrollX;
   let scaleScrollY;



   //svg width remains at full
   $svgScroll
     .attr('width', width)
     .attr('height', height)

  $svgScrollG = $svgScroll
     .append('g')
     .attr('class', 'chart scroll-g')
     .attr('transform', `translate(${chartWidthPadding},${margin.top})`)

   const scaleObj = getScaleMinMax(popularSongs)

   console.log(scaleObj)

   scaleScrollX = d3.scaleLinear()
     .domain([scaleObj.xMin, scaleObj.xMax])
     .range([0, chartWidth - margin.left - margin.right])


   scaleScrollY = d3.scaleLinear()
     .domain([0, scaleObj.yMax])
     .range([chartHeight - margin.top - margin.bottom, 0])


   const line = d3.line()
     .curve(d3.curveCardinal)
     .x(d =>
       scaleScrollX(d.generation))
     .y(d => scaleScrollY(d.recognition))

   $svgScrollG
     .append('g')
     .attr('class', 'axis x scroll')
     .call(d3.axisBottom(scaleScrollX).tickFormat(d3.format('')))
     .attr('transform', `translate(${margin.left},${chartHeight-margin.bottom})`)

   $svgScrollG
     .append('g')
     .attr('class', 'axis y scroll')
     .call(d3.axisLeft(scaleScrollY)
       .tickSize(-chartWidth + margin.left + margin.right)
       .tickFormat(d3.format('.0%'))
       .ticks(5)
     )
     .attr('transform', `translate(${margin.left},${margin.bottom})`)


   $svgScrollG.append("text")
     .attr("y", 0)
     .attr("x", 0)
     .attr("dy", "1em")
     .attr('class', 'label-axis')
     .style("text-anchor", "middle")
     .attr('transform', `translate(${margin.left+chartWidth/2},${chartHeight+margin.bottom/2})`)
     .text("Age when song was released");


   $svgScrollSongGs = $svgScrollG
     .selectAll('g.song-g')
     .data(popularSongs)
     .join('g')
     .attr('class', d => `song-g ${cleanSongName(d.key)}`)
     .attr('transform', `translate(${margin.left},${margin.top})`)

   $svgScrollSongLines = $svgScrollSongGs
     .append('path')
     .attr('class', 'line scroll')
     .attr('d', d => line(d.values))
     .style('opacity', 0)

   $svgScrollSongGLabelsTextG = $svgScrollSongGs
     .append('g')
     .attr('class', 'label-g scoll')
     .style('opacity', 0)

   const makeAnnotations = setupAnnotations(scaleScrollX, scaleScrollY, annotationsScroll)

   $svgScrollG
     .append("g")
     .attr("class", "annotation-group-scroll")
     .call(makeAnnotations)

   $svgScrollG.select('.annotation-group-scroll')
     .attr('transform', `translate(${margin.left + WRAP/2},0)`)

   $svgScrollG
     .selectAll('g.label')
     .select('text.annotation-note-label')
     .style('fill', d => colorScale(d.note.key))



   const yAxisAnnotation = [{
     note: {
       title: "% of People Who Know Song",
       bgPadding: 20
     },
     //can use x, y directly instead of data
     data: {
       generation: (-15),
       recognition: 1
     },
     className: "show-bg"
     // dy: chartHeight / 7,
     //   dx: 162
   }]

   const makeYAxisLabel = setupAnnotations(scaleScrollX, scaleScrollY, yAxisAnnotation)

   $svgScrollG
     .append("g")
     .attr("class", "annotation-y-axis")
     .call(makeYAxisLabel)

   $svgScrollG.select('.annotation-y-axis')
     .attr('transform', `translate(${-margin.left},${0 })`)

 }

 function makeLollipopChart(data) {

   let scaleLollipopX;

   let lollipopData = data.map(song => ({
     ...song,
     mean_gen_z_recognition: +song.mean_gen_z_recognition,
     mean_millennial_recognition: +song.mean_millennial_recognition
   })).sort((a, b) => b.mean_gen_z_recognition - a.mean_gen_z_recognition)

   lollipopData.forEach(item => {
     const currentKey = item.artist_song
     const previewSong = previewData.filter(previewItem => previewItem.artist_song === currentKey)[0]
     if (previewSong) {
       item.song_url = previewSong.song_url
     } else item.song_url = ''


   })
   //    lollipopData = lollipopData.filter(song => song.song_url !== 'https://p.scdn.co/mp3-preview/87cd92b04f6501ecace9f7f2a6b12802fc2cc437')


   const numSongs = lollipopData.length
   // todo check if mobile and decide on the right multiplier
   const songHeight = 60
   const chartHeight = (numSongs * songHeight) + margin.top + margin.bottom
   const thisChartPaddingLeft = +d3.select('.chart-container__lollipop').style('padding-left').split('px')[0]
   const thisChartPaddingRight = +d3.select('.chart-container__lollipop').style('padding-right').split('px')[0]
   let chartWidth = Math.min(width, 800) - margin.left - margin.right;

   const scaleWidth = margin.left

   scaleLollipopX = d3.scaleLinear()
     .domain([0, 1])
     .range([chartWidth, scaleWidth * 4.5])

   $svgLollipop
     .attr('width', chartWidth + margin.left + margin.right)
     .attr('height', chartHeight + margin.top + margin.bottom)


   $svgLollipopG = $svgLollipop
     .append('g')
     .attr('class', 'chart lollipop-g')
     .attr('transform', `translate(${margin.left},${0})`)

   $svgLollipopG
     .append('g')
     .attr('class', 'axis x lollipop-g')
     .call(
       d3.axisTop(scaleLollipopX)
       .tickFormat(d3.format('.0%'))
       .tickSize(-chartHeight)
       .ticks(5)
     )
     .attr('transform', `translate(${0},${0})`)

   $svgLollipopSongsG = $svgLollipopG
     .append("g")
     .attr("class","lollipop-song-g-wrapper")
     .selectAll('g.lollipop-song-g')
     .data(lollipopData)
     .join('g')
     .attr('class', 'lollipop-song-g')

   $svgLollipopSongsG
     .attr('transform', (d, i) => {
       return `translate(0,${margin.top + i*songHeight})`
     })

   $svgLollipopSongsG
     .append('text')
     .attr('x', 0)
     .attr('y', 0)
     .attr('class', 'lollipop-song-title')
     .text(d => {

       const truncated = truncate({
         text: d.artist_song.split('|||')[1],
         chars: 25,
         ellipses: true
       })
       //  console.log(truncated)
       return truncated

     })

   d3.xml('assets/images/sound.svg')
     .then(svg => {
       d3.select('svg.chart__lollipop')
         .selectAll('g.lollipop-song-g')
         .append('g')
         .attr('class', 'sound-icon-g')
         .attr('transform', 'translate(2, 9)')
         .nodes()
         .forEach(n => n.append(svg.documentElement.cloneNode(true)))
     })

   $svgLollipopSongsG
     .append('text')
     .attr('x', 24)
     .attr('y', 20)
     .attr('class', 'lollipop-song-year')
     .text(d => `${d.year},`)

   $svgLollipopSongsG
     .append('text')
     .attr('x', 66)
     .attr('y', 20)
     .attr('class', 'lollipop-song-artist')
     .text(d => {

       const truncated = truncate({
         text: d.artist_song.split('|||')[0],
         chars: 13,
         ellipses: true
       })
       //  console.log(truncated)
       return truncated

     })

   const RECT_HEIGHT = 6
   const CIRCLE_RADIUS = 6
   const RECT_VERTICAL_BUMP = CIRCLE_RADIUS - RECT_HEIGHT

   $svgLollipopSongsG
     .append('rect')
     .attr('x', d => {
       if (d.mean_millennial_recognition > d.mean_gen_z_recognition) {
         return scaleLollipopX(d.mean_millennial_recognition)
       } else return scaleLollipopX(d.mean_gen_z_recognition)
     })
     .attr('y', -RECT_VERTICAL_BUMP)
     .attr('class', 'lollipop-x-axis-base-difference')
     .attr('width', d => {
       return Math.abs(scaleLollipopX(d.mean_millennial_recognition) - scaleLollipopX(d.mean_gen_z_recognition))
     })
     .attr('height', `${RECT_HEIGHT}px`)
     .attr('fill', 'url(#grad1)')
   //  .attr('transform', `translate(0, -${RECT_VERTICAL_BUMP}px)`)

   $svgLollipopSongsG
     .append('circle')
     .attr('class', 'circle-millennial')
     .attr('r', `${CIRCLE_RADIUS}`)
     .attr('cx', d => scaleLollipopX(d.mean_millennial_recognition))
     .attr('cy', `${CIRCLE_RADIUS/2}`)

   $svgLollipopSongsG
     .append('circle')
     .attr('class', 'circle-gen-z')
     .attr('r', `${CIRCLE_RADIUS}`)
     .attr('cx', d => scaleLollipopX(d.mean_gen_z_recognition))
     .attr('cy', `${CIRCLE_RADIUS/2}`)

   const $svgLollipopGAnnotation = $svgLollipop
     .append('g')
     .attr('class', 'chart lollipop-g')
     .attr('transform', `translate(${margin.left},${margin.top/2})`)

   const $svgLollipopXAxisFixed = d3.select('.lollipop-x-axis-svg')
   //    const headerHeight = d3.select('header').style('height')
   //    const headerHeight = 40

   $svgLollipopXAxisFixed
     .attr('height', songHeight / 1.5)
     .attr('width', chartWidth + margin.left + margin.right)


   const $svgLollipopXAxisFixedG = $svgLollipopXAxisFixed
     .append('g')
     .attr('class', 'axis x fixed lollipop-g line-chart')
     .attr('transform', `translate(${margin.left},${margin.top/2})`)

   //    $svgLollipopXAxisFixedG
   //      .append('text')
   //      .attr('class', 'lollipop-x-axis-label')
   //      .text('% of People Who Know Song')

   $svgLollipopXAxisFixedG
     .call(
       d3.axisTop(scaleLollipopX)
       .tickFormat(d3.format('.0%'))
       .tickSize(0)
       .ticks(5)
     )

   const lollipopAnnotations = [{
     note: {
       title: "Millennials",
       bgPadding: 2
     },
     //can use x, y directly instead of data
     data: {
       recognition: 0.9918509070294785
     },
     className: "lollipop-annotation-millennials",
     y: margin.top,
     dy: -margin.top / 2,
     dx: -margin.left / 2
   }, {
     note: {
       title: "Gen Z",
       bgPadding: 2
     },
     y: margin.top,
     //can use x, y directly instead of data
     data: {
       recognition: 0.9619603211477253
     },
     className: "lollipop-annotation-gen-z",
     dy: -margin.top / 2,
     dx: margin.left
   }]


   const type = Annotate.annotationLabel

   const makeAnnotations = Annotate.annotation()
     .editMode(false)
     //also can set and override in the note.padding property
     //of the annotation object
     .notePadding(20)
     .type(type)
     //accessors & accessorsInverse not needed
     //if using x, y in annotations JSON
     .accessors({
       x: d => scaleLollipopX(d.recognition)
     })
     .annotations(lollipopAnnotations)

   $svgLollipopGAnnotation
     .append("g")
     .attr("class", "annotation-circles")
     .call(makeAnnotations)

   //    $svgScrollG.select('.annotation-circles')
   //      .attr('transform', `translate(${-margin.left},${0 })`)


   //    svgLollipopG.selectAll('.lollipop-song-g').selectAll('svg')
   //      .attr('class', 'sound-icon')
   //      .attr('width', 21)
   //      .attr('height', 21)
   //      .attr('cy', songHeight / 2)


 }

 function makeAllCharts() {

   // Load data
   // old data time_series_90s_d3.csv
   loadData(['time_series_90s_d3_13_15_averaged.csv', 'lollipop_chart_data.csv', 'song_previews.csv', 'song_years.csv'])
     .then(results => {

       previewData = results[2]
       data = d3.nest()
         .key(d => d.artist_song.trim()) //NB trimmed whitespace from artist_song names, just in case
         .entries(results[0].filter(result => result.recognition > 0))
         .map(item => ({
           ...item,
           values: item.values.map(songYear => { //format value arrays to include objects w/nums, not strings
               const thisSongYear = {};

               thisSongYear.artist_song = songYear.artist_song.trim()
               thisSongYear.generation = +songYear.generation
               thisSongYear.recognition = +songYear.recognition
               thisSongYear.formatted_generation = yearToBirthYear(+songYear.generation)

               return thisSongYear
             })
             .sort((a, b) => a.generation - b.generation) //sort generation values for each song
         }))


       //   data.forEach(item => {
       //     const currentKey = item.key.trim()
       //     const previewSong = previewData.filter(previewItem => previewItem.artist_song === currentKey)[0]
       //     if (previewSong) {
       //       item.song_url = previewSong.song_url
       //     } else item.song_url = ''

       //   })


       data.forEach(item => {
         const currentKey = item.key.trim()
         const previewSong = results[3].filter(previewItem => previewItem.artist_song === currentKey)[0]
         if (previewSong) {
           item.year = +previewSong.year
         } else item.year = ''
         item.values = item.values
       })

       //adding year to lollipop chart data
       results[1].forEach(item => {
         const currentKey = item.artist_song.trim()
         const previewSong = results[3].filter(previewItem => previewItem.artist_song.trim() === currentKey)[0]
         if (previewSong) {
           item.year = +previewSong.year
         } else item.year = ''
         item.mean_gen_z_recognition = item.mean_gen_z_recognition;
         item.mean_millennial_recognition = item.mean_millennial_recognition;
         item.artist_song = item.artist_song;
       })





       makeProclaimersDreChart(data)
       makeNoDiggityChart(data)
       makeAceOfBace(data)
       makeMeanChart(data)
       makeNarrativeChart(data, 'underperforming', underperformingSongs)
       makeNarrativeChart(data, 'overperforming', overperformingSongs)
       makeNarrativeChart(data, 'millennial-only', millennialOnlySongs)
       makeLollipopChart(results[1])


     })
     .then(setupEnterView)
     .then(setupHowlerList)
     .then(setupHowlerPlayback)
     .catch(console.error);
 }

 function init() {
   setupDOM()
   resize()
 }

 export default {
   init,
   resize
 };
