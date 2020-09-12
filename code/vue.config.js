module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "smartmon.it",
        appId: 'com.madebyfabian.smartmonit',
        win: {
          requestedExecutionLevel: 'highestAvailable',
          target: [ 'nsis' ]
        },
        nsis: {
          perMachine: true
        },
        directories: {
          output: '../',
          buildResources: 'public'
        }
        // artifactName: '${productName} Setup ${version}.${ext}',
      }
    }
  }
}