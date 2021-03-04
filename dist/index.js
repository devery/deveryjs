if (typeof document !== 'undefined') {} // do stuff

// This one is overkill, but 100% always works:
if (typeof window !== 'undefined' && window && window.window === window) {
   if (typeof window.document !== 'undefined' && document.documentElement) {
     module.exports = require('./index-web')
   }
   else{
    module.exports = require('./index-node')
   }
}
else{
    module.exports = require('./index-node')
}