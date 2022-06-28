var disable_Parents;
function creatLinearTree(life, info, baseSvg) {
    var showTime = 0;
    var showName = 1;
    $("#show_name").css("color", "#d23600");
    $("#linear").css("color", "#d23600");
    $("#radial").css("color", "#555555");
    

    $("#zoomValue").val('100');
    var tree = d3.cluster().separation(function(a, b) {
        return (a.parent == b.parent ? 1 : 1)
    })
    .size([h * 3, w]);

    var parsedData = newick.parse(life);
    var root = d3.hierarchy(parsedData, function(d) {
        return d.branchset;
    });
    var diagonal = getDiagonal();

    $("#zoomValue").change(function() {
        zoomValue = $("#zoomValue").val();
        baseSvg.transition()
        .duration(150)
        .call(zoom.transform, d3.zoomIdentity
        .translate(30, 0)
        .scale(zoomValue / 100));
    });
    
    $("#show_timeLine").click(function(){
        if(showTime == 0){
            $("#show_timeLine").css("color", "#d23600");
            showTimeLine();
            showTime = 1;
        }else{
            $("#show_timeLine").css("color", "#555555");
            d3.select(".xaxis").remove(); 
            showTime = 0;
        }
    });

    $("#show_name").click(function(){
        if(showName == 0){
            $("#show_name").css("color", "#d23600");
            chart.selectAll("g.node").select("text").style("opacity", 1);
            showName = 1;
        }else{
            $("#show_name").css("color", "#555555");
            chart.selectAll("g.node").select("text").style("opacity", 0);
            showName = 0;
        }
    });

    $("#radial").click(function() {
        $("#show_timeLine").css("color", "#555555");
        d3.select(".xaxis").remove(); 
        showTime = 0;
    });

    var chart = baseSvg.append("g").attr("transform", "translate(50, 20)");
    tree(root);

    function scaleBranchLengths(nodes, w) {
        // Visit all nodes and adjust y pos width distance metric
        var visitPreOrder = function(root, callback) {
            callback(root)
            if (root.children) {
                for (var i = 0; i < root.children.length; i++) {
                    visitPreOrder(root.children[i], callback)
                };
            }
        }

        visitPreOrder(nodes[0], function(node) {
            node.rootDist = (node.parent ? node.parent.rootDist : 0) + (node.data.length || 0)
        })
        var rootDists = nodes.map(function(n) {
            return n.rootDist;
        });
        var yscale = d3.scaleLinear()
                        .domain([0, d3.max(rootDists)])
                        .range([0, w]);
        visitPreOrder(nodes[0], function(node) {
            node.y = yscale(node.rootDist);
        })
    }

    scaleBranchLengths(root.descendants(), w);

    var link = chart.selectAll("path.link")
                    .data(root.links())
                    .enter().append("svg:path")
                    .attr("class", function(d) {
                        var nodeP = d.source;
                        var node2 = d.target;
                        while (nodeP.data.name == "") {
                            nodeP = nodeP.parent;
                        }
                        
                        function getDescendants(node) {
                            var nameP = nodeP.data.name;
                            var name = "";
                            if (node.children) {
                                node.children.forEach(function(d) {
                                    if (d.data.name != "") {
                                        name = " " + nameP + "-" + d.data.name + name;
                                    } else {
                                        name += " " + nameP + "-" + getDescendants(d);
                                    }
                                })
                                name += " " + nameP + "-" + node.data.name;
                            } else {
                                var name = "";
                                name = nameP + "-" + node.data.name;
                            }
                            return name;
                        }
                        return getDescendants(node2) + " links";
                    })
                    .attr("d", diagonal)
                    .attr("fill", "none")
                    .attr("stroke", "#aaa")
                    .attr("stroke-width", "2px");

    var node = chart.selectAll("g.node")
                    .data(root.descendants())
                    .enter().append("g")
                    .attr("id", function(d) {
                        return d.data.name;
                    })
                    .attr("class", function(d) {
                        if (d.data.name != '') {
                            return "node" +
                            (d.children ? " node--internal" : " node--leaf");
                        }
                    })
                    .attr("transform", function(d) {
                        if (d.children) {
                            return "translate(" + (d.y - 40) + "," + (d.x - 35) + ")";
                        } else {
                            return "translate(" + (d.y - 2) + "," + (d.x - 35) + ")";
                        }
                    })
                    .attr("initial-transform", function(d) {
                        if (d.children) {
                            return "translate(" + (d.y - 40) + "," + (d.x - 35) + ")";
                        } else {
                            return "translate(" + (d.y - 2) + "," + (d.x - 35) + ")";
                        }
                    })
                    .on("click", function(d) {
                        console.log(selected);
                        if (selected == 0) {   // both empty: 00
                            secondNode = "";
                            secondNodeName = "";
                            $(".button").hide();
                            d3.selectAll(".boarder").attr("opacity",0);
                            d3.select("#boarder" + d.data.name).attr("opacity",1);
                            disable_Parents = [];
                            var node = d;
                            while (node.parent !== null) {
                                if (node.parent.data.name != "") {
                                    disable_Parents.push(node.parent.data.name);
                                }
                                node = node.parent;
                            }
                            for(i = 0; i < disable_Parents.length; i++){
                                d3.select("#" + disable_Parents[i])
                                    .attr("pointer-events", "none")
                                    .attr("opacity",0.5);
                            }

                            d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                            firstNode = d;
                            selected = 1;
                            firstNodeName = "" + d.data.name;
                            $("#speOne").html("<div class=\"boxTitle\" style=\"transform:translate(0px,-7px);\"><a class=\"closeButton\" id=\"reselectSpeOne\"></a><img src=png/" + d.data.name + 
                                        "_sm.png style=\"width:60px;height:60px;font-size:0.9rem;\"><p class=\"textTitle\" style=\"font-size:0.9rem\">" + 
                                        sName[d.data.name] + "</p><p class=\"textArea\">" +
                                        wiki[d.data.name] + "</p><div>");
                            $("#speTwo").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                            d3.selectAll('#miniTree svg').remove();

                            // become 10 after selection, close button: go to 00
                            d3.select("#speOne")
                                .select(".closeButton")
                                .on("click", function(){
                                    $("#speOne").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                    $(".button").hide()
                                    d3.selectAll('#miniTree svg').remove();
                                    d3.selectAll(".boarder").attr("opacity",0);
                                    d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                                    d3.select("#boarder" + secondNodeName).attr("opacity",1);
                                    selected = 0;
                                    firstNode = "";
                                    firstNodeName = "";
                                    // enable parent selection
                                    for(i = 0; i < disable_Parents.length; i++){
                                        d3.select("#" + disable_Parents[i])
                                            .attr("pointer-events", "all")
                                            .attr("opacity",1);
                                    }
                                })

                        } else if (selected == 1) {  // first is full, second is empty 10
                            d3.select("#boarder" + d.data.name).attr("opacity",1);
                            for(i = 0; i < disable_Parents.length; i++){
                                d3.select("#" + disable_Parents[i])
                                    .attr("pointer-events", "all")
                                    .attr("opacity",1);
                            }
                            secondNode = d;
                            if(firstNode == secondNode){  // deselect current species: go to 00
                                /*alert("Please select a different species");
                                $("#speOne").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                $("#speTwo").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                $(".button").hide()
                                d3.selectAll('#miniTree svg').remove();
                                d3.selectAll(".boarder").attr("opacity",0);
                                d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                                selected = 0;
                                firstNode = "";
                                firstNodeName = "";*/
                                $("#speOne").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                $(".button").hide()
                                d3.selectAll('#miniTree svg').remove();
                                d3.selectAll(".boarder").attr("opacity",0);
                                d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                                firstNode = "";
                                firstNodeName = "";
                                secondNode = "";
                                secondNodeName = "";
                                selected = 0;
                            }else{
                                $("#genome").show();
                                selected = 3;  // go to state 11
                                secondNodeName = "" + d.data.name;
                                $("#speTwo").html("<div class=\"boxTitle\"><a href=\"#\" class=\"closeButton\" id=\"reselectSpeTwo\" style=\"transform:translate(-18px,3px);\"></a><img src=png/" + 
                                    d.data.name + "_sm.png style=\"width:60px;height:60px;font-size:0.9rem;\"><p class=\"textTitle\" style=\"font-size:0.9rem\">" +
                                    sName[d.data.name] + "</p><p class=\"textArea\">" + 
                                    wiki[d.data.name] + "</p><div>");
                                var miniLife = buildMiniTree(firstNode, secondNode);
                                localStorage.setItem("miniLife", miniLife);
                                createMiniTree(miniLife, info);  
                            }

                            // become 11 after selection, speOne close button: go to 01 or 00
                            d3.select("#speOne")
                                .select(".closeButton")
                                .on("click", function(){
                                    $("#speOne").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                    $(".button").hide()
                                    d3.selectAll('#miniTree svg').remove();
                                    d3.selectAll(".boarder").attr("opacity",0);
                                    d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                                    d3.select("#boarder" + secondNodeName).attr("opacity",1);
                                    firstNode = "";
                                    firstNodeName = "";
                                    if (secondNodeName != "") {
                                        selected = 2;
                                    } else {
                                        selected = 0;
                                    }
                                })

                            // become 11 after selection, speTwo close button: go to 10 or 00
                            d3.select("#speTwo")
                                .select(".closeButton")
                                .on("click", function(){
                                    $("#speTwo").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                    $(".button").hide()
                                    d3.selectAll('#miniTree svg').remove();
                                    d3.selectAll(".boarder").attr("opacity",0);
                                    d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                                    d3.select("#boarder" + firstNodeName).attr("opacity",1);
                                    secondNode = "";
                                    secondNodeName = "";
                                    if (firstNodeName != "") {
                                        selected = 1;
                                    } else {
                                        selected = 0;
                                    }
                                    // disable first node's parent
                                    disable_Parents = [];
                                    var node = firstNode;
                                    while (node.parent !== null) {
                                        if (node.parent.data.name != "") {
                                            disable_Parents.push(node.parent.data.name);
                                        }
                                        node = node.parent;
                                    }
                                    
                                    for(i = 0; i < disable_Parents.length; i++){
                                        d3.select("#" + disable_Parents[i])
                                            .attr("pointer-events", "none")
                                            .attr("opacity",0.5);
                                    }
                                })
                        } else if (selected == 2) { // first is empty, second is full: 01 (selection similar to 10)
                            d3.select("#boarder" + d.data.name).attr("opacity",1);
                            for(i = 0; i < disable_Parents.length; i++){
                                d3.select("#" + disable_Parents[i])
                                    .attr("pointer-events", "all")
                                    .attr("opacity",1);
                            }
                            firstNode = d;
                            if(firstNode == secondNode){   // deselect current species: go to 00
                                /*alert("Please select a different species");
                                $("#speOne").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                $("#speTwo").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                $(".button").hide()
                                d3.selectAll('#miniTree svg').remove();
                                d3.selectAll(".boarder").attr("opacity",0);
                                d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                                selected = 0;
                                firstNode = "";
                                firstNodeName = "";*/
                                $("#speTwo").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                $(".button").hide()
                                d3.selectAll('#miniTree svg').remove();
                                d3.selectAll(".boarder").attr("opacity",0);
                                d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                                firstNode = "";
                                firstNodeName = "";
                                secondNode = "";
                                secondNodeName = "";
                                selected = 0;
                            }else{
                                $("#genome").show();
                                selected = 3;   // go to state 11
                                firstNodeName = "" + d.data.name;
                                $("#speOne").html("<div class=\"boxTitle\"><a href=\"#\" class=\"closeButton\" id=\"reselectSpeTwo\" style=\"transform:translate(-18px,3px);\"></a><img src=png/" + 
                                    d.data.name + "_sm.png style=\"width:60px;height:60px;font-size:0.9rem;\"><p class=\"textTitle\" style=\"font-size:0.9rem\">" +
                                    sName[d.data.name] + "</p><p class=\"textArea\">" + 
                                    wiki[d.data.name] + "</p><div>");
                                var miniLife = buildMiniTree(firstNode, secondNode);
                                localStorage.setItem("miniLife", miniLife);
                                createMiniTree(miniLife, info);  
                            }
                            // become 11 after selection, speOne close button: go to 01
                            d3.select("#speOne")
                                .select(".closeButton")
                                .on("click", function(){
                                    $("#speOne").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                    $(".button").hide()
                                    d3.selectAll('#miniTree svg').remove();
                                    d3.selectAll(".boarder").attr("opacity",0);
                                    d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                                    d3.select("#boarder" + secondNodeName).attr("opacity",1);
                                    firstNode = "";
                                    firstNodeName = "";
                                    if (secondNodeName != "") {
                                        selected = 2;
                                    } else {
                                        selected = 0;
                                    }
                                })
                            // become 11 after selection, speTwo close button: go to 10
                            d3.select("#speTwo")
                                .select(".closeButton")
                                .on("click", function(){
                                    $("#speTwo").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                    $(".button").hide()
                                    d3.selectAll('#miniTree svg').remove();
                                    d3.selectAll(".boarder").attr("opacity",0);
                                    d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                                    d3.select("#boarder" + firstNodeName).attr("opacity",1);
                                    secondNode = "";
                                    secondNodeName = "";
                                    if (firstNodeName != "") {
                                        selected = 1;
                                    } else {
                                        selected = 0;
                                    }
                                })
                        } else if (selected == 3) {   // state 11, when both are full
                            // 3 situations for the third node. starting a new selection or deselecting a node.
                            thirdNode = d;
                            thirdNodeName = "" + d.data.name;
                            if (thirdNodeName != firstNodeName && thirdNodeName != secondNodeName) {
                                // when selecting a new first node (same as state 00)
                                secondNode = "";
                                secondNodeName = "";
                                $(".button").hide();
                                d3.selectAll(".boarder").attr("opacity",0);
                                d3.select("#boarder" + d.data.name).attr("opacity",1);
                                disable_Parents = [];
                                var node = d;
                                while (node.parent !== null) {
                                    if (node.parent.data.name != "") {
                                        disable_Parents.push(node.parent.data.name);
                                    }
                                    node = node.parent;
                                }
                                
                                for(i = 0; i < disable_Parents.length; i++){
                                    d3.select("#" + disable_Parents[i])
                                        .attr("pointer-events", "none")
                                        .attr("opacity",0.5);
                                }

                                d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                                firstNode = d;
                                selected = 1;
                                firstNodeName = "" + d.data.name;
                                $("#speOne").html("<div class=\"boxTitle\" style=\"transform:translate(0px,-7px);\"><a class=\"closeButton\" id=\"reselectSpeOne\"></a><img src=png/" + d.data.name + 
                                            "_sm.png style=\"width:60px;height:60px;font-size:0.9rem;\"><p class=\"textTitle\" style=\"font-size:0.9rem\">" + 
                                            sName[d.data.name] + "</p><p class=\"textArea\">" +
                                            wiki[d.data.name] + "</p><div>");
                                $("#speTwo").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                d3.selectAll('#miniTree svg').remove();

                                // become 10 after selection, close button: go to 00
                                d3.select("#speOne")
                                    .select(".closeButton")
                                    .on("click", function(){
                                        $("#speOne").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                        $(".button").hide()
                                        d3.selectAll('#miniTree svg').remove();
                                        d3.selectAll(".boarder").attr("opacity",0);
                                        d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                                        d3.select("#boarder" + secondNodeName).attr("opacity",1);
                                        selected = 0;
                                        firstNode = "";
                                        firstNodeName = "";
                                        // enable parent selection
                                        for(i = 0; i < disable_Parents.length; i++){
                                            d3.select("#" + disable_Parents[i])
                                                .attr("pointer-events", "all")
                                                .attr("opacity",1);
                                        }
                                    })
                            } else if (thirdNodeName == firstNodeName) {   // when deselect the first node
                                $("#speOne").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                $(".button").hide()
                                d3.selectAll('#miniTree svg').remove();
                                d3.selectAll(".boarder").attr("opacity",0);
                                d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                                d3.select("#boarder" + secondNodeName).attr("opacity",1);
                                firstNode = "";
                                firstNodeName = "";
                                if (secondNodeName != "") {
                                    selected = 2;
                                } else {
                                    selected = 0;
                                    // enable parents
                                    for(i = 0; i < disable_Parents.length; i++){
                                        d3.select("#" + disable_Parents[i])
                                            .attr("pointer-events", "all")
                                            .attr("opacity",1);
                                    }
                                }
                            } else if (thirdNodeName == secondNodeName) {   // when deselect the second node
                                $("#speTwo").html("<div class=\"innerbox\"><p>Click Icons to Select Species.</p></div>");
                                $(".button").hide()
                                d3.selectAll('#miniTree svg').remove();
                                d3.selectAll(".boarder").attr("opacity",0);
                                d3.selectAll(".links").style("stroke", "#000000").style("stroke-width", "2");
                                d3.select("#boarder" + firstNodeName).attr("opacity",1);
                                secondNode = "";
                                secondNodeName = "";
                                if (firstNodeName != "") {
                                    selected = 1;
                                } else {
                                    selected = 0;
                                }
                                // disable first node's parents
                                disable_Parents = [];
                                var node = firstNode;
                                while (node.parent !== null) {
                                    if (node.parent.data.name != "") {
                                        disable_Parents.push(node.parent.data.name);
                                    }
                                    node = node.parent;
                                }
                                for(i = 0; i < disable_Parents.length; i++){
                                    d3.select("#" + disable_Parents[i])
                                        .attr("pointer-events", "none")
                                        .attr("opacity",0.5);
                                }
                            }
                        }
                    })
                    .attr("pointer-events", function(d) {
                        if (sName[d.data.name] != "") {
                            return "all";
                        } else {
                            return "none";
                        }
                    })
                    .attr("cursor", function(d) {
                        if (sName[d.data.name] != "") {
                            return "pointer";
                        }
                    })
                    .attr("opacity", function(d) {
                        if (sName[d.data.name] != "") {
                            return 1;
                        } else {
                            return 0.5;
                        }
                    });

    


    chart.selectAll('g.node')
        .append("rect")
        .attr("width", function(d) {
            if (sName[d.data.name] != "") {
                return 80;
            } else {
                return 60;
            }
        })
        .attr("height", function(d) {
            if (sName[d.data.name] != "") {
                return 80;
            } else {
                return 60;
            }
        })
        .attr("fill", function(d) {
            if (sName[d.data.name] != "") {
                return "url(#svg" + d.data.name + "_big)";
            } else {
                return "url(#svg" + d.data.name + "_mini)";
            }
        });
    
    chart.selectAll('g.node')
        .filter(function(d){
            return sName[d.data.name] != "";
        })
        .append("circle")
        .attr("class","boarder")
        .attr("id",function(d){
            return "boarder" + d.data.name;
        })
        .attr("cx", 40)
        .attr("cy", 40)
        .attr("stroke","#1E90FF")
        .attr("stroke-width","5")
        .attr("fill","none")
        .attr("opacity",0)
        .attr("r", 40)


    chart.selectAll('g.node').append("text")
        .attr("dx", function(d){
            if(d.children){
                return -20;
            }
            else{
                return 100;
            }
        })
        .attr("dy", 30)
        .attr("text-anchor", "start")
        .attr("font-family", "Raleway', sans-serif")
        .attr('font-size', '20px')
        .attr("font-weight", "bold")
        .attr('fill', 'white')
        .text(function(d) {
            if (sName[d.data.name] != "") {
                return sName[d.data.name];
            } else {
                return d.data.name;
            }
        });

    chart.selectAll('g.node--internal')
        .selectAll('text')
        .attr("text-anchor","end")

    
    function showTimeLine() {
        var rootDist = root.descendants().map(function(n) {
            return n.data.length;
        });
        rootDists = d3.max(rootDist);
        d3.select('.xaxis').remove();
        
        timeLineScale = d3.scaleLinear()
        .domain([rootDists, 0])
        .rangeRound([0, w * scale2]).nice();

        xAxis = d3.axisBottom(timeLineScale);

        d3.select(".timeLine").append("g")
        .attr("class", "xaxis")
        .attr("transform", function() {
            if (frameTranslate !== null && dragTransform !== null) {
                return "translate(" + (frameTranslate[0]+35) + "," + 20 + ")";
            } else {
                return "translate(35," + 20 + ")";
            }
        })
        .call(xAxis.ticks(5))
        .selectAll("text")
        .style("font-size", "15px");
    }

}