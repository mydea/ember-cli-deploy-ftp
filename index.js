/* jshint node: true */
'use strict';

var BasePlugin = require('ember-cli-deploy-plugin');
var FtpDeploy = require('ftp-deploy');

module.exports = {
  name: 'ember-cli-deploy-ftp',

  createDeployPlugin: function(options) {
    var DeployPlugin = BasePlugin.extend({
      name: options.name,

      requiredConfig: ['host'],

      defaultConfig: {
        port: 21,
        username: 'anonymous',
        password: 'anonymous',
        remoteRoot: '/',
        include: ['*', '**/*'],
        exclude: []
      },

      upload: function(context) {
        var self = this;

        var ftpDeploy = new FtpDeploy();
        var host = this.readConfig('host');

        var config = {
          host: host,
          port: this.readConfig('port'),
          user: this.readConfig('username'),
          password: this.readConfig('password'),
          localRoot: context.distDir,
          remoteRoot: this.readConfig('remoteRoot'),
          include: this.readConfig('include'),
          exclude: this.readConfig('exclude')
        };

        this.log('preparing to upload to FTP host `' + host + '`', { verbose: true });

        ftpDeploy.on('uploading', function(data) {
          self.log('uploading file `' + data.filename + '`', { verbose: true });
        });

        return ftpDeploy.deploy(config).then(function() {
          self.log('upload complete', { verbose: true });
        });
      },
    });

    return new DeployPlugin();
  }
};
