$(document).ready(function(){

	function chernoffFace() {
		var width = 500, height = 200;
		var chernoff = d3.chernoff()
          .face(function(d) { return d.f; })
          .hair(function(d) { return d.h; })
          .mouth(function(d) { return d.m; })
          .nosew(function(d) { return d.nw; })
          .noseh(function(d) { return d.nh; })
          .eyew(function(d) { return d.ew; })
          .eyeh(function(d) { return d.eh; })
          .brow(function(d) { return d.b; })
          .eyeRadius(function(d) { return d.er; })
          .browVertical(function(d) { return d.bv; })
          .browSlant(function(d) { return d.bs; })
          .browLength(function(d) { return d.bl; })
          .mouthSize(function(d) { return d.ms; })
          .mouthVertical(function(d) { return d.mv; })
          .mouthCurve(function(d) { return d.mc; });

        function value_transfer(datapoint) {
        	var datapoint_new = {};

        	datapoint_new["fixed_acidity"] = (datapoint["fixed_acidity"] - 3.8) / (14.2 - 3.8);
        	datapoint_new["volatile_acidity"] = (datapoint["volatile_acidity"] - 0.08) / (1.1 - 0.08);
        	datapoint_new["citric_acid"] = (datapoint["volatile_acidity"] - 0) / (1.66 - 0);
        	datapoint_new["residual_sugar"] = (datapoint["residual_sugar"] - 0.6) / (65.8 - 0.6);
        	datapoint_new["chlorides"] = (datapoint["chlorides"] - 0.009) / (0.346 - 0.009);
        	datapoint_new["free_sulfur_dioxide"] = (datapoint["free_sulfur_dioxide"] - 2) / (289 - 2);
        	datapoint_new["total_sulfur_dioxide"] = (datapoint["total_sulfur_dioxide"] - 9) / (440 - 9);

        	return datapoint_new;
        };
        
        function data() {
        	new_data = value_transfer(datapoint);
          for (key in new_data) {
          	switch(json_mapping[key]) {
          		case 'er':
          			output = document.getElementById("area");
          			// output.innerHTML = (10.82 + (9.34 * datapoint[key])).toFixed(2);
          			output.innterHTML = new_data[key].toFixed(2);
                    break;
                case 'bs':
                    output = document.getElementById("perimeter");
                    // output.innerHTML = (12.8 + (4.23 * datapoint[key])).toFixed(2);
                    output.innterHTML = new_data[key].toFixed(2);
                    break;
                case 'bl':
                    output = document.getElementById("compactness");
                    // output.innerHTML = (0.8082 + (0.0974 * datapoint[key])).toFixed(3);
                    output.innterHTML = new_data[key].toFixed(3);
                    break;
                case 'bv':
                    output = document.getElementById("klength");
                    // output.innerHTML = (5.008 + (1.505 * datapoint[key])).toFixed(3);
                    output.innterHTML = new_data[key].toFixed(3);
                    break;
                case 'ms':
                    output = document.getElementById("kwidth");
                    // output.innerHTML = (2.63 + (1.272 * datapoint[key])).toFixed(3);
                    output.innterHTML = new_data[key].toFixed(3);
                    break;
                case 'mv':
                    output = document.getElementById("asymmetry");
                    // output.innerHTML = (1.472 + (6.984 * datapoint[key])).toFixed(3);
                    output.innterHTML = new_data[key].toFixed(3);
                    break;
                case 'mc':
                    output = document.getElementById("glength");
                    // output.innerHTML = (4.607 + (1.666 * datapoint[key])).toFixed(3);
                    output.innterHTML = new_data[key].toFixed(3);
                    break;
                 default:
                 	break;
          	}
          }
        }

        function drawFace(selection) {
          var svg = selection.append("svg")
            .attr("width", width)
            .attr("height", height);
          var face = svg.selectAll("g.chernoff")
            .data(data())
            .enter().append("g")
            .attr("class", "chernoff")
            .call(chernoff);
        }

        function updateFace(selection) {
          selection.select("svg")
              .selectAll("g.chernoff")
              .remove();
          // chernoff will not draw on update selections
          selection.select("svg")
              .selectAll("g.chernoff")
              .data(data())
            .enter().append("g")
              .attr("class", "chernoff")
              .call(chernoff);
        }

        function draw(selection) {
          selection
            .call(drawFace)
        }

        return draw;
      }

	d3.select("#face")
	  .call(chernoffFace());

});