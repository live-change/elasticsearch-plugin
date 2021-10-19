const { Client: ElasticSearch } = require('@elastic/elasticsearch')
const AnalyticsWriter = require('./lib/AnalyticsWriter.js')
const updater = require('./lib/updater.js')
const searchIndex = require('./lib/searchIndex.js')

module.exports = function(app, services) {
  app.connectToSearch = () => {
    if(!app.env.SEARCH_INDEX_PREFIX) throw new Error("ElasticSearch not configured")
    if(app.search) return app.search
    app.searchIndexPrefix = app.env.SEARCH_INDEX_PREFIX
    app.search = new ElasticSearch({ node: this.env.SEARCH_URL || 'http://localhost:9200' })
    //this.search.info(console.log)
    return app.search
  }

  app.connectToAnalytics = () => {
    if(!this.env.ANALYTICS_INDEX_PREFIX) throw new Error("ElasticSearch analytics not configured")
    if(app.analytics) return app.analytics
    app.analytics = new AnalyticsWriter(this.env.ANALYTICS_INDEX_PREFIX)
    return app.analytics
  }

  if(app.env.SEARCH_INDEX_PREFIX) app.defaultProcessors.push(searchIndex)
  if(app.env.SEARCH_INDEX_PREFIX) app.defaultUpdaters.push(updater)
}
