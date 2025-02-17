
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

export class CompletionInput {
    constructor(rootId, inputElemName) {
        this.rootId = rootId;
        let rootElem = document.getElementById(rootId);

        this.inputElem = document.createElement("input");
        this.inputElem.id = rootId + "__input";
        this.inputElem.type = "text";
        this.inputElem.name = inputElemName;
        this.inputElem.addEventListener("input", (event) => {
            this.captureCandidatesFor(event.target.value);
        });
        this.inputElem.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowUp":
                    event.preventDefault();
                    this.up();
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    this.down();
                    break;
                case "Enter":
                    this.doSomethingFor(this.text());
                    this.clear();
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

    updateSelection(oldIdx, newIdx) {
        if (oldIdx != -1)
            this.candidateElems[oldIdx].classList.remove(this.rootId + "__completion-candidate--highlight");
        else
            this.storeInputValue();

        if (newIdx != -1) {
            this.candidateElems[newIdx].classList.add(this.rootId + "__completion-candidate--highlight");

            // update suggestion
            return this.inputElem.value = this.candidates[newIdx];
        }
        
        return this.restoreInputValue();
    }

    setCandidates(candidates) {
        this.candidates = candidates;
        this.rotation = new Rotation(-1, this.candidates.length);
        this.draw(this.candidates);
    }
    
    draw(candidates) {
        this.erase();

        this.isCompletionMouseMoving = false;

        this.candidateElems = (new Array(candidates.length)).fill().map((e) => { return document.createElement("li"); });
        this.candidateElems.forEach((e, i) => {
            e.classList.add(this.rootId + "__completion-candidate");
            e.innerText = candidates[i];
            e.addEventListener("click", (event) => {
                this.inputElem.focus();
                this.doSomethingFor(this.text());
                this.clear();
            });

            e.addEventListener("mouseenter", (event) => {
                if (!this.isCompletionMouseMoving)
                    return;
                this.point(i);
            });

            this.completionElem.appendChild(e);
        });
    }

    doSomethingFor(str) {
        console.log(str);
    }

    async captureCandidatesFor(str) {
        this.setCandidates(candidates.filter((candidate) => {
            return candidate.startsWith(str, 0);
        }));
    }

    erase() {
        this.completionElem.innerHTML = "";
    }

    text() {
        if (this.rotation.idx < 0)
            return this.inputElem.value;
        else
            return this.candidates[this.rotation.idx];
    }

    clear() {
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
