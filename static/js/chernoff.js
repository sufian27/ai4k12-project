(function() {
    function sign(num) {
        if(num > 0) {
            return 1;
        } else if(num < 0) {
            return -1;
        } else {
            return 0;
        }
    }

    // Implements Chernoff faces (http://en.wikipedia.org/wiki/Chernoff_face).
    // Exposes 8 parameters through functons to control the facial expression.
    // face -- shape of the face {0..1}
    // hair -- shape of the hair {-1..1}
    // mouth -- shape of the mouth {-1..1}
    // noseh -- height of the nose {0..1}
    // nosew -- width of the nose {0..1}
    // eyeh -- height of the eyes {0..1}
    // eyew -- width of the eyes {0..1}
    // brow -- slant of the brows {-1..1}
    function d3_chernoff() {

        const a = 0.5;

        let eyeSpacing = 10+ a*12,
            eyeVertical = -20+a*8,
            eyeEccentricity = 1+a/2,
            eyeSlant = 5*a,
            browThickness = 1+5*a,
            browSpacing = 1+a*4,
            mouthOpensize = -8*a+16,
            pupilSize = 1+4*a,
            pupilHeight = 4-a*4;

        let er_f = 0.5,
            bv_f = 0.5,
            bs_f = 0.5,
            bl_f = 0.5,
            ms_f = 0.5,
            mv_f = 0.5,
            mc_f = 0.5;

        let facef = 0.5, // 0 - 1
            hairf = 0, // -1 - 1
            mouthf = 0, // -1 - 1
            nosehf = 0.5, // 0 - 1
            nosewf = 0.5, // 0 - 1
            eyehf = 0.5, // 0 - 1
            eyewf = 0.5, // 0 - 1
            browf = 0, // -1 - 1

            line = d3.svg.line()
                .interpolate("cardinal-closed")
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; }),
            bline = d3.svg.line()
                .interpolate("basis-closed")
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; });

        function chernoff(a) {
            if(a instanceof Array) {
                a.each(__chernoff);
                // console.log("Array");
            } else {
                d3.select(this).each(__chernoff);
                // console.log("Not Array");
            }
        }

        function __chernoff(d) {
            let er_var = (typeof(er_f) === "function" ? er_f(d) : er_f) * 8 + 10,
                bv_var = (typeof(bv_f) === "function" ? bv_f(d) : bv_f) * 25 - 25,
                bs_var = (typeof(bs_f) === "function" ? bs_f(d) : bs_f) * 11,
                bl_var = (typeof(bl_f) === "function" ? bl_f(d) : bl_f) * 12 + 10,
                ms_var = (typeof(ms_f) === "function" ? ms_f(d) : ms_f) * 20 + 10, //LK
                mv_var = (typeof(mv_f) === "function" ? mv_f(d) : mv_f) * 30 + 10, //WK
                mc_var = (typeof(mc_f) === "function" ? mc_f(d) : mc_f) * -1 * 35 + 25; //LKG

            let ele = d3.select(this),
                facevar = (typeof(facef) === "function" ? facef(d) : facef) * 30,
                hairvar = (typeof(hairf) === "function" ? hairf(d) : hairf) * 80,
                mouthvar = (typeof(mouthf) === "function" ? mouthf(d) : mouthf) * 7,
                nosehvar = (typeof(nosehf) === "function" ? nosehf(d) : nosehf) * 10,
                nosewvar = (typeof(nosewf) === "function" ? nosewf(d) : nosewf) * 10,
                eyehvar = (typeof(eyehf) === "function" ? eyehf(d) : eyehf) * 10,
                eyewvar = (typeof(eyewf) === "function" ? eyewf(d) : eyewf) * 10,
                browvar = (typeof(browf) === "function" ? browf(d) : browf) * 3;

            let face = [{x: 70, y: 60}, {x: 120, y: 80},
                        {x: 120-facevar, y: 110}, {x: 120-facevar, y: 160},
                        {x: 20+facevar, y: 160}, {x: 20+facevar, y: 110},
                        {x: 20, y: 80}];

            let hair = [{x: 70, y: 60}, {x: 120, y: 80},
                        {x: 140, y: 45-hairvar}, {x: 120, y: 45},
                        {x: 70, y: 30}, {x: 20, y: 45},
                        {x: 0, y: 45-hairvar}, {x: 20, y: 80}];

            // ele.selectAll("path.mouth2").data([mouth]).enter().append("rect").attr("x",50).attr("y",50).attr("width",50*ms_var/25).attr("height",50);

            let nose = [{x: 70, y: 110-nosehvar},
                        {x: 70+nosewvar, y: 110+nosehvar},
                        {x: 70-nosewvar, y: 110+nosehvar}];

            //////////////////// MY CODE BELOW (Zhaoxiong) /////////////
            ele.append('circle')
                .attr('r',53)
                .attr('fill', '#F3D681')
                .attr('transform', `translate(70,110)`);

            let xoffset = 70,
                yoffset = 110+mv_var; //130+mv_var

            let mouth = [{x: xoffset, y: yoffset+mc_var-mouthOpensize},
                        {x: xoffset+ms_var, y: yoffset},
                        {x: xoffset, y: yoffset+mc_var},
                        {x: xoffset-ms_var, y: yoffset}]; //mouthSize = Zaiqiao

            ele.selectAll("path.mouth").data([mouth]).enter()
                .append("path")
                .attr("class", "mouth")
                .attr("d", line);

            // Eyes //
            let leyex = 50,
                reyex = 90,
                eyey = 95;

            let leye = [{x: leyex, y: eyey-er_var}, {x: leyex+er_var, y: eyey},
                        {x: leyex, y: eyey+er_var}, {x: leyex-er_var, y: eyey}];
            let reye = [{x: reyex, y: eyey-er_var}, {x: reyex+er_var, y: eyey},
                        {x: reyex, y: eyey+er_var}, {x: reyex-er_var, y: eyey}];

            ele.selectAll("path.leye").data([leye]).enter()
                .append("path")
                .attr("class", "leye")
                .attr('fill','white')
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .attr("d", bline);
            
            ele.selectAll("path.reye").data([reye]).enter()
                .append("path")
                .attr("class", "reye")
                .attr('fill','white')
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .attr("d", bline);

            // Eyebrows //
            ele.append('rect')
                .attr('x', -eyeSpacing - bl_var / 2 - browSpacing)
                .attr('transform', `translate(68, ${-1*eyeVertical+bv_var+74}) rotate(${bs_var})`)
                .attr('width', bl_var)
                .attr('height', browThickness)
                .transition();

            // console.log("bs_var: " + bs_var);


            ele.append('rect')
                .attr('x', eyeSpacing - bl_var / 2 + browSpacing)
                // .attr('transform', ``)
                // .attr('transform', `rotate(-20 * (Math.PI / 180))`)
                .attr('transform', `translate( 72, ${-1*eyeVertical+bv_var+74}) rotate(-${bs_var})`)
                .attr('width', bl_var)
                .attr('height', browThickness);

            // Pupils //
            ele.append("circle")
                .attr("transform", `translate(66, ${-1*eyeVertical+79})`)
                .attr("class","pupil")
                .attr("r",pupilSize)
                .attr('cx', -eyeSpacing)
                .attr('cy', pupilHeight);

            ele.append('circle')
                .attr("transform", `translate(74, ${-1*eyeVertical+79})`)
                .attr("class", "pupil")
                .attr('r', pupilSize)
                .attr('cx', eyeSpacing)
                .attr('cy', pupilHeight);
        }

        chernoff.face = function(x) {
            if(!arguments.length) return facef;
            facef = x;
            return chernoff;
        };

        chernoff.hair = function(x) {
            if(!arguments.length) return hairf;
            hairf = x;
            return chernoff;
        };

        chernoff.mouth = function(x) {
            if(!arguments.length) return mouthf;
            mouthf = x;
            return chernoff;
        };

        chernoff.noseh = function(x) {
            if(!arguments.length) return nosehf;
            nosehf = x;
            return chernoff;
        };

        chernoff.nosew = function(x) {
            if(!arguments.length) return nosewf;
            nosewf = x;
            return chernoff;
        };

        chernoff.eyeh = function(x) {
            if(!arguments.length) return eyehf;
            eyehf = x;
            return chernoff;
        };

        chernoff.eyew = function(x) {
            if(!arguments.length) return eyewf;
            eyewf = x;
            return chernoff;
        };

        chernoff.brow = function(x) {
            if(!arguments.length) return browf;
            browf = x;
            return chernoff;
        };
        chernoff.eyeRadius = function(x) {
            if(!arguments.length) return er_f;
            er_f = x;
            return chernoff;
        };
        chernoff.browVertical = function(x) {
            if(!arguments.length) return bv_f;
            bv_f = x;
            return chernoff;
        };
        chernoff.browSlant = function(x) {
            if(!arguments.length) return bs_f;
            bs_f = x;
            return chernoff;
        };
        chernoff.browLength = function(x) {
            if(!arguments.length) return bl_f;
            bl_f = x;
            return chernoff;
        };
        chernoff.mouthSize = function(x) {
            if(!arguments.length) return ms_f;
            ms_f = x;
            return chernoff;
        };
        chernoff.mouthVertical = function(x) {
            if(!arguments.length) return mv_f;
            mv_f = x;
            return chernoff;
        };
        chernoff.mouthCurve = function(x) {
            if(!arguments.length) return mc_f;
            mc_f = x;
            return chernoff;
        };

        return chernoff;
    }

    d3.chernoff = function() {
        return d3_chernoff(Object);
    };
    
})();
