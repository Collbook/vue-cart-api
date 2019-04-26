var PRICE = 9.99;
var LOAD_NUM = 10;
new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        results: [],
        search: 'anime',
        lastSearch: '',
        loading: false,
        price: PRICE
    },

    computed: {
        // show message after load data
        noMoreItems: function () {
            return this.items.length === this.results.length && this.results.length > 0
        }
    },
    methods: {
        appendItems: function () {
            if (this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
        },
        onSubmit: function () {
            // check input search
            if (this.search.length) {
                this.items = [],
                    this.loading = true,
                    //console.log(this.search);
                    //console.log(this.$http);
                    this.$http
                        .get('/search/'.concat(this.search))
                        //.get('/search/'.concat('90s'))
                        .then(function (res) {

                            this.lastSearch = this.search;

                            // all result
                            this.results = res.data;
                            console.log(res.data);
                            // limit recoder result of 10
                            this.items = res.data.slice(0, 10);
                            this.loading = false;
                        });
            }
        },
        addItem: function (index) {
            this.total += PRICE;
            //console.log(index);
            //this.cart.push(this.items[index]);

            // 1 get id of item
            var item = this.items[index];
            // 3 check is exists of cart, if found qty++

            var found = false;
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    found = true;
                    // if found we need increment qty++
                    this.cart[i].qty++;
                    break;
                }
            }

            // 2 push item to cart

            // if found == false -> add item to cart
            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    price: PRICE,
                    qty: 1
                })
            }

            console.log(this.cart);
        },
        inc: function (item) {
            item.qty++;
            this.total += PRICE;
        },
        dec: function (item) {
            item.qty--;
            this.total -= PRICE;

            // remove a item 
            if (item.qty <= 0) {
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                    }
                }
            }
        },
        removeItem: function (item) {
            console.log(item.qty);
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    this.cart.splice(i, 1);
                    this.total -= item.qty * PRICE;
                }
            }
        }
    },
    filters: {
        currency: function (price) {
            return '$'.concat(price.toFixed(2));
        }
    },
    mounted() {
        // load data default when run open home  (anime)
        this.onSubmit();

        var VueInstance = this;

        var elem = document.getElementById('product-list-bottom');

        var watcher = scrollMonitor.create(elem);

        watcher.enterViewport(function () {
            VueInstance.appendItems();
        });
    },
})

//console.log(scrollMonitor);

