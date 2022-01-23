function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("./static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

const preTag = 1
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("./static/js/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    
    // 6. Create variables that hold the otu_ids, otu_slabels, and sample_values.
    var samples =  result;
    var otu_ids = samples.otu_ids;
    var otu_labels = samples.otu_labels;
    var sample_values = samples.sample_values;
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse()
    //console.log(yticks);

    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
     DELIVERABLE 1 ADD BAR CHART
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

    // 8. Create the trace for the bar chart. 
    var barData = [{
        x: sample_values.slice(0,10).reverse(),
        y: yticks,
        text: otu_labels.slice(0,10).reverse(), //hover text
        type: "bar",
        orientation: "h"  // horizontal bar chart
  }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
     DELIVERABLE 2 ADD BUBBLE CHART
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    
      // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
      //Plotly.newPlot(); 

      // 1. Create the trace for the bubble chart.
      var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
              color: otu_ids,
              size: sample_values,
              colorscale: 'Earth'
         
        }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      xaxis: { title: "OTU ID"},
      title: "Bacteria Cultures per Sample",
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
     DELIVERABLE 3: ADD GUAGE 
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var meta = data.metadata;
    var resultmeta = meta.filter(metaObj => metaObj.id == sample);
    console.log(resultmeta);
    

    // 2. Create a variable that holds the first sample in the metadata array.
    metasample = resultmeta[0];
    console.log(metasample);


    // 3. Create a variable that holds the washing frequency.
    var washfreq = parseFloat(metasample.wfreq);
    console.log(washfreq);

    var gaugeData = [
          {
                  domain: { x: [0, 1], y: [0, 1] },
                  value: washfreq,
                  title: '<b>Belly Button Washing Frequency</b><br> Scrubs per week',
                  axis: {text: "test"},
                  type: "indicator",
                  mode: "gauge+number",
                  gauge: {
                    axis: {range: [null, 500], tickwidth: 1, tickcolor:"black"},
                    axis: { range: [0, 10] },
                    bar: { color: 'black'},
                    steps: [
                        { range: [0, 2], color: 'red' },
                        { range: [2, 4], color: 'orange' },
                        { range: [4, 6], color: 'yellow' },
                        { range: [6, 8], color: 'lightgreen' },
                        { range: [8, 10], color: 'darkgreen' }
                    ]
                  
                  },
          }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: {t:0,l:55}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout );

    
    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    DELIVERABLE 4: (1) Add background color to the webpage
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    d3.select("body").style("background-color","lavenderblush");
    

    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
     DELIVERABLE 4: (2) Add image to jumbotron.
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    var PANEL = d3.select(".jumbotron");
    PANEL.html("")
    PANEL.append().html("<h1>Belly Button Biodiversity Dashboard</h1>"        +
          "<p>Use the interactive charts below to explore the dataset</p>"    + 
          "<img src='./static/images/Bacteria.jpg' width='500'>")  // ADD Image

   
    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   
     DELIVERABLE 4: (3) Made the webpage mobile-responsive
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

 });
}
