function createRouter(server){
    function App() {
        this.callbacks = {
            post: {},
            get: {},
    
            delete:{},
            patch:{},
            put:{},
           
        };
        let self = this;
        server.on("request", function (request, response) {
            
            var requestUrl = new URL(request.url, `http://${request.headers.host}`);
            if (self.callbacks[request.method.toLowerCase()][requestUrl.pathname]) {
            self.callbacks[request.method.toLowerCase()][requestUrl.pathname](
                request,
                response
            );
            }
        });
    }
    
    App.prototype = {
        get: function (url, callback) {
            this.callbacks.get[url] = callback;
        },
        post: function (url, callback) {
            this.callbacks.post[url] = callback;
            
        },
        drop: function (url, callback) {
            this.callbacks.delete[url] = callback;
            
        },
        delete: function(url, callback) {
            this.callbacks.delete[url] = callback;
            
        },
        patch: function(url, callback) {
            this.callbacks.patch[url] = callback;
            
        },
        put: function(url,callback){
            this.callbacks.put[url] = callback;
        },
        count: function(url,callback){
            this.callbacks.get[url] = callback;
        }
    };

    return new App();
}

module.exports = createRouter;
