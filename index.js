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

class CompletionInput {
    constructor(rootId, inputElemName) {
        this.rootId = rootId;
        let rootElem = document.getElementById(rootId);

        this.inputElem = document.createElement("input");
        this.inputElem.id = rootId + "__input";
        this.inputElem.type = "text";
        this.inputElem.name = inputElemName;
        this.inputElem.addEventListener("input", (event) => {
            this.setCandidates(candidates.filter((candidate) => {
                return candidate.startsWith(event.target.value, 0);
            }));
        });
        this.inputElem.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowUp":
                    e.preventDefault();
                    this.up();
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    this.down();
                    break;
                case "Enter":
                    let idx = this.rotation.idx;
                    if (idx < 0) {
                        console.log(this.inputElem.value);
                    } else {
                        console.log(this.candidates[idx]);
                    }
                    break;
                case "Escape":
                    this.clear();
                    break;
            }
        });
        rootElem.appendChild(this.inputElem);

        this.completionElem = document.createElement("div");
        this.completionElem.id = rootId + "__completion";
        this.completionElem.addEventListener("mouseleave", () => {
            this.over();
            console.log("over");
        });
        this.completionElem.addEventListener("mousemove", () => {
            this.isCompletionMouseMoving = true;
        })
        rootElem.appendChild(this.completionElem);

        this.isCompletionMouseMoving = false;

        this.candidates = [];
        this.candidateElems = [];
        this.rotation = new Rotation(-1, 0);

        this.originalInputValue = "";
    }

    storeInputValue() {
        this.originalInputValue = this.inputElem.value;
    }

    restoreInputValue() {
        this.inputElem.value = this.originalInputValue;
    }

    setCandidates(candidates) {
        if (candidates != this.candidates) {
            this.rotation = new Rotation(-1, candidates.length);
            this.draw(this.candidates = structuredClone(candidates));
        }
    }

    updateSelection(oldIdx, newIdx) {
        if (oldIdx == -1)
           this.storeInputValue();
        else {
            this.candidateElems[oldIdx].classList.remove(this.rootId + "__completion-candidate--highlight");
        }

        if (newIdx == -1)
            // set saved value
            this.restoreInputValue();
        else {
            this.candidateElems[newIdx].classList.add(this.rootId + "__completion-candidate--highlight");

            this.inputElem.value = this.candidates[newIdx];
        }
    }
    
    draw(candidates) {
        this.erase();

        this.isCompletionMouseMoving = false;

        this.candidateElems = (new Array(candidates.length)).fill().map((e) => { return document.createElement("li"); });
        this.candidateElems.forEach((e, i) => {
            e.classList.add(this.rootId + "__completion-candidate");
            e.innerText = candidates[i];
            e.addEventListener("click", (event) => {
                console.log(this.candidates[i]);
            });

            e.addEventListener("mouseenter", (event) => {
                if (!this.isCompletionMouseMoving)
                    return;
                this.point(i);
            });

            this.completionElem.appendChild(e);
        });
    }

    whenEnter(data) {
        
    }

    whenClick(data) {
        console.log(data);
    }

    erase() {
        this.completionElem.innerHTML = "";
    }

    clear() {
        this.restoreInputValue();
        this.setCandidates([]);
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
}

window.onload = () => {
    input = new CompletionInput("search-tag", "tag");

    let tag_file = document.getElementById("tag-file");
    tag_file.addEventListener("change", async (e) => {
        let text = await e.target.files[0].text();
        candidates = text.match(/[^\r\n]+/g);
    })
}

