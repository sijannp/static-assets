alert("Hello From Github");
if (!customElements.get('views-count-component')) {
    customElements.define('views-count-component', class CustomViewsCountComponent extends HTMLElement {
        constructor() {
            super();
            this.storeId = this.dataset.storeid;
            this.productId = this.dataset.productid;
            this.id = this.dataset.id;
            this.handle = this.dataset.producthandle;
            if (!CustomViewsCountComponent.requestSent) {
                CustomViewsCountComponent.requestSent = false;
                CustomViewsCountComponent.viewsCount = null;
            }
            this.requestDebounce = this.debounce(this.sendViewsCountRequest.bind(this), 100);
        }

        debounce(func, wait) {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func(...args), wait);
            };
        }

        async sendViewsCountRequest() {
            if (!CustomViewsCountComponent.requestSent) {
                CustomViewsCountComponent.requestSent = true;
                try {
                    const response = await fetch(`/apps/views-count-dev/product`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },
                        body: JSON.stringify({ storeId: this.storeId, productId: this.productId, productHandle: this.handle }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch views count');
                    }
                    const data = await response.json();
                    CustomViewsCountComponent.viewsCount = data.count;
                    this.updateViewsCount();
                } catch (error) {
                    console.error('Error fetching views count:', error);
                } finally {
                    CustomViewsCountComponent.requestSent = false;
                }
            }
        }

        connectedCallback() {
            this.requestDebounce();
        }

        updateViewsCount() {
            if (CustomViewsCountComponent.viewsCount !== null) {
                const viewsCountElements = document.querySelectorAll('views-count') || this.querySelector('views-count');
                if (viewsCountElements && viewsCountElements[0]) {
                    viewsCountElements.forEach((element) => {
                        element.textContent = CustomViewsCountComponent.viewsCount;

                    })
                }

            } else {
                console.log('Views count not yet available');
            }
        }
    });
}
