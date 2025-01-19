

var candidates = [
    "hello",
    "hello world",
    "hello is a word for morning"
];


class Rotation {
    // Restrict: beg < end
    constructor(beg, end) {
        this.beg = beg;
        this.end = end;
        this.i = beg;
    }


    up() {
        if (this.i == this.beg) {
            this.i = this.end;
        }
        this.i--;
        return this.i;
    }


    down() {
        this.i++;
        if (this.i == this.end) {
            this.i = this.beg;
        }
        return this.i;
    }
}


class Completion {
    constructor(candidates) {
        this.candidates = candidates;
        this.rotation = new Rotation(-1, candidates.length);
    }


    up() {
        this.rotation.up();
    }


    down() {
        this.rotation.down();
    }


    reset(candidates) {
        this.candidates = candidates;
        this.rotation.i = -1;
        this.rotation = new Rotation(-1, candidates.length);
    }


    clear() {
        this.reset([]);
    }


    word() {
        return this.rotation.i < 0 ? null : this.candidates[this.rotation.i];
    }
}


var completion = new Completion(candidates);


function renderCompletion(completion) {
    let completion_elem = document.getElementById("tag-search-completion");
    completion_elem.innerHTML = "";


    for (var i = 0; i < completion.candidates.length; i++) {
        let candidate_elem = document.createElement("li");
        candidate_elem.innerText = completion.candidates[i];


        candidate_elem.addEventListener("click", (e) => {
            console.log(e.target.innerText);
        })


        if (i == completion.rotation.i) {
            candidate_elem.style.backgroundColor = "red"
        }
        completion_elem.appendChild(candidate_elem);
    }
}


window.onload = () => {
    let tag_search = document.getElementById("tag-search");


    tag_search.addEventListener("input", (event) => {
        // candiates
        completion.reset(candidates.filter((candidate) => {
            return candidate.startsWith(event.target.value, 0);
        }));
   
        renderCompletion(completion);
    });


    tag_search.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowUp":
                e.preventDefault();
                completion.up();
                renderCompletion(completion);
                break;
            case "ArrowDown":
                e.preventDefault();
                completion.down();
                renderCompletion(completion);
                break;
            case "Enter":
                let word = completion.word();
                if (!word) {
                    console.log(tag_search.value);
                } else {
                    console.log(word);
                }
                break;
            case "Escape":
                completion.clear();
                renderCompletion(completion);
                break;
        }
    });


    let tag_file = document.getElementById("tag-file");
    tag_file.addEventListener("change", async (e) => {
        let text = await e.target.files[0].text();
        candidates = text.match(/[^\r\n]+/g);
    })
}

