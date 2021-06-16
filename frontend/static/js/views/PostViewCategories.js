import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.postId = params.id;
        this.categoryId = params.categoryId
        this.setTitle("Viewing Post Categories");
    }

    async getHtml() {
        return `
            <h1>Post Categories</h1>
            <p>You are viewing post #${this.postId}.</p>
            <p>You are viewing post category #${this.categoryId}.</p>
        `;
    }
}
