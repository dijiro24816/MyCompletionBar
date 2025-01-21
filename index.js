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
        this.idx = beg;
    }

    prev() {
        if (this.idx == this.beg)
            this.idx = this.end;
        this.idx--;
        return this.idx;
    }

    next() {
        this.idx++;
        if (this.idx == this.end)
            this.idx = this.beg;
        return this.idx;
    }

    set(idx) {
        return this.idx = idx;
    }

    reset() {
        return this.idx = this.beg;
    }
}

class CompletionDOM {
    constructor(containerId) {
        this.containerElem = document.getElementById(containerId);
        this.containerElem.addEventListener("mouseleave", () => { this.over() });
        this.candidates = [];
        this.candidateElems = [];
        this.rotation = new Rotation(-1, 0);
    }

    render(candidates) {
        if (candidates != this.candidates) {
            this.rotation = new Rotation(-1, candidates.length);
            this.draw(this.candidates = structuredClone(candidates));
        }
    }

    updateSelection(oldIdx, newIdx) {
        if (oldIdx != -1)
            this.candidateElems[oldIdx].classList.remove("select");

        if (newIdx != -1)
            this.candidateElems[newIdx].classList.add("select");
    }

    up() {
        this.updateSelection(this.rotation.idx, this.rotation.prev());
    }

    down() {
        this.updateSelection(this.rotation.idx, this.rotation.next());
    }

    point(idx) {
        this.updateSelection(this.rotation.idx, this.rotation.set(idx));
    }

    over() {
        this.updateSelection(this.rotation.idx, this.rotation.reset());
    }

    draw(candidates) {
        this.erase();

        this.candidateElems = (new Array(candidates.length)).fill().map((e) => { return document.createElement("li"); });
        this.candidateElems.forEach((e, i) => {
            e.classList.add("candidate");
            e.innerText = candidates[i];
            e.addEventListener("click", (event) => {
                console.log(this.candidates[i]);
            });

            e.addEventListener("mouseenter", (event) => {
                this.point(i);
            });

            this.containerElem.appendChild(e);
        });
    }

    erase() {
        this.containerElem.innerHTML = "";
    }
}

window.onload = () => {
    let tag_search = document.getElementById("tag-search");

    completionDOM = new CompletionDOM("completion");

    tag_search.addEventListener("input", (event) => {
        // candiates
        completionDOM.render(candidates.filter((candidate) => {
            return candidate.startsWith(event.target.value, 0);
        }));
    });


    tag_search.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowUp":
                e.preventDefault();
                completionDOM.up();
                break;
            case "ArrowDown":
                e.preventDefault();
                completionDOM.down();
                break;
            case "Enter":
                let idx = completionDOM.rotation.idx;
                if (idx < 0) {
                    console.log(tag_search.value);
                } else {
                    console.log(completionDOM.candidates[idx]);
                }
                break;
            case "Escape":
                completionDOM.render([]);
                break;
        }
    });


    let tag_file = document.getElementById("tag-file");
    tag_file.addEventListener("change", async (e) => {
        let text = await e.target.files[0].text();
        candidates = text.match(/[^\r\n]+/g);
    })
}

