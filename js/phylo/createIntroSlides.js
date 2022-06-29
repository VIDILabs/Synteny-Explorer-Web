var page = 0;
var title_text;
var body_text;
var body_image;
$("#show_intro").click(function() {
    page = 0;
    //$("#mask").css("-webkit-mask-image", "linear-gradient(white, transparent)");
    $(".modal").css("display", "flex");
    assignPageText(0);
    
});

$(".skip-button-box").click(function() {
    page = 0;
    $(".modal").css("display", "none");
})

$(".next-button-box").click(function() {
    console.log("here")
    page = page+1;
    assignPageText(page);
})

$('.previous-button-box').click(function() {
    console.log("p")
    page = page-1;
    assignPageText(page);
}) 

function assignPageText(pageNum) {
    if(pageNum == 0) {
        // load html text content, and previous button
        console.log("page 0")
        title_text = "Did you Know Animals Share Large Chunks of DNA?";
        addTitleText(title_text);
        body_text = "Animals such as humans, whales, and dogs are made up of cells. Inside these cells are chromosomes.<br><br>"
            + "Chromosomes are composed of DNA, and the set of chromosomes for a species is called its genome.<br><br>"
            + "Animal genomes mutate and evolve into new species over time."
            + " These new species share preserved DNA segments with their ancestor, called synteny blocks. " 
            + "It's like a puzzle where the DNA blocks are the pieces, and they've been put together in a new way! ...";
        addBodyText(body_text, "../data/intro/intro.png", 7, 5);
        addButtons(1,0);
        
    } else if (pageNum == 1) {
        console.log("page 1")
        title_text = "Synteny Blocks Come From Common Ancestors";
        addTitleText(title_text);
        body_text = "Today's species such as dolphins and cats also share synteny blocks between each other."
                    + "<br><br>" 
                    + "By studying the genomes of two existing species, scientists can figure out when they diverged from each other! " 
                    + "This diverging animal, which existed many millions of years ago, is called a Common Ancestor, "
                    + "and contains DNA that is shared by both current, diverged species." 
                    + "<br><br>" 
                    + "Use this application to learn how synteny blocks evolve from Common Ancestors to current species...";
        addBodyText(body_text, "../data/intro/intro2.png", 5, 7);
        addButtons(1,1);

    } else if (pageNum == 2) {
        title_text = "The Phylogenetic Tree Classifies Species";
        addTitleText(title_text);
        body_text = "<br><br><br><br><br><br>Click on the animal icons in the tree to "
                    + " learn more about them. When two species are in the sidebar, "
                    + "the path to their most recent common ancestor is highlighted. "
                    + "Then click on \"go to genome view\" to explore their chromosome evolution.";
        addBodyText(body_text, "../data/intro/phylo.png", 7, 5);
        addButtons(1,1);
        
    } else if (pageNum == 3) {
        title_text = "Use The Genome View To Evolve Chromosomes";
        addTitleText(title_text);
        body_text = "The genome view is for showing indivdiual genome evolution."
                    + "<br><br>"
                    + "The chromosomes for each species are shown as a set of colored bars. " 
                    + "Clicking on a chromosome will show how the chromosome evolved from the Common Ancestor to today's species. "
                    + "Chromosomes split, flip, or move to other chromosomes! " 
                    + "<br><br>Click the arrow connecting two species to evolve the entire genome at once!<br><br>"
                    + "To go back to the full tree, hover on \"Synteny Explorer\" at the top left and click.";
        addBodyText(body_text, "../data/intro/genome_animated.png", 6, 6);
        addButtons(1,1);

    } else if (pageNum == 4) {
        title_text = "Synteny Blocks Sometimes Flip Out!";
        addTitleText(title_text);
        body_text = "Synteny blocks sometimes invert. This type of rearrangement is a disrupting event, "
                    + "and is an important mechanism for scientists in studying genome evolution. "
                    + "<br><br>To denote a flip, a synteny block will do a half spin."
                    + "<br><br>Use \"Mode\" in the navigation bar to select different representation of the genome evolution.";
        addBodyText(body_text, "../data/intro/flip_animating.png", 6, 6);
        addButtons(1,1);

    } else if (pageNum == 5) {
        title_text = "Explore and Learn!";
        addTitleText(title_text);
        body_text = "Have fun playing!<br><br>"
                    + "Use the Help icon if you're not sure what to do. "
                    + "<br><br>"
            //					+ "Quiz yourself by clicking the Test You Knowledge icon."
            //					+ "\n\n"
            //					+ "When you're done playing, please click the I'm Finished button to end your "+
            //			"session, grab the paper slip for the user study note.\n\n" +
                    + "Thanks from the team!<br>"
                    + "Chris, Greg, Kathy, Dr Kwan-Liu Ma, and Dr Harris Lewin";
        addBodyText(body_text, 0, 9, 3);
        addButtons(1,1);

    } else if (pageNum == 6) {
        title_text = "Thanks for playing!";
        addTitleText(title_text);

        body_text =  "If you're interested in learning more about genomic evolution, " +
					   "consider looking at some of the following resources:<br><br>" +
					   "\u2022 Wikipedia pages for 'genome evolution', 'comparative genomics', or 'synteny'<br>" +
					   "\u2022 Online genome databases like Genome Browser   (https://genome.ucsc.edu)<br>" +
					   "\u2022 Check out a book on genomics at local library<br>" +
					   "\u2022 Explore a natural history museum <br>" +
					   "\u2022 Talk to your biology teacher at school" + "<br><br>"
					   + "Don't forget to let us know what you think of the app. It really helps out our student research and this project's development!";
        addBodyText(body_text, 0, 9, 3);
        addButtons(0,1);

    }

    function addTitleText(text) {
        $('.title-text-box').html("<div class=\"title-text\">" + text +"</div>");
        $('.skip-button-box').html("<div class=\"skip-button\">&times;</div>");
    }

    function addBodyText(text, image_url, col1, col2) {
        if (image_url == 0) {
            $('#modal-content-body').html(
                "<div class=\"col-" + col1 + "\" id=\"body-text\" style=\"font-size: 1.5rem; padding-right:5%;\">"
                + text +"</div>"
                + "<div class=\"col-" + col2 + "\"></div>");
        } else {        
            $('#modal-content-body').html(
                "<div class=\"col-" + col1 + "\" id=\"body-text\" style=\"font-size: 1.5rem; padding-right:5%;\">"
                + text +"</div>"
                + "<img class=\"col-" + col2 + "\" src=\"" + image_url + "\" alt=\"\" style=\"object-fit:contain;\">");
        }
    }

    function addButtons(next, previous) {
        if (next == 1) {
            $('.next-button-box').html("<div class=\"next-button\">Next &raquo;</div>");
        } else {
            $('.next-button').remove();
        }
        //<span class="next-button">Next &raquo;</span>
        if (previous == 1) {
            $('.previous-button-box').html("<div class=\"previous-button\">&laquo; Previous</div>");
        } else {
            $('.previous-button').remove();
        }
        
    }
}

var queue = d3.queue();
queue.awaitAll(function() {
    //show instruction slides when first load
    assignPageText(0);
});
