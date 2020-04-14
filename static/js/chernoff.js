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

        let er_f_default = 0,
            bv_f_default = 0,
            bs_f_default = 0,
            bl_f_default = 0,
            ms_f_default = 0,
            mv_f_default = 0,
            mc_f_default = 0,
            nw_f_default = 0,
            nh_f_default = 0;

        let facef_default = 0.5, // 0 - 1
            hairf_default = 0, // -1 - 1
            mouthf_default = 0, // -1 - 1
            //nosehf = 0.5, // 0 - 1
            //nosewf = 0.5, // 0 - 1
            eyehf_default = 0.5, // 0 - 1
            eyewf_default = 0.5, // 0 - 1
            browf_default = 0, // -1 - 1

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

            //modified by Xiaofei
            let er_var = (typeof(er_f) === "function" && !isNaN(er_f(d)) ? er_f(d) : er_f_default) * 15 + 7,
                bv_var = (1 - (typeof(bv_f) === "function" && !isNaN(bv_f(d)) ? bv_f(d) : bv_f_default)) * 25 - 25,
                bs_var = (typeof(bs_f) === "function" && !isNaN(bs_f(d)) ? bs_f(d) : bs_f_default) * 60,
                bl_var = (typeof(bl_f) === "function" && !isNaN(bl_f(d)) ? bl_f(d) : bl_f_default) * 14 + 10,
                ms_var = (typeof(ms_f) === "function" && !isNaN(ms_f(d)) ? ms_f(d) : ms_f_default) * 20 + 10, //LK
                mv_var = (typeof(mv_f) === "function" && !isNaN(mv_f(d)) ? mv_f(d) : mv_f_default) * 30 + 10, //WK
                mc_var = (typeof(mc_f) === "function" && !isNaN(mc_f(d)) ? mc_f(d) : mc_f_default) * -1 * 35 + 25, //LKG
                // mc_var = (typeof(mc_f) === "function" && !isNaN(mc_f(d)) ? (1 - mc_f(d)) : (1 - mc_f_default)) * -1 * 35 + 25, 
                nh_var = (typeof(nh_f) === "function" && !isNaN(nh_f(d)) ? nh_f(d) : nh_f_default) * 20,
                nw_var = (typeof(nw_f) === "function" && !isNaN(nw_f(d)) ? nw_f(d) : nw_f_default) * 15;

            let ele = d3.select(this),
                facevar = (typeof(facef) === "function" ? facef(d) : facef) * 30,
                hairvar = (typeof(hairf) === "function" ? hairf(d) : hairf) * 80,
                mouthvar = (typeof(mouthf) === "function" ? mouthf(d) : mouthf) * 7,
                //nosehvar = (typeof(nosehf) === "function" ? nosehf(d) : nosehf) * 10,
                //nosewvar = (typeof(nosewf) === "function" ? nosewf(d) : nosewf) * 10,
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



            //////////////////// MY CODE BELOW (Zhaoxiong) /////////////
            ele.append('circle')
                .attr('r',50)
                .attr('fill', '#F3D681')
                // .attr('transform', `translate(70,110)`);
                .attr('transform', `translate(50,50)`);

            //let xoffset = 70,
            //    yoffset = 110+mv_var; //130+mv_var

            let xoffset = 50,
                yoffset = 50; //130+mv_var

            // let nose = [{x: 70, y: 110-nosehvar},
            //             {x: 70+nosewvar, y: 110+nosehvar},
            //             {x: 70-nosewvar, y: 110+nosehvar}];

            //for nose added by Xiaofei
            let nose = [{x: xoffset, y: yoffset-0.5*nh_var-10},
                        {x: xoffset+2+nw_var, y: yoffset+0.5*nh_var+5},
                        {x: xoffset-2-nw_var, y: yoffset+0.5*nh_var+5}];

            ele.selectAll("path.nose").data([nose]).enter()
                .append("path")
                .attr("class", "nose")
                .attr('fill', '#267326')
                .attr("d", line);

            let mouth = [{x: xoffset, y: yoffset+mc_var+mv_var-mouthOpensize},
                        {x: xoffset+ms_var, y: yoffset+mv_var},
                        {x: xoffset, y: yoffset+mc_var+mv_var},
                        {x: xoffset-ms_var, y: yoffset+mv_var}]; //mouthSize = Zaiqiao

            ele.selectAll("path.mouth").data([mouth]).enter()
                .append("path")
                .attr("class", "mouth")
                .attr('fill', '#e25c6e')
                .attr("d", line);

            // Eyes //
            // let leyex = 50,
            //     reyex = 90,
            //     eyey = 95;

            let leyex = 30,
                reyex = 70,
                eyey = 35;

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
                .attr("class", "leyebrow")
                .attr('x', -eyeSpacing - bl_var / 2 - browSpacing)
                // .attr('transform', `translate(68, ${-1*eyeVertical+bv_var+74}) rotate(${bs_var})`)
                .attr('transform', `translate(48, ${-1*eyeVertical+bv_var+14}) rotate(${bs_var})`)
                .attr('width', bl_var)
                .attr('height', browThickness)
                .transition();

            // console.log("bs_var: " + bs_var);


            ele.append('rect')
                .attr("class", "reyebrow")
                .attr('x', eyeSpacing - bl_var / 2 + browSpacing)
                // .attr('transform', ``)
                // .attr('transform', `rotate(-20 * (Math.PI / 180))`)
                // .attr('transform', `translate( 72, ${-1*eyeVertical+bv_var+74}) rotate(-${bs_var})`)
                .attr('transform', `translate( 52, ${-1*eyeVertical+bv_var+14}) rotate(-${bs_var})`)
                .attr('width', bl_var)
                .attr('height', browThickness);

            // Pupils //
            ele.append("circle")
                // .attr("transform", `translate(66, ${-1*eyeVertical+79})`)
                .attr("transform", `translate(46, ${-1*eyeVertical+19})`)
                .attr("class","pupil")
                .attr("r",pupilSize)
                .attr('cx', -eyeSpacing)
                .attr('cy', pupilHeight);

            ele.append('circle')
                // .attr("transform", `translate(74, ${-1*eyeVertical+79})`)
                .attr("transform", `translate(54, ${-1*eyeVertical+19})`)
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
        chernoff.noseh = function(x) {
            if(!arguments.length) return nh_f;
            nh_f = x;
            return chernoff;
        };

        chernoff.nosew = function(x) {
            if(!arguments.length) return nw_f;
            nw_f = x;
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
