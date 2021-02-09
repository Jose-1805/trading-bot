  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var Connector = function () {
      /**
       * Create a new class instance.
       */
      function Connector(options) {
          classCallCheck(this, Connector);

          /**
           * Default connector options.
           */
          this._defaultOptions = {
              auth: {
                  headers: {}
              },
              authEndpoint: '/broadcasting/auth',
              broadcaster: 'pusher',
              csrfToken: null,
              host: null,
              key: null,
              namespace: 'App.Events'
          };
          this.setOptions(options);
          this.connect();
      }
      /**
       * Merge the custom options with the defaults.
       */


      createClass(Connector, [{
          key: 'setOptions',
          value: function setOptions(options) {
              this.options = _extends(this._defaultOptions, options);
              if (this.csrfToken()) {
                  this.options.auth.headers['X-CSRF-TOKEN'] = this.csrfToken();
              }
              return options;
          }
          /**
           * Extract the CSRF token from the page.
           */

      }, {
          key: 'csrfToken',
          value: function csrfToken() {
              var selector = void 0;
              if (typeof window !== 'undefined' && window['Laravel'] && window['Laravel'].csrfToken) {
                  return window['Laravel'].csrfToken;
              } else if (this.options.csrfToken) {
                  return this.options.csrfToken;
              } else if (typeof document !== 'undefined' && typeof document.querySelector === 'function' && (selector = document.querySelector('meta[name="csrf-token"]'))) {
                  return selector.getAttribute('content');
              }
              return null;
          }
      }]);
      return Connector;
  }();

  /**
   * This class represents a basic channel.
   */
  var Channel = function () {
    function Channel() {
      classCallCheck(this, Channel);
    }

    createClass(Channel, [{
      key: 'listenForWhisper',

      /**
       * Listen for a whisper event on the channel instance.
       */
      value: function listenForWhisper(event, callback) {
        return this.listen('.client-' + event, callback);
      }
      /**
       * Listen for an event on the channel instance.
       */

    }, {
      key: 'notification',
      value: function notification(callback) {
        return this.listen('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', callback);
      }
      /**
       * Stop listening for a whispser event on the channel instance.
       */

    }, {
      key: 'stopListeningForWhisper',
      value: function stopListeningForWhisper(event) {
        return this.stopListening('.client-' + event);
      }
    }]);
    return Channel;
  }();

  /**
   * Event name formatter
   */
  var EventFormatter = function () {
      /**
       * Create a new class instance.
       */
      function EventFormatter(namespace) {
          classCallCheck(this, EventFormatter);

          this.setNamespace(namespace);
      }
      /**
       * Format the given event name.
       */


      createClass(EventFormatter, [{
          key: 'format',
          value: function format(event) {
              if (event.charAt(0) === '.' || event.charAt(0) === '\\') {
                  return event.substr(1);
              } else if (this.namespace) {
                  event = this.namespace + '.' + event;
              }
              return event.replace(/\./g, '\\');
          }
          /**
           * Set the event namespace.
           */

      }, {
          key: 'setNamespace',
          value: function setNamespace(value) {
              this.namespace = value;
          }
      }]);
      return EventFormatter;
  }();

  /**
   * This class represents a Pusher channel.
   */
  var PusherChannel = function (_Channel) {
      inherits(PusherChannel, _Channel);

      /**
       * Create a new class instance.
       */
      function PusherChannel(pusher, name, options) {
          classCallCheck(this, PusherChannel);

          var _this = possibleConstructorReturn(this, (PusherChannel.__proto__ || Object.getPrototypeOf(PusherChannel)).call(this));

          _this.name = name;
          _this.pusher = pusher;
          _this.options = options;
          _this.eventFormatter = new EventFormatter(_this.options.namespace);
          _this.subscribe();
          return _this;
      }
      /**
       * Subscribe to a Pusher channel.
       */


      createClass(PusherChannel, [{
          key: 'subscribe',
          value: function subscribe() {
              this.subscription = this.pusher.subscribe(this.name);
          }
          /**
           * Unsubscribe from a Pusher channel.
           */

      }, {
          key: 'unsubscribe',
          value: function unsubscribe() {
              this.pusher.unsubscribe(this.name);
          }
          /**
           * Listen for an event on the channel instance.
           */

      }, {
          key: 'listen',
          value: function listen(event, callback) {
              this.on(this.eventFormatter.format(event), callback);
              return this;
          }
          /**
           * Stop listening for an event on the channel instance.
           */

      }, {
          key: 'stopListening',
          value: function stopListening(event) {
              this.subscription.unbind(this.eventFormatter.format(event));
              return this;
          }
          /**
           * Bind a channel to an event.
           */

      }, {
          key: 'on',
          value: function on(event, callback) {
              this.subscription.bind(event, callback);
              return this;
          }
      }]);
      return PusherChannel;
  }(Channel);

  /**
   * This class represents a Pusher private channel.
   */
  var PusherPrivateChannel = function (_PusherChannel) {
    inherits(PusherPrivateChannel, _PusherChannel);

    function PusherPrivateChannel() {
      classCallCheck(this, PusherPrivateChannel);
      return possibleConstructorReturn(this, (PusherPrivateChannel.__proto__ || Object.getPrototypeOf(PusherPrivateChannel)).apply(this, arguments));
    }

    createClass(PusherPrivateChannel, [{
      key: 'whisper',

      /**
       * Trigger client event on the channel.
       */
      value: function whisper(eventName, data) {
        this.pusher.channels.channels[this.name].trigger('client-' + eventName, data);
        return this;
      }
    }]);
    return PusherPrivateChannel;
  }(PusherChannel);

  /**
   * This class represents a Pusher presence channel.
   */
  var PusherPresenceChannel = function (_PusherChannel) {
      inherits(PusherPresenceChannel, _PusherChannel);

      function PusherPresenceChannel() {
          classCallCheck(this, PusherPresenceChannel);
          return possibleConstructorReturn(this, (PusherPresenceChannel.__proto__ || Object.getPrototypeOf(PusherPresenceChannel)).apply(this, arguments));
      }

      createClass(PusherPresenceChannel, [{
          key: 'here',

          /**
           * Register a callback to be called anytime the member list changes.
           */
          value: function here(callback) {
              this.on('pusher:subscription_succeeded', function (data) {
                  callback(Object.keys(data.members).map(function (k) {
                      return data.members[k];
                  }));
              });
              return this;
          }
          /**
           * Listen for someone joining the channel.
           */

      }, {
          key: 'joining',
          value: function joining(callback) {
              this.on('pusher:member_added', function (member) {
                  callback(member.info);
              });
              return this;
          }
          /**
           * Listen for someone leaving the channel.
           */

      }, {
          key: 'leaving',
          value: function leaving(callback) {
              this.on('pusher:member_removed', function (member) {
                  callback(member.info);
              });
              return this;
          }
          /**
           * Trigger client event on the channel.
           */

      }, {
          key: 'whisper',
          value: function whisper(eventName, data) {
              this.pusher.channels.channels[this.name].trigger('client-' + eventName, data);
              return this;
          }
      }]);
      return PusherPresenceChannel;
  }(PusherChannel);

  /**
   * This class represents a Socket.io channel.
   */
  var SocketIoChannel = function (_Channel) {
      inherits(SocketIoChannel, _Channel);

      /**
       * Create a new class instance.
       */
      function SocketIoChannel(socket, name, options) {
          classCallCheck(this, SocketIoChannel);

          /**
           * The event callbacks applied to the channel.
           */
          var _this = possibleConstructorReturn(this, (SocketIoChannel.__proto__ || Object.getPrototypeOf(SocketIoChannel)).call(this));

          _this.events = {};
          _this.name = name;
          _this.socket = socket;
          _this.options = options;
          _this.eventFormatter = new EventFormatter(_this.options.namespace);
          _this.subscribe();
          _this.configureReconnector();
          return _this;
      }
      /**
       * Subscribe to a Socket.io channel.
       */


      createClass(SocketIoChannel, [{
          key: 'subscribe',
          value: function subscribe() {
              this.socket.emit('subscribe', {
                  channel: this.name,
                  auth: this.options.auth || {}
              });
          }
          /**
           * Unsubscribe from channel and ubind event callbacks.
           */

      }, {
          key: 'unsubscribe',
          value: function unsubscribe() {
              this.unbind();
              this.socket.emit('unsubscribe', {
                  channel: this.name,
                  auth: this.options.auth || {}
              });
          }
          /**
           * Listen for an event on the channel instance.
           */

      }, {
          key: 'listen',
          value: function listen(event, callback) {
              this.on(this.eventFormatter.format(event), callback);
              return this;
          }
          /**
           * Stop listening for an event on the channel instance.
           */

      }, {
          key: 'stopListening',
          value: function stopListening(event) {
              var name = this.eventFormatter.format(event);
              this.socket.removeListener(name);
              delete this.events[name];
              return this;
          }
          /**
           * Bind the channel's socket to an event and store the callback.
           */

      }, {
          key: 'on',
          value: function on(event, callback) {
              var _this2 = this;

              var listener = function listener(channel, data) {
                  if (_this2.name == channel) {
                      callback(data);
                  }
              };
              this.socket.on(event, listener);
              this.bind(event, listener);
          }
          /**
           * Attach a 'reconnect' listener and bind the event.
           */

      }, {
          key: 'configureReconnector',
          value: function configureReconnector() {
              var _this3 = this;

              var listener = function listener() {
                  _this3.subscribe();
              };
              this.socket.on('reconnect', listener);
              this.bind('reconnect', listener);
          }
          /**
           * Bind the channel's socket to an event and store the callback.
           */

      }, {
          key: 'bind',
          value: function bind(event, callback) {
              this.events[event] = this.events[event] || [];
              this.events[event].push(callback);
          }
          /**
           * Unbind the channel's socket from all stored event callbacks.
           */

      }, {
          key: 'unbind',
          value: function unbind() {
              var _this4 = this;

              Object.keys(this.events).forEach(function (event) {
                  _this4.events[event].forEach(function (callback) {
                      _this4.socket.removeListener(event, callback);
                  });
                  delete _this4.events[event];
              });
          }
      }]);
      return SocketIoChannel;
  }(Channel);

  /**
   * This class represents a Socket.io presence channel.
   */
  var SocketIoPrivateChannel = function (_SocketIoChannel) {
      inherits(SocketIoPrivateChannel, _SocketIoChannel);

      function SocketIoPrivateChannel() {
          classCallCheck(this, SocketIoPrivateChannel);
          return possibleConstructorReturn(this, (SocketIoPrivateChannel.__proto__ || Object.getPrototypeOf(SocketIoPrivateChannel)).apply(this, arguments));
      }

      createClass(SocketIoPrivateChannel, [{
          key: 'whisper',

          /**
           * Trigger client event on the channel.
           */
          value: function whisper(eventName, data) {
              this.socket.emit('client event', {
                  channel: this.name,
                  event: 'client-' + eventName,
                  data: data
              });
              return this;
          }
      }]);
      return SocketIoPrivateChannel;
  }(SocketIoChannel);

  /**
   * This class represents a Socket.io presence channel.
   */
  var SocketIoPresenceChannel = function (_SocketIoPrivateChann) {
      inherits(SocketIoPresenceChannel, _SocketIoPrivateChann);

      function SocketIoPresenceChannel() {
          classCallCheck(this, SocketIoPresenceChannel);
          return possibleConstructorReturn(this, (SocketIoPresenceChannel.__proto__ || Object.getPrototypeOf(SocketIoPresenceChannel)).apply(this, arguments));
      }

      createClass(SocketIoPresenceChannel, [{
          key: 'here',

          /**
           * Register a callback to be called anytime the member list changes.
           */
          value: function here(callback) {
              this.on('presence:subscribed', function (members) {
                  callback(members.map(function (m) {
                      return m.user_info;
                  }));
              });
              return this;
          }
          /**
           * Listen for someone joining the channel.
           */

      }, {
          key: 'joining',
          value: function joining(callback) {
              this.on('presence:joining', function (member) {
                  return callback(member.user_info);
              });
              return this;
          }
          /**
           * Listen for someone leaving the channel.
           */

      }, {
          key: 'leaving',
          value: function leaving(callback) {
              this.on('presence:leaving', function (member) {
                  return callback(member.user_info);
              });
              return this;
          }
      }]);
      return SocketIoPresenceChannel;
  }(SocketIoPrivateChannel);

  /**
   * This class represents a null channel.
   */
  var NullChannel = function (_Channel) {
    inherits(NullChannel, _Channel);

    function NullChannel() {
      classCallCheck(this, NullChannel);
      return possibleConstructorReturn(this, (NullChannel.__proto__ || Object.getPrototypeOf(NullChannel)).apply(this, arguments));
    }

    createClass(NullChannel, [{
      key: 'subscribe',

      /**
       * Subscribe to a channel.
       */
      value: function subscribe() {}
      //

      /**
       * Unsubscribe from a channel.
       */

    }, {
      key: 'unsubscribe',
      value: function unsubscribe() {}
      //

      /**
       * Listen for an event on the channel instance.
       */

    }, {
      key: 'listen',
      value: function listen(event, callback) {
        return this;
      }
      /**
       * Stop listening for an event on the channel instance.
       */

    }, {
      key: 'stopListening',
      value: function stopListening(event) {
        return this;
      }
      /**
       * Bind a channel to an event.
       */

    }, {
      key: 'on',
      value: function on(event, callback) {
        return this;
      }
    }]);
    return NullChannel;
  }(Channel);

  /**
   * This class represents a null private channel.
   */
  var NullPrivateChannel = function (_NullChannel) {
    inherits(NullPrivateChannel, _NullChannel);

    function NullPrivateChannel() {
      classCallCheck(this, NullPrivateChannel);
      return possibleConstructorReturn(this, (NullPrivateChannel.__proto__ || Object.getPrototypeOf(NullPrivateChannel)).apply(this, arguments));
    }

    createClass(NullPrivateChannel, [{
      key: 'whisper',

      /**
       * Trigger client event on the channel.
       */
      value: function whisper(eventName, data) {
        return this;
      }
    }]);
    return NullPrivateChannel;
  }(NullChannel);

  /**
   * This class represents a null presence channel.
   */
  var NullPresenceChannel = function (_NullChannel) {
    inherits(NullPresenceChannel, _NullChannel);

    function NullPresenceChannel() {
      classCallCheck(this, NullPresenceChannel);
      return possibleConstructorReturn(this, (NullPresenceChannel.__proto__ || Object.getPrototypeOf(NullPresenceChannel)).apply(this, arguments));
    }

    createClass(NullPresenceChannel, [{
      key: 'here',

      /**
       * Register a callback to be called anytime the member list changes.
       */
      value: function here(callback) {
        return this;
      }
      /**
       * Listen for someone joining the channel.
       */

    }, {
      key: 'joining',
      value: function joining(callback) {
        return this;
      }
      /**
       * Listen for someone leaving the channel.
       */

    }, {
      key: 'leaving',
      value: function leaving(callback) {
        return this;
      }
      /**
       * Trigger client event on the channel.
       */

    }, {
      key: 'whisper',
      value: function whisper(eventName, data) {
        return this;
      }
    }]);
    return NullPresenceChannel;
  }(NullChannel);

  /**
   * This class creates a connector to Pusher.
   */
  var PusherConnector = function (_Connector) {
      inherits(PusherConnector, _Connector);

      function PusherConnector() {
          classCallCheck(this, PusherConnector);

          /**
           * All of the subscribed channel names.
           */
          var _this = possibleConstructorReturn(this, (PusherConnector.__proto__ || Object.getPrototypeOf(PusherConnector)).apply(this, arguments));

          _this.channels = {};
          return _this;
      }
      /**
       * Create a fresh Pusher connection.
       */


      createClass(PusherConnector, [{
          key: 'connect',
          value: function connect() {
              if (typeof this.options.client !== 'undefined') {
                  this.pusher = this.options.client;
              } else {
                  this.pusher = new Pusher(this.options.key, this.options);
              }
          }
          /**
           * Listen for an event on a channel instance.
           */

      }, {
          key: 'listen',
          value: function listen(name, event, callback) {
              return this.channel(name).listen(event, callback);
          }
          /**
           * Get a channel instance by name.
           */

      }, {
          key: 'channel',
          value: function channel(name) {
              if (!this.channels[name]) {
                  this.channels[name] = new PusherChannel(this.pusher, name, this.options);
              }
              return this.channels[name];
          }
          /**
           * Get a private channel instance by name.
           */

      }, {
          key: 'privateChannel',
          value: function privateChannel(name) {
              if (!this.channels['private-' + name]) {
                  this.channels['private-' + name] = new PusherPrivateChannel(this.pusher, 'private-' + name, this.options);
              }
              return this.channels['private-' + name];
          }
          /**
           * Get a presence channel instance by name.
           */

      }, {
          key: 'presenceChannel',
          value: function presenceChannel(name) {
              if (!this.channels['presence-' + name]) {
                  this.channels['presence-' + name] = new PusherPresenceChannel(this.pusher, 'presence-' + name, this.options);
              }
              return this.channels['presence-' + name];
          }
          /**
           * Leave the given channel, as well as its private and presence variants.
           */

      }, {
          key: 'leave',
          value: function leave(name) {
              var _this2 = this;

              var channels = [name, 'private-' + name, 'presence-' + name];
              channels.forEach(function (name, index) {
                  _this2.leaveChannel(name);
              });
          }
          /**
           * Leave the given channel.
           */

      }, {
          key: 'leaveChannel',
          value: function leaveChannel(name) {
              if (this.channels[name]) {
                  this.channels[name].unsubscribe();
                  delete this.channels[name];
              }
          }
          /**
           * Get the socket ID for the connection.
           */

      }, {
          key: 'socketId',
          value: function socketId() {
              return this.pusher.connection.socket_id;
          }
          /**
           * Disconnect Pusher connection.
           */

      }, {
          key: 'disconnect',
          value: function disconnect() {
              this.pusher.disconnect();
          }
      }]);
      return PusherConnector;
  }(Connector);

  /**
   * This class creates a connnector to a Socket.io server.
   */
  var SocketIoConnector = function (_Connector) {
      inherits(SocketIoConnector, _Connector);

      function SocketIoConnector() {
          classCallCheck(this, SocketIoConnector);

          /**
           * All of the subscribed channel names.
           */
          var _this = possibleConstructorReturn(this, (SocketIoConnector.__proto__ || Object.getPrototypeOf(SocketIoConnector)).apply(this, arguments));

          _this.channels = {};
          return _this;
      }
      /**
       * Create a fresh Socket.io connection.
       */


      createClass(SocketIoConnector, [{
          key: 'connect',
          value: function connect() {
              var io = this.getSocketIO();
              this.socket = io(this.options.host, this.options);
              return this.socket;
          }
          /**
           * Get socket.io module from global scope or options.
           */

      }, {
          key: 'getSocketIO',
          value: function getSocketIO() {
              if (typeof this.options.client !== 'undefined') {
                  return this.options.client;
              }
              if (typeof io !== 'undefined') {
                  return io;
              }
              throw new Error('Socket.io client not found. Should be globally available or passed via options.client');
          }
          /**
           * Listen for an event on a channel instance.
           */

      }, {
          key: 'listen',
          value: function listen(name, event, callback) {
              return this.channel(name).listen(event, callback);
          }
          /**
           * Get a channel instance by name.
           */

      }, {
          key: 'channel',
          value: function channel(name) {
              if (!this.channels[name]) {
                  this.channels[name] = new SocketIoChannel(this.socket, name, this.options);
              }
              return this.channels[name];
          }
          /**
           * Get a private channel instance by name.
           */

      }, {
          key: 'privateChannel',
          value: function privateChannel(name) {
              if (!this.channels['private-' + name]) {
                  this.channels['private-' + name] = new SocketIoPrivateChannel(this.socket, 'private-' + name, this.options);
              }
              return this.channels['private-' + name];
          }
          /**
           * Get a presence channel instance by name.
           */

      }, {
          key: 'presenceChannel',
          value: function presenceChannel(name) {
              if (!this.channels['presence-' + name]) {
                  this.channels['presence-' + name] = new SocketIoPresenceChannel(this.socket, 'presence-' + name, this.options);
              }
              return this.channels['presence-' + name];
          }
          /**
           * Leave the given channel, as well as its private and presence variants.
           */

      }, {
          key: 'leave',
          value: function leave(name) {
              var _this2 = this;

              var channels = [name, 'private-' + name, 'presence-' + name];
              channels.forEach(function (name) {
                  _this2.leaveChannel(name);
              });
          }
          /**
           * Leave the given channel.
           */

      }, {
          key: 'leaveChannel',
          value: function leaveChannel(name) {
              if (this.channels[name]) {
                  this.channels[name].unsubscribe();
                  delete this.channels[name];
              }
          }
          /**
           * Get the socket ID for the connection.
           */

      }, {
          key: 'socketId',
          value: function socketId() {
              return this.socket.id;
          }
          /**
           * Disconnect Socketio connection.
           */

      }, {
          key: 'disconnect',
          value: function disconnect() {
              this.socket.disconnect();
          }
      }]);
      return SocketIoConnector;
  }(Connector);

  /**
   * This class creates a null connector.
   */
  var NullConnector = function (_Connector) {
    inherits(NullConnector, _Connector);

    function NullConnector() {
      classCallCheck(this, NullConnector);

      /**
       * All of the subscribed channel names.
       */
      var _this = possibleConstructorReturn(this, (NullConnector.__proto__ || Object.getPrototypeOf(NullConnector)).apply(this, arguments));

      _this.channels = {};
      return _this;
    }
    /**
     * Create a fresh connection.
     */


    createClass(NullConnector, [{
      key: 'connect',
      value: function connect() {}
      //

      /**
       * Listen for an event on a channel instance.
       */

    }, {
      key: 'listen',
      value: function listen(name, event, callback) {
        return new NullChannel();
      }
      /**
       * Get a channel instance by name.
       */

    }, {
      key: 'channel',
      value: function channel(name) {
        return new NullChannel();
      }
      /**
       * Get a private channel instance by name.
       */

    }, {
      key: 'privateChannel',
      value: function privateChannel(name) {
        return new NullPrivateChannel();
      }
      /**
       * Get a presence channel instance by name.
       */

    }, {
      key: 'presenceChannel',
      value: function presenceChannel(name) {
        return new NullPresenceChannel();
      }
      /**
       * Leave the given channel, as well as its private and presence variants.
       */

    }, {
      key: 'leave',
      value: function leave(name) {}
      //

      /**
       * Leave the given channel.
       */

    }, {
      key: 'leaveChannel',
      value: function leaveChannel(name) {}
      //

      /**
       * Get the socket ID for the connection.
       */

    }, {
      key: 'socketId',
      value: function socketId() {
        return 'fake-socket-id';
      }
      /**
       * Disconnect the connection.
       */

    }, {
      key: 'disconnect',
      value: function disconnect() {
        //
      }
    }]);
    return NullConnector;
  }(Connector);

  /**
   * This class is the primary API for interacting with broadcasting.
   */

  var Echo = function () {
      /**
       * Create a new class instance.
       */
      function Echo(options) {
          classCallCheck(this, Echo);

          this.options = options;
          this.connect();
          if (!this.options.withoutInterceptors) {
              this.registerInterceptors();
          }
      }
      /**
       * Get a channel instance by name.
       */


      createClass(Echo, [{
          key: 'channel',
          value: function channel(_channel) {
              return this.connector.channel(_channel);
          }
          /**
           * Create a new connection.
           */

      }, {
          key: 'connect',
          value: function connect() {
              if (this.options.broadcaster == 'pusher') {
                  this.connector = new PusherConnector(this.options);
              } else if (this.options.broadcaster == 'socket.io') {
                  this.connector = new SocketIoConnector(this.options);
              } else if (this.options.broadcaster == 'null') {
                  this.connector = new NullConnector(this.options);
              } else if (typeof this.options.broadcaster == 'function') {
                  this.connector = new this.options.broadcaster(this.options);
              }
          }
          /**
           * Disconnect from the Echo server.
           */

      }, {
          key: 'disconnect',
          value: function disconnect() {
              this.connector.disconnect();
          }
          /**
           * Get a presence channel instance by name.
           */

      }, {
          key: 'join',
          value: function join(channel) {
              return this.connector.presenceChannel(channel);
          }
          /**
           * Leave the given channel, as well as its private and presence variants.
           */

      }, {
          key: 'leave',
          value: function leave(channel) {
              this.connector.leave(channel);
          }
          /**
           * Leave the given channel.
           */

      }, {
          key: 'leaveChannel',
          value: function leaveChannel(channel) {
              this.connector.leaveChannel(channel);
          }
          /**
           * Listen for an event on a channel instance.
           */

      }, {
          key: 'listen',
          value: function listen(channel, event, callback) {
              return this.connector.listen(channel, event, callback);
          }
          /**
           * Get a private channel instance by name.
           */

      }, {
          key: 'private',
          value: function _private(channel) {
              return this.connector.privateChannel(channel);
          }
          /**
           * Get the Socket ID for the connection.
           */

      }, {
          key: 'socketId',
          value: function socketId() {
              return this.connector.socketId();
          }
          /**
           * Register 3rd party request interceptiors. These are used to automatically
           * send a connections socket id to a Laravel app with a X-Socket-Id header.
           */

      }, {
          key: 'registerInterceptors',
          value: function registerInterceptors() {
              if (typeof Vue === 'function' && Vue.http) {
                  this.registerVueRequestInterceptor();
              }
              if (typeof axios === 'function') {
                  this.registerAxiosRequestInterceptor();
              }
              if (typeof jQuery === 'function') {
                  this.registerjQueryAjaxSetup();
              }
          }
          /**
           * Register a Vue HTTP interceptor to add the X-Socket-ID header.
           */

      }, {
          key: 'registerVueRequestInterceptor',
          value: function registerVueRequestInterceptor() {
              var _this = this;

              Vue.http.interceptors.push(function (request, next) {
                  if (_this.socketId()) {
                      request.headers.set('X-Socket-ID', _this.socketId());
                  }
                  next();
              });
          }
          /**
           * Register an Axios HTTP interceptor to add the X-Socket-ID header.
           */

      }, {
          key: 'registerAxiosRequestInterceptor',
          value: function registerAxiosRequestInterceptor() {
              var _this2 = this;

              axios.interceptors.request.use(function (config) {
                  if (_this2.socketId()) {
                      config.headers['X-Socket-Id'] = _this2.socketId();
                  }
                  return config;
              });
          }
          /**
           * Register jQuery AjaxPrefilter to add the X-Socket-ID header.
           */

      }, {
          key: 'registerjQueryAjaxSetup',
          value: function registerjQueryAjaxSetup() {
              var _this3 = this;

              if (typeof jQuery.ajax != 'undefined') {
                  jQuery.ajaxPrefilter(function (options, originalOptions, xhr) {
                      if (_this3.socketId()) {
                          xhr.setRequestHeader('X-Socket-Id', _this3.socketId());
                      }
                  });
              }
          }
      }]);
      return Echo;
  }();

  Window.Pusher = !function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Pusher=e():t.Pusher=e()}(window,(function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e,n){!function(t){"use strict";var e=function(t){var e,n=new Float64Array(16);if(t)for(e=0;e<t.length;e++)n[e]=t[e];return n},r=function(){throw new Error("no PRNG")},o=new Uint8Array(16),i=new Uint8Array(32);i[0]=9;var s=e(),c=e([1]),a=e([56129,1]),u=e([30883,4953,19914,30187,55467,16705,2637,112,59544,30585,16505,36039,65139,11119,27886,20995]),h=e([61785,9906,39828,60374,45398,33411,5274,224,53552,61171,33010,6542,64743,22239,55772,9222]),p=e([54554,36645,11616,51542,42930,38181,51040,26924,56412,64982,57905,49316,21502,52590,14035,8553]),f=e([26200,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214]),l=e([41136,18958,6951,50414,58488,44335,6150,12099,55207,15867,153,11085,57099,20417,9344,11139]);function d(t,e,n,r){t[e]=n>>24&255,t[e+1]=n>>16&255,t[e+2]=n>>8&255,t[e+3]=255&n,t[e+4]=r>>24&255,t[e+5]=r>>16&255,t[e+6]=r>>8&255,t[e+7]=255&r}function y(t,e,n,r,o){var i,s=0;for(i=0;i<o;i++)s|=t[e+i]^n[r+i];return(1&s-1>>>8)-1}function v(t,e,n,r){return y(t,e,n,r,16)}function g(t,e,n,r){return y(t,e,n,r,32)}function b(t,e,n,r){!function(t,e,n,r){for(var o,i=255&r[0]|(255&r[1])<<8|(255&r[2])<<16|(255&r[3])<<24,s=255&n[0]|(255&n[1])<<8|(255&n[2])<<16|(255&n[3])<<24,c=255&n[4]|(255&n[5])<<8|(255&n[6])<<16|(255&n[7])<<24,a=255&n[8]|(255&n[9])<<8|(255&n[10])<<16|(255&n[11])<<24,u=255&n[12]|(255&n[13])<<8|(255&n[14])<<16|(255&n[15])<<24,h=255&r[4]|(255&r[5])<<8|(255&r[6])<<16|(255&r[7])<<24,p=255&e[0]|(255&e[1])<<8|(255&e[2])<<16|(255&e[3])<<24,f=255&e[4]|(255&e[5])<<8|(255&e[6])<<16|(255&e[7])<<24,l=255&e[8]|(255&e[9])<<8|(255&e[10])<<16|(255&e[11])<<24,d=255&e[12]|(255&e[13])<<8|(255&e[14])<<16|(255&e[15])<<24,y=255&r[8]|(255&r[9])<<8|(255&r[10])<<16|(255&r[11])<<24,v=255&n[16]|(255&n[17])<<8|(255&n[18])<<16|(255&n[19])<<24,g=255&n[20]|(255&n[21])<<8|(255&n[22])<<16|(255&n[23])<<24,b=255&n[24]|(255&n[25])<<8|(255&n[26])<<16|(255&n[27])<<24,m=255&n[28]|(255&n[29])<<8|(255&n[30])<<16|(255&n[31])<<24,w=255&r[12]|(255&r[13])<<8|(255&r[14])<<16|(255&r[15])<<24,_=i,S=s,k=c,T=a,O=u,C=h,A=p,E=f,P=l,x=d,L=y,R=v,U=g,M=b,j=m,I=w,N=0;N<20;N+=2)_^=(o=(U^=(o=(P^=(o=(O^=(o=_+U|0)<<7|o>>>25)+_|0)<<9|o>>>23)+O|0)<<13|o>>>19)+P|0)<<18|o>>>14,C^=(o=(S^=(o=(M^=(o=(x^=(o=C+S|0)<<7|o>>>25)+C|0)<<9|o>>>23)+x|0)<<13|o>>>19)+M|0)<<18|o>>>14,L^=(o=(A^=(o=(k^=(o=(j^=(o=L+A|0)<<7|o>>>25)+L|0)<<9|o>>>23)+j|0)<<13|o>>>19)+k|0)<<18|o>>>14,I^=(o=(R^=(o=(E^=(o=(T^=(o=I+R|0)<<7|o>>>25)+I|0)<<9|o>>>23)+T|0)<<13|o>>>19)+E|0)<<18|o>>>14,_^=(o=(T^=(o=(k^=(o=(S^=(o=_+T|0)<<7|o>>>25)+_|0)<<9|o>>>23)+S|0)<<13|o>>>19)+k|0)<<18|o>>>14,C^=(o=(O^=(o=(E^=(o=(A^=(o=C+O|0)<<7|o>>>25)+C|0)<<9|o>>>23)+A|0)<<13|o>>>19)+E|0)<<18|o>>>14,L^=(o=(x^=(o=(P^=(o=(R^=(o=L+x|0)<<7|o>>>25)+L|0)<<9|o>>>23)+R|0)<<13|o>>>19)+P|0)<<18|o>>>14,I^=(o=(j^=(o=(M^=(o=(U^=(o=I+j|0)<<7|o>>>25)+I|0)<<9|o>>>23)+U|0)<<13|o>>>19)+M|0)<<18|o>>>14;_=_+i|0,S=S+s|0,k=k+c|0,T=T+a|0,O=O+u|0,C=C+h|0,A=A+p|0,E=E+f|0,P=P+l|0,x=x+d|0,L=L+y|0,R=R+v|0,U=U+g|0,M=M+b|0,j=j+m|0,I=I+w|0,t[0]=_>>>0&255,t[1]=_>>>8&255,t[2]=_>>>16&255,t[3]=_>>>24&255,t[4]=S>>>0&255,t[5]=S>>>8&255,t[6]=S>>>16&255,t[7]=S>>>24&255,t[8]=k>>>0&255,t[9]=k>>>8&255,t[10]=k>>>16&255,t[11]=k>>>24&255,t[12]=T>>>0&255,t[13]=T>>>8&255,t[14]=T>>>16&255,t[15]=T>>>24&255,t[16]=O>>>0&255,t[17]=O>>>8&255,t[18]=O>>>16&255,t[19]=O>>>24&255,t[20]=C>>>0&255,t[21]=C>>>8&255,t[22]=C>>>16&255,t[23]=C>>>24&255,t[24]=A>>>0&255,t[25]=A>>>8&255,t[26]=A>>>16&255,t[27]=A>>>24&255,t[28]=E>>>0&255,t[29]=E>>>8&255,t[30]=E>>>16&255,t[31]=E>>>24&255,t[32]=P>>>0&255,t[33]=P>>>8&255,t[34]=P>>>16&255,t[35]=P>>>24&255,t[36]=x>>>0&255,t[37]=x>>>8&255,t[38]=x>>>16&255,t[39]=x>>>24&255,t[40]=L>>>0&255,t[41]=L>>>8&255,t[42]=L>>>16&255,t[43]=L>>>24&255,t[44]=R>>>0&255,t[45]=R>>>8&255,t[46]=R>>>16&255,t[47]=R>>>24&255,t[48]=U>>>0&255,t[49]=U>>>8&255,t[50]=U>>>16&255,t[51]=U>>>24&255,t[52]=M>>>0&255,t[53]=M>>>8&255,t[54]=M>>>16&255,t[55]=M>>>24&255,t[56]=j>>>0&255,t[57]=j>>>8&255,t[58]=j>>>16&255,t[59]=j>>>24&255,t[60]=I>>>0&255,t[61]=I>>>8&255,t[62]=I>>>16&255,t[63]=I>>>24&255}(t,e,n,r)}function m(t,e,n,r){!function(t,e,n,r){for(var o,i=255&r[0]|(255&r[1])<<8|(255&r[2])<<16|(255&r[3])<<24,s=255&n[0]|(255&n[1])<<8|(255&n[2])<<16|(255&n[3])<<24,c=255&n[4]|(255&n[5])<<8|(255&n[6])<<16|(255&n[7])<<24,a=255&n[8]|(255&n[9])<<8|(255&n[10])<<16|(255&n[11])<<24,u=255&n[12]|(255&n[13])<<8|(255&n[14])<<16|(255&n[15])<<24,h=255&r[4]|(255&r[5])<<8|(255&r[6])<<16|(255&r[7])<<24,p=255&e[0]|(255&e[1])<<8|(255&e[2])<<16|(255&e[3])<<24,f=255&e[4]|(255&e[5])<<8|(255&e[6])<<16|(255&e[7])<<24,l=255&e[8]|(255&e[9])<<8|(255&e[10])<<16|(255&e[11])<<24,d=255&e[12]|(255&e[13])<<8|(255&e[14])<<16|(255&e[15])<<24,y=255&r[8]|(255&r[9])<<8|(255&r[10])<<16|(255&r[11])<<24,v=255&n[16]|(255&n[17])<<8|(255&n[18])<<16|(255&n[19])<<24,g=255&n[20]|(255&n[21])<<8|(255&n[22])<<16|(255&n[23])<<24,b=255&n[24]|(255&n[25])<<8|(255&n[26])<<16|(255&n[27])<<24,m=255&n[28]|(255&n[29])<<8|(255&n[30])<<16|(255&n[31])<<24,w=255&r[12]|(255&r[13])<<8|(255&r[14])<<16|(255&r[15])<<24,_=0;_<20;_+=2)i^=(o=(g^=(o=(l^=(o=(u^=(o=i+g|0)<<7|o>>>25)+i|0)<<9|o>>>23)+u|0)<<13|o>>>19)+l|0)<<18|o>>>14,h^=(o=(s^=(o=(b^=(o=(d^=(o=h+s|0)<<7|o>>>25)+h|0)<<9|o>>>23)+d|0)<<13|o>>>19)+b|0)<<18|o>>>14,y^=(o=(p^=(o=(c^=(o=(m^=(o=y+p|0)<<7|o>>>25)+y|0)<<9|o>>>23)+m|0)<<13|o>>>19)+c|0)<<18|o>>>14,w^=(o=(v^=(o=(f^=(o=(a^=(o=w+v|0)<<7|o>>>25)+w|0)<<9|o>>>23)+a|0)<<13|o>>>19)+f|0)<<18|o>>>14,i^=(o=(a^=(o=(c^=(o=(s^=(o=i+a|0)<<7|o>>>25)+i|0)<<9|o>>>23)+s|0)<<13|o>>>19)+c|0)<<18|o>>>14,h^=(o=(u^=(o=(f^=(o=(p^=(o=h+u|0)<<7|o>>>25)+h|0)<<9|o>>>23)+p|0)<<13|o>>>19)+f|0)<<18|o>>>14,y^=(o=(d^=(o=(l^=(o=(v^=(o=y+d|0)<<7|o>>>25)+y|0)<<9|o>>>23)+v|0)<<13|o>>>19)+l|0)<<18|o>>>14,w^=(o=(m^=(o=(b^=(o=(g^=(o=w+m|0)<<7|o>>>25)+w|0)<<9|o>>>23)+g|0)<<13|o>>>19)+b|0)<<18|o>>>14;t[0]=i>>>0&255,t[1]=i>>>8&255,t[2]=i>>>16&255,t[3]=i>>>24&255,t[4]=h>>>0&255,t[5]=h>>>8&255,t[6]=h>>>16&255,t[7]=h>>>24&255,t[8]=y>>>0&255,t[9]=y>>>8&255,t[10]=y>>>16&255,t[11]=y>>>24&255,t[12]=w>>>0&255,t[13]=w>>>8&255,t[14]=w>>>16&255,t[15]=w>>>24&255,t[16]=p>>>0&255,t[17]=p>>>8&255,t[18]=p>>>16&255,t[19]=p>>>24&255,t[20]=f>>>0&255,t[21]=f>>>8&255,t[22]=f>>>16&255,t[23]=f>>>24&255,t[24]=l>>>0&255,t[25]=l>>>8&255,t[26]=l>>>16&255,t[27]=l>>>24&255,t[28]=d>>>0&255,t[29]=d>>>8&255,t[30]=d>>>16&255,t[31]=d>>>24&255}(t,e,n,r)}var w=new Uint8Array([101,120,112,97,110,100,32,51,50,45,98,121,116,101,32,107]);function _(t,e,n,r,o,i,s){var c,a,u=new Uint8Array(16),h=new Uint8Array(64);for(a=0;a<16;a++)u[a]=0;for(a=0;a<8;a++)u[a]=i[a];for(;o>=64;){for(b(h,u,s,w),a=0;a<64;a++)t[e+a]=n[r+a]^h[a];for(c=1,a=8;a<16;a++)c=c+(255&u[a])|0,u[a]=255&c,c>>>=8;o-=64,e+=64,r+=64}if(o>0)for(b(h,u,s,w),a=0;a<o;a++)t[e+a]=n[r+a]^h[a];return 0}function S(t,e,n,r,o){var i,s,c=new Uint8Array(16),a=new Uint8Array(64);for(s=0;s<16;s++)c[s]=0;for(s=0;s<8;s++)c[s]=r[s];for(;n>=64;){for(b(a,c,o,w),s=0;s<64;s++)t[e+s]=a[s];for(i=1,s=8;s<16;s++)i=i+(255&c[s])|0,c[s]=255&i,i>>>=8;n-=64,e+=64}if(n>0)for(b(a,c,o,w),s=0;s<n;s++)t[e+s]=a[s];return 0}function k(t,e,n,r,o){var i=new Uint8Array(32);m(i,r,o,w);for(var s=new Uint8Array(8),c=0;c<8;c++)s[c]=r[c+16];return S(t,e,n,s,i)}function T(t,e,n,r,o,i,s){var c=new Uint8Array(32);m(c,i,s,w);for(var a=new Uint8Array(8),u=0;u<8;u++)a[u]=i[u+16];return _(t,e,n,r,o,a,c)}var O=function(t){var e,n,r,o,i,s,c,a;this.buffer=new Uint8Array(16),this.r=new Uint16Array(10),this.h=new Uint16Array(10),this.pad=new Uint16Array(8),this.leftover=0,this.fin=0,e=255&t[0]|(255&t[1])<<8,this.r[0]=8191&e,n=255&t[2]|(255&t[3])<<8,this.r[1]=8191&(e>>>13|n<<3),r=255&t[4]|(255&t[5])<<8,this.r[2]=7939&(n>>>10|r<<6),o=255&t[6]|(255&t[7])<<8,this.r[3]=8191&(r>>>7|o<<9),i=255&t[8]|(255&t[9])<<8,this.r[4]=255&(o>>>4|i<<12),this.r[5]=i>>>1&8190,s=255&t[10]|(255&t[11])<<8,this.r[6]=8191&(i>>>14|s<<2),c=255&t[12]|(255&t[13])<<8,this.r[7]=8065&(s>>>11|c<<5),a=255&t[14]|(255&t[15])<<8,this.r[8]=8191&(c>>>8|a<<8),this.r[9]=a>>>5&127,this.pad[0]=255&t[16]|(255&t[17])<<8,this.pad[1]=255&t[18]|(255&t[19])<<8,this.pad[2]=255&t[20]|(255&t[21])<<8,this.pad[3]=255&t[22]|(255&t[23])<<8,this.pad[4]=255&t[24]|(255&t[25])<<8,this.pad[5]=255&t[26]|(255&t[27])<<8,this.pad[6]=255&t[28]|(255&t[29])<<8,this.pad[7]=255&t[30]|(255&t[31])<<8};function C(t,e,n,r,o,i){var s=new O(i);return s.update(n,r,o),s.finish(t,e),0}function A(t,e,n,r,o,i){var s=new Uint8Array(16);return C(s,0,n,r,o,i),v(t,e,s,0)}function E(t,e,n,r,o){var i;if(n<32)return-1;for(T(t,0,e,0,n,r,o),C(t,16,t,32,n-32,t),i=0;i<16;i++)t[i]=0;return 0}function P(t,e,n,r,o){var i,s=new Uint8Array(32);if(n<32)return-1;if(k(s,0,32,r,o),0!==A(e,16,e,32,n-32,s))return-1;for(T(t,0,e,0,n,r,o),i=0;i<32;i++)t[i]=0;return 0}function x(t,e){var n;for(n=0;n<16;n++)t[n]=0|e[n]}function L(t){var e,n,r=1;for(e=0;e<16;e++)n=t[e]+r+65535,r=Math.floor(n/65536),t[e]=n-65536*r;t[0]+=r-1+37*(r-1)}function R(t,e,n){for(var r,o=~(n-1),i=0;i<16;i++)r=o&(t[i]^e[i]),t[i]^=r,e[i]^=r}function U(t,n){var r,o,i,s=e(),c=e();for(r=0;r<16;r++)c[r]=n[r];for(L(c),L(c),L(c),o=0;o<2;o++){for(s[0]=c[0]-65517,r=1;r<15;r++)s[r]=c[r]-65535-(s[r-1]>>16&1),s[r-1]&=65535;s[15]=c[15]-32767-(s[14]>>16&1),i=s[15]>>16&1,s[14]&=65535,R(c,s,1-i)}for(r=0;r<16;r++)t[2*r]=255&c[r],t[2*r+1]=c[r]>>8}function M(t,e){var n=new Uint8Array(32),r=new Uint8Array(32);return U(n,t),U(r,e),g(n,0,r,0)}function j(t){var e=new Uint8Array(32);return U(e,t),1&e[0]}function I(t,e){var n;for(n=0;n<16;n++)t[n]=e[2*n]+(e[2*n+1]<<8);t[15]&=32767}function N(t,e,n){for(var r=0;r<16;r++)t[r]=e[r]+n[r]}function B(t,e,n){for(var r=0;r<16;r++)t[r]=e[r]-n[r]}function D(t,e,n){var r,o,i=0,s=0,c=0,a=0,u=0,h=0,p=0,f=0,l=0,d=0,y=0,v=0,g=0,b=0,m=0,w=0,_=0,S=0,k=0,T=0,O=0,C=0,A=0,E=0,P=0,x=0,L=0,R=0,U=0,M=0,j=0,I=n[0],N=n[1],B=n[2],D=n[3],z=n[4],H=n[5],q=n[6],F=n[7],X=n[8],J=n[9],Y=n[10],K=n[11],W=n[12],G=n[13],Z=n[14],V=n[15];i+=(r=e[0])*I,s+=r*N,c+=r*B,a+=r*D,u+=r*z,h+=r*H,p+=r*q,f+=r*F,l+=r*X,d+=r*J,y+=r*Y,v+=r*K,g+=r*W,b+=r*G,m+=r*Z,w+=r*V,s+=(r=e[1])*I,c+=r*N,a+=r*B,u+=r*D,h+=r*z,p+=r*H,f+=r*q,l+=r*F,d+=r*X,y+=r*J,v+=r*Y,g+=r*K,b+=r*W,m+=r*G,w+=r*Z,_+=r*V,c+=(r=e[2])*I,a+=r*N,u+=r*B,h+=r*D,p+=r*z,f+=r*H,l+=r*q,d+=r*F,y+=r*X,v+=r*J,g+=r*Y,b+=r*K,m+=r*W,w+=r*G,_+=r*Z,S+=r*V,a+=(r=e[3])*I,u+=r*N,h+=r*B,p+=r*D,f+=r*z,l+=r*H,d+=r*q,y+=r*F,v+=r*X,g+=r*J,b+=r*Y,m+=r*K,w+=r*W,_+=r*G,S+=r*Z,k+=r*V,u+=(r=e[4])*I,h+=r*N,p+=r*B,f+=r*D,l+=r*z,d+=r*H,y+=r*q,v+=r*F,g+=r*X,b+=r*J,m+=r*Y,w+=r*K,_+=r*W,S+=r*G,k+=r*Z,T+=r*V,h+=(r=e[5])*I,p+=r*N,f+=r*B,l+=r*D,d+=r*z,y+=r*H,v+=r*q,g+=r*F,b+=r*X,m+=r*J,w+=r*Y,_+=r*K,S+=r*W,k+=r*G,T+=r*Z,O+=r*V,p+=(r=e[6])*I,f+=r*N,l+=r*B,d+=r*D,y+=r*z,v+=r*H,g+=r*q,b+=r*F,m+=r*X,w+=r*J,_+=r*Y,S+=r*K,k+=r*W,T+=r*G,O+=r*Z,C+=r*V,f+=(r=e[7])*I,l+=r*N,d+=r*B,y+=r*D,v+=r*z,g+=r*H,b+=r*q,m+=r*F,w+=r*X,_+=r*J,S+=r*Y,k+=r*K,T+=r*W,O+=r*G,C+=r*Z,A+=r*V,l+=(r=e[8])*I,d+=r*N,y+=r*B,v+=r*D,g+=r*z,b+=r*H,m+=r*q,w+=r*F,_+=r*X,S+=r*J,k+=r*Y,T+=r*K,O+=r*W,C+=r*G,A+=r*Z,E+=r*V,d+=(r=e[9])*I,y+=r*N,v+=r*B,g+=r*D,b+=r*z,m+=r*H,w+=r*q,_+=r*F,S+=r*X,k+=r*J,T+=r*Y,O+=r*K,C+=r*W,A+=r*G,E+=r*Z,P+=r*V,y+=(r=e[10])*I,v+=r*N,g+=r*B,b+=r*D,m+=r*z,w+=r*H,_+=r*q,S+=r*F,k+=r*X,T+=r*J,O+=r*Y,C+=r*K,A+=r*W,E+=r*G,P+=r*Z,x+=r*V,v+=(r=e[11])*I,g+=r*N,b+=r*B,m+=r*D,w+=r*z,_+=r*H,S+=r*q,k+=r*F,T+=r*X,O+=r*J,C+=r*Y,A+=r*K,E+=r*W,P+=r*G,x+=r*Z,L+=r*V,g+=(r=e[12])*I,b+=r*N,m+=r*B,w+=r*D,_+=r*z,S+=r*H,k+=r*q,T+=r*F,O+=r*X,C+=r*J,A+=r*Y,E+=r*K,P+=r*W,x+=r*G,L+=r*Z,R+=r*V,b+=(r=e[13])*I,m+=r*N,w+=r*B,_+=r*D,S+=r*z,k+=r*H,T+=r*q,O+=r*F,C+=r*X,A+=r*J,E+=r*Y,P+=r*K,x+=r*W,L+=r*G,R+=r*Z,U+=r*V,m+=(r=e[14])*I,w+=r*N,_+=r*B,S+=r*D,k+=r*z,T+=r*H,O+=r*q,C+=r*F,A+=r*X,E+=r*J,P+=r*Y,x+=r*K,L+=r*W,R+=r*G,U+=r*Z,M+=r*V,w+=(r=e[15])*I,s+=38*(S+=r*B),c+=38*(k+=r*D),a+=38*(T+=r*z),u+=38*(O+=r*H),h+=38*(C+=r*q),p+=38*(A+=r*F),f+=38*(E+=r*X),l+=38*(P+=r*J),d+=38*(x+=r*Y),y+=38*(L+=r*K),v+=38*(R+=r*W),g+=38*(U+=r*G),b+=38*(M+=r*Z),m+=38*(j+=r*V),i=(r=(i+=38*(_+=r*N))+(o=1)+65535)-65536*(o=Math.floor(r/65536)),s=(r=s+o+65535)-65536*(o=Math.floor(r/65536)),c=(r=c+o+65535)-65536*(o=Math.floor(r/65536)),a=(r=a+o+65535)-65536*(o=Math.floor(r/65536)),u=(r=u+o+65535)-65536*(o=Math.floor(r/65536)),h=(r=h+o+65535)-65536*(o=Math.floor(r/65536)),p=(r=p+o+65535)-65536*(o=Math.floor(r/65536)),f=(r=f+o+65535)-65536*(o=Math.floor(r/65536)),l=(r=l+o+65535)-65536*(o=Math.floor(r/65536)),d=(r=d+o+65535)-65536*(o=Math.floor(r/65536)),y=(r=y+o+65535)-65536*(o=Math.floor(r/65536)),v=(r=v+o+65535)-65536*(o=Math.floor(r/65536)),g=(r=g+o+65535)-65536*(o=Math.floor(r/65536)),b=(r=b+o+65535)-65536*(o=Math.floor(r/65536)),m=(r=m+o+65535)-65536*(o=Math.floor(r/65536)),w=(r=w+o+65535)-65536*(o=Math.floor(r/65536)),i=(r=(i+=o-1+37*(o-1))+(o=1)+65535)-65536*(o=Math.floor(r/65536)),s=(r=s+o+65535)-65536*(o=Math.floor(r/65536)),c=(r=c+o+65535)-65536*(o=Math.floor(r/65536)),a=(r=a+o+65535)-65536*(o=Math.floor(r/65536)),u=(r=u+o+65535)-65536*(o=Math.floor(r/65536)),h=(r=h+o+65535)-65536*(o=Math.floor(r/65536)),p=(r=p+o+65535)-65536*(o=Math.floor(r/65536)),f=(r=f+o+65535)-65536*(o=Math.floor(r/65536)),l=(r=l+o+65535)-65536*(o=Math.floor(r/65536)),d=(r=d+o+65535)-65536*(o=Math.floor(r/65536)),y=(r=y+o+65535)-65536*(o=Math.floor(r/65536)),v=(r=v+o+65535)-65536*(o=Math.floor(r/65536)),g=(r=g+o+65535)-65536*(o=Math.floor(r/65536)),b=(r=b+o+65535)-65536*(o=Math.floor(r/65536)),m=(r=m+o+65535)-65536*(o=Math.floor(r/65536)),w=(r=w+o+65535)-65536*(o=Math.floor(r/65536)),i+=o-1+37*(o-1),t[0]=i,t[1]=s,t[2]=c,t[3]=a,t[4]=u,t[5]=h,t[6]=p,t[7]=f,t[8]=l,t[9]=d,t[10]=y,t[11]=v,t[12]=g,t[13]=b,t[14]=m,t[15]=w}function z(t,e){D(t,e,e)}function H(t,n){var r,o=e();for(r=0;r<16;r++)o[r]=n[r];for(r=253;r>=0;r--)z(o,o),2!==r&&4!==r&&D(o,o,n);for(r=0;r<16;r++)t[r]=o[r]}function q(t,n,r){var o,i,s=new Uint8Array(32),c=new Float64Array(80),u=e(),h=e(),p=e(),f=e(),l=e(),d=e();for(i=0;i<31;i++)s[i]=n[i];for(s[31]=127&n[31]|64,s[0]&=248,I(c,r),i=0;i<16;i++)h[i]=c[i],f[i]=u[i]=p[i]=0;for(u[0]=f[0]=1,i=254;i>=0;--i)R(u,h,o=s[i>>>3]>>>(7&i)&1),R(p,f,o),N(l,u,p),B(u,u,p),N(p,h,f),B(h,h,f),z(f,l),z(d,u),D(u,p,u),D(p,h,l),N(l,u,p),B(u,u,p),z(h,u),B(p,f,d),D(u,p,a),N(u,u,f),D(p,p,u),D(u,f,d),D(f,h,c),z(h,l),R(u,h,o),R(p,f,o);for(i=0;i<16;i++)c[i+16]=u[i],c[i+32]=p[i],c[i+48]=h[i],c[i+64]=f[i];var y=c.subarray(32),v=c.subarray(16);return H(y,y),D(v,v,y),U(t,v),0}function F(t,e){return q(t,e,i)}function X(t,e){return r(e,32),F(t,e)}function J(t,e,n){var r=new Uint8Array(32);return q(r,n,e),m(t,o,r,w)}O.prototype.blocks=function(t,e,n){for(var r,o,i,s,c,a,u,h,p,f,l,d,y,v,g,b,m,w,_,S=this.fin?0:2048,k=this.h[0],T=this.h[1],O=this.h[2],C=this.h[3],A=this.h[4],E=this.h[5],P=this.h[6],x=this.h[7],L=this.h[8],R=this.h[9],U=this.r[0],M=this.r[1],j=this.r[2],I=this.r[3],N=this.r[4],B=this.r[5],D=this.r[6],z=this.r[7],H=this.r[8],q=this.r[9];n>=16;)f=p=0,f+=(k+=8191&(r=255&t[e+0]|(255&t[e+1])<<8))*U,f+=(T+=8191&(r>>>13|(o=255&t[e+2]|(255&t[e+3])<<8)<<3))*(5*q),f+=(O+=8191&(o>>>10|(i=255&t[e+4]|(255&t[e+5])<<8)<<6))*(5*H),f+=(C+=8191&(i>>>7|(s=255&t[e+6]|(255&t[e+7])<<8)<<9))*(5*z),p=(f+=(A+=8191&(s>>>4|(c=255&t[e+8]|(255&t[e+9])<<8)<<12))*(5*D))>>>13,f&=8191,f+=(E+=c>>>1&8191)*(5*B),f+=(P+=8191&(c>>>14|(a=255&t[e+10]|(255&t[e+11])<<8)<<2))*(5*N),f+=(x+=8191&(a>>>11|(u=255&t[e+12]|(255&t[e+13])<<8)<<5))*(5*I),f+=(L+=8191&(u>>>8|(h=255&t[e+14]|(255&t[e+15])<<8)<<8))*(5*j),l=p+=(f+=(R+=h>>>5|S)*(5*M))>>>13,l+=k*M,l+=T*U,l+=O*(5*q),l+=C*(5*H),p=(l+=A*(5*z))>>>13,l&=8191,l+=E*(5*D),l+=P*(5*B),l+=x*(5*N),l+=L*(5*I),p+=(l+=R*(5*j))>>>13,l&=8191,d=p,d+=k*j,d+=T*M,d+=O*U,d+=C*(5*q),p=(d+=A*(5*H))>>>13,d&=8191,d+=E*(5*z),d+=P*(5*D),d+=x*(5*B),d+=L*(5*N),y=p+=(d+=R*(5*I))>>>13,y+=k*I,y+=T*j,y+=O*M,y+=C*U,p=(y+=A*(5*q))>>>13,y&=8191,y+=E*(5*H),y+=P*(5*z),y+=x*(5*D),y+=L*(5*B),v=p+=(y+=R*(5*N))>>>13,v+=k*N,v+=T*I,v+=O*j,v+=C*M,p=(v+=A*U)>>>13,v&=8191,v+=E*(5*q),v+=P*(5*H),v+=x*(5*z),v+=L*(5*D),g=p+=(v+=R*(5*B))>>>13,g+=k*B,g+=T*N,g+=O*I,g+=C*j,p=(g+=A*M)>>>13,g&=8191,g+=E*U,g+=P*(5*q),g+=x*(5*H),g+=L*(5*z),b=p+=(g+=R*(5*D))>>>13,b+=k*D,b+=T*B,b+=O*N,b+=C*I,p=(b+=A*j)>>>13,b&=8191,b+=E*M,b+=P*U,b+=x*(5*q),b+=L*(5*H),m=p+=(b+=R*(5*z))>>>13,m+=k*z,m+=T*D,m+=O*B,m+=C*N,p=(m+=A*I)>>>13,m&=8191,m+=E*j,m+=P*M,m+=x*U,m+=L*(5*q),w=p+=(m+=R*(5*H))>>>13,w+=k*H,w+=T*z,w+=O*D,w+=C*B,p=(w+=A*N)>>>13,w&=8191,w+=E*I,w+=P*j,w+=x*M,w+=L*U,_=p+=(w+=R*(5*q))>>>13,_+=k*q,_+=T*H,_+=O*z,_+=C*D,p=(_+=A*B)>>>13,_&=8191,_+=E*N,_+=P*I,_+=x*j,_+=L*M,k=f=8191&(p=(p=((p+=(_+=R*U)>>>13)<<2)+p|0)+(f&=8191)|0),T=l+=p>>>=13,O=d&=8191,C=y&=8191,A=v&=8191,E=g&=8191,P=b&=8191,x=m&=8191,L=w&=8191,R=_&=8191,e+=16,n-=16;this.h[0]=k,this.h[1]=T,this.h[2]=O,this.h[3]=C,this.h[4]=A,this.h[5]=E,this.h[6]=P,this.h[7]=x,this.h[8]=L,this.h[9]=R},O.prototype.finish=function(t,e){var n,r,o,i,s=new Uint16Array(10);if(this.leftover){for(i=this.leftover,this.buffer[i++]=1;i<16;i++)this.buffer[i]=0;this.fin=1,this.blocks(this.buffer,0,16)}for(n=this.h[1]>>>13,this.h[1]&=8191,i=2;i<10;i++)this.h[i]+=n,n=this.h[i]>>>13,this.h[i]&=8191;for(this.h[0]+=5*n,n=this.h[0]>>>13,this.h[0]&=8191,this.h[1]+=n,n=this.h[1]>>>13,this.h[1]&=8191,this.h[2]+=n,s[0]=this.h[0]+5,n=s[0]>>>13,s[0]&=8191,i=1;i<10;i++)s[i]=this.h[i]+n,n=s[i]>>>13,s[i]&=8191;for(s[9]-=8192,r=(1^n)-1,i=0;i<10;i++)s[i]&=r;for(r=~r,i=0;i<10;i++)this.h[i]=this.h[i]&r|s[i];for(this.h[0]=65535&(this.h[0]|this.h[1]<<13),this.h[1]=65535&(this.h[1]>>>3|this.h[2]<<10),this.h[2]=65535&(this.h[2]>>>6|this.h[3]<<7),this.h[3]=65535&(this.h[3]>>>9|this.h[4]<<4),this.h[4]=65535&(this.h[4]>>>12|this.h[5]<<1|this.h[6]<<14),this.h[5]=65535&(this.h[6]>>>2|this.h[7]<<11),this.h[6]=65535&(this.h[7]>>>5|this.h[8]<<8),this.h[7]=65535&(this.h[8]>>>8|this.h[9]<<5),o=this.h[0]+this.pad[0],this.h[0]=65535&o,i=1;i<8;i++)o=(this.h[i]+this.pad[i]|0)+(o>>>16)|0,this.h[i]=65535&o;t[e+0]=this.h[0]>>>0&255,t[e+1]=this.h[0]>>>8&255,t[e+2]=this.h[1]>>>0&255,t[e+3]=this.h[1]>>>8&255,t[e+4]=this.h[2]>>>0&255,t[e+5]=this.h[2]>>>8&255,t[e+6]=this.h[3]>>>0&255,t[e+7]=this.h[3]>>>8&255,t[e+8]=this.h[4]>>>0&255,t[e+9]=this.h[4]>>>8&255,t[e+10]=this.h[5]>>>0&255,t[e+11]=this.h[5]>>>8&255,t[e+12]=this.h[6]>>>0&255,t[e+13]=this.h[6]>>>8&255,t[e+14]=this.h[7]>>>0&255,t[e+15]=this.h[7]>>>8&255},O.prototype.update=function(t,e,n){var r,o;if(this.leftover){for((o=16-this.leftover)>n&&(o=n),r=0;r<o;r++)this.buffer[this.leftover+r]=t[e+r];if(n-=o,e+=o,this.leftover+=o,this.leftover<16)return;this.blocks(this.buffer,0,16),this.leftover=0}if(n>=16&&(o=n-n%16,this.blocks(t,e,o),e+=o,n-=o),n){for(r=0;r<n;r++)this.buffer[this.leftover+r]=t[e+r];this.leftover+=n}};var Y=E,K=P;var W=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591];function G(t,e,n,r){for(var o,i,s,c,a,u,h,p,f,l,d,y,v,g,b,m,w,_,S,k,T,O,C,A,E,P,x=new Int32Array(16),L=new Int32Array(16),R=t[0],U=t[1],M=t[2],j=t[3],I=t[4],N=t[5],B=t[6],D=t[7],z=e[0],H=e[1],q=e[2],F=e[3],X=e[4],J=e[5],Y=e[6],K=e[7],G=0;r>=128;){for(S=0;S<16;S++)k=8*S+G,x[S]=n[k+0]<<24|n[k+1]<<16|n[k+2]<<8|n[k+3],L[S]=n[k+4]<<24|n[k+5]<<16|n[k+6]<<8|n[k+7];for(S=0;S<80;S++)if(o=R,i=U,s=M,c=j,a=I,u=N,h=B,D,f=z,l=H,d=q,y=F,v=X,g=J,b=Y,K,C=65535&(O=K),A=O>>>16,E=65535&(T=D),P=T>>>16,C+=65535&(O=(X>>>14|I<<18)^(X>>>18|I<<14)^(I>>>9|X<<23)),A+=O>>>16,E+=65535&(T=(I>>>14|X<<18)^(I>>>18|X<<14)^(X>>>9|I<<23)),P+=T>>>16,C+=65535&(O=X&J^~X&Y),A+=O>>>16,E+=65535&(T=I&N^~I&B),P+=T>>>16,T=W[2*S],C+=65535&(O=W[2*S+1]),A+=O>>>16,E+=65535&T,P+=T>>>16,T=x[S%16],A+=(O=L[S%16])>>>16,E+=65535&T,P+=T>>>16,E+=(A+=(C+=65535&O)>>>16)>>>16,C=65535&(O=_=65535&C|A<<16),A=O>>>16,E=65535&(T=w=65535&E|(P+=E>>>16)<<16),P=T>>>16,C+=65535&(O=(z>>>28|R<<4)^(R>>>2|z<<30)^(R>>>7|z<<25)),A+=O>>>16,E+=65535&(T=(R>>>28|z<<4)^(z>>>2|R<<30)^(z>>>7|R<<25)),P+=T>>>16,A+=(O=z&H^z&q^H&q)>>>16,E+=65535&(T=R&U^R&M^U&M),P+=T>>>16,p=65535&(E+=(A+=(C+=65535&O)>>>16)>>>16)|(P+=E>>>16)<<16,m=65535&C|A<<16,C=65535&(O=y),A=O>>>16,E=65535&(T=c),P=T>>>16,A+=(O=_)>>>16,E+=65535&(T=w),P+=T>>>16,U=o,M=i,j=s,I=c=65535&(E+=(A+=(C+=65535&O)>>>16)>>>16)|(P+=E>>>16)<<16,N=a,B=u,D=h,R=p,H=f,q=l,F=d,X=y=65535&C|A<<16,J=v,Y=g,K=b,z=m,S%16==15)for(k=0;k<16;k++)T=x[k],C=65535&(O=L[k]),A=O>>>16,E=65535&T,P=T>>>16,T=x[(k+9)%16],C+=65535&(O=L[(k+9)%16]),A+=O>>>16,E+=65535&T,P+=T>>>16,w=x[(k+1)%16],C+=65535&(O=((_=L[(k+1)%16])>>>1|w<<31)^(_>>>8|w<<24)^(_>>>7|w<<25)),A+=O>>>16,E+=65535&(T=(w>>>1|_<<31)^(w>>>8|_<<24)^w>>>7),P+=T>>>16,w=x[(k+14)%16],A+=(O=((_=L[(k+14)%16])>>>19|w<<13)^(w>>>29|_<<3)^(_>>>6|w<<26))>>>16,E+=65535&(T=(w>>>19|_<<13)^(_>>>29|w<<3)^w>>>6),P+=T>>>16,P+=(E+=(A+=(C+=65535&O)>>>16)>>>16)>>>16,x[k]=65535&E|P<<16,L[k]=65535&C|A<<16;C=65535&(O=z),A=O>>>16,E=65535&(T=R),P=T>>>16,T=t[0],A+=(O=e[0])>>>16,E+=65535&T,P+=T>>>16,P+=(E+=(A+=(C+=65535&O)>>>16)>>>16)>>>16,t[0]=R=65535&E|P<<16,e[0]=z=65535&C|A<<16,C=65535&(O=H),A=O>>>16,E=65535&(T=U),P=T>>>16,T=t[1],A+=(O=e[1])>>>16,E+=65535&T,P+=T>>>16,P+=(E+=(A+=(C+=65535&O)>>>16)>>>16)>>>16,t[1]=U=65535&E|P<<16,e[1]=H=65535&C|A<<16,C=65535&(O=q),A=O>>>16,E=65535&(T=M),P=T>>>16,T=t[2],A+=(O=e[2])>>>16,E+=65535&T,P+=T>>>16,P+=(E+=(A+=(C+=65535&O)>>>16)>>>16)>>>16,t[2]=M=65535&E|P<<16,e[2]=q=65535&C|A<<16,C=65535&(O=F),A=O>>>16,E=65535&(T=j),P=T>>>16,T=t[3],A+=(O=e[3])>>>16,E+=65535&T,P+=T>>>16,P+=(E+=(A+=(C+=65535&O)>>>16)>>>16)>>>16,t[3]=j=65535&E|P<<16,e[3]=F=65535&C|A<<16,C=65535&(O=X),A=O>>>16,E=65535&(T=I),P=T>>>16,T=t[4],A+=(O=e[4])>>>16,E+=65535&T,P+=T>>>16,P+=(E+=(A+=(C+=65535&O)>>>16)>>>16)>>>16,t[4]=I=65535&E|P<<16,e[4]=X=65535&C|A<<16,C=65535&(O=J),A=O>>>16,E=65535&(T=N),P=T>>>16,T=t[5],A+=(O=e[5])>>>16,E+=65535&T,P+=T>>>16,P+=(E+=(A+=(C+=65535&O)>>>16)>>>16)>>>16,t[5]=N=65535&E|P<<16,e[5]=J=65535&C|A<<16,C=65535&(O=Y),A=O>>>16,E=65535&(T=B),P=T>>>16,T=t[6],A+=(O=e[6])>>>16,E+=65535&T,P+=T>>>16,P+=(E+=(A+=(C+=65535&O)>>>16)>>>16)>>>16,t[6]=B=65535&E|P<<16,e[6]=Y=65535&C|A<<16,C=65535&(O=K),A=O>>>16,E=65535&(T=D),P=T>>>16,T=t[7],A+=(O=e[7])>>>16,E+=65535&T,P+=T>>>16,P+=(E+=(A+=(C+=65535&O)>>>16)>>>16)>>>16,t[7]=D=65535&E|P<<16,e[7]=K=65535&C|A<<16,G+=128,r-=128}return r}function Z(t,e,n){var r,o=new Int32Array(8),i=new Int32Array(8),s=new Uint8Array(256),c=n;for(o[0]=1779033703,o[1]=3144134277,o[2]=1013904242,o[3]=2773480762,o[4]=1359893119,o[5]=2600822924,o[6]=528734635,o[7]=1541459225,i[0]=4089235720,i[1]=2227873595,i[2]=4271175723,i[3]=1595750129,i[4]=2917565137,i[5]=725511199,i[6]=4215389547,i[7]=327033209,G(o,i,e,n),n%=128,r=0;r<n;r++)s[r]=e[c-n+r];for(s[n]=128,s[(n=256-128*(n<112?1:0))-9]=0,d(s,n-8,c/536870912|0,c<<3),G(o,i,s,n),r=0;r<8;r++)d(t,8*r,o[r],i[r]);return 0}function V(t,n){var r=e(),o=e(),i=e(),s=e(),c=e(),a=e(),u=e(),p=e(),f=e();B(r,t[1],t[0]),B(f,n[1],n[0]),D(r,r,f),N(o,t[0],t[1]),N(f,n[0],n[1]),D(o,o,f),D(i,t[3],n[3]),D(i,i,h),D(s,t[2],n[2]),N(s,s,s),B(c,o,r),B(a,s,i),N(u,s,i),N(p,o,r),D(t[0],c,a),D(t[1],p,u),D(t[2],u,a),D(t[3],c,p)}function Q(t,e,n){var r;for(r=0;r<4;r++)R(t[r],e[r],n)}function $(t,n){var r=e(),o=e(),i=e();H(i,n[2]),D(r,n[0],i),D(o,n[1],i),U(t,o),t[31]^=j(r)<<7}function tt(t,e,n){var r,o;for(x(t[0],s),x(t[1],c),x(t[2],c),x(t[3],s),o=255;o>=0;--o)Q(t,e,r=n[o/8|0]>>(7&o)&1),V(e,t),V(t,t),Q(t,e,r)}function et(t,n){var r=[e(),e(),e(),e()];x(r[0],p),x(r[1],f),x(r[2],c),D(r[3],p,f),tt(t,r,n)}function nt(t,n,o){var i,s=new Uint8Array(64),c=[e(),e(),e(),e()];for(o||r(n,32),Z(s,n,32),s[0]&=248,s[31]&=127,s[31]|=64,et(c,s),$(t,c),i=0;i<32;i++)n[i+32]=t[i];return 0}var rt=new Float64Array([237,211,245,92,26,99,18,88,214,156,247,162,222,249,222,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16]);function ot(t,e){var n,r,o,i;for(r=63;r>=32;--r){for(n=0,o=r-32,i=r-12;o<i;++o)e[o]+=n-16*e[r]*rt[o-(r-32)],n=e[o]+128>>8,e[o]-=256*n;e[o]+=n,e[r]=0}for(n=0,o=0;o<32;o++)e[o]+=n-(e[31]>>4)*rt[o],n=e[o]>>8,e[o]&=255;for(o=0;o<32;o++)e[o]-=n*rt[o];for(r=0;r<32;r++)e[r+1]+=e[r]>>8,t[r]=255&e[r]}function it(t){var e,n=new Float64Array(64);for(e=0;e<64;e++)n[e]=t[e];for(e=0;e<64;e++)t[e]=0;ot(t,n)}function st(t,n,r,o){var i,s,c=new Uint8Array(64),a=new Uint8Array(64),u=new Uint8Array(64),h=new Float64Array(64),p=[e(),e(),e(),e()];Z(c,o,32),c[0]&=248,c[31]&=127,c[31]|=64;var f=r+64;for(i=0;i<r;i++)t[64+i]=n[i];for(i=0;i<32;i++)t[32+i]=c[32+i];for(Z(u,t.subarray(32),r+32),it(u),et(p,u),$(t,p),i=32;i<64;i++)t[i]=o[i];for(Z(a,t,r+64),it(a),i=0;i<64;i++)h[i]=0;for(i=0;i<32;i++)h[i]=u[i];for(i=0;i<32;i++)for(s=0;s<32;s++)h[i+s]+=a[i]*c[s];return ot(t.subarray(32),h),f}function ct(t,n){var r=e(),o=e(),i=e(),a=e(),h=e(),p=e(),f=e();return x(t[2],c),I(t[1],n),z(i,t[1]),D(a,i,u),B(i,i,t[2]),N(a,t[2],a),z(h,a),z(p,h),D(f,p,h),D(r,f,i),D(r,r,a),function(t,n){var r,o=e();for(r=0;r<16;r++)o[r]=n[r];for(r=250;r>=0;r--)z(o,o),1!==r&&D(o,o,n);for(r=0;r<16;r++)t[r]=o[r]}(r,r),D(r,r,i),D(r,r,a),D(r,r,a),D(t[0],r,a),z(o,t[0]),D(o,o,a),M(o,i)&&D(t[0],t[0],l),z(o,t[0]),D(o,o,a),M(o,i)?-1:(j(t[0])===n[31]>>7&&B(t[0],s,t[0]),D(t[3],t[0],t[1]),0)}function at(t,n,r,o){var i,s=new Uint8Array(32),c=new Uint8Array(64),a=[e(),e(),e(),e()],u=[e(),e(),e(),e()];if(-1,r<64)return-1;if(ct(u,o))return-1;for(i=0;i<r;i++)t[i]=n[i];for(i=0;i<32;i++)t[i+32]=o[i];if(Z(c,t,r),it(c),tt(a,u,c),et(u,n.subarray(32)),V(a,u),$(s,a),r-=64,g(n,0,s,0)){for(i=0;i<r;i++)t[i]=0;return-1}for(i=0;i<r;i++)t[i]=n[i+64];return r}var ut=32,ht=24,pt=32,ft=32,lt=ht;function dt(t,e){if(t.length!==ut)throw new Error("bad key size");if(e.length!==ht)throw new Error("bad nonce size")}function yt(){for(var t=0;t<arguments.length;t++)if(!(arguments[t]instanceof Uint8Array))throw new TypeError("unexpected type, use Uint8Array")}function vt(t){for(var e=0;e<t.length;e++)t[e]=0}t.lowlevel={crypto_core_hsalsa20:m,crypto_stream_xor:T,crypto_stream:k,crypto_stream_salsa20_xor:_,crypto_stream_salsa20:S,crypto_onetimeauth:C,crypto_onetimeauth_verify:A,crypto_verify_16:v,crypto_verify_32:g,crypto_secretbox:E,crypto_secretbox_open:P,crypto_scalarmult:q,crypto_scalarmult_base:F,crypto_box_beforenm:J,crypto_box_afternm:Y,crypto_box:function(t,e,n,r,o,i){var s=new Uint8Array(32);return J(s,o,i),Y(t,e,n,r,s)},crypto_box_open:function(t,e,n,r,o,i){var s=new Uint8Array(32);return J(s,o,i),K(t,e,n,r,s)},crypto_box_keypair:X,crypto_hash:Z,crypto_sign:st,crypto_sign_keypair:nt,crypto_sign_open:at,crypto_secretbox_KEYBYTES:ut,crypto_secretbox_NONCEBYTES:ht,crypto_secretbox_ZEROBYTES:32,crypto_secretbox_BOXZEROBYTES:16,crypto_scalarmult_BYTES:32,crypto_scalarmult_SCALARBYTES:32,crypto_box_PUBLICKEYBYTES:pt,crypto_box_SECRETKEYBYTES:ft,crypto_box_BEFORENMBYTES:32,crypto_box_NONCEBYTES:lt,crypto_box_ZEROBYTES:32,crypto_box_BOXZEROBYTES:16,crypto_sign_BYTES:64,crypto_sign_PUBLICKEYBYTES:32,crypto_sign_SECRETKEYBYTES:64,crypto_sign_SEEDBYTES:32,crypto_hash_BYTES:64},t.randomBytes=function(t){var e=new Uint8Array(t);return r(e,t),e},t.secretbox=function(t,e,n){yt(t,e,n),dt(n,e);for(var r=new Uint8Array(32+t.length),o=new Uint8Array(r.length),i=0;i<t.length;i++)r[i+32]=t[i];return E(o,r,r.length,e,n),o.subarray(16)},t.secretbox.open=function(t,e,n){yt(t,e,n),dt(n,e);for(var r=new Uint8Array(16+t.length),o=new Uint8Array(r.length),i=0;i<t.length;i++)r[i+16]=t[i];return r.length<32?null:0!==P(o,r,r.length,e,n)?null:o.subarray(32)},t.secretbox.keyLength=ut,t.secretbox.nonceLength=ht,t.secretbox.overheadLength=16,t.scalarMult=function(t,e){if(yt(t,e),32!==t.length)throw new Error("bad n size");if(32!==e.length)throw new Error("bad p size");var n=new Uint8Array(32);return q(n,t,e),n},t.scalarMult.base=function(t){if(yt(t),32!==t.length)throw new Error("bad n size");var e=new Uint8Array(32);return F(e,t),e},t.scalarMult.scalarLength=32,t.scalarMult.groupElementLength=32,t.box=function(e,n,r,o){var i=t.box.before(r,o);return t.secretbox(e,n,i)},t.box.before=function(t,e){yt(t,e),function(t,e){if(t.length!==pt)throw new Error("bad public key size");if(e.length!==ft)throw new Error("bad secret key size")}(t,e);var n=new Uint8Array(32);return J(n,t,e),n},t.box.after=t.secretbox,t.box.open=function(e,n,r,o){var i=t.box.before(r,o);return t.secretbox.open(e,n,i)},t.box.open.after=t.secretbox.open,t.box.keyPair=function(){var t=new Uint8Array(pt),e=new Uint8Array(ft);return X(t,e),{publicKey:t,secretKey:e}},t.box.keyPair.fromSecretKey=function(t){if(yt(t),t.length!==ft)throw new Error("bad secret key size");var e=new Uint8Array(pt);return F(e,t),{publicKey:e,secretKey:new Uint8Array(t)}},t.box.publicKeyLength=pt,t.box.secretKeyLength=ft,t.box.sharedKeyLength=32,t.box.nonceLength=lt,t.box.overheadLength=t.secretbox.overheadLength,t.sign=function(t,e){if(yt(t,e),64!==e.length)throw new Error("bad secret key size");var n=new Uint8Array(64+t.length);return st(n,t,t.length,e),n},t.sign.open=function(t,e){if(yt(t,e),32!==e.length)throw new Error("bad public key size");var n=new Uint8Array(t.length),r=at(n,t,t.length,e);if(r<0)return null;for(var o=new Uint8Array(r),i=0;i<o.length;i++)o[i]=n[i];return o},t.sign.detached=function(e,n){for(var r=t.sign(e,n),o=new Uint8Array(64),i=0;i<o.length;i++)o[i]=r[i];return o},t.sign.detached.verify=function(t,e,n){if(yt(t,e,n),64!==e.length)throw new Error("bad signature size");if(32!==n.length)throw new Error("bad public key size");var r,o=new Uint8Array(64+t.length),i=new Uint8Array(64+t.length);for(r=0;r<64;r++)o[r]=e[r];for(r=0;r<t.length;r++)o[r+64]=t[r];return at(i,o,o.length,n)>=0},t.sign.keyPair=function(){var t=new Uint8Array(32),e=new Uint8Array(64);return nt(t,e),{publicKey:t,secretKey:e}},t.sign.keyPair.fromSecretKey=function(t){if(yt(t),64!==t.length)throw new Error("bad secret key size");for(var e=new Uint8Array(32),n=0;n<e.length;n++)e[n]=t[32+n];return{publicKey:e,secretKey:new Uint8Array(t)}},t.sign.keyPair.fromSeed=function(t){if(yt(t),32!==t.length)throw new Error("bad seed size");for(var e=new Uint8Array(32),n=new Uint8Array(64),r=0;r<32;r++)n[r]=t[r];return nt(e,n,!0),{publicKey:e,secretKey:n}},t.sign.publicKeyLength=32,t.sign.secretKeyLength=64,t.sign.seedLength=32,t.sign.signatureLength=64,t.hash=function(t){yt(t);var e=new Uint8Array(64);return Z(e,t,t.length),e},t.hash.hashLength=64,t.verify=function(t,e){return yt(t,e),0!==t.length&&0!==e.length&&(t.length===e.length&&0===y(t,0,e,0,t.length))},t.setPRNG=function(t){r=t},function(){var e="undefined"!=typeof self?self.crypto||self.msCrypto:null;if(e&&e.getRandomValues){t.setPRNG((function(t,n){var r,o=new Uint8Array(n);for(r=0;r<n;r+=65536)e.getRandomValues(o.subarray(r,r+Math.min(n-r,65536)));for(r=0;r<n;r++)t[r]=o[r];vt(o)}))}else(e=n(3))&&e.randomBytes&&t.setPRNG((function(t,n){var r,o=e.randomBytes(n);for(r=0;r<n;r++)t[r]=o[r];vt(o)}))}()}(t.exports?t.exports:self.nacl=self.nacl||{})},function(t,e,n){!function(e,n){"use strict";t.exports?t.exports=n():e.nacl?e.nacl.util=n():(e.nacl={},e.nacl.util=n())}(this,(function(){"use strict";var t={};function e(t){if(!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(t))throw new TypeError("invalid encoding")}return t.decodeUTF8=function(t){if("string"!=typeof t)throw new TypeError("expected string");var e,n=unescape(encodeURIComponent(t)),r=new Uint8Array(n.length);for(e=0;e<n.length;e++)r[e]=n.charCodeAt(e);return r},t.encodeUTF8=function(t){var e,n=[];for(e=0;e<t.length;e++)n.push(String.fromCharCode(t[e]));return decodeURIComponent(escape(n.join("")))},"undefined"==typeof atob?void 0!==Buffer.from?(t.encodeBase64=function(t){return Buffer.from(t).toString("base64")},t.decodeBase64=function(t){return e(t),new Uint8Array(Array.prototype.slice.call(Buffer.from(t,"base64"),0))}):(t.encodeBase64=function(t){return new Buffer(t).toString("base64")},t.decodeBase64=function(t){return e(t),new Uint8Array(Array.prototype.slice.call(new Buffer(t,"base64"),0))}):(t.encodeBase64=function(t){var e,n=[],r=t.length;for(e=0;e<r;e++)n.push(String.fromCharCode(t[e]));return btoa(n.join(""))},t.decodeBase64=function(t){e(t);var n,r=atob(t),o=new Uint8Array(r.length);for(n=0;n<r.length;n++)o[n]=r.charCodeAt(n);return o}),t}))},function(t,e,n){t.exports=n(4).default},function(t,e){},function(t,e,n){"use strict";n.r(e);var r=function(){function t(t,e){this.lastId=0,this.prefix=t,this.name=e}return t.prototype.create=function(t){this.lastId++;var e=this.lastId,n=this.prefix+e,r=this.name+"["+e+"]",o=!1,i=function(){o||(t.apply(null,arguments),o=!0)};return this[e]=i,{number:e,id:n,name:r,callback:i}},t.prototype.remove=function(t){delete this[t.number]},t}(),o=new r("_pusher_script_","Pusher.ScriptReceivers"),i={VERSION:"5.0.3",PROTOCOL:7,host:"ws.pusherapp.com",ws_port:80,wss_port:443,ws_path:"",sockjs_host:"sockjs.pusher.com",sockjs_http_port:80,sockjs_https_port:443,sockjs_path:"/pusher",stats_host:"stats.pusher.com",channel_auth_endpoint:"/pusher/auth",channel_auth_transport:"ajax",activity_timeout:12e4,pong_timeout:3e4,unavailable_timeout:1e4,cdn_http:"http://js.pusher.com",cdn_https:"https://js.pusher.com",dependency_suffix:""},s=function(){function t(t){this.options=t,this.receivers=t.receivers||o,this.loading={}}return t.prototype.load=function(t,e,n){var r=this;if(r.loading[t]&&r.loading[t].length>0)r.loading[t].push(n);else{r.loading[t]=[n];var o=we.createScriptRequest(r.getPath(t,e)),i=r.receivers.create((function(e){if(r.receivers.remove(i),r.loading[t]){var n=r.loading[t];delete r.loading[t];for(var s=function(t){t||o.cleanup()},c=0;c<n.length;c++)n[c](e,s)}}));o.send(i)}},t.prototype.getRoot=function(t){var e=we.getDocument().location.protocol;return(t&&t.useTLS||"https:"===e?this.options.cdn_https:this.options.cdn_http).replace(/\/*$/,"")+"/"+this.options.version},t.prototype.getPath=function(t,e){return this.getRoot(e)+"/"+t+this.options.suffix+".js"},t}(),c=new r("_pusher_dependencies","Pusher.DependenciesReceivers"),a=new s({cdn_http:i.cdn_http,cdn_https:i.cdn_https,version:i.VERSION,suffix:i.dependency_suffix,receivers:c});for(var u=String.fromCharCode,h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",p={},f=0,l=h.length;f<l;f++)p[h.charAt(f)]=f;var d,y=function(t){var e=t.charCodeAt(0);return e<128?t:e<2048?u(192|e>>>6)+u(128|63&e):u(224|e>>>12&15)+u(128|e>>>6&63)+u(128|63&e)},v=function(t){return t.replace(/[^\x00-\x7F]/g,y)},g=function(t){var e=[0,2,1][t.length%3],n=t.charCodeAt(0)<<16|(t.length>1?t.charCodeAt(1):0)<<8|(t.length>2?t.charCodeAt(2):0);return[h.charAt(n>>>18),h.charAt(n>>>12&63),e>=2?"=":h.charAt(n>>>6&63),e>=1?"=":h.charAt(63&n)].join("")},b=window.btoa||function(t){return t.replace(/[\s\S]{1,3}/g,g)},m=function(){function t(t,e,n,r){var o=this;this.clear=e,this.timer=t((function(){o.timer&&(o.timer=r(o.timer))}),n)}return t.prototype.isRunning=function(){return null!==this.timer},t.prototype.ensureAborted=function(){this.timer&&(this.clear(this.timer),this.timer=null)},t}(),w=(d=function(t,e){return(d=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}d(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});function _(t){window.clearTimeout(t)}function S(t){window.clearInterval(t)}var k=function(t){function e(e,n){return t.call(this,setTimeout,_,e,(function(t){return n(),null}))||this}return w(e,t),e}(m),T=function(t){function e(e,n){return t.call(this,setInterval,S,e,(function(t){return n(),t}))||this}return w(e,t),e}(m),O={now:function(){return Date.now?Date.now():(new Date).valueOf()},defer:function(t){return new k(0,t)},method:function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];var r=Array.prototype.slice.call(arguments,1);return function(e){return e[t].apply(e,r.concat(arguments))}}};function C(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];for(var r=0;r<e.length;r++){var o=e[r];for(var i in o)o[i]&&o[i].constructor&&o[i].constructor===Object?t[i]=C(t[i]||{},o[i]):t[i]=o[i]}return t}function A(){for(var t=["Pusher"],e=0;e<arguments.length;e++)"string"==typeof arguments[e]?t.push(arguments[e]):t.push(B(arguments[e]));return t.join(" : ")}function E(t,e){var n=Array.prototype.indexOf;if(null===t)return-1;if(n&&t.indexOf===n)return t.indexOf(e);for(var r=0,o=t.length;r<o;r++)if(t[r]===e)return r;return-1}function P(t,e){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(t[n],n,t)}function x(t){var e=[];return P(t,(function(t,n){e.push(n)})),e}function L(t,e,n){for(var r=0;r<t.length;r++)e.call(n||window,t[r],r,t)}function R(t,e){for(var n=[],r=0;r<t.length;r++)n.push(e(t[r],r,t,n));return n}function U(t,e){e=e||function(t){return!!t};for(var n=[],r=0;r<t.length;r++)e(t[r],r,t,n)&&n.push(t[r]);return n}function M(t,e){var n={};return P(t,(function(r,o){(e&&e(r,o,t,n)||Boolean(r))&&(n[o]=r)})),n}function j(t,e){for(var n=0;n<t.length;n++)if(e(t[n],n,t))return!0;return!1}function I(t){return e=function(t){return"object"==typeof t&&(t=B(t)),encodeURIComponent((e=t.toString(),b(v(e))));var e},n={},P(t,(function(t,r){n[r]=e(t)})),n;var e,n}function N(t){var e,n,r=M(t,(function(t){return void 0!==t}));return R((e=I(r),n=[],P(e,(function(t,e){n.push([e,t])})),n),O.method("join","=")).join("&")}function B(t){try{return JSON.stringify(t)}catch(r){return JSON.stringify((e=[],n=[],function t(r,o){var i,s,c;switch(typeof r){case"object":if(!r)return null;for(i=0;i<e.length;i+=1)if(e[i]===r)return{$ref:n[i]};if(e.push(r),n.push(o),"[object Array]"===Object.prototype.toString.apply(r))for(c=[],i=0;i<r.length;i+=1)c[i]=t(r[i],o+"["+i+"]");else for(s in c={},r)Object.prototype.hasOwnProperty.call(r,s)&&(c[s]=t(r[s],o+"["+JSON.stringify(s)+"]"));return c;case"number":case"string":case"boolean":return r}}(t,"$")))}var e,n}var D=new(function(){function t(){this.globalLog=function(t){window.console&&window.console.log&&window.console.log(t)}}return t.prototype.debug=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.log(this.globalLog,t)},t.prototype.warn=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.log(this.globalLogWarn,t)},t.prototype.error=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.log(this.globalLogError,t)},t.prototype.globalLogWarn=function(t){window.console&&window.console.warn?window.console.warn(t):this.globalLog(t)},t.prototype.globalLogError=function(t){window.console&&window.console.error?window.console.error(t):this.globalLogWarn(t)},t.prototype.log=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];var r=A.apply(this,arguments);if(Le.log)Le.log(r);else if(Le.logToConsole){var o=t.bind(this);o(r)}},t}()),z={baseUrl:"https://pusher.com",urls:{authenticationEndpoint:{path:"/docs/authenticating_users"},javascriptQuickStart:{path:"/docs/javascript_quick_start"},triggeringClientEvents:{path:"/docs/client_api_guide/client_events#trigger-events"}}},H={buildLogSuffix:function(t){var e,n=z.urls[t];return n?(n.fullUrl?e=n.fullUrl:n.path&&(e=z.baseUrl+n.path),e?"See: "+e:""):""}},q=function(t,e,n){var r,o=this;for(var i in(r=we.createXHR()).open("POST",o.options.authEndpoint,!0),r.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),this.authOptions.headers)r.setRequestHeader(i,this.authOptions.headers[i]);return r.onreadystatechange=function(){if(4===r.readyState)if(200===r.status){var t,e=!1;try{t=JSON.parse(r.responseText),e=!0}catch(t){n(!0,"JSON returned from auth endpoint was invalid, yet status code was 200. Data was: "+r.responseText)}e&&n(!1,t)}else{var i=H.buildLogSuffix("authenticationEndpoint");D.error("Unable to retrieve auth string from auth endpoint - received status "+r.status+" from "+o.options.authEndpoint+". Clients must be authenticated to join private or presence channels. "+i),n(!0,r.status)}},r.send(this.composeQuery(e)),r},F=function(t,e,n){void 0!==this.authOptions.headers&&D.warn("To send headers with the auth request, you must use AJAX, rather than JSONP.");var r=t.nextAuthCallbackID.toString();t.nextAuthCallbackID++;var o=t.getDocument(),i=o.createElement("script");t.auth_callbacks[r]=function(t){n(!1,t)};var s="Pusher.auth_callbacks['"+r+"']";i.src=this.options.authEndpoint+"?callback="+encodeURIComponent(s)+"&"+this.composeQuery(e);var c=o.getElementsByTagName("head")[0]||o.documentElement;c.insertBefore(i,c.firstChild)},X=function(){function t(t){this.src=t}return t.prototype.send=function(t){var e=this,n="Error loading "+e.src;e.script=document.createElement("script"),e.script.id=t.id,e.script.src=e.src,e.script.type="text/javascript",e.script.charset="UTF-8",e.script.addEventListener?(e.script.onerror=function(){t.callback(n)},e.script.onload=function(){t.callback(null)}):e.script.onreadystatechange=function(){"loaded"!==e.script.readyState&&"complete"!==e.script.readyState||t.callback(null)},void 0===e.script.async&&document.attachEvent&&/opera/i.test(navigator.userAgent)?(e.errorScript=document.createElement("script"),e.errorScript.id=t.id+"_error",e.errorScript.text=t.name+"('"+n+"');",e.script.async=e.errorScript.async=!1):e.script.async=!0;var r=document.getElementsByTagName("head")[0];r.insertBefore(e.script,r.firstChild),e.errorScript&&r.insertBefore(e.errorScript,e.script.nextSibling)},t.prototype.cleanup=function(){this.script&&(this.script.onload=this.script.onerror=null,this.script.onreadystatechange=null),this.script&&this.script.parentNode&&this.script.parentNode.removeChild(this.script),this.errorScript&&this.errorScript.parentNode&&this.errorScript.parentNode.removeChild(this.errorScript),this.script=null,this.errorScript=null},t}(),J=function(){function t(t,e){this.url=t,this.data=e}return t.prototype.send=function(t){if(!this.request){var e=N(this.data),n=this.url+"/"+t.number+"?"+e;this.request=we.createScriptRequest(n),this.request.send(t)}},t.prototype.cleanup=function(){this.request&&this.request.cleanup()},t}(),Y={name:"jsonp",getAgent:function(t,e){return function(n,r){var i="http"+(e?"":"")+"://"+(t.host||t.options.host)+t.options.path,s=we.createJSONPRequest(i,n),c=we.ScriptReceivers.create((function(e,n){o.remove(c),s.cleanup(),n&&n.host&&(t.host=n.host),r&&r(e,n)}));s.send(c)}}};function K(t,e,n){return t+(e.useTLS?"":"")+"://"+(e.useTLS?e.hostTLS:e.hostNonTLS)+n}function W(t,e){return"/app/"+t+("?protocol="+i.PROTOCOL+"&client=js&version="+i.VERSION+(e?"&"+e:""))}var G={getInitial:function(t,e){return K("ws",e,(e.httpPath||"")+W(t,"flash=false"))}},Z={getInitial:function(t,e){return K("http",e,(e.httpPath||"/pusher")+W(t))}},V={getInitial:function(t,e){return K("http",e,e.httpPath||"/pusher")},getPath:function(t,e){return W(t)}},Q=function(){function t(){this._callbacks={}}return t.prototype.get=function(t){return this._callbacks[$(t)]},t.prototype.add=function(t,e,n){var r=$(t);this._callbacks[r]=this._callbacks[r]||[],this._callbacks[r].push({fn:e,context:n})},t.prototype.remove=function(t,e,n){if(t||e||n){var r=t?[$(t)]:x(this._callbacks);e||n?this.removeCallback(r,e,n):this.removeAllCallbacks(r)}else this._callbacks={}},t.prototype.removeCallback=function(t,e,n){L(t,(function(t){this._callbacks[t]=U(this._callbacks[t]||[],(function(t){return e&&e!==t.fn||n&&n!==t.context})),0===this._callbacks[t].length&&delete this._callbacks[t]}),this)},t.prototype.removeAllCallbacks=function(t){L(t,(function(t){delete this._callbacks[t]}),this)},t}();function $(t){return"_"+t}var tt=function(){function t(t){this.callbacks=new Q,this.global_callbacks=[],this.failThrough=t}return t.prototype.bind=function(t,e,n){return this.callbacks.add(t,e,n),this},t.prototype.bind_global=function(t){return this.global_callbacks.push(t),this},t.prototype.unbind=function(t,e,n){return this.callbacks.remove(t,e,n),this},t.prototype.unbind_global=function(t){return t?(this.global_callbacks=U(this.global_callbacks||[],(function(e){return e!==t})),this):(this.global_callbacks=[],this)},t.prototype.unbind_all=function(){return this.unbind(),this.unbind_global(),this},t.prototype.emit=function(t,e,n){for(var r=0;r<this.global_callbacks.length;r++)this.global_callbacks[r](t,e);var o=this.callbacks.get(t),i=[];if(n?i.push(e,n):e&&i.push(e),o&&o.length>0)for(r=0;r<o.length;r++)o[r].fn.apply(o[r].context||window,i);else this.failThrough&&this.failThrough(t,e);return this},t}(),et=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),nt=function(t){function e(e,n,r,o,i){var s=t.call(this)||this;return s.initialize=we.transportConnectionInitializer,s.hooks=e,s.name=n,s.priority=r,s.key=o,s.options=i,s.state="new",s.timeline=i.timeline,s.activityTimeout=i.activityTimeout,s.id=s.timeline.generateUniqueID(),s}return et(e,t),e.prototype.handlesActivityChecks=function(){return Boolean(this.hooks.handlesActivityChecks)},e.prototype.supportsPing=function(){return Boolean(this.hooks.supportsPing)},e.prototype.connect=function(){var t=this;if(this.socket||"initialized"!==this.state)return!1;var e=this.hooks.urls.getInitial(this.key,this.options);try{this.socket=this.hooks.getSocket(e,this.options)}catch(e){return O.defer((function(){t.onError(e),t.changeState("closed")})),!1}return this.bindListeners(),D.debug("Connecting",{transport:this.name,url:e}),this.changeState("connecting"),!0},e.prototype.close=function(){return!!this.socket&&(this.socket.close(),!0)},e.prototype.send=function(t){var e=this;return"open"===this.state&&(O.defer((function(){e.socket&&e.socket.send(t)})),!0)},e.prototype.ping=function(){"open"===this.state&&this.supportsPing()&&this.socket.ping()},e.prototype.onOpen=function(){this.hooks.beforeOpen&&this.hooks.beforeOpen(this.socket,this.hooks.urls.getPath(this.key,this.options)),this.changeState("open"),this.socket.onopen=void 0},e.prototype.onError=function(t){this.emit("error",{type:"WebSocketError",error:t}),this.timeline.error(this.buildTimelineMessage({error:t.toString()}))},e.prototype.onClose=function(t){t?this.changeState("closed",{code:t.code,reason:t.reason,wasClean:t.wasClean}):this.changeState("closed"),this.unbindListeners(),this.socket=void 0},e.prototype.onMessage=function(t){this.emit("message",t)},e.prototype.onActivity=function(){this.emit("activity")},e.prototype.bindListeners=function(){var t=this;this.socket.onopen=function(){t.onOpen()},this.socket.onerror=function(e){t.onError(e)},this.socket.onclose=function(e){t.onClose(e)},this.socket.onmessage=function(e){t.onMessage(e)},this.supportsPing()&&(this.socket.onactivity=function(){t.onActivity()})},e.prototype.unbindListeners=function(){this.socket&&(this.socket.onopen=void 0,this.socket.onerror=void 0,this.socket.onclose=void 0,this.socket.onmessage=void 0,this.supportsPing()&&(this.socket.onactivity=void 0))},e.prototype.changeState=function(t,e){this.state=t,this.timeline.info(this.buildTimelineMessage({state:t,params:e})),this.emit(t,e)},e.prototype.buildTimelineMessage=function(t){return C({cid:this.id},t)},e}(tt),rt=function(){function t(t){this.hooks=t}return t.prototype.isSupported=function(t){return this.hooks.isSupported(t)},t.prototype.createConnection=function(t,e,n,r){return new nt(this.hooks,t,e,n,r)},t}(),ot=new rt({urls:G,handlesActivityChecks:!1,supportsPing:!1,isInitialized:function(){return Boolean(we.getWebSocketAPI())},isSupported:function(){return Boolean(we.getWebSocketAPI())},getSocket:function(t){return we.createWebSocket(t)}}),it={urls:Z,handlesActivityChecks:!1,supportsPing:!0,isInitialized:function(){return!0}},st=C({getSocket:function(t){return we.HTTPFactory.createStreamingSocket(t)}},it),ct=C({getSocket:function(t){return we.HTTPFactory.createPollingSocket(t)}},it),at={isSupported:function(){return we.isXHRSupported()}},ut={ws:ot,xhr_streaming:new rt(C({},st,at)),xhr_polling:new rt(C({},ct,at))},ht=new rt({file:"sockjs",urls:V,handlesActivityChecks:!0,supportsPing:!1,isSupported:function(){return!0},isInitialized:function(){return void 0!==window.SockJS},getSocket:function(t,e){return new window.SockJS(t,null,{js_path:a.getPath("sockjs",{useTLS:e.useTLS}),ignore_null_origin:e.ignoreNullOrigin})},beforeOpen:function(t,e){t.send(JSON.stringify({path:e}))}}),pt={isSupported:function(t){return we.isXDRSupported(t.useTLS)}},ft=new rt(C({},st,pt)),lt=new rt(C({},ct,pt));ut.xdr_streaming=ft,ut.xdr_polling=lt,ut.sockjs=ht;var dt=ut,yt=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),vt=new(function(t){function e(){var e=t.call(this)||this,n=e;return void 0!==window.addEventListener&&(window.addEventListener("online",(function(){n.emit("online")}),!1),window.addEventListener("offline",(function(){n.emit("offline")}),!1)),e}return yt(e,t),e.prototype.isOnline=function(){return void 0===window.navigator.onLine||window.navigator.onLine},e}(tt)),gt=function(){function t(t,e,n){this.manager=t,this.transport=e,this.minPingDelay=n.minPingDelay,this.maxPingDelay=n.maxPingDelay,this.pingDelay=void 0}return t.prototype.createConnection=function(t,e,n,r){var o=this;r=C({},r,{activityTimeout:this.pingDelay});var i=this.transport.createConnection(t,e,n,r),s=null,c=function(){i.unbind("open",c),i.bind("closed",a),s=O.now()},a=function(t){if(i.unbind("closed",a),1002===t.code||1003===t.code)o.manager.reportDeath();else if(!t.wasClean&&s){var e=O.now()-s;e<2*o.maxPingDelay&&(o.manager.reportDeath(),o.pingDelay=Math.max(e/2,o.minPingDelay))}};return i.bind("open",c),i},t.prototype.isSupported=function(t){return this.manager.isAlive()&&this.transport.isSupported(t)},t}(),bt={decodeMessage:function(t){try{var e=JSON.parse(t.data),n=e.data;if("string"==typeof n)try{n=JSON.parse(e.data)}catch(t){}var r={event:e.event,channel:e.channel,data:n};return e.user_id&&(r.user_id=e.user_id),r}catch(e){throw{type:"MessageParseError",error:e,data:t.data}}},encodeMessage:function(t){return JSON.stringify(t)},processHandshake:function(t){var e=bt.decodeMessage(t);if("pusher:connection_established"===e.event){if(!e.data.activity_timeout)throw"No activity timeout specified in handshake";return{action:"connected",id:e.data.socket_id,activityTimeout:1e3*e.data.activity_timeout}}if("pusher:error"===e.event)return{action:this.getCloseAction(e.data),error:this.getCloseError(e.data)};throw"Invalid handshake"},getCloseAction:function(t){return t.code<4e3?t.code>=1002&&t.code<=1004?"backoff":null:4e3===t.code?"tls_only":t.code<4100?"refused":t.code<4200?"backoff":t.code<4300?"retry":"refused"},getCloseError:function(t){return 1e3!==t.code&&1001!==t.code?{type:"PusherError",data:{code:t.code,message:t.reason||t.message}}:null}},mt=bt,wt=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),_t=function(t){function e(e,n){var r=t.call(this)||this;return r.id=e,r.transport=n,r.activityTimeout=n.activityTimeout,r.bindListeners(),r}return wt(e,t),e.prototype.handlesActivityChecks=function(){return this.transport.handlesActivityChecks()},e.prototype.send=function(t){return this.transport.send(t)},e.prototype.send_event=function(t,e,n){var r={event:t,data:e};return n&&(r.channel=n),D.debug("Event sent",r),this.send(mt.encodeMessage(r))},e.prototype.ping=function(){this.transport.supportsPing()?this.transport.ping():this.send_event("pusher:ping",{})},e.prototype.close=function(){this.transport.close()},e.prototype.bindListeners=function(){var t=this,e={message:function(e){var n;try{n=mt.decodeMessage(e)}catch(n){t.emit("error",{type:"MessageParseError",error:n,data:e.data})}if(void 0!==n){switch(D.debug("Event recd",n),n.event){case"pusher:error":t.emit("error",{type:"PusherError",data:n.data});break;case"pusher:ping":t.emit("ping");break;case"pusher:pong":t.emit("pong")}t.emit("message",n)}},activity:function(){t.emit("activity")},error:function(e){t.emit("error",{type:"WebSocketError",error:e})},closed:function(e){n(),e&&e.code&&t.handleCloseEvent(e),t.transport=null,t.emit("closed")}},n=function(){P(e,(function(e,n){t.transport.unbind(n,e)}))};P(e,(function(e,n){t.transport.bind(n,e)}))},e.prototype.handleCloseEvent=function(t){var e=mt.getCloseAction(t),n=mt.getCloseError(t);n&&this.emit("error",n),e&&this.emit(e,{action:e,error:n})},e}(tt),St=function(){function t(t,e){this.transport=t,this.callback=e,this.bindListeners()}return t.prototype.close=function(){this.unbindListeners(),this.transport.close()},t.prototype.bindListeners=function(){var t=this;this.onMessage=function(e){var n;t.unbindListeners();try{n=mt.processHandshake(e)}catch(e){return t.finish("error",{error:e}),void t.transport.close()}"connected"===n.action?t.finish("connected",{connection:new _t(n.id,t.transport),activityTimeout:n.activityTimeout}):(t.finish(n.action,{error:n.error}),t.transport.close())},this.onClosed=function(e){t.unbindListeners();var n=mt.getCloseAction(e)||"backoff",r=mt.getCloseError(e);t.finish(n,{error:r})},this.transport.bind("message",this.onMessage),this.transport.bind("closed",this.onClosed)},t.prototype.unbindListeners=function(){this.transport.unbind("message",this.onMessage),this.transport.unbind("closed",this.onClosed)},t.prototype.finish=function(t,e){this.callback(C({transport:this.transport,action:t},e))},t}(),kt=function(){function t(t,e){this.channel=t;var n=e.authTransport;if(void 0===we.getAuthorizers()[n])throw"'"+n+"' is not a recognized auth transport";this.type=n,this.options=e,this.authOptions=(e||{}).auth||{}}return t.prototype.composeQuery=function(t){var e="socket_id="+encodeURIComponent(t)+"&channel_name="+encodeURIComponent(this.channel.name);for(var n in this.authOptions.params)e+="&"+encodeURIComponent(n)+"="+encodeURIComponent(this.authOptions.params[n]);return e},t.prototype.authorize=function(e,n){return t.authorizers=t.authorizers||we.getAuthorizers(),t.authorizers[this.type].call(this,we,e,n)},t}(),Tt=function(){function t(t,e){this.timeline=t,this.options=e||{}}return t.prototype.send=function(t,e){this.timeline.isEmpty()||this.timeline.send(we.TimelineTransport.getAgent(this,t),e)},t}(),Ot=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),Ct=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return Ot(e,t),e}(Error),At=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return Ot(e,t),e}(Error),Et=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return Ot(e,t),e}(Error),Pt=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return Ot(e,t),e}(Error),xt=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return Ot(e,t),e}(Error),Lt=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return Ot(e,t),e}(Error),Rt=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return Ot(e,t),e}(Error),Ut=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),Mt=function(t){function e(e,n){var r=t.call(this,(function(t,n){D.debug("No callbacks on "+e+" for "+t)}))||this;return r.name=e,r.pusher=n,r.subscribed=!1,r.subscriptionPending=!1,r.subscriptionCancelled=!1,r}return Ut(e,t),e.prototype.authorize=function(t,e){return e(!1,{})},e.prototype.trigger=function(t,e){if(0!==t.indexOf("client-"))throw new Ct("Event '"+t+"' does not start with 'client-'");if(!this.subscribed){var n=H.buildLogSuffix("triggeringClientEvents");D.warn("Client event triggered before channel 'subscription_succeeded' event . "+n)}return this.pusher.send_event(t,e,this.name)},e.prototype.disconnect=function(){this.subscribed=!1,this.subscriptionPending=!1},e.prototype.handleEvent=function(t){var e=t.event,n=t.data;if("pusher_internal:subscription_succeeded"===e)this.handleSubscriptionSucceededEvent(t);else if(0!==e.indexOf("pusher_internal:")){this.emit(e,n,{})}},e.prototype.handleSubscriptionSucceededEvent=function(t){this.subscriptionPending=!1,this.subscribed=!0,this.subscriptionCancelled?this.pusher.unsubscribe(this.name):this.emit("pusher:subscription_succeeded",t.data)},e.prototype.subscribe=function(){var t=this;this.subscribed||(this.subscriptionPending=!0,this.subscriptionCancelled=!1,this.authorize(this.pusher.connection.socket_id,(function(e,n){e?(D.error(n),t.emit("pusher:subscription_error",n)):t.pusher.send_event("pusher:subscribe",{auth:n.auth,channel_data:n.channel_data,channel:t.name})})))},e.prototype.unsubscribe=function(){this.subscribed=!1,this.pusher.send_event("pusher:unsubscribe",{channel:this.name})},e.prototype.cancelSubscription=function(){this.subscriptionCancelled=!0},e.prototype.reinstateSubscription=function(){this.subscriptionCancelled=!1},e}(tt),jt=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),It=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return jt(e,t),e.prototype.authorize=function(t,e){return Kt.createAuthorizer(this,this.pusher.config).authorize(t,e)},e}(Mt),Nt=function(){function t(){this.reset()}return t.prototype.get=function(t){return Object.prototype.hasOwnProperty.call(this.members,t)?{id:t,info:this.members[t]}:null},t.prototype.each=function(t){var e=this;P(this.members,(function(n,r){t(e.get(r))}))},t.prototype.setMyID=function(t){this.myID=t},t.prototype.onSubscription=function(t){this.members=t.presence.hash,this.count=t.presence.count,this.me=this.get(this.myID)},t.prototype.addMember=function(t){return null===this.get(t.user_id)&&this.count++,this.members[t.user_id]=t.user_info,this.get(t.user_id)},t.prototype.removeMember=function(t){var e=this.get(t.user_id);return e&&(delete this.members[t.user_id],this.count--),e},t.prototype.reset=function(){this.members={},this.count=0,this.myID=null,this.me=null},t}(),Bt=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),Dt=function(t){function e(e,n){var r=t.call(this,e,n)||this;return r.members=new Nt,r}return Bt(e,t),e.prototype.authorize=function(e,n){var r=this;t.prototype.authorize.call(this,e,(function(t,e){if(!t){if(void 0===e.channel_data){var o=H.buildLogSuffix("authenticationEndpoint");return D.error("Invalid auth response for channel '"+r.name+"',expected 'channel_data' field. "+o),void n("Invalid auth response")}var i=JSON.parse(e.channel_data);r.members.setMyID(i.user_id)}n(t,e)}))},e.prototype.handleEvent=function(t){var e=t.event;if(0===e.indexOf("pusher_internal:"))this.handleInternalEvent(t);else{var n=t.data,r={};t.user_id&&(r.user_id=t.user_id),this.emit(e,n,r)}},e.prototype.handleInternalEvent=function(t){var e=t.event,n=t.data;switch(e){case"pusher_internal:subscription_succeeded":this.handleSubscriptionSucceededEvent(t);break;case"pusher_internal:member_added":var r=this.members.addMember(n);this.emit("pusher:member_added",r);break;case"pusher_internal:member_removed":var o=this.members.removeMember(n);o&&this.emit("pusher:member_removed",o)}},e.prototype.handleSubscriptionSucceededEvent=function(t){this.subscriptionPending=!1,this.subscribed=!0,this.subscriptionCancelled?this.pusher.unsubscribe(this.name):(this.members.onSubscription(t.data),this.emit("pusher:subscription_succeeded",this.members))},e.prototype.disconnect=function(){this.members.reset(),t.prototype.disconnect.call(this)},e}(It),zt=n(0),Ht=n(1),qt=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),Ft=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.key=null,e}return qt(e,t),e.prototype.authorize=function(e,n){var r=this;t.prototype.authorize.call(this,e,(function(t,e){if(t)n(!0,e);else{var o=e.shared_secret;if(o)r.key=Object(Ht.decodeBase64)(o),delete e.shared_secret,n(!1,e);else{var i="No shared_secret key in auth payload for encrypted channel: "+r.name;n(!0,i)}}}))},e.prototype.trigger=function(t,e){throw new xt("Client events are not currently supported for encrypted channels")},e.prototype.handleEvent=function(e){var n=e.event,r=e.data;0!==n.indexOf("pusher_internal:")&&0!==n.indexOf("pusher:")?this.handleEncryptedEvent(n,r):t.prototype.handleEvent.call(this,e)},e.prototype.handleEncryptedEvent=function(t,e){var n=this;if(this.key)if(e.ciphertext&&e.nonce){var r=Object(Ht.decodeBase64)(e.ciphertext);if(r.length<zt.secretbox.overheadLength)D.error("Expected encrypted event ciphertext length to be "+zt.secretbox.overheadLength+", got: "+r.length);else{var o=Object(Ht.decodeBase64)(e.nonce);if(o.length<zt.secretbox.nonceLength)D.error("Expected encrypted event nonce length to be "+zt.secretbox.nonceLength+", got: "+o.length);else{var i=zt.secretbox.open(r,o,this.key);if(null===i)return D.debug("Failed to decrypt an event, probably because it was encrypted with a different key. Fetching a new key from the authEndpoint..."),void this.authorize(this.pusher.connection.socket_id,(function(e,s){e?D.error("Failed to make a request to the authEndpoint: "+s+". Unable to fetch new key, so dropping encrypted event"):null!==(i=zt.secretbox.open(r,o,n.key))?n.emitJSON(t,Object(Ht.encodeUTF8)(i)):D.error("Failed to decrypt event with new key. Dropping encrypted event")}));this.emitJSON(t,Object(Ht.encodeUTF8)(i))}}}else D.error("Unexpected format for encrypted event, expected object with `ciphertext` and `nonce` fields, got: "+e);else D.debug("Received encrypted event before key has been retrieved from the authEndpoint")},e.prototype.emitJSON=function(t,e){try{this.emit(t,JSON.parse(e))}catch(n){this.emit(t,e)}return this},e}(It),Xt=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),Jt=function(t){function e(e,n){var r=t.call(this)||this;r.key=e,r.options=n||{},r.state="initialized",r.connection=null,r.usingTLS=!!n.useTLS,r.timeline=r.options.timeline,r.errorCallbacks=r.buildErrorCallbacks(),r.connectionCallbacks=r.buildConnectionCallbacks(r.errorCallbacks),r.handshakeCallbacks=r.buildHandshakeCallbacks(r.errorCallbacks);var o=we.getNetwork();return o.bind("online",(function(){r.timeline.info({netinfo:"online"}),"connecting"!==r.state&&"unavailable"!==r.state||r.retryIn(0)})),o.bind("offline",(function(){r.timeline.info({netinfo:"offline"}),r.connection&&r.sendActivityCheck()})),r.updateStrategy(),r}return Xt(e,t),e.prototype.connect=function(){this.connection||this.runner||(this.strategy.isSupported()?(this.updateState("connecting"),this.startConnecting(),this.setUnavailableTimer()):this.updateState("failed"))},e.prototype.send=function(t){return!!this.connection&&this.connection.send(t)},e.prototype.send_event=function(t,e,n){return!!this.connection&&this.connection.send_event(t,e,n)},e.prototype.disconnect=function(){this.disconnectInternally(),this.updateState("disconnected")},e.prototype.isUsingTLS=function(){return this.usingTLS},e.prototype.startConnecting=function(){var t=this,e=function(n,r){n?t.runner=t.strategy.connect(0,e):"error"===r.action?(t.emit("error",{type:"HandshakeError",error:r.error}),t.timeline.error({handshakeError:r.error})):(t.abortConnecting(),t.handshakeCallbacks[r.action](r))};this.runner=this.strategy.connect(0,e)},e.prototype.abortConnecting=function(){this.runner&&(this.runner.abort(),this.runner=null)},e.prototype.disconnectInternally=function(){(this.abortConnecting(),this.clearRetryTimer(),this.clearUnavailableTimer(),this.connection)&&this.abandonConnection().close()},e.prototype.updateStrategy=function(){this.strategy=this.options.getStrategy({key:this.key,timeline:this.timeline,useTLS:this.usingTLS})},e.prototype.retryIn=function(t){var e=this;this.timeline.info({action:"retry",delay:t}),t>0&&this.emit("connecting_in",Math.round(t/1e3)),this.retryTimer=new k(t||0,(function(){e.disconnectInternally(),e.connect()}))},e.prototype.clearRetryTimer=function(){this.retryTimer&&(this.retryTimer.ensureAborted(),this.retryTimer=null)},e.prototype.setUnavailableTimer=function(){var t=this;this.unavailableTimer=new k(this.options.unavailableTimeout,(function(){t.updateState("unavailable")}))},e.prototype.clearUnavailableTimer=function(){this.unavailableTimer&&this.unavailableTimer.ensureAborted()},e.prototype.sendActivityCheck=function(){var t=this;this.stopActivityCheck(),this.connection.ping(),this.activityTimer=new k(this.options.pongTimeout,(function(){t.timeline.error({pong_timed_out:t.options.pongTimeout}),t.retryIn(0)}))},e.prototype.resetActivityCheck=function(){var t=this;this.stopActivityCheck(),this.connection&&!this.connection.handlesActivityChecks()&&(this.activityTimer=new k(this.activityTimeout,(function(){t.sendActivityCheck()})))},e.prototype.stopActivityCheck=function(){this.activityTimer&&this.activityTimer.ensureAborted()},e.prototype.buildConnectionCallbacks=function(t){var e=this;return C({},t,{message:function(t){e.resetActivityCheck(),e.emit("message",t)},ping:function(){e.send_event("pusher:pong",{})},activity:function(){e.resetActivityCheck()},error:function(t){e.emit("error",{type:"WebSocketError",error:t})},closed:function(){e.abandonConnection(),e.shouldRetry()&&e.retryIn(1e3)}})},e.prototype.buildHandshakeCallbacks=function(t){var e=this;return C({},t,{connected:function(t){e.activityTimeout=Math.min(e.options.activityTimeout,t.activityTimeout,t.connection.activityTimeout||1/0),e.clearUnavailableTimer(),e.setConnection(t.connection),e.socket_id=e.connection.id,e.updateState("connected",{socket_id:e.socket_id})}})},e.prototype.buildErrorCallbacks=function(){var t=this,e=function(e){return function(n){n.error&&t.emit("error",{type:"WebSocketError",error:n.error}),e(n)}};return{tls_only:e((function(){t.usingTLS=!0,t.updateStrategy(),t.retryIn(0)})),refused:e((function(){t.disconnect()})),backoff:e((function(){t.retryIn(1e3)})),retry:e((function(){t.retryIn(0)}))}},e.prototype.setConnection=function(t){for(var e in this.connection=t,this.connectionCallbacks)this.connection.bind(e,this.connectionCallbacks[e]);this.resetActivityCheck()},e.prototype.abandonConnection=function(){if(this.connection){for(var t in this.stopActivityCheck(),this.connectionCallbacks)this.connection.unbind(t,this.connectionCallbacks[t]);var e=this.connection;return this.connection=null,e}},e.prototype.updateState=function(t,e){var n=this.state;if(this.state=t,n!==t){var r=t;"connected"===r&&(r+=" with new socket ID "+e.socket_id),D.debug("State changed",n+" -> "+r),this.timeline.info({state:t,params:e}),this.emit("state_change",{previous:n,current:t}),this.emit(t,e)}},e.prototype.shouldRetry=function(){return"connecting"===this.state||"connected"===this.state},e}(tt),Yt=function(){function t(){this.channels={}}return t.prototype.add=function(t,e){return this.channels[t]||(this.channels[t]=function(t,e){return 0===t.indexOf("private-encrypted-")?Kt.createEncryptedChannel(t,e):0===t.indexOf("private-")?Kt.createPrivateChannel(t,e):0===t.indexOf("presence-")?Kt.createPresenceChannel(t,e):Kt.createChannel(t,e)}(t,e)),this.channels[t]},t.prototype.all=function(){return function(t){var e=[];return P(t,(function(t){e.push(t)})),e}(this.channels)},t.prototype.find=function(t){return this.channels[t]},t.prototype.remove=function(t){var e=this.channels[t];return delete this.channels[t],e},t.prototype.disconnect=function(){P(this.channels,(function(t){t.disconnect()}))},t}();var Kt={createChannels:function(){return new Yt},createConnectionManager:function(t,e){return new Jt(t,e)},createChannel:function(t,e){return new Mt(t,e)},createPrivateChannel:function(t,e){return new It(t,e)},createPresenceChannel:function(t,e){return new Dt(t,e)},createEncryptedChannel:function(t,e){return new Ft(t,e)},createTimelineSender:function(t,e){return new Tt(t,e)},createAuthorizer:function(t,e){return e.authorizer?e.authorizer(t,e):new kt(t,e)},createHandshake:function(t,e){return new St(t,e)},createAssistantToTheTransportManager:function(t,e,n){return new gt(t,e,n)}},Wt=function(){function t(t){this.options=t||{},this.livesLeft=this.options.lives||1/0}return t.prototype.getAssistant=function(t){return Kt.createAssistantToTheTransportManager(this,t,{minPingDelay:this.options.minPingDelay,maxPingDelay:this.options.maxPingDelay})},t.prototype.isAlive=function(){return this.livesLeft>0},t.prototype.reportDeath=function(){this.livesLeft-=1},t}(),Gt=function(){function t(t,e){this.strategies=t,this.loop=Boolean(e.loop),this.failFast=Boolean(e.failFast),this.timeout=e.timeout,this.timeoutLimit=e.timeoutLimit}return t.prototype.isSupported=function(){return j(this.strategies,O.method("isSupported"))},t.prototype.connect=function(t,e){var n=this,r=this.strategies,o=0,i=this.timeout,s=null,c=function(a,u){u?e(null,u):(o+=1,n.loop&&(o%=r.length),o<r.length?(i&&(i*=2,n.timeoutLimit&&(i=Math.min(i,n.timeoutLimit))),s=n.tryStrategy(r[o],t,{timeout:i,failFast:n.failFast},c)):e(!0))};return s=this.tryStrategy(r[o],t,{timeout:i,failFast:this.failFast},c),{abort:function(){s.abort()},forceMinPriority:function(e){t=e,s&&s.forceMinPriority(e)}}},t.prototype.tryStrategy=function(t,e,n,r){var o=null,i=null;return n.timeout>0&&(o=new k(n.timeout,(function(){i.abort(),r(!0)}))),i=t.connect(e,(function(t,e){t&&o&&o.isRunning()&&!n.failFast||(o&&o.ensureAborted(),r(t,e))})),{abort:function(){o&&o.ensureAborted(),i.abort()},forceMinPriority:function(t){i.forceMinPriority(t)}}},t}(),Zt=function(){function t(t){this.strategies=t}return t.prototype.isSupported=function(){return j(this.strategies,O.method("isSupported"))},t.prototype.connect=function(t,e){return function(t,e,n){var r=R(t,(function(t,r,o,i){return t.connect(e,n(r,i))}));return{abort:function(){L(r,Vt)},forceMinPriority:function(t){L(r,(function(e){e.forceMinPriority(t)}))}}}(this.strategies,t,(function(t,n){return function(r,o){n[t].error=r,r?function(t){return function(t,e){for(var n=0;n<t.length;n++)if(!e(t[n],n,t))return!1;return!0}(t,(function(t){return Boolean(t.error)}))}(n)&&e(!0):(L(n,(function(t){t.forceMinPriority(o.transport.priority)})),e(null,o))}}))},t}();function Vt(t){t.error||t.aborted||(t.abort(),t.aborted=!0)}var Qt=function(){function t(t,e,n){this.strategy=t,this.transports=e,this.ttl=n.ttl||18e5,this.usingTLS=n.useTLS,this.timeline=n.timeline}return t.prototype.isSupported=function(){return this.strategy.isSupported()},t.prototype.connect=function(t,e){var n=this.usingTLS,r=function(t){var e=we.getLocalStorage();if(e)try{var n=e[$t(t)];if(n)return JSON.parse(n)}catch(e){te(t)}return null}(n),o=[this.strategy];if(r&&r.timestamp+this.ttl>=O.now()){var i=this.transports[r.transport];i&&(this.timeline.info({cached:!0,transport:r.transport,latency:r.latency}),o.push(new Gt([i],{timeout:2*r.latency+1e3,failFast:!0})))}var s=O.now(),c=o.pop().connect(t,(function r(i,a){i?(te(n),o.length>0?(s=O.now(),c=o.pop().connect(t,r)):e(i)):(!function(t,e,n){var r=we.getLocalStorage();if(r)try{r[$t(t)]=B({timestamp:O.now(),transport:e,latency:n})}catch(t){}}(n,a.transport.name,O.now()-s),e(null,a))}));return{abort:function(){c.abort()},forceMinPriority:function(e){t=e,c&&c.forceMinPriority(e)}}},t}();function $t(t){return"pusherTransport"+(t?"TLS":"NonTLS")}function te(t){var e=we.getLocalStorage();if(e)try{delete e[$t(t)]}catch(t){}}var ee=function(){function t(t,e){var n=e.delay;this.strategy=t,this.options={delay:n}}return t.prototype.isSupported=function(){return this.strategy.isSupported()},t.prototype.connect=function(t,e){var n,r=this.strategy,o=new k(this.options.delay,(function(){n=r.connect(t,e)}));return{abort:function(){o.ensureAborted(),n&&n.abort()},forceMinPriority:function(e){t=e,n&&n.forceMinPriority(e)}}},t}(),ne=function(){function t(t,e,n){this.test=t,this.trueBranch=e,this.falseBranch=n}return t.prototype.isSupported=function(){return(this.test()?this.trueBranch:this.falseBranch).isSupported()},t.prototype.connect=function(t,e){return(this.test()?this.trueBranch:this.falseBranch).connect(t,e)},t}(),re=function(){function t(t){this.strategy=t}return t.prototype.isSupported=function(){return this.strategy.isSupported()},t.prototype.connect=function(t,e){var n=this.strategy.connect(t,(function(t,r){r&&n.abort(),e(t,r)}));return n},t}();function oe(t){return function(){return t.isSupported()}}var ie,se=function(t,e){var n={};function r(r,o,i,s,c){var a=e(t,r,o,i,s,c);return n[r]=a,a}var o,i={hostNonTLS:t.wsHost+":"+t.wsPort,hostTLS:t.wsHost+":"+t.wssPort,httpPath:t.wsPath},s=C({},i,{useTLS:!0}),c={hostNonTLS:t.httpHost+":"+t.httpPort,hostTLS:t.httpHost+":"+t.httpsPort,httpPath:t.httpPath},a={loop:!0,timeout:15e3,timeoutLimit:6e4},u=new Wt({lives:2,minPingDelay:1e4,maxPingDelay:t.activity_timeout}),h=new Wt({lives:2,minPingDelay:1e4,maxPingDelay:t.activity_timeout}),p=r("ws","ws",3,i,u),f=r("wss","ws",3,s,u),l=r("sockjs","sockjs",1,c),d=r("xhr_streaming","xhr_streaming",1,c,h),y=r("xdr_streaming","xdr_streaming",1,c,h),v=r("xhr_polling","xhr_polling",1,c),g=r("xdr_polling","xdr_polling",1,c),b=new Gt([p],a),m=new Gt([f],a),w=new Gt([l],a),_=new Gt([new ne(oe(d),d,y)],a),S=new Gt([new ne(oe(v),v,g)],a),k=new Gt([new ne(oe(_),new Zt([_,new ee(S,{delay:4e3})]),S)],a),T=new ne(oe(k),k,w);return o=t.useTLS?new Zt([b,new ee(T,{delay:2e3})]):new Zt([b,new ee(m,{delay:2e3}),new ee(T,{delay:5e3})]),new Qt(new re(new ne(oe(p),o,T)),n,{ttl:18e5,timeline:t.timeline,useTLS:t.useTLS})},ce={getRequest:function(t){var e=new window.XDomainRequest;return e.ontimeout=function(){t.emit("error",new At),t.close()},e.onerror=function(e){t.emit("error",e),t.close()},e.onprogress=function(){e.responseText&&e.responseText.length>0&&t.onChunk(200,e.responseText)},e.onload=function(){e.responseText&&e.responseText.length>0&&t.onChunk(200,e.responseText),t.emit("finished",200),t.close()},e},abortRequest:function(t){t.ontimeout=t.onerror=t.onprogress=t.onload=null,t.abort()}},ae=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),ue=function(t){function e(e,n,r){var o=t.call(this)||this;return o.hooks=e,o.method=n,o.url=r,o}return ae(e,t),e.prototype.start=function(t){var e=this;this.position=0,this.xhr=this.hooks.getRequest(this),this.unloader=function(){e.close()},we.addUnloadListener(this.unloader),this.xhr.open(this.method,this.url,!0),this.xhr.setRequestHeader&&this.xhr.setRequestHeader("Content-Type","application/json"),this.xhr.send(t)},e.prototype.close=function(){this.unloader&&(we.removeUnloadListener(this.unloader),this.unloader=null),this.xhr&&(this.hooks.abortRequest(this.xhr),this.xhr=null)},e.prototype.onChunk=function(t,e){for(;;){var n=this.advanceBuffer(e);if(!n)break;this.emit("chunk",{status:t,data:n})}this.isBufferTooLong(e)&&this.emit("buffer_too_long")},e.prototype.advanceBuffer=function(t){var e=t.slice(this.position),n=e.indexOf("\n");return-1!==n?(this.position+=n+1,e.slice(0,n)):null},e.prototype.isBufferTooLong=function(t){return this.position===t.length&&t.length>262144},e}(tt);!function(t){t[t.CONNECTING=0]="CONNECTING",t[t.OPEN=1]="OPEN",t[t.CLOSED=3]="CLOSED"}(ie||(ie={}));var he=ie,pe=1;function fe(t){var e=-1===t.indexOf("?")?"?":"&";return t+e+"t="+ +new Date+"&n="+pe++}function le(t){return Math.floor(Math.random()*t)}var de,ye=function(){function t(t,e){this.hooks=t,this.session=le(1e3)+"/"+function(t){for(var e=[],n=0;n<t;n++)e.push(le(32).toString(32));return e.join("")}(8),this.location=function(t){var e=/([^\?]*)\/*(\??.*)/.exec(t);return{base:e[1],queryString:e[2]}}(e),this.readyState=he.CONNECTING,this.openStream()}return t.prototype.send=function(t){return this.sendRaw(JSON.stringify([t]))},t.prototype.ping=function(){this.hooks.sendHeartbeat(this)},t.prototype.close=function(t,e){this.onClose(t,e,!0)},t.prototype.sendRaw=function(t){if(this.readyState!==he.OPEN)return!1;try{return we.createSocketRequest("POST",fe((e=this.location,n=this.session,e.base+"/"+n+"/xhr_send"))).start(t),!0}catch(t){return!1}var e,n},t.prototype.reconnect=function(){this.closeStream(),this.openStream()},t.prototype.onClose=function(t,e,n){this.closeStream(),this.readyState=he.CLOSED,this.onclose&&this.onclose({code:t,reason:e,wasClean:n})},t.prototype.onChunk=function(t){var e;if(200===t.status)switch(this.readyState===he.OPEN&&this.onActivity(),t.data.slice(0,1)){case"o":e=JSON.parse(t.data.slice(1)||"{}"),this.onOpen(e);break;case"a":e=JSON.parse(t.data.slice(1)||"[]");for(var n=0;n<e.length;n++)this.onEvent(e[n]);break;case"m":e=JSON.parse(t.data.slice(1)||"null"),this.onEvent(e);break;case"h":this.hooks.onHeartbeat(this);break;case"c":e=JSON.parse(t.data.slice(1)||"[]"),this.onClose(e[0],e[1],!0)}},t.prototype.onOpen=function(t){var e,n,r;this.readyState===he.CONNECTING?(t&&t.hostname&&(this.location.base=(e=this.location.base,n=t.hostname,(r=/(https?:\/\/)([^\/:]+)((\/|:)?.*)/.exec(e))[1]+n+r[3])),this.readyState=he.OPEN,this.onopen&&this.onopen()):this.onClose(1006,"Server lost session",!0)},t.prototype.onEvent=function(t){this.readyState===he.OPEN&&this.onmessage&&this.onmessage({data:t})},t.prototype.onActivity=function(){this.onactivity&&this.onactivity()},t.prototype.onError=function(t){this.onerror&&this.onerror(t)},t.prototype.openStream=function(){var t=this;this.stream=we.createSocketRequest("POST",fe(this.hooks.getReceiveURL(this.location,this.session))),this.stream.bind("chunk",(function(e){t.onChunk(e)})),this.stream.bind("finished",(function(e){t.hooks.onFinished(t,e)})),this.stream.bind("buffer_too_long",(function(){t.reconnect()}));try{this.stream.start()}catch(e){O.defer((function(){t.onError(e),t.onClose(1006,"Could not start streaming",!1)}))}},t.prototype.closeStream=function(){this.stream&&(this.stream.unbind_all(),this.stream.close(),this.stream=null)},t}(),ve={getReceiveURL:function(t,e){return t.base+"/"+e+"/xhr_streaming"+t.queryString},onHeartbeat:function(t){t.sendRaw("[]")},sendHeartbeat:function(t){t.sendRaw("[]")},onFinished:function(t,e){t.onClose(1006,"Connection interrupted ("+e+")",!1)}},ge={getReceiveURL:function(t,e){return t.base+"/"+e+"/xhr"+t.queryString},onHeartbeat:function(){},sendHeartbeat:function(t){t.sendRaw("[]")},onFinished:function(t,e){200===e?t.reconnect():t.onClose(1006,"Connection interrupted ("+e+")",!1)}},be={getRequest:function(t){var e=new(we.getXHRAPI());return e.onreadystatechange=e.onprogress=function(){switch(e.readyState){case 3:e.responseText&&e.responseText.length>0&&t.onChunk(e.status,e.responseText);break;case 4:e.responseText&&e.responseText.length>0&&t.onChunk(e.status,e.responseText),t.emit("finished",e.status),t.close()}},e},abortRequest:function(t){t.onreadystatechange=null,t.abort()}},me={createStreamingSocket:function(t){return this.createSocket(ve,t)},createPollingSocket:function(t){return this.createSocket(ge,t)},createSocket:function(t,e){return new ye(t,e)},createXHR:function(t,e){return this.createRequest(be,t,e)},createRequest:function(t,e,n){return new ue(t,e,n)},createXDR:function(t,e){return this.createRequest(ce,t,e)}},we={nextAuthCallbackID:1,auth_callbacks:{},ScriptReceivers:o,DependenciesReceivers:c,getDefaultStrategy:se,Transports:dt,transportConnectionInitializer:function(){var t=this;t.timeline.info(t.buildTimelineMessage({transport:t.name+(t.options.useTLS?"":"")})),t.hooks.isInitialized()?t.changeState("initialized"):t.hooks.file?(t.changeState("initializing"),a.load(t.hooks.file,{useTLS:t.options.useTLS},(function(e,n){t.hooks.isInitialized()?(t.changeState("initialized"),n(!0)):(e&&t.onError(e),t.onClose(),n(!1))}))):t.onClose()},HTTPFactory:me,TimelineTransport:Y,getXHRAPI:function(){return window.XMLHttpRequest},getWebSocketAPI:function(){return window.WebSocket||window.MozWebSocket},setup:function(t){var e=this;window.Pusher=t;var n=function(){e.onDocumentBody(t.ready)};window.JSON?n():a.load("json2",{},n)},getDocument:function(){return document},getProtocol:function(){return this.getDocument().location.protocol},getAuthorizers:function(){return{ajax:q,jsonp:F}},onDocumentBody:function(t){var e=this;document.body?t():setTimeout((function(){e.onDocumentBody(t)}),0)},createJSONPRequest:function(t,e){return new J(t,e)},createScriptRequest:function(t){return new X(t)},getLocalStorage:function(){try{return window.localStorage}catch(t){return}},createXHR:function(){return this.getXHRAPI()?this.createXMLHttpRequest():this.createMicrosoftXHR()},createXMLHttpRequest:function(){return new(this.getXHRAPI())},createMicrosoftXHR:function(){return new ActiveXObject("Microsoft.XMLHTTP")},getNetwork:function(){return vt},createWebSocket:function(t){return new(this.getWebSocketAPI())(t)},createSocketRequest:function(t,e){if(this.isXHRSupported())return this.HTTPFactory.createXHR(t,e);if(this.isXDRSupported(0===e.indexOf("https:")))return this.HTTPFactory.createXDR(t,e);throw"Cross-origin HTTP requests are not supported"},isXHRSupported:function(){var t=this.getXHRAPI();return Boolean(t)&&void 0!==(new t).withCredentials},isXDRSupported:function(t){var e=t?"https:":"http:",n=this.getProtocol();return Boolean(window.XDomainRequest)&&n===e},addUnloadListener:function(t){void 0!==window.addEventListener?window.addEventListener("unload",t,!1):void 0!==window.attachEvent&&window.attachEvent("onunload",t)},removeUnloadListener:function(t){void 0!==window.addEventListener?window.removeEventListener("unload",t,!1):void 0!==window.detachEvent&&window.detachEvent("onunload",t)}};!function(t){t[t.ERROR=3]="ERROR",t[t.INFO=6]="INFO",t[t.DEBUG=7]="DEBUG"}(de||(de={}));var _e=de,Se=function(){function t(t,e,n){this.key=t,this.session=e,this.events=[],this.options=n||{},this.sent=0,this.uniqueID=0}return t.prototype.log=function(t,e){t<=this.options.level&&(this.events.push(C({},e,{timestamp:O.now()})),this.options.limit&&this.events.length>this.options.limit&&this.events.shift())},t.prototype.error=function(t){this.log(_e.ERROR,t)},t.prototype.info=function(t){this.log(_e.INFO,t)},t.prototype.debug=function(t){this.log(_e.DEBUG,t)},t.prototype.isEmpty=function(){return 0===this.events.length},t.prototype.send=function(t,e){var n=this,r=C({session:this.session,bundle:this.sent+1,key:this.key,lib:"js",version:this.options.version,cluster:this.options.cluster,features:this.options.features,timeline:this.events},this.options.params);return this.events=[],t(r,(function(t,r){t||n.sent++,e&&e(t,r)})),!0},t.prototype.generateUniqueID=function(){return this.uniqueID++,this.uniqueID},t}(),ke=function(){function t(t,e,n,r){this.name=t,this.priority=e,this.transport=n,this.options=r||{}}return t.prototype.isSupported=function(){return this.transport.isSupported({useTLS:this.options.useTLS})},t.prototype.connect=function(t,e){var n=this;if(!this.isSupported())return Te(new Rt,e);if(this.priority<t)return Te(new Et,e);var r=!1,o=this.transport.createConnection(this.name,this.priority,this.options.key,this.options),i=null,s=function(){o.unbind("initialized",s),o.connect()},c=function(){i=Kt.createHandshake(o,(function(t){r=!0,h(),e(null,t)}))},a=function(t){h(),e(t)},u=function(){var t;h(),t=B(o),e(new Pt(t))},h=function(){o.unbind("initialized",s),o.unbind("open",c),o.unbind("error",a),o.unbind("closed",u)};return o.bind("initialized",s),o.bind("open",c),o.bind("error",a),o.bind("closed",u),o.initialize(),{abort:function(){r||(h(),i?i.close():o.close())},forceMinPriority:function(t){r||n.priority<t&&(i?i.close():o.close())}}},t}();function Te(t,e){return O.defer((function(){e(t)})),{abort:function(){},forceMinPriority:function(){}}}var Oe=we.Transports,Ce=function(t,e,n,r,o,i){var s=Oe[n];if(!s)throw new Lt(n);return!(t.enabledTransports&&-1===E(t.enabledTransports,e)||t.disabledTransports&&-1!==E(t.disabledTransports,e))?new ke(e,r,i?i.getAssistant(s):s,C({key:t.key,useTLS:t.useTLS,timeline:t.timeline,ignoreNullOrigin:t.ignoreNullOrigin},o)):Ae},Ae={isSupported:function(){return!1},connect:function(t,e){var n=O.defer((function(){e(new Rt)}));return{abort:function(){n.ensureAborted()},forceMinPriority:function(){}}}},Ee=function(){return{wsHost:i.host,wsPort:i.ws_port,wssPort:i.wss_port,wsPath:i.ws_path,httpHost:i.sockjs_host,httpPort:i.sockjs_http_port,httpsPort:i.sockjs_https_port,httpPath:i.sockjs_path,statsHost:i.stats_host,authEndpoint:i.channel_auth_endpoint,authTransport:i.channel_auth_transport,activity_timeout:i.activity_timeout,pong_timeout:i.pong_timeout,unavailable_timeout:i.unavailable_timeout}},Pe=function(t){return{wsHost:"ws-"+t+".pusher.com",httpHost:"sockjs-"+t+".pusher.com"}},xe=function(){function t(e,n){var r=this;if(function(t){if(null==t)throw"You must pass your app key when you instantiate Pusher."}(e),!(n=n||{}).cluster&&!n.wsHost&&!n.httpHost){var o=H.buildLogSuffix("javascriptQuickStart");D.warn("You should always specify a cluster when connecting. "+o)}this.key=e,this.config=C(Ee(),n.cluster?Pe(n.cluster):{},n),this.channels=Kt.createChannels(),this.global_emitter=new tt,this.sessionID=Math.floor(1e9*Math.random()),this.timeline=new Se(this.key,this.sessionID,{cluster:this.config.cluster,features:t.getClientFeatures(),params:this.config.timelineParams||{},limit:50,level:_e.INFO,version:i.VERSION}),this.config.disableStats||(this.timelineSender=Kt.createTimelineSender(this.timeline,{host:this.config.statsHost,path:"/timeline/v2/"+we.TimelineTransport.name}));this.connection=Kt.createConnectionManager(this.key,C({getStrategy:function(t){var e=C({},r.config,t);return we.getDefaultStrategy(e,Ce)},timeline:this.timeline,activityTimeout:this.config.activity_timeout,pongTimeout:this.config.pong_timeout,unavailableTimeout:this.config.unavailable_timeout},this.config,{useTLS:this.shouldUseTLS()})),this.connection.bind("connected",(function(){r.subscribeAll(),r.timelineSender&&r.timelineSender.send(r.connection.isUsingTLS())})),this.connection.bind("message",(function(t){var e=0===t.event.indexOf("pusher_internal:");if(t.channel){var n=r.channel(t.channel);n&&n.handleEvent(t)}e||r.global_emitter.emit(t.event,t.data)})),this.connection.bind("connecting",(function(){r.channels.disconnect()})),this.connection.bind("disconnected",(function(){r.channels.disconnect()})),this.connection.bind("error",(function(t){D.warn(t)})),t.instances.push(this),this.timeline.info({instances:t.instances.length}),t.isReady&&this.connect()}return t.ready=function(){t.isReady=!0;for(var e=0,n=t.instances.length;e<n;e++)t.instances[e].connect()},t.getClientFeatures=function(){return x(M({ws:we.Transports.ws},(function(t){return t.isSupported({})})))},t.prototype.channel=function(t){return this.channels.find(t)},t.prototype.allChannels=function(){return this.channels.all()},t.prototype.connect=function(){if(this.connection.connect(),this.timelineSender&&!this.timelineSenderTimer){var t=this.connection.isUsingTLS(),e=this.timelineSender;this.timelineSenderTimer=new T(6e4,(function(){e.send(t)}))}},t.prototype.disconnect=function(){this.connection.disconnect(),this.timelineSenderTimer&&(this.timelineSenderTimer.ensureAborted(),this.timelineSenderTimer=null)},t.prototype.bind=function(t,e,n){return this.global_emitter.bind(t,e,n),this},t.prototype.unbind=function(t,e,n){return this.global_emitter.unbind(t,e,n),this},t.prototype.bind_global=function(t){return this.global_emitter.bind_global(t),this},t.prototype.unbind_global=function(t){return this.global_emitter.unbind_global(t),this},t.prototype.unbind_all=function(t){return this.global_emitter.unbind_all(),this},t.prototype.subscribeAll=function(){var t;for(t in this.channels.channels)this.channels.channels.hasOwnProperty(t)&&this.subscribe(t)},t.prototype.subscribe=function(t){var e=this.channels.add(t,this);return e.subscriptionPending&&e.subscriptionCancelled?e.reinstateSubscription():e.subscriptionPending||"connected"!==this.connection.state||e.subscribe(),e},t.prototype.unsubscribe=function(t){var e=this.channels.find(t);e&&e.subscriptionPending?e.cancelSubscription():(e=this.channels.remove(t))&&"connected"===this.connection.state&&e.unsubscribe()},t.prototype.send_event=function(t,e,n){return this.connection.send_event(t,e,n)},t.prototype.shouldUseTLS=function(){return"https:"===we.getProtocol()||(!0===this.config.forceTLS||Boolean(this.config.encrypted))},t.instances=[],t.isReady=!1,t.logToConsole=!1,t.Runtime=we,t.ScriptReceivers=we.ScriptReceivers,t.DependenciesReceivers=we.DependenciesReceivers,t.auth_callbacks=we.auth_callbacks,t}(),Le=e.default=xe;we.setup(xe)}])}));
  //export default Echo;

  window.Echo = new Echo({
      broadcaster: 'pusher',
      key: '12345678',
      //cluster: process.env.MIX_PUSHER_APP_CLUSTER,
      //encrypted: true,

      wsHost: 'localhost',
      wssHost: 'localhost',
      wsPort: 6001,
      wssPort: 6001,

      disableStats: true,
      enabledTransports: ['ws']
  });

let data_currency_pairs = {
	//EUR-USD
	_1:{
		name:'EUR-USD',
		active_id:1,

		current_utility:null,//utilidad actual - Se configura al iniciar el sistema, después se actualiza automáticamente

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,//Ultimos datos de martingala enviados en el primer segundo de cada minuto
		traders_mood:50,//Estado de ánimo de los traders, se actualiza automáticamente 
		currency_pair:null,
		entry_confirmed:true,//Identifica la confirmación de una entrada en el mercado
		mandatory_entry:false,//Determina si se debe realizar una entrada obligatoria
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,//Determina si el precio de las divisas se está moviendo rápido
		restart_high_speed_at:null,//Almacena la fecha en que se debe restablecer la variable high_speed
		last_entry:null,//Hora y minuto de la ultima entrada
		option_currently_open:false,//indica si hay una opción abierta actualmente
		candle_pending_save:false,
		amount_last_candles:60,//cantidad de velas que debe guardar en memoria
		number_of_fast_movements:0,////Cantidad de movimientos rápidos detectados
		reset_number_of_fast_movements_at:null,//Fecha para restablecer numero de movimientos rápidos (Si no aparece uno nuevo)

		//PARA MARTINGALA
		current_amount:0,//Valor de inversión actual
		attemps:0,//Cantidad de intentos actuales
		current_gain:0,//Ganancias actuales
		max_gain:0,//Ganancia máxima obtenida
		option_equal:false,//Identifica si la utlima entrada se empató
		id_martingala:null,//Identificador de la entrada martingala
		data_entries:[],//Datos de las entradas realizadas

		//Suma o resta la direccion de cada alerta en una entrada martingala
		//Si hay tres entradas al alza su valor será 3 y hay dos entradas al alza y una a la baja su valor sera 1
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//EUR-USD//OTC
	_76:{
		name:'EUR-USD',//OTC
		active_id:76,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//AUD-USD
	_99:{
		name:'AUD-USD',
		active_id:99,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//NZD-USD
	_8:{
		name:'NZD-USD',
		active_id:8,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//NZD-USD//OTC
	_80:{
		name:'NZD-USD',//OTC
		active_id:80,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//EUR-NZD
	_212:{
		name:'EUR-NZD',
		active_id:212,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//EUR-JPY
	_4:{
		name:'EUR-JPY',
		active_id:4,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//GBP-USD
	_5:{
		name:'GBP-USD',
		active_id:5,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//GBP-USD//OTC
	_81:{
		name:'GBP-USD',//OTC
		active_id:81,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//GBP-JPY
	_3:{
		name:'GBP-JPY',
		active_id:3,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//EUR-GBP
	_2:{
		name:'EUR-GBP',
		active_id:2,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//EUR-GBP//OTC
	_77:{
		name:'EUR-GBP',//OTC
		active_id:77,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//AUD-JPY
	_101:{
		name:'AUD-JPY',
		active_id:101,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//EUR-AUD
	_108:{
		name:'EUR-AUD',
		active_id:108,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//USD-JPY
	_6:{
		name:'USD-JPY',
		active_id:6,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
}
const config_trading = {
	/*******************************************
     ******** CONFIGURACIÓN PARA PICOS, ********
     ******** NIVELES, VALLES Y COLINAS ********
     ******************************************/

		//determina la altura de un pico
		//un pico debe tener una altura mayor o igual a el valor de esta variable
		//multiplicado por el promedio de altura de velas actual
		height_peaks : 10,

		//altura minima de un pico
		//se miden en porcentaje en relación a el tamaño de una vela grande
		min_height_peaks : 20,

		//cantidad de minutos que se deben analizar antes y después del pico
		minutes_for_peaks : 15,

		//determina el porcentaje por encima o por debajo que se debe tener en cuenta
		//para determinar que un valor está sobre un nivel existente
		//este porcentaje es en relación a lo definido como vela grande (big) en currency_pairs
		//se utiliza para saber cuando un pico se repite o cuando supar rebotes a un nivel
		proximity_percentage_peaks : 2,

		//cantidad de valles o colinas que se deben repetir
		//para que se considere un nivel de velas
		appearances_valleys_hills_to_candle_level : 5,

		//cantidad de apariciones que debe tener un valle o colina
		//para poder identificar una entrada
		appearances_valleys_hills_for_entry : 2,

	    //canidad de intentos para encontrar un buen nivel
  		attemps_level : 1,

  		//Tamaño promedio máximo para intentos de busqueda de nivel
  		//si el tamaño promedio es mayor al seleccionado se incrementan los
  		//intentos en relación al tamaño promedio
  		max_size_attemps_level : 10,

  		//canidad de intentos para encontrar un buen soporte o resistencia
  		attemps_support_resistor : 3,

  		//Tamaño promedio máximo para intentos de busqueda de un soporte o resistencia
  		//si el tamaño promedio es mayor al seleccionado se incrementan los
  		//intentos en relación al tamaño promedio
  		max_size_attemps_support_resistor : 10,

  		//distancia mínima que puede haber entre dos niveles que permitan entradas
	  	//la distancia se mide en porcentaje y con relación a la vela grande
	  	min_distance_between_levels : 50,

	  	//factor de 'min_distance_between_levels' utilizado para calcular la 
	  	//distancia minima real entre dos niveles de entrada
	  	factor_for_distance_between_levels : 0.2,

	  	//determina la fracción del tamaño de una vela grande
	    //que se utiliza para definir los niveles de precio de un par de divisas
	    factor_space_levels : 0.5,

	    //cantidad de minutos antes de la ultima vela en los cuales debe haber
	    //rebotado un nivel para tenerlo en cuenta en la siguiente entrada
	    minutes_for_last_date_level : 2880,

	    //cantidad de minutos antes de la ultima vela en los cuales debe haber
	    //rebotado un soporte o resistencia para tenerlo en cuenta en la siguiente entrada
	    minutes_for_last_date_support_resistor : 360,

	    //determina el porcentaje minimo para definir que un valor
	    //esta en un nivel, el porcentaje se calcula en relación
	    //al tamaño de una vela grande (big)
	    percentage_value_in_level : 1,


	/**********************************************
     ******** CONFIGURACIÓN PARA MARTILLOS ********
     *********************************************/

		//tamaño mínimo del cuerpo de una vela para considerar martillo
		//el tamaño de mide en porcentaje de acuerdo al campo big de curency_pairs
		hammer_size : 5,

		//porcentaje (en relación al cuerpo de la vela) que debe tener el palo del martillo
		//como mínimo para considerarse martillo
		percentage_hammer_stick : 120,

		//porcentaje máximo (en relación al cuerpo de la vela) que puede tener la mecha que
		//puede aparecer por encima de la maseta del martillo
		percentage_hammer_header : 0,



	/**********************************************
     ******** CONFIGURACIÓN PARA ESTRELLAS ********
     *********************************************/

		//tamaño máximo del cuerpo de una estrella
	  	max_size_star : 0.3,

	  	//cantidad de velas en una misma dirección para 
	  	//realizar una entrada con una estrella
	  	number_candles_entry_star : 4,



	/************************************************************
     ******** CONFIGURACIÓN PARA ENTRADAS DE MECHA NIVEL ********
     ***********************************************************/


	  	//Porcentaje de proximidad a la cual la punta de una mecha
	  	//puede quedar de un nivel para lanzar una alerta
	  	//el porcentaje se mide en relación a una vela grande
	  	proximity_alert_wick : 0.1,

	  	//Altura minima en porcentage de una mecha para realizar una entrada
	  	//cuando la punta de una mecha toca un nivel
	  	min_percentage_for_alert_wick_closure : 2,

	  	//altura minima de una vela para lanzar alertas 
	  	//de cierre de mecha
	  	min_percentage_body_for_alert_wick_closure : 2,

		//cantidad de minutos anteriores en que debe haber aparecido un rebote
		//en el nivel para realizar una entrada de toque de vela
	  	minutes_for_last_date_in_wick_touch : 180,

	  	//Cantidad minima de rebotes para poder lanzar una alerta
	  	//de mecha nivel
	  	min_bounces_after_date_for_wick_touch : 5,



	/**************************************************
     ******** CONFIGURACIÓN PARA VELAS GRANDES ********
     *************************************************/

	    //determina cuando una vela es grande
	    //se define en porcentaje, en relación al campo big de la tabla currency_pairs
	    big_candle : 70,

		//determina el porcentaje mínimo de altura de las mechas de una vela
	    //definido para guardar los niveles de cierre y apertura de la vela como soportes y resistencias
	    //en una vela grande
	    percentage_wick_save_body : 20,

	    //factor de 'big_candle' que debe ser mayor al promedio 
	    //de velas para almacenar los niveles de la vela grande
	    factor_for_save_big_candle : 0.1,



	/*******************************************************
     ******** CONFIGURACIÓN PARA VELAS CONSECUTIVAS ********
     ******************************************************/

	    //cantidad de velas que deben ir en una misma dirección
	    //para aumentar la probabilidad de entrada
	  	number_candles_entry : 8,



	/**************************************************
     ******** CONFIGURACIÓN REBOTES Y RUPTURAS ********
     *************************************************/

	    //cantidad mínima de velas que deben haber rebotado en un nivel
	    //para aumentar su probabilidad
	    bounce_count : 10,

	    //porcentaje de rebotes que deben existir en comparación
	    //con rupturas para aumentar la probabilidad
	    percentage_bounces_brokes : 70,



    /*******************************************************
     ******** CONFIGURACIÓN DE VALOR DE PROBAILIDAD ********
     ******************************************************/
    
	    //probabilidad por rebotes en un nivel, soporte o resistencia
	    probability_bounce : 7,
	    //probabilidad por toque de un nivel semifundamental
	    probability_semifundamental : 5,
	    //probabilidad por toque de un nivel fundamental
	    probability_fundamental : 7,
	    //probabilidad por N velas en el mismo sentido
	    probability_count_candles : 7,
	    //probabilidad por cada vela adicional a N en el mismo sentido
	    probability_count_candles_more : 1,
	    //probabilidad por toque en soporte o resistencia de vela grande
	    probability_levels_big_candles : 6,
	    //probabilidad por toque en soporte o resistencia de nivel de vela
	    probability_levels_candles : 5,
	    //probabilidad por toque en soporte o resistencia de valle o colina
	    probability_valleys_hills : 3,
	    //probabilidad por tendencia
	    probability_good_trend : 7,
	    
	    probability_max : 95,  
  		probability_min : 50,



	/********************************************
     ******** CONFIGURACIÓN PARA ALERTAS ********
     ********************************************/

	    //porcentaje mínimo de probabilidad para lanzar alerta
	    min_percentage_alert : 	60,

	  	//porcentaje mínimo para enviar una alerta
	  	//se mide en relación al tamaño de una vela grande
	  	percentage_for_alert : .3,

	  	//porcentaje minimo de apertura de una vela para lanzar alertas
	  	//si la vela abre a una distancia menor o igual a esta no lanza alertas
	  	//se miden en porcentaje en relación al tamaño de una vela grande
	  	percentage_open_candle_lock_alert : .5,

	  	//tamaño máximo permitido para enviar alertas segudo a segundo cuando 
	  	//la vela anterior va en dirección opuesta a la dirección de la alerta
	  	max_size_candle_previous : 1.5,



	/********************************************
     ******** CONFIGURACIÓN PARA TENDENCIAS ********
     ********************************************/
		//determina el tamaño mínimo de una tendencia
	  	//para determinar que es buena, tamaño en porcentaje
	  	//en relación a una vela grande
	  	good_trend_size : 60,

	  	//cantidad de minutos que se evalua por cada
	  	//ciclo de revisión de tendencia
	  	minutes_for_good_trend : 5,

	  	//canidad de intentos para encontrar la siguiente vela
	  	//más alta o baja de una tendencia
	  	attemps_trend : 3,



  	/***************************************
     ******** CONFIGURACIÓN GENERAL ********
     ***************************************/

	  	//cantidad máxima de decimales que puede tener un valor
	  	max_decimals_value : 6,

	  	//determina si se deben almacenar mensajes de log
	  	active_log : false,
  	
	  	//determina cuantos minutos se utilizan para medir un promedio de velas
	  	minutes_for_avg_candles : 10,



	/******************************************
     ******** CONFIGURACIÓN MARTINGALA ********
     *****************************************/	
     	//Determina si se debe iniciar nuevamente martingala luego de alcanzar el stop loss
     	auto_start_with_stop_loss : true,

     	//Determina si se ejecuta martingala individualmente en cada para de divisas
     	//o si se ejecuta de manera global con todas las divisas abiertas (no ejecuta entradas al mismo tiempo)
     	individual_martingala : true,

		//distancia mínima a la que el punto máximo o minimo
		//de una vela debe estar de un nivel para lanzar alerta martingala
		proximity_to_level : 4,

		//cuando una vel atravieza un nivel y la tendencia es
		//mayor a esta variable se va en sentido de la tendencia
		//si la tendencia es menor se va en el sentido de la vela
		min_percentage_trend : 70,

		//Tamaño promedio de velas para aplicar el min_percentage_trend
		avg_candles_size_for_trend : 7,

		//tamaño minimo en porcentaje para decidir la dirección de la
		//siguiente vela dependiendo de las mechas. El porcentage se mide de acuerdo
		//al tamaño del cuerpo de la vela
		min_percentage_wick : 90,

		//Multiplicado por el tamaño de la mecha más pequeña, no puede sobrepasar
		//el tamaño de la mecha más grande para realizar una entrada
		factor_for_small_wick : 8,

		//estado de ánimo mínimo para abrir una posición
		min_traders_mood : 15,

		//estado de ánimo mínimo para hacer caso a las mechas
		min_traders_mood_wicks : 40,

		//estado de ánimo mínimo para hacer caso a la tendencia
		min_traders_mood_trend : 60,

		//estado de ánimo mínimo para hacer caso al estado de ánimo
		min_traders_mood_without_direction : 90,

		//Factor para calcular una vela pequeña en relación 
		//al promedio de velas, utilizado cuando una vela atravieza un nivel
		//para saber en que dirección ir dependiendo del tamaño
		factor_candle_small_broke : .15,

		//Factor para determinar cuando dos velas representan una
		//figura donde la penultima vela es N veces mayor a la actual
		factor_figure_big_small : 8,

		//Cantidad de ultimas velas a analizar para identificar la cantidad de rupturas de nivel
		max_candles_for_set_brokes_level: 8,

		//cantidad de velas que deben estar rompiendo un nivel
		//para lanzar alertas en una sola dirección
		amount_brokes_level_only_one_direction : 4,

		//Cantidad de rupturas de nivel necesarias para no generar entradas nuevas
		amount_brokes_level_for_cancel_entry : 4,

		values_for_calculate_speed : 10,

		//Velocidad donde se deben bloquear las alertas
		speed_for_block_entries : 70,

		//Velocidad máxima permitida para iniciar una entrada
		max_speed_for_entry : 15,

		//Velocidad mínima permitida para iniciar una entrada
		min_speed_for_entry : 7,

		//Cantidad de minutos que se bloquean las entradas despues de identificar
		//Alta velocidad en el movimiento del precio
		high_speed_lock_minutes : 2,

		//Tamaño minimo que debe tener la ultima vela para
		//identificar figura big_small. El tamaño de mide en porcentaje de acuerdo 
		//al tamaño promedio de velas
		min_size_figure_big_small : 5,

		//Cantidad de movimientos rápidos detectados para bloquear entradas
		number_of_fast_movements_to_block_entries : 2,

		//Cantidad de segundos que permanece activo el contador de movimientos rapidos
		seconds_to_reset_number_of_fast_movements : 30,

		//Cantidad de intentos perdidos para ir en contra a la dirección con mas fallas
		attemps_for_only_direction : 3,

		//Cantidad minima de pronosticos de vela para realizar una evaluación válida
		min_number_or_forecast : 5,

		//Porcentaje de aciertos minimo para iniciar una entrada
		min_forecast_success_rate : 67,

		//Porcentaje de aciertos máximo para iniciar una entrada
		max_forecast_success_rate : 78,

		//Salto maximo permitido para realizar una entrada cuando en el 
		//primer intento la vela abre en posicion contraria a la dirección de entrada
		//Se mide en porcentje de acuerdo al tamaño promedio de velas
		max_jump_allowed_after_touch_level : 3,

		//Determina si las entradas que inician martingala solo se deben realizar en niveles
		start_entries_only_in_levels : true,

		//determina si se deben almacenar mensajes de log de martingala
	  	active_log_martingala : false,
}
var run_martingala = false;//Habilida o desabilita las funcionalidades de martingala

var initial_amount = 1;//Valor de la inversión inicial
var factor_increase = 2.25;//Factor para incremento de inversión en cada pérdida
var max_attemps = null;//Cantidad máxima de intentos seguidos que deben ejecutarse

//Precio de perdida en que el sistema se detiene
var stop_loss = null;

//El precio de perdida se calcula de acuerdo a la ganancia
//máxima obtenida
var stop_loss_dynamic = true;

//Ganancias actuales
var global_current_gain = 0;

//Ganancia máxima obtenida
var global_max_gain = 0;

//Determina si se está ejecutando una entrada de martingala global 
//(Martingala global: cuando no se ejecuta martingala con cada divisa por separado sino analizando varias divisas)
var global_martingala_is_running = false;

//Identificador del activo que está ejecutando la entrada martingala global
var active_id_global_martingala_running = null;

var reasons_martingala = {
	broke_level:1,
	touch_level_upper:2,
	touch_level_lowwer:3,
	upper_wick_big:4,
	lowwer_wick_big:5,
	traders_mood:6,
	cancel_for_inadequate_traders_mood:7,
	inverted_for_inadequate_traders_mood:8,
	reassigned_for_big_small:9,
	broke_level_continuous:10,
	trend:11,
	heritage:12,
	inverted_for_small_broke_level:13,
	inverted_for_big_trend:14,
	inverted_for_jump_between_levels:15,
	cancel_for_jump_between_levels:16,
	cancel_for_high_speed:17,
	reassigned_by_several_failed_entries:18,
	cancel_for_jump_against:19,
};

/**
 * Restablecimiento de intentos martingala
 */
function resetAttemps(data_currency_pair) {
	data_currency_pair.attemps = 0;
}

/**
 * Incrementa la inversión de acuerdo a la configuración
 */
function increaceCurrentAmount(data_currency_pair){
	setCurrentAmount(data_currency_pair.current_amount * factor_increase, data_currency_pair);
}

/**
 * Restaura los valores de inversión
 */
function resetCurrentAmount(data_currency_pair){
	resetAttemps(data_currency_pair);
	setCurrentAmount(initial_amount, data_currency_pair);   
}  

/**
* Asigna un nuevo valor al current_amount
* @param {Number} new_current_amount [Nuevo importe]
*/
function setCurrentAmount(new_current_amount = 1, data_currency_pair){
	data_currency_pair.current_amount = new_current_amount;
}


function startMartingala(){
	if(!run_martingala){
		console.log('Martingala iniciado');
		run_martingala = true;
		global_max_gain = 0;
		global_current_gain = 0;
		for(var key in data_currency_pairs){
			if(data_currency_pairs[key].active){
				data_currency_pairs[key].current_amount = initial_amount;
				data_currency_pairs[key].attemps = 0;
				data_currency_pairs[key].option_equal = false;
				data_currency_pairs[key].id_martingala = null;
				data_currency_pairs[key].current_gain = 0;
				data_currency_pairs[key].max_gain = 0;
				data_currency_pairs[key].data_entries = [];
			}
		}
	}
}

function stopMartingala(){
	if(run_martingala){
		console.log('Martingala detenido');
		
		run_martingala = false;
		global_max_gain = 0;
		global_current_gain = 0;
		
		for(var key in data_currency_pairs){
			data_currency_pairs[key].active = true;
			data_currency_pairs[key].current_amount = initial_amount;
			data_currency_pairs[key].attemps = 0;
			data_currency_pairs[key].option_equal = false;
			data_currency_pairs[key].id_martingala = null;
			data_currency_pairs[key].current_gain = 0;
			data_currency_pairs[key].max_gain = 0;
			data_currency_pairs[key].data_entries = [];
		}
	}
}

function startMartingalaCurrencyPair(data_currency_pair){
	if(run_martingala){
		if(!data_currency_pair.active){
			data_currency_pair.active = true;
			data_currency_pair.current_amount = initial_amount;
			data_currency_pair.attemps = 0;
			data_currency_pair.option_equal = false;
			data_currency_pair.id_martingala = null;
			data_currency_pair.current_gain = 0;
			data_currency_pair.max_gain = 0;
			data_currency_pair.data_entries = [];
		}
	}
}

function stopMartingalaCurrencyPair(data_currency_pair){
	if(run_martingala){
		if(data_currency_pair.active){
			data_currency_pair.active = false;
			data_currency_pair.current_amount = initial_amount;
			data_currency_pair.attemps = 0;
			data_currency_pair.option_equal = false;
			data_currency_pair.id_martingala = null;
			data_currency_pair.current_gain = 0;
			data_currency_pair.max_gain = 0;
			data_currency_pair.data_entries = [];
		}
	}
}

/**
 * Si una entrada no se ejecuta en el sistema
 * se restablecen los valores
 */
function rollbackEntryMartingala(data_currency_pair){
	if(data_currency_pair.option_currently_open){
		data_currency_pair.attemps--;
		data_currency_pair.option_currently_open = false;
		data_currency_pair.attemps_direction += data_currency_pair.last_direction == 1?-1:1;
		data_currency_pair.data_entries.splice(0, 1);

		last_candle = data_currency_pair.currency_pair.getLastCandle();

		last_candle.alert_martingala = null;
		last_candle.update();

		//Si era un intento mayor al primero se debe realizar entrada obligatoria
		if(data_currency_pair.attemps > 0){
			data_currency_pair.mandatory_entry = true;
		}else{
			//Si martingala se esta ejecturando de manera global
			//y era el primer intento se restablecen los valores globales
			if(!config_trading.individual_martingala){
				global_martingala_is_running = false;
				active_id_global_martingala_running = null;
			}
		}
	}
}

/**
 * Realiza una entrada en el mercado
 * @param  {Boolean} direction [Dirección de la entrada true => alcista false => bajista]
 */
function enterNow(direction = true, data_currency_pair){
	let new_last_entry = new Date();
	new_last_entry = new_last_entry.getHours()+':'+new_last_entry.getMinutes();

	if(new_last_entry != data_currency_pair.last_entry){
		data_currency_pair.last_entry = new_last_entry;

		startEntry(direction?'call':'put', data_currency_pair.active_id, data_currency_pair.current_amount, data_currency_pair.current_utility);
	}
}

function startEntryMartingala(id_alert, direction, data_currency_pair) {
	if(run_martingala && max_attemps == null || data_currency_pair.attemps < max_attemps){
		var launch_alert = true;

		//SI se está ejecutando martingala de manera global
		//y hay una alerta corriendo pero de diferente par de divisas
		//no se debe ejecutar la entrada actual
		if(!config_trading.individual_martingala && global_martingala_is_running && data_currency_pair.active_id != active_id_global_martingala_running){
			return false;
		}

		//si es el primer intento pero tiene el mismo id
		//significa que es un intento más de una entrada fallida anterior
		//por lo cual no se debe lanzar la alerta
		if(data_currency_pair.attemps == 0 && data_currency_pair.id_martingala == id_alert && !data_currency_pair.option_equal){
			launch_alert = false;

			//SI se está ejecutando martingala de manera global
			if(!config_trading.individual_martingala){
				global_martingala_is_running = false;
				active_id_global_martingala_running = null;
			}
		}

		if(launch_alert){
			//si no es el primer intento y no es un empate se incrementa el importe
			if(data_currency_pair.attemps > 0/*attemps > 1*/ && !data_currency_pair.option_equal){
				increaceCurrentAmount(data_currency_pair);
			}

			data_currency_pair.id_martingala = id_alert;

			//siempre se restablece el valor de esta variable
			data_currency_pair.option_equal = false;

			data_currency_pair.last_entry = null;

			var send_entry = true;

			if(typeof stop_loss == 'number'){
				if(stop_loss_dynamic){
					//Si se ejecuta martingala individual en cada divisa
					//y las ganancias actuales menos el valor de la
					//inversión actual sobrepasan las perdidas permitidas
					//segun el stop_loss dinámico se detienen las entradas
					if(config_trading.individual_martingala && (data_currency_pair.current_gain - data_currency_pair.current_amount) < (data_currency_pair.max_gain - stop_loss)){
						send_entry = false;
					}
					//Si se ejecuta martingala de manera global
					//y las ganancias actuales menos el valor de la
					//inversión actual sobrepasan las perdidas permitidas
					//segun el stop_loss dinámico se detienen las entradas
					else if(!config_trading.individual_martingala && (global_current_gain - data_currency_pair.current_amount) < (global_max_gain - stop_loss)){
						send_entry = false;

						global_martingala_is_running = false;
						active_id_global_martingala_running = null;
					}
				}else{
					//Si se ejecuta martingala individual en cada divisa
					//y las ganancias actuales menos el valor de la
					//inversión actual sobrepasan las perdidas del stop_loss
					//se detienen las entradas
					if((data_currency_pair.current_gain - data_currency_pair.current_amount) < (stop_loss * -1)){
						send_entry = false;
					}
					//Si se ejecuta martingala de maneraglobal
					//y las ganancias actuales menos el valor de la
					//inversión actual sobrepasan las perdidas del stop_loss
					//se detienen las entradas
					else if(!config_trading.individual_martingala && (global_current_gain - data_currency_pair.current_amount) < (stop_loss * -1)){
						send_entry = false;

						global_martingala_is_running = false;
						active_id_global_martingala_running = null;
					}
				}
			}

			if(send_entry){
				console.log('Velocidad en la entrada: '+data_currency_pair.currency_pair.speed);
				enterNow(direction == 1?true:false, data_currency_pair);

				data_currency_pair.option_currently_open = true;
				data_currency_pair.entry_confirmed = false;
				data_currency_pair.attemps++;

				//Si martingala corre de manera global
				if(!config_trading.individual_martingala){
					global_martingala_is_running = true;
					active_id_global_martingala_running = data_currency_pair.active_id;
				}

				data_currency_pair.data_entries.push({
					amount:data_currency_pair.current_amount,
					utility:data_currency_pair.current_utility
				})

				setTimeout(function(){
					data_currency_pair.last_entry = null;
				}, 10000)
			}else{
				//si no se puede realizar la entrada se reinician los valores de inversión
				resetCurrentAmount(data_currency_pair);
			}
		}
	}else if(data_currency_pair.attemps >= max_attemps){
		//Si ya se llegó al tope de los intentos permitidos
		resetCurrentAmount(data_currency_pair);
	}
}

function stopEntriesMartingala(data_currency_pair) {
	if(run_martingala)
		resetCurrentAmount(data_currency_pair);
}
let ws = null;
let domain = "iqoption.com";
let user_balance_id = null;

/**
 * Conexion a websocket
 * @return {[type]} [description]
 */
function connectToServer() {
    (ws = new WebSocket("wss://" + domain + "/echo/websocket")).onopen = function() {
        console.log("CONEXION WEB SOCKET ESTABLECIDA");
        ws.send('{"name":"ssid","msg":"'+getCookie('ssid')+'"}');
        ws.send('{"msg":"","name":"api_option_init_all"}')
    }
    
    ws.onclose = function(e) {
        console.log("CONEXION WEB SOCKET CERRADA «" + e.code + "». RAZÓN «" + e.reason + "»."),
        connectToServer();
    }
    
    ws.onmessage = function(e) {
    	if(e.data && JSON.parse(e.data).name == 'api_option_init_all_result'){
            //console.log(JSON.parse(e.data));
            try {
                syncDataCurrencyPairs(JSON.parse(e.data).msg.result.turbo.actives);
            } catch(e) {
                // statements
                console.log(e);
            }
        }else if(e.data && JSON.parse(e.data).name != 'timeSync'){
            //console.log(JSON.parse(e.data));
        }
    }
    
    ws.onerror = function(e) {
        console.log("ERROR EN WEBSOCKET: «" + e.message + "».")
    }
}

function requestSyncDataCurrencyPairs(){
    if(ws){
        ws.send('{"msg":"","name":"api_option_init_all"}');
    }
}

function syncDataCurrencyPairs(actives){
    for(const k in actives){
        if('_'+k in data_currency_pairs){
            data_currency_pairs['_'+k].enabled = actives[k].enabled;
            data_currency_pairs['_'+k].current_utility = actives[k].option.profit.commission && actives[k].option.profit.commission > 1?parseInt(100 - actives[k].option.profit.commission):null;

            //Si la divisa esta habilitada
            if(actives[k].enabled){
                //Si la divisa no tiene una opcion abierta
                if(!data_currency_pairs['_'+k].option_currently_open){
                    //Si hay menos de 5 minutos de entradas se desabilitan
                    let new_enabled = Object.keys(actives[k].option.bet_close_time).length < 5?false:true;

                    //Si aun sigue habilitado
                    if(new_enabled){
                        for(const key in actives[k].option.bet_close_time){
                            if(!actives[k].option.bet_close_time[key].enabled)
                                new_enabled = false;
                        }  

                        data_currency_pairs['_'+k].enabled = new_enabled;
                    }
                }
            }
        }
    }
}

/**
 * Determina cuando expira la siguiente opción
 */
function getNextExpirationTime(){
	var date = new Date();
	var add_minutes = 2;
	if(date.getSeconds() < 30){
		add_minutes = 1;
	}

	date.setSeconds(0, 0);
	date.setMinutes(date.getMinutes() + add_minutes);

	return date.getTime().toString().substr(0,10);
}

/**
 * Ejecuta una entrada en el sistema
 * 
 * @param  {String} direction       [Direccion de compra "put" o "call"]
 * @param  {Number} active_id       [Id del activo]
 * @param  {Number} price           [Valor del importe]
 * @param  {Number} profit_percent  [Porentaje de utilidad]
 */
function startEntry(direction, active_id, price, profit_percent){
	if(ws && direction && user_balance_id && active_id && price && profit_percent)
		ws.send('{"name":"sendMessage","msg":{"name":"binary-options.open-option","version":"1.0","body":{"user_balance_id":'+user_balance_id+',"active_id":'+active_id+',"option_type_id":3,"direction":"'+direction+'","expired":'+getNextExpirationTime()+',"refund_value":0,"price":'+price+',"value":0,"profit_percent":'+profit_percent+'}}}');
}
class CurrencyPair {

	constructor(name,big,candles_direction,candles_count,avg_candles_size,next_bullish_entry,next_bear_entry,probability_bullish_entry,probability_bear_entry,last_candles, data_trend) {
	  	this.name = name;
		this.big = big;
		this.candles_direction = candles_direction;
		this.candles_count = candles_count;
		this.avg_candles_size = avg_candles_size;
		this.next_bullish_entry = next_bullish_entry;
		this.next_bear_entry = next_bear_entry;
		this.probability_bullish_entry = probability_bullish_entry;
		this.probability_bear_entry = probability_bear_entry;
		this.last_candles = last_candles?last_candles:[];
		this.data_trend = data_trend;
		this.last_values = [];
		this.forecast_data = {
    		number_or_forecast:0,
    		success_rate:0
    	};
		this.speed = 0;
	}

	requestSync() {
		return fetch("http://127.0.0.1:8000/api/currency-pair/request-sync/"+this.name, {mode: 'no-cors'});
	}

	dataSync(data){
		//this.name = data.name;
		this.big = data.big;
		this.candles_direction = data.candles_direction;
		this.candles_count = data.candles_count;
		this.avg_candles_size = data.avg_candles_size;
		this.next_bullish_entry = data.next_bullish_entry;
		this.next_bear_entry = data.next_bear_entry;
		this.next_level_upper = data.next_level_upper;
		this.next_level_lowwer = data.next_level_lowwer;
		this.probability_bullish_entry = data.probability_bullish_entry;
		this.probability_bear_entry = data.probability_bear_entry;
		//this.last_candles = data.last_candles;
		this.data_trend = data.data_trend;
	}

	requestUpdateLevels(value){
		const url = "http://127.0.0.1:8000/api/currency-pair/request-update-levels/"+this.name+"/"+value;
		setTimeout(function(){
			return fetch(url, {mode: 'no-cors'});	
		}, 7000)
	}

	addLastValue(value){
		this.last_values.push(value);

		//Si hay N valores se empieza a eliminar el primero
		if(this.last_values.length > config_trading.values_for_calculate_speed){
			this.last_values.splice(0, (this.last_values.length - config_trading.values_for_calculate_speed));
		}

		let speed = 0;

		if(this.last_values.length > 1){
			for (var i = 1; i < this.last_values.length; i++) {
				//El dato actual es mayor al anterior
				if(this.last_values[i] > this.last_values[(i - 1)]){
					speed += this.last_values[i] - this.last_values[(i - 1)];
				}else{
					speed += this.last_values[(i-1)] - this.last_values[i];
				}
			}	

			speed = speed / (this.last_values.length - 1);
		}

		//La velocidad promedio en porcentaje se calcula tomando como 100% 
		//la conversión del tamaño promedio de velas en porcentaje (avg_candles_size) a 
		//la unidad de medida original, por tanto:
		//El movimiento promedio calculado es un porcentaje del tamaño de velas promedio
		speed = (speed * 100)/((this.avg_candles_size * this.big)/100);

		this.speed = parseFloat(speed).toFixed(2);
	}

	/**
	 * Determina cuantas rupturas de nivel tiene los ultimos datos
	 */
	setLastBrokesLevel(){
		let count_brokes = 0;

		if(this.last_candles.length <= config_trading.max_candles_for_set_brokes_level){
			for(let i = 0; i < this.last_candles.length; i++){
				count_brokes += (this.last_candles[i].is_broke_level?1:0);
			}
		}else{
			for(let i = (this.last_candles.length - config_trading.max_candles_for_set_brokes_level); i < config_trading.max_candles_for_set_brokes_level; i++){
				count_brokes += (this.last_candles[i].is_broke_level?1:0);
			}
		}

		this.last_brokes_level = count_brokes;
	}

	/**
	 * Retorna la ultima vela almacenada en el objeto
	 */
	getLastCandle(){
		if(this.last_candles.length){
			return this.last_candles[this.last_candles.length - 1];
		}
		return null;
	}

	/**
	 * Retorna la penúltima vela almacenada en el objeto
	 */
	getPenultimateCandle(){
		if(this.last_candles.length > 1){
			return this.last_candles[this.last_candles.length - 2];
		}
		return null;
	}

	/**
	 * Evalua si la ultima vela genera alerta de entrada
	 * y si se debe ejecutar la entrada
	 */
	evaluateLastAlertMartingala(current_open, data_currency_pair)
    {
        let last_candle = this.getLastCandle();
        if(last_candle){
	        let launch_alert = false;

	        //Tmaño máximo de salto permitido para la primera entrada
	        let max_jump = (((this.avg_candles_size * this.big)/100) * config_trading.max_jump_allowed_after_touch_level) / 100;

	        //si se creó alerta en la vela anterior
	        if(last_candle.alert_martingala == -1 || last_candle.alert_martingala == 1){
	            //vela alcista
	            if(last_candle.direction == 1){
	                //alerta por ruptura de nivel ruptura de nivel
	                if(last_candle.close > last_candle.level_martingala && last_candle.open < last_candle.level_martingala){
	                    launch_alert = true;

	                    //si hay salto al nivel anterior se recalculan los niveles
	                    if(current_open < last_candle.level_martingala){
	                        this.requestUpdateLevels(current_open);
	                    }

	                //si el cierre de la vela alcista es menor al nivel de la alerta
	                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
	                }else if(last_candle.close <= last_candle.level_martingala){
	                	//Si es el primer intento
	                	//Y existe un salto en ontra de la direccion de entrada (Bajista)
	                	if(data_currency_pair.attemps == 0 && (last_candle.close + max_jump) < current_open){
	                		last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_against);
	                        config_trading.active_log_martingala?console.log('Alerta cancelada por salto de precio en sentido contrario'):null;
	                	}else{
		                    //la alerta se puede enviar si es alcista
		                    //o si es bajista pero no hay un salto al siguiente nivel
		                    if(last_candle.alert_martingala == 1 || (last_candle.alert_martingala == -1 && this.next_level_upper > current_open)){
		                        launch_alert = true;
		                    }else{
		                        //si existe un salto al siguiente nivel la alerta se invierte
		                        //siempre y cuando el envío sea obligatorio
		                        if(last_candle.martingala_mandatory_shipping == 1){
		                            last_candle.alert_martingala = 1;
		                            launch_alert = true;
		                            last_candle.reasons_martingala += ("_"+reasons_martingala.inverted_for_jump_between_levels);
		                            config_trading.active_log_martingala?console.log('Alerta invertida por salto entre niveles'):null;
		                        }else{
		                            //la alerta no se envía y se calculan los niveles
		                            last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_between_levels);
		                            config_trading.active_log_martingala?console.log('Alerta cancelada por ruptura en salto'):null;
		                            this.requestUpdateLevels(current_open);
		                        }
		                    }
		                }
	                //si el cierre de la vela alcista es mayor al nivel de la alerta
	                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
	                }else if(last_candle.close >= last_candle.level_martingala){
	                    //la alerta se puede enviar si es bajista
	                    //o si es alcista pero no hay un salto al nivel anterior
	                    if(last_candle.alert_martingala == -1 || (last_candle.alert_martingala == 1 && this.next_level_lowwer < current_open)){
	                        launch_alert = true;
	                    }else{
	                        //si existe un salto al nivel anterior la alerta se invierte
	                        //siempre y cuando el envío sea obligatorio
	                        if(last_candle.martingala_mandatory_shipping == 1){
	                            last_candle.alert_martingala = -1;
	                            launch_alert = true;
	                            last_candle.reasons_martingala += ("_"+reasons_martingala.inverted_for_jump_between_levels);
	                            config_trading.active_log_martingala?console.log('Alerta invertida por salto entre niveles'):null;
	                        }else{
	                            //la alerta no se envía y se calculan los niveles
	                            config_trading.active_log_martingala?console.log('Alerta cancelada por ruptura en salto'):null;
	                            last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_between_levels);
	                            this.requestUpdateLevels(current_open);
	                        }
	                    }
	                }else{
	                    //la alerta fue creada de otra forma
	                    launch_alert = true;
	                }
	            
	            //vela bajista
	            }else if(last_candle.direction == -1){
	                //alerta por ruptura de nivel
	                if(last_candle.close < last_candle.level_martingala && last_candle.open > last_candle.level_martingala){
	                    launch_alert = true;

	                    //si hay salto al siguiente nivel se recalculan los niveles
	                    if(current_open > last_candle.level_martingala){
	                        this.requestUpdateLevels(current_open);
	                    }

	                //si el cierre de la vela bajista es mayor al nivel de la alerta
	                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
	                }else if(last_candle.close >= last_candle.level_martingala){
	                	//Si es el primer intento
	                	//Y existe un salto en contra de la direccion de entrada (Alcista)
	                	if(data_currency_pair.attemps == 0 && (last_candle.close - max_jump) > current_open){
	                		last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_against);
	                        config_trading.active_log_martingala?console.log('Alerta cancelada por salto de precio en sentido contrario'):null;
	                	}else{

		                    //la alerta se puede enviar si es bajista
		                    //o si es alcista pero no hay un salto al nivel anterior
		                    if(last_candle.alert_martingala == -1 || (last_candle.alert_martingala == 1 && this.next_level_lowwer < current_open)){
		                        launch_alert = true;
		                    }else{
		                        //si existe un salto al nivel anterior la alerta se invierte
		                        //siempre y cuando el envío sea obligatorio
		                        if(last_candle.martingala_mandatory_shipping == 1){
		                            last_candle.alert_martingala = -1;
		                            launch_alert = true;
		                        }else{
		                        	last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_between_levels);
		                            //la alerta no se envía y se calculan los niveles
		                            config_trading.active_log_martingala?console.log('Alerta cancelada por ruptura en salto'):null;
		                            this.requestUpdateLevels(current_open);
		                        }
		                    }
		                }
	                //si el cierre de la vela bajista es menor al nivel de la alerta
	                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
	                }else if(last_candle.close <= last_candle.level_martingala){
	                    //la alerta se puede enviar si es alcista
	                    //o si es bajista pero no hay un salto al nivel superior
	                    if(last_candle.alert_martingala == 1 || (last_candle.alert_martingala == -1 && this.next_level_upper > current_open)){
	                        launch_alert = true;
	                    }else{
	                        //si existe un salto al nivel superopr la alerta se invierte
	                        //siempre y cuando el envío sea obligatorio
	                        if(last_candle.martingala_mandatory_shipping == 1){
	                            last_candle.alert_martingala = 1;
	                            launch_alert = true;
	                        }else{
	                        	last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_between_levels);
	                            //la alerta no se envía y se calculan los niveles
	                            config_trading.active_log_martingala?console.log('Alerta cancelada por ruptura en salto'):null;
	                            this.requestUpdateLevels(current_open);
	                        }
	                    }
	                }else{
	                    //la alerta fue creada de otra forma
	                    launch_alert = true;
	                }
	            }else if(last_candle.direction == 0){
	            	//Si es el primer intento y es toque de nivel inferior
                	//Y existe un salto en contra de la direccion de entrada (Alcista)
                	if(data_currency_pair.attemps == 0 && last_candle.alert_martingala == 1 && (last_candle.close - max_jump) > current_open){
                		last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_against);
                        config_trading.active_log_martingala?console.log('Alerta cancelada por salto de precio en sentido contrario'):null;
                	}
                	//Si es el primer intento y es toque de nivel superior
                	//Y existe un salto en contra de la direccion de entrada (Bajista)
                	else if(data_currency_pair.attemps == 0 && last_candle.alert_martingala == -1 && (last_candle.close + max_jump) < current_open){
                		last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_against);
                        config_trading.active_log_martingala?console.log('Alerta cancelada por salto de precio en sentido contrario'):null;
                	}else{

		                //si el cierre de la vela es menor al nivel de la alerta
		                if(last_candle.close <= last_candle.level_martingala){
		                    //la alerta se puede enviar si es alcista
		                    //o si es bajista pero no hay un salto al siguiente nivel
		                    if(last_candle.alert_martingala == 1 || (last_candle.alert_martingala == -1 && this.next_level_upper > current_open)){
		                        launch_alert = true;
		                    }else{
		                        //si existe un salto al siguiente nivel la alerta se invierte
		                        //siempre y cuando el envío sea obligatorio
		                        if(last_candle.martingala_mandatory_shipping == 1){
		                            last_candle.alert_martingala = 1;
		                            launch_alert = true;
		                        }else{
		                        	last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_between_levels);
		                            //la alerta no se envía y se calculan los niveles
		                            config_trading.active_log_martingala?console.log('Alerta cancelada por ruptura en salto'):null;
		                            this.requestUpdateLevels(current_open);
		                        }
		                    }
		                //si el cierre de la vela alcista es mayor al nivel de la alerta
		                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
		                }else if(last_candle.close >= last_candle.level_martingala){
		                    //la alerta se puede enviar si es bajista
		                    //o si es alcista pero no hay un salto al nivel anterior
		                    if(last_candle.alert_martingala == -1 || (last_candle.alert_martingala == 1 && this.next_level_lowwer < current_open)){
		                        launch_alert = true;
		                    }else{
		                        //si existe un salto al nivel anterior la alerta se invierte
		                        //siempre y cuando el envío sea obligatorio
		                        if(last_candle.martingala_mandatory_shipping == 1){
		                            last_candle.alert_martingala = -1;
		                            launch_alert = true;
		                        }else{
		                        	last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_between_levels);
		                            //la alerta no se envía y se calculan los niveles
		                            config_trading.active_log_martingala?console.log('Alerta cancelada por ruptura en salto'):null;
		                            this.requestUpdateLevels(current_open);
		                        }
		                    }
		                }else{
		                    //la alerta fue creada de otra forma
		                    launch_alert = true;
		                }
		            }
	            }

	        }

	        //la alerta cumple los criterios y se puede enviar
	        if(launch_alert){
	        	if(
	        		//velocidad permitida
	        		(
	        			this.speed <= config_trading.max_speed_for_entry
	        			&& this.speed >= config_trading.min_speed_for_entry
	        		)
	        		//velocidad NO permitida pero alerta obligatoria
	        		|| (
	        			(
	        				this.speed > config_trading.max_speed_for_entry 
	        				|| this.speed < config_trading.min_speed_for_entry 
	        			)
	        			&& last_candle.martingala_mandatory_shipping == 1
	        		)
        		){
	        		//Si se han perdido N intentos se realizan entradas solo en la dirección contraria a la
	        		//que ha tenido mas perdidas
	        		if(data_currency_pair.attemps >= config_trading.attemps_for_only_direction && data_currency_pair.attemps_direction != 0){
	        			last_candle.alert_martingala = data_currency_pair.attemps_direction > 0?-1:1;
		        		last_candle.reasons_martingala += ("_"+reasons_martingala.reassigned_by_several_failed_entries);
		        		config_trading.active_log_martingala?console.log('Entrada asigna en una sola dirección por perdidas consecutivas'):null;
	        		}else{
			            //Se suma el valor de la entrada para identificar la dirección con mas perdidas
			            data_currency_pair.attemps_direction += last_candle.alert_martingala;
			        }
			        //Se reasigna el valor del pronostico 
			        last_candle.forecast_for_next_candle = last_candle.alert_martingala;
			        //Se asigna el dato de pronostico
			        last_candle.reasons_martingala += "_FORECAST DIRECTION: "+last_candle.alert_martingala;
			        
			        startEntryMartingala(last_candle.id_martingala, last_candle.alert_martingala, data_currency_pair);
			        //Se asigna información de forecast
			        last_candle.reasons_martingala += "_FORECAST DATA: "+this.forecast_data.number_or_forecast+" - "+this.forecast_data.success_rate+"%";
			        data_currency_pair.last_direction = last_candle.alert_martingala;
		        }else{
		        	config_trading.active_log_martingala?console.log('Entrada cancelada por velocidad alta en movimiento de precio. Velocidad '+this.speed):null;
			        last_candle.reasons_martingala += "_"+reasons_martingala.cancel_for_high_speed+"_FORECAST DATA: "+this.forecast_data.number_or_forecast+" - "+this.forecast_data.success_rate+"%";
		        	last_candle.alert_martingala = null;
	                last_candle.level_martingala = null;
	                last_candle.id_martingala = null;
		        }

		        //Se actualiza la velocidad de movimiento
		        last_candle.speed = this.speed;

	        	setTimeout(function(){
                	last_candle.update();
                }, 3000);
		        config_trading.active_log_martingala?console.log('*******************************************************************'):null;
	        }else{
	            //si existía alerta pero no se envió
	            if(last_candle.alert_martingala == -1 || last_candle.alert_martingala == 1){
	                last_candle.alert_martingala = null;
	                last_candle.level_martingala = null;
	                last_candle.id_martingala = null;

	                setTimeout(function(){
	                	last_candle.update();
	                }, 3000);
	                config_trading.active_log_martingala?console.log('*******************************************************************'):null;
	            }
	        }
	    }
    }

    //Evalua los pronosticos generados por las velas
    evaluateForecasts(){
    	this.forecast_data = {
    		number_or_forecast:0,
    		success_rate:0
    	};

    	if(this.last_candles.length > 1){
    		let successes = 0;

    		let last_minute = null;

    		//Se evalua hasta la penultima vela para saber si la ultima cumple el pronostico
    		for (var i = 0; i < (this.last_candles.length - 1); i++) {
    			let date_last_candle = new Date(this.last_candles[i].date);

    			//las velas deben ser en minutos consecutivos
    			if(last_minute == null || last_minute == (date_last_candle.getMinutes() - 1) || (last_minute == 59 && date_last_candle.getMinutes() == 0)){
    				last_minute = date_last_candle.getMinutes();

	    			//Si existe pronostico
	    			if(this.last_candles[i].forecast_for_next_candle == 1 || this.last_candles[i].forecast_for_next_candle == -1){
	    				this.forecast_data.number_or_forecast++;
	    				//El pronostico se cumple
	    				if(this.last_candles[i].forecast_for_next_candle == this.last_candles[(i+1)].direction){
	    					successes++;
	    				}
	    			}
	    		}else{
	    			//si las velas no van en minutos conseutivos los datos
	    			//de pronostico se dejan en 0
	    			this.forecast_data = {
			    		number_or_forecast:0,
			    		success_rate:0
			    	};
			    	return false;
	    		}
    		}

    		//Se calcula el porcentaje de acierto
    		this.forecast_data.success_rate = successes > 0?((successes * 100)/this.forecast_data.number_or_forecast):0;
    		this.forecast_data.success_rate = parseFloat(parseFloat(this.forecast_data.success_rate).toFixed(2));
    	}
    }
}
class Candle {

	constructor(name,open,close,min,max,date,time,candle_size,direction,volume, currency_pair) {
	  	this.name = name;
        this.open = open;
        this.close = close;
        this.min = min;
        this.max = max;
        this.date = date;
        this.time = time;
        this.candle_size = candle_size;
        this.direction = direction;
        this.volume = volume;
        this.speed = currency_pair?currency_pair.speed:0;
        this.reasons_martingala = "";
        this.currency_pair = currency_pair;
	}

	save(){
	    let params = this.name
	        +'/'+this.open
	        +'/'+this.close
	        +'/'+this.min
	        +'/'+this.max
	        +'/'+this.date
	        +'/'+this.time
	        +'/'+this.volume
	        +'/'+this.candle_size
	        +'/'+this.direction
	        +'/'+this.id_martingala
	        +'/'+this.alert_martingala
	        +'/'+this.martingala_mandatory_shipping
	        +'/'+this.level_martingala
	        +'/'+this.martingala_alert_value
	        +'/'+this.speed
	        +'/'+(this.reasons_martingala != ""?this.reasons_martingala:'undefined');

	    return fetch("http://127.0.0.1:8000/api/iq_value/add_candle/"+params, {mode: 'no-cors'});
	}

	update(){
		let params = this.name
			+'/'+this.date
			+'/'+this.id_martingala
	        +'/'+this.alert_martingala
	        +'/'+this.martingala_mandatory_shipping
	        +'/'+this.level_martingala
	        +'/'+this.martingala_alert_value
	        +'/'+this.result_alert_martingala
	        +'/'+(this.reasons_martingala != ""?this.reasons_martingala:'undefined')
	        +'/'+this.speed;

	    return fetch("http://127.0.0.1:8000/api/iq_value/update_candle/"+params, {mode: 'no-cors'});
	}

	/**
     * Se define la direccion de la vela
     * 1 -> en dirección alcista
     * 0 -> sin dirección
     * -1 -> en dirección bajista
     */
    setDirection()
    {
        this.direction = this.open < this.close?1:(this.open > this.close?-1:0); 
    }

    /**
     * Define el tamaño de una vela de acuerdo al tamaño definido
     * como big en la tabla de par de divisas
     */
    setCandleSize()
    {
        //se calcula la diferencia entre el precio de apertura y cierre de la vela
        //dependiendo de su dirección
        let difference = this.direction == 1?(this.close - this.open):(this.direction == -1?this.open - this.close:0);
        //se define el tamaño de la vela en porcentaje
        //calculando el 100% como el tamaño definido para una vela grande en 'currency_pairs'
        let size = (difference * 100)/this.currency_pair.big;
        this.candle_size = parseFloat(size).toFixed(2);
    }

    bodyMaxValue()
    {
        return this.direction == 1?this.close:this.open;
    }

    bodyMinValue()
    {
        return this.direction == -1?this.close:this.open;
    }

    getSizeBody(){
    	return this.bodyMaxValue() - this.bodyMinValue();
    }

    /**
     * Calcula el tamaño en unidades de la mecha
     * @param  boolean upper [Si es la mecha superior o la inferior]
     */
    getSizeWick(upper = true)
    {
        if(upper)
            return this.max - this.bodyMaxValue();   
        else
            return this.bodyMinValue() - this.min;   
    }

    /**
     * Calcula el tamaño de una mecha de vela en porcentaje de acuerdo al del cuerpo de la vela
     * @param  boolean           upper         [Si es la mecha superior o inferior]
     */
    getPercentageWick(upper = true)
    {
    	if(this.currency_pair){
    		let size_body = this.getSizeBody();

    		//si el tamaño de la vela es 0
    		//se establece el 1% de una vela grande como tamaño de vela
    		if(size_body == 0){
    			size_body = this.currency_pair.big / 100;
    		}
	        return (this.getSizeWick(upper) * 100)/size_body;
	        //return (this.getSizeWick(upper) * 100)/((this.currency_pair.big * this.currency_pair.avg_candles_size)/100);
	    }
	    return 0;
    }

    /**
     * Evalua si la vela debe lanzar una alerta de entrada
     */
    evaluateMartingala(data_currency_pair)
    {
        let last_candle = this.currency_pair.getPenultimateCandle();

        let traders_mood_bullish = data_currency_pair.traders_mood;
        let traders_mood_bearish = (data_currency_pair.traders_mood - 100) * -1;

        if(last_candle){
        	let evaluate_martingala = true;

        	//Si la vela anterior no tiene alertas
        	//O si tiene pero se empató en el primer intento
        	if(
        		(last_candle.alert_martingala != 1 && last_candle.alert_martingala != -1)
        		|| ((last_candle.alert_martingala == 1 || last_candle.alert_martingala == -1) && (data_currency_pair.option_equal && data_currency_pair.attemps == 0))
        	){
        		//SI se ha identificado alta velocidad
        		if(data_currency_pair.high_speed){
	        		evaluate_martingala = false;
	        	}

	        	//Si no tiene aciertos suficientes en el pronostico
	        	//o tiene más aciertos de los permitidos
	        	if(
	        		this.currency_pair.forecast_data.success_rate < config_trading.min_forecast_success_rate
	        		|| this.currency_pair.forecast_data.success_rate > config_trading.max_forecast_success_rate
	        		|| this.currency_pair.forecast_data.number_or_forecast < config_trading.min_number_or_forecast
	        	){
	        		evaluate_martingala = false;
	        	}
        	}

        	if(evaluate_martingala){
	            let trend = this.currency_pair.data_trend;

	            let min_trend = 0;

	    		if(trend){
	    			min_trend = config_trading.min_percentage_trend * (this.currency_pair.avg_candles_size / config_trading.avg_candles_size_for_trend);
	    		}

	            //si se presenta figura big-small
	            let figure_big_small = false;//this.evaluateFigureBigSmall();

	            let have_old_alert = false;

	            //si la vela anterior lanzó alerta
	            if(last_candle.alert_martingala == 1 || last_candle.alert_martingala == -1){
	                //si no se asignó un valor de apertura se asigna la apertura de la vela actual
	                if(last_candle.martingala_alert_value == null){
	                    last_candle.martingala_alert_value = this.open;
	                }

	                //se asigna el resultado de la entrada
	                last_candle.result_alert_martingala = data_currency_pair.last_entry_result;

	                //si la alerta se cumplió o se empató en el primer intento
	                if(data_currency_pair.last_entry_result == 1 || (data_currency_pair.last_entry_result == 0 && data_currency_pair.attemps == 0)){
	                	//SI se ha identificado alta velocidad
		        		if(data_currency_pair.high_speed){
			        		evaluate_martingala = false;
			        	}

			        	//Si no tiene aciertos suficientes en el pronostico
			        	//o tiene más aciertos de los permitidos
			        	if(
			        		this.currency_pair.forecast_data.success_rate < config_trading.min_forecast_success_rate
			        		|| this.currency_pair.forecast_data.success_rate > config_trading.max_forecast_success_rate
			        		|| this.currency_pair.forecast_data.number_or_forecast < config_trading.min_number_or_forecast
			        	){
			        		evaluate_martingala = false;
			        	}
	                    //fin de alertas martingala
	                    stopEntriesMartingala(data_currency_pair);
	                }else{
	                    have_old_alert = true;
	                }

	                last_candle.update();
	            }else{
	            	//Si existe obligatoriedad de entrada por entrada no enviada al servidor 
	            	//pero entradas martingala iniciadas
	            	if(data_currency_pair.mandatory_entry){
	            		have_old_alert = true;
	            	}
	            }

	            data_currency_pair.mandatory_entry = false;

	            //Si se puede evaluar martingala
	            if(evaluate_martingala){
		            //si aun no existen alertas martingala
		            if(!have_old_alert){

		            	//Se restablece la variable con la que se identifica la dirección de entradas con mas perdidas
		            	data_currency_pair.attemps_direction = 0;
		            	//Las alertas se pueden generar si no existen varias rupturas
		            	if(this.currency_pair.last_brokes_level < config_trading.amount_brokes_level_for_cancel_entry){
			                let next_direction = this.assumeNextDirectionWithLevels(data_currency_pair);

			                //si se asume alguna dirección por toque o ruptura de nivel
			                if(next_direction.direction != 0){
			                    let continue_ = false;
			                    //siguiente dirección es alcista y el estado de animo es adecuado
			                    if(next_direction.direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood){
			                        continue_ = true;
			                    }
			                    //siguiente dirección es bajista y el estado de animo es adecuado
			                    else if(next_direction.direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood){
			                        continue_ = true;
			                    }else{
			                        config_trading.active_log_martingala?console.log('Estado de ánimo no adecuado'):null;
			                        this.reasons_martingala += ("_"+reasons_martingala.inverted_for_inadequate_traders_mood);
			                    }

			                    if(!continue_)
			                        config_trading.active_log_martingala?console.log('Alerta invertida por estado de ánimo inadecuado'):null;
			                    //if(continue_){                    
			                        //si la dirección no corresponde con el estado de animo
			                        //se invierte
			                        this.alert_martingala = continue_?next_direction.direction:next_direction.direction * -1;
			                        this.level_martingala = next_direction.level;
			                        this.martingala_mandatory_shipping = -1;
			                        this.id_martingala = this.time;
			                    //}
			                    //
			                    if(figure_big_small){	
			                    	config_trading.active_log_martingala?console.log('Dirección reasignada por figura big-small'):null;
			                    	this.reasons_martingala += ("_"+reasons_martingala.reassigned_for_big_small);
			                    	this.alert_martingala = this.direction * -1;
			                    }
			                }else{
			                	if(!config_trading.start_entries_only_in_levels){
				                	next_direction = this.assumeNextDirectionWithWicks();

				                    //si se asume una dirección por las caracteristicas de las mechas de la vela
				                    //pero el estado de animo es inadecuado
				                    if(
				                        next_direction != 0 
				                        && (
				                            (next_direction == 1 && traders_mood_bullish < config_trading.min_traders_mood_wicks)
				                            ||(next_direction == -1 && traders_mood_bearish < config_trading.min_traders_mood_wicks)
				                        )
				                    ){
				                    	this.reasons_martingala += ("_"+reasons_martingala.cancel_for_inadequate_traders_mood);
				                        config_trading.active_log_martingala?console.log('Dirección de mecha eliminada por estado de ánimo insuficiente'):null;
				                    }

				                    //si se asume alguna dirección con mechas
				                    //y el estado de animo esta a favor en lo indicado en config
				                    if(
				                        next_direction != 0 
				                        && (
				                            (next_direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood_wicks)
				                            ||(next_direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood_wicks)
				                        )
				                    ){
				                        config_trading.active_log_martingala?console.log('Dirección asignada por mecha'):null;
				                        this.alert_martingala = next_direction;
				                        this.level_martingala = (next_direction == 1)?this.currency_pair.next_level_lowwer:this.currency_pair.next_level_upper;
				                        this.martingala_mandatory_shipping = -1;
			                        	this.id_martingala = this.time;

				                    //si existe tendencia alta
				                    //y el estado de animo esta a favor en lo indicado en config
				                    }else if(
				                        trend && trend.trend_size_percentage >= min_trend
				                        && (
				                            (trend.trend_direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood_trend)
				                            ||(trend.trend_direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood_trend)
				                        )
				                    ){
				                        config_trading.active_log_martingala?console.log('Dirección asignada por tendencia'):null;
				                        this.reasons_martingala += ("_"+reasons_martingala.trend);
				                        this.alert_martingala = trend.trend_direction;
				                        this.level_martingala = (trend.trend_direction == 1)?this.currency_pair.next_level_lowwer:this.currency_pair.next_level_upper;
				                        this.martingala_mandatory_shipping = -1;
			                        	this.id_martingala = this.time;
				                    }else{
				                        //si hay un estado de ánimo alcista grande
				                        if(traders_mood_bullish >= config_trading.min_traders_mood_without_direction){
				                            config_trading.active_log_martingala?console.log('Dirección asignada por estado de ánimo alcista'):null;
				                            this.reasons_martingala += ("_"+reasons_martingala.traders_mood);
				                            this.alert_martingala = 1;
				                        	this.level_martingala = this.currency_pair.next_level_lowwer;
				                        	this.martingala_mandatory_shipping = -1;
			                        		this.id_martingala = this.time;
				                        }
				                        //si hay un estado de ánimo bajista grande
				                        else if(traders_mood_bearish >= config_trading.min_traders_mood_without_direction){
				                            config_trading.active_log_martingala?console.log('Dirección asignada por estado de ánimo bajista'):null;
				                            this.reasons_martingala += ("_"+reasons_martingala.traders_mood);
				                            this.alert_martingala = -1;
				                        	this.level_martingala = this.currency_pair.next_level_upper;
				                        	this.martingala_mandatory_shipping = -1;
			                        		this.id_martingala = this.time;
				                        }

				                    }
				                }
			                }
			            }
		            }else{//si ya se han iniado las alertas y la ultima no se ganó

			            let next_direction = this.assumeNextDirectionWithLevels(data_currency_pair);
		            	
		            	//si las alertas deben ir en una sola dirección
		            	let only_one_direction = false;
			            if(this.is_broke_level && this.currency_pair.last_brokes_level >= config_trading.amount_brokes_level_only_one_direction){
			            	only_one_direction = true;
			            }
		                
		                this.id_martingala = last_candle.id_martingala;
		                //el envío de la alerta es obligatorio
		                this.martingala_mandatory_shipping = 1;

		                //Se asigna una dirección por retpuras de nivel seguidas
			            if(only_one_direction){
			            	config_trading.active_log_martingala?console.log('Dirección asignada por rupturas de nivel seguidas'):null;
			            	this.reasons_martingala += ("_"+reasons_martingala.broke_level_continuous);
			            	this.alert_martingala = last_candle.alert_martingala;
		                    this.level_martingala = last_candle.level_martingala;
			            }else{
			                //si se asume alguna dirección por toque o ruptura de nivel
			                if(next_direction.direction != 0){
			                    let continue_ = false;
			                    //siguiente dirección es alcista y el estado de animo es adecuado
			                    if(next_direction.direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood){
			                        continue_ = true;
			                    }
			                    //siguiente dirección es bajista y el estado de animo es adecuado
			                    else if(next_direction.direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood){
			                        continue_ = true;
			                    }else{
			                        config_trading.active_log_martingala?console.log('Estado de ánimo no adecuado'):null;
			                        this.reasons_martingala += ("_"+reasons_martingala.inverted_for_inadequate_traders_mood);
			                    }

			                    if(!continue_)
			                        config_trading.active_log_martingala?console.log('Alerta invertida por estado de ánimo inadecuado'):null;

			                    //if(continue_){
			                        this.alert_martingala = continue_?next_direction.direction:next_direction.direction * -1;
			                        this.level_martingala = next_direction.level;
			                    //}
			                    //
			                }else{
			                    next_direction = this.assumeNextDirectionWithWicks();

			                    //si se asume una dirección por las caracteristicas de las mechas de la vela
			                    //pero el estado de animo es inadecuado
			                    if(
			                        next_direction != 0 
			                        && (
			                            (next_direction == 1 && traders_mood_bullish < config_trading.min_traders_mood_wicks)
			                            ||(next_direction == -1 && traders_mood_bearish < config_trading.min_traders_mood_wicks)
			                        )
			                    ){
			                    	this.reasons_martingala += ("_"+reasons_martingala.cancel_for_inadequate_traders_mood);
			                        config_trading.active_log_martingala?console.log('Dirección de mecha eliminada por estado de ánimo insuficiente'):null;
			                    }

			                    //si se asume alguna dirección con mechas
			                    //y el estado de animo esta a favor en lo indicado en config
			                    if(
			                        next_direction != 0 
			                        && (
			                            (next_direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood_wicks)
			                            ||(next_direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood_wicks)
			                        )
			                    ){
			                        config_trading.active_log_martingala?console.log('Dirección asignada por mecha'):null;
			                        this.alert_martingala = next_direction;
			                        this.level_martingala = last_candle.level_martingala;

			                    //si existe tendencia alta
			                    //y el estado de animo esta a favor en lo indicado en config
			                    }else if(
			                        trend && trend.trend_size_percentage >= min_trend
			                        && (
			                            (trend.trend_direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood_trend)
			                            ||(trend.trend_direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood_trend)
			                        )
			                    ){
			                        config_trading.active_log_martingala?console.log('Dirección asignada por tendencia'):null;
			                        this.reasons_martingala += ("_"+reasons_martingala.trend);
			                        this.alert_martingala = trend.trend_direction;
			                        this.level_martingala = last_candle.level_martingala;
			                    }else{
			                        //si hay un estado de ánimo alcista grande
			                        if(traders_mood_bullish >= config_trading.min_traders_mood_without_direction){
			                            config_trading.active_log_martingala?console.log('Dirección asignada por estado de ánimo alcista'):null;
			                            this.reasons_martingala += ("_"+reasons_martingala.traders_mood);
			                            this.alert_martingala = 1;
			                        }
			                        //si hay un estado de ánimo bajista grande
			                        else if(traders_mood_bearish >= config_trading.min_traders_mood_without_direction){
			                            config_trading.active_log_martingala?console.log('Dirección asignada por estado de ánimo bajista'):null;
			                            this.reasons_martingala += ("_"+reasons_martingala.traders_mood);
			                            this.alert_martingala = -1;
			                        }
			                        //si no se asume dirección se deja la existente
			                        else{
			                            config_trading.active_log_martingala?console.log('Dirección asignada por herencia'):null;
			                            this.reasons_martingala += ("_"+reasons_martingala.heritage);
			                            this.alert_martingala = last_candle.alert_martingala;
			                        }
			                        this.level_martingala = last_candle.level_martingala;

			                    }
			                }

			                if((this.alert_martingala == 1 || this.alert_martingala == -1) && figure_big_small){
			                	config_trading.active_log_martingala?console.log('Dirección reasignada por figura big-small'):null;
			                	this.reasons_martingala += ("_"+reasons_martingala.reassigned_for_big_small);
			                	this.alert_martingala = this.direction * -1;
			                }
			            }
		            }
		        }
	        }

            if(this.alert_martingala == 1){
                config_trading.active_log_martingala?console.log('Estado de ánimo alcista: '+traders_mood_bullish):null;
                config_trading.active_log_martingala?console.log('Entrada alcista'):null;
                this.forecast_for_next_candle = 1;
                this.reasons_martingala += '_UTILITY: '+data_currency_pair.current_utility+'%';
            }else if(this.alert_martingala == -1){
                config_trading.active_log_martingala?console.log('Estado de ánimo bajista: '+traders_mood_bearish):null;
                config_trading.active_log_martingala?console.log('Entrada bajista'):null;
                this.forecast_for_next_candle = -1;
                this.reasons_martingala += '_UTILITY: '+data_currency_pair.current_utility+'%';
            }else{
            	//Si no se generó alerta se manda a calcular la predición para la siguiente vela
            	this.calculateForecastForNextCandle(data_currency_pair);
            }
        }
    }

    /**
     * Calcula la predicción para la dirección de la siguiente vela
     */
    calculateForecastForNextCandle(data_currency_pair){

    	config_trading.active_log_martingala?console.log('************************ INICIO DE INFORMACIÓN DE PRONOSTICO PARA SIGUIENTE VELA ***************************'):null;
    	this.reasons_martingala += '**';
    	let last_candle = this.currency_pair.getPenultimateCandle();

    	if(last_candle){

	        let traders_mood_bullish = data_currency_pair.traders_mood;
	        let traders_mood_bearish = (data_currency_pair.traders_mood - 100) * -1;
	        
	        let trend = this.currency_pair.data_trend;

	        let min_trend = 0;

			if(trend){
				min_trend = config_trading.min_percentage_trend * (this.currency_pair.avg_candles_size / config_trading.avg_candles_size_for_trend);
			}

	        //si se presenta figura big-small
	        let figure_big_small = false;//this.evaluateFigureBigSmall();

	        //Calcula si se puede definir una dircción por toque o ruptura de nivel
	        let next_direction = this.assumeNextDirectionWithLevels(data_currency_pair);
	    	
	    	//si las alertas deben ir en una sola dirección
	    	let only_one_direction = false;
	        if(this.is_broke_level && this.currency_pair.last_brokes_level >= config_trading.amount_brokes_level_only_one_direction){
	        	only_one_direction = true;
	        }

	        //No hay rutpuras de nivel seguidas
	        if(!only_one_direction){
	            //si se asume alguna dirección por toque o ruptura de nivel
	            if(next_direction.direction != 0){
	                let continue_ = false;
	                //siguiente dirección es alcista y el estado de animo es adecuado
	                if(next_direction.direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood){
	                    continue_ = true;
	                }
	                //siguiente dirección es bajista y el estado de animo es adecuado
	                else if(next_direction.direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood){
	                    continue_ = true;
	                }else{
	                    config_trading.active_log_martingala?console.log('Estado de ánimo no adecuado'):null;
	                    this.reasons_martingala += ("_"+reasons_martingala.inverted_for_inadequate_traders_mood);
	                }

	                if(!continue_)
	                    config_trading.active_log_martingala?console.log('Alerta invertida por estado de ánimo inadecuado'):null;

	                //if(continue_){
	                    this.forecast_for_next_candle = continue_?next_direction.direction:next_direction.direction * -1;
	                    this.level_martingala = next_direction.level;
	                //}
	                //
	            }else{
	            	if(!config_trading.start_entries_only_in_levels){
		                next_direction = this.assumeNextDirectionWithWicks();

		                //si se asume una dirección por las caracteristicas de las mechas de la vela
		                //pero el estado de animo es inadecuado
		                if(
		                    next_direction != 0 
		                    && (
		                        (next_direction == 1 && traders_mood_bullish < config_trading.min_traders_mood_wicks)
		                        ||(next_direction == -1 && traders_mood_bearish < config_trading.min_traders_mood_wicks)
		                    )
		                ){
		                	this.reasons_martingala += ("_"+reasons_martingala.cancel_for_inadequate_traders_mood);
		                    config_trading.active_log_martingala?console.log('Dirección de mecha eliminada por estado de ánimo insuficiente'):null;
		                }

		                //si se asume alguna dirección con mechas
		                //y el estado de animo esta a favor en lo indicado en config
		                if(
		                    next_direction != 0 
		                    && (
		                        (next_direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood_wicks)
		                        ||(next_direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood_wicks)
		                    )
		                ){
		                    config_trading.active_log_martingala?console.log('Dirección asignada por mecha'):null;
		                    this.forecast_for_next_candle = next_direction;
		                    this.level_martingala = (next_direction == 1)?this.currency_pair.next_level_lowwer:this.currency_pair.next_level_upper;

		                //si existe tendencia alta
		                //y el estado de animo esta a favor en lo indicado en config
		                }else if(
		                    trend && trend.trend_size_percentage >= min_trend
		                    && (
		                        (trend.trend_direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood_trend)
		                        ||(trend.trend_direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood_trend)
		                    )
		                ){
		                    config_trading.active_log_martingala?console.log('Dirección asignada por tendencia'):null;
		                    this.reasons_martingala += ("_"+reasons_martingala.trend);
		                    this.forecast_for_next_candle = trend.trend_direction;
		                    this.level_martingala = (trend.trend_direction == 1)?this.currency_pair.next_level_lowwer:this.currency_pair.next_level_upper;
		                }else{
		                    //si hay un estado de ánimo alcista grande
		                    if(traders_mood_bullish >= config_trading.min_traders_mood_without_direction){
		                        config_trading.active_log_martingala?console.log('Dirección asignada por estado de ánimo alcista'):null;
		                        this.reasons_martingala += ("_"+reasons_martingala.traders_mood);
		                        this.forecast_for_next_candle = 1;
		                        this.level_martingala = this.currency_pair.next_level_lowwer;
		                    }
		                    //si hay un estado de ánimo bajista grande
		                    else if(traders_mood_bearish >= config_trading.min_traders_mood_without_direction){
		                        config_trading.active_log_martingala?console.log('Dirección asignada por estado de ánimo bajista'):null;
		                        this.reasons_martingala += ("_"+reasons_martingala.traders_mood);
		                        this.forecast_for_next_candle = -1;
		                        this.level_martingala = this.currency_pair.next_level_upper;
		                    }
		                }
		            }
	            }

	            if((this.forecast_for_next_candle == 1 || this.forecast_for_next_candle == -1) && figure_big_small){
	            	config_trading.active_log_martingala?console.log('Dirección reasignada por figura big-small'):null;
	            	this.reasons_martingala += ("_"+reasons_martingala.reassigned_for_big_small);
	            	this.forecast_for_next_candle = this.direction * -1;
	            	this.reasons_martingala += '_UTILITY: '+data_currency_pair.current_utility+'%';
	            }

	            if(this.reasons_martingala != '**'){
	            	this.reasons_martingala += (this.forecast_for_next_candle == 1 || this.forecast_for_next_candle == -1)?("_FORECAST DIRECTION: "+this.forecast_for_next_candle):"";
	            	this.reasons_martingala += "_FORECAST DATA: "+this.currency_pair.forecast_data.number_or_forecast+" - "+this.currency_pair.forecast_data.success_rate+"%";
	            	this.reasons_martingala += '_UTILITY: '+data_currency_pair.current_utility+'%';
	            }
	        }  
	    }

        config_trading.active_log_martingala?console.log('************************ FIN DE INFORMACIÓN DE PRONOSTICO PARA SIGUIENTE VELA ***************************'):null;      
    }

    /**
     * Supone la dirección de la siguiente vela de acuerdo a sus niveles cercanos
     */
    assumeNextDirectionWithLevels(data_currency_pair)
    {   
        let data_return = {
            direction : 0,
            level : 0
        };

    	if(this.currency_pair && this.currency_pair.next_level_upper && this.currency_pair.next_level_lowwer && this.currency_pair.avg_candles_size){
    		let trend = this.currency_pair.data_trend;

    		let min_trend = 0;

    		if(trend){
    			min_trend = config_trading.min_percentage_trend * (this.currency_pair.avg_candles_size / config_trading.avg_candles_size_for_trend);
    		}

    		//La ruptura de niveles sólo se analiza cuando ya se han iniciado entradas martingala
    		if(data_currency_pair.attemps > 0){
		        //vela alcista y rompe nivel
		        if(this.direction == 1 && this.close > this.currency_pair.next_level_upper){
		        	this.is_broke_level = true;
		            //la dirección se asigna si la tendencia es grande, en sentido contrario a la tendencia
		            //la dirección se asigna si la vela es pequeña, en sentido contrario a la vela
		            //sino en sentido de la vela
		            config_trading.active_log_martingala?console.log('Dirección asignada por ruptura de nivel . vela alcista'):null;
		            this.reasons_martingala += ("_"+reasons_martingala.broke_level);
		            if(trend && trend.trend_direction == -1 && trend.trend_size_percentage >= min_trend){
		                config_trading.active_log_martingala?console.log('Dirección invertida por tendencia contraria grande'):null;
		                this.reasons_martingala += ("_"+reasons_martingala.inverted_for_big_trend);
		            }else if(this.candle_size <= (this.currency_pair.avg_candles_size * config_trading.factor_candle_small_broke)){
		                //config_trading.active_log_martingala?console.log('Dirección invertida por vela de ruptura pequeña'):null;
		                //this.reasons_martingala += ("_"+reasons_martingala.inverted_for_small_broke_level);

		            }
		            data_return.direction = (trend && trend.trend_direction == -1 && trend.trend_size_percentage >= min_trend)?-1:1;//((this.candle_size <= (this.currency_pair.avg_candles_size * config_trading.factor_candle_small_broke))?-1:1);
		            data_return.level = this.currency_pair.next_level_upper;
		            return data_return;
		        }//vela bajista y rompe nivel
		        else if(this.direction == -1 && this.close < this.currency_pair.next_level_lowwer){
		        	this.is_broke_level = true;
		            ////la dirección se asigna si la tendencia es grande, en sentido contrario a la tendencia
		            //la dirección se asigna si la vela es pequeña, en sentido contrario a la vela
		            //sino en sentido de la vela
		            config_trading.active_log_martingala?console.log('Dirección asignada por ruptura de nivel . vela bajista'):null;
		            this.reasons_martingala += ("_"+reasons_martingala.broke_level);
		            if(trend && trend.trend_direction == 1 && trend.trend_size_percentage >= min_trend){
		                config_trading.active_log_martingala?console.log('Dirección invertida por tendencia contraria grande'):null;
		                this.reasons_martingala += ("_"+reasons_martingala.inverted_for_big_trend);
		            }else if(this.candle_size <= (this.currency_pair.avg_candles_size * config_trading.factor_candle_small_broke)){
		                //config_trading.active_log_martingala?console.log('Dirección invertida por vela de ruptura pequeña'):null;
		                //this.reasons_martingala += ("_"+reasons_martingala.inverted_for_small_broke_level);

		            }
		            data_return.direction = (trend && trend.trend_direction == 1 && trend.trend_size_percentage >= min_trend)?1:-1;//((this.candle_size <= (this.currency_pair.avg_candles_size * config_trading.factor_candle_small_broke))?1:-1);
		            data_return.level = this.currency_pair.next_level_lowwer;
		            return data_return;
		        }
		    }

		    let distance_to_level = 0;
			let percentage_to_level = 0;

	        //se calcula si la mecha toca el nivel superior
	        //y la vela es alcista
		    if(this.bodyMaxValue() < this.currency_pair.next_level_upper && this.direction != -1){

		        distance_to_level = this.currency_pair.next_level_upper - this.max;
		        //distancia convertida a porcentaje de acuerdo al tamaño promedio de velas
		        percentage_to_level = (distance_to_level * 100)/((this.currency_pair.big * this.currency_pair.avg_candles_size)/100);
		        //si el máximo está cerca al siguiente nivel
		        if(percentage_to_level <= config_trading.proximity_to_level){
		            config_trading.active_log_martingala?console.log('Dirección asignada por toque de nivel superior'):null;
		            this.reasons_martingala += ("_"+reasons_martingala.touch_level_upper);
		            data_return.direction = -1;
		            data_return.level = this.currency_pair.next_level_upper;
		            return data_return;
		        }
		    }

	        //se calcula si la mecha toca el nivel inferior
	        //y la vela es bajista
	        if(this.bodyMinValue() > this.currency_pair.next_level_lowwer && this.direction != 1){
		        distance_to_level = this.min - this.currency_pair.next_level_lowwer;
		        //distancia convertida a porcentaje de acuerdo al tamaño promedio de velas
		        percentage_to_level = (distance_to_level * 100)/((this.currency_pair.big * this.currency_pair.avg_candles_size)/100);
		        //si el minimo está cerca al siguiente nivel
		        if(percentage_to_level <= config_trading.proximity_to_level){
		            config_trading.active_log_martingala?console.log('Dirección asignada por toque de nivel inferior'):null;
		            this.reasons_martingala += ("_"+reasons_martingala.touch_level_lowwer);
		            data_return.direction = 1;
		            data_return.level = this.currency_pair.next_level_lowwer;

		            return data_return;
		        }
		    }
		}
        return data_return;
    }

    /**
     * Supone la dirección de la siguiente vela de acuerdo a sus mechas
     */
    assumeNextDirectionWithWicks()
    {
    	if(this.currency_pair && this.currency_pair.avg_candles_size){

    		//Tamaño de las mechas de vela en porcentage de acuerdo al tamaño del cuerpo de la vela
	        let size_upper_wick = this.getPercentageWick(true);
	        let size_lowwer_wick = this.getPercentageWick(false);

	        //mecha inferior mas grande y tiene tamaño optimo
	        if(size_lowwer_wick > size_upper_wick && size_lowwer_wick >= config_trading.min_percentage_wick && size_lowwer_wick >= (size_upper_wick * config_trading.factor_for_small_wick)){
	            config_trading.active_log_martingala?console.log('Dirección asignada por mecha inferior grande'):null;
	            this.reasons_martingala += ("_"+reasons_martingala.lowwer_wick_big);
	            return 1;
	        }//mecha superior mas grande y tiene tamaño optimo
	        else if(size_lowwer_wick < size_upper_wick && size_upper_wick >= config_trading.min_percentage_wick && size_upper_wick >= (size_lowwer_wick * config_trading.factor_for_small_wick)){
	            config_trading.active_log_martingala?console.log('Dirección asignada por mecha superior grande'):null;
	            this.reasons_martingala += ("_"+reasons_martingala.upper_wick_big);
	            return -1;
	        }
	    }

        return 0;
    }

    /**
     * Evalua si se presenta la figura donde la ultima vela
     * es N veces más pequeña a la penultima y el sentido es contrario a la penultima
     * y la tendencia va a favor de la penultima
     */
    evaluateFigureBigSmall(){
    	if(this.currency_pair){
    		let trend = this.currency_pair.data_trend;

    		let last_candle = this.currency_pair.getPenultimateCandle();

    		if(last_candle){
    			//Las velas tienen una dirección diferente de 0 y son diferentes entre ellas
    			//y el tamaño de la ultima es mayor al minimo permitido
    			if(((this.candle_size * 100)/this.currency_pair.avg_candles_size) >= config_trading.min_size_figure_big_small && last_candle.direction != 0 && this.direction != last_candle.direction && this.direction != 0){
    				//si la penultima vela es N veces más grande de la actual, la tendencia la favorece
    				//y la vela pequeña no tiene señales de ir en contra a la dirección de la grande
    				if(last_candle.candle_size >= (this.candle_size * config_trading.factor_figure_big_small) && last_candle.direction == trend.trend_direction && this.assumeNextDirectionWithWicks() != this.direction){
    					return true;
    				}
    			}
    		}
    	}

    	return false;
    }
}
/**
 * Recive y analiza los datos que se generan dentro de cada minuto
 * @param  {[type]} data               [Datos enviados por el servidor]
 * @param  {[type]} data_currency_pair [Datos de configuracion del par de divi*/
function evaluateCandle(data, data_currency_pair){

	//Registra el ultimo valor y calcula la velocidad del movimiento
	if(data_currency_pair.currency_pair && 'close' in data){
		data_currency_pair.currency_pair.addLastValue(data.close);

		//Si se detecta un movimiento rápido
		if(data_currency_pair.currency_pair.speed > config_trading.speed_for_block_entries){
			let date_ = new Date();
			date_.setSeconds(date_.getSeconds() + config_trading.seconds_to_reset_number_of_fast_movements);

			//Fecha de restablecimiento de contador de movimientos rápidos
			data_currency_pair.reset_number_of_fast_movements_at = date_.getFullYear()
            +'-'+(date_.getMonth()+1)  
            +'-'+date_.getDate()  
            +' '+date_.getHours()
            +':'+date_.getMinutes()
            +':'+date_.getSeconds();

			data_currency_pair.number_of_fast_movements++;
            config_trading.active_log_martingala?console.log('Movimiento rápido detectado (actuales: '+data_currency_pair.number_of_fast_movements+')'):null;

            //Si no hay una opción abierta y la cantidad de movimientos rápidos
            //alcanza o supera el limite se bloquean las entradas por unos minutos
			if(!data_currency_pair.option_currently_open && data_currency_pair.number_of_fast_movements >= config_trading.number_of_fast_movements_to_block_entries){
				//Se desactivan las alertas por alta velocidad
				data_currency_pair.high_speed = true;

				let date_ = new Date();
				date_.setMinutes(date_.getMinutes() + config_trading.high_speed_lock_minutes);

				//Fecha de reactivación de entradas
				data_currency_pair.restart_high_speed_at = date_.getFullYear()
	            +'-'+(date_.getMonth()+1)  
	            +'-'+date_.getDate()  
	            +' '+date_.getHours()
	            +':'+date_.getMinutes();

	            data_currency_pair.number_of_fast_movements = 0;

	            config_trading.active_log_martingala?console.log('Alertas suspendidas por movimiento rápido del precio, se reactivaran automáticamente -> '+data_currency_pair.restart_high_speed_at):null;
			}
		}
	}

	//Si las alertas están suspendidas por alta velocidad
	if(data_currency_pair.high_speed){
		let current_date = new Date();

		current_date = current_date.getFullYear()
        +'-'+(current_date.getMonth()+1)  
        +'-'+current_date.getDate()  
        +' '+current_date.getHours()
        +':'+current_date.getMinutes();

        if(current_date == data_currency_pair.restart_high_speed_at){
        	data_currency_pair.high_speed = false;
        	config_trading.active_log_martingala?console.log('Alertas activadas nuevamente ***************'):null;
        }
	}

	//Si el contador de movimientos rápidos está iniciado
	if(data_currency_pair.number_of_fast_movements > 0){
		let current_date = new Date();

		current_date = current_date.getFullYear()
        +'-'+(current_date.getMonth()+1)  
        +'-'+current_date.getDate()  
        +' '+current_date.getHours()
        +':'+current_date.getMinutes()
        +':'+current_date.getSeconds();

        if(current_date == data_currency_pair.reset_number_of_fast_movements_at){
        	number_of_fast_movements = 0;
        	config_trading.active_log_martingala?console.log('Contador de movimientos rápidos restablecido ***************'):null;
        }
	}

	//time de la fecha del evento
	var time_date_at = data.at.toString().substr(0,13);
    var date_at = new Date();
    date_at.setTime(time_date_at);

    //fecha exacta de generación de los datos
    var date_send_at_s_s = date_at.getFullYear()
            +'-'+(date_at.getMonth()+1)  
            +'-'+date_at.getDate()  
            +' '+date_at.getHours()
            +':'+date_at.getMinutes()
            +':'+date_at.getSeconds();

    //a la fecha exacta se le resta un minuto para 
    //almacenarla en el sistema con el minuto en el cual se inicio
    //y no en el que terminó
    date_at.setMinutes(date_at.getMinutes() - 1);

    var date_send_at = date_at.getFullYear()
            +'-'+(date_at.getMonth()+1)  
            +'-'+date_at.getDate()  
            +' '+date_at.getHours()
            +':'+date_at.getMinutes()
            +':'+date_at.getSeconds();
    
    //si es el segundo 0 se establecen los parametros para
    //guardar los datos de la vela si el se recibe más de un dato 
    //por segundo se tomará el ultimo
    if(date_at.getSeconds() == 0){
        data_currency_pair.last_params = {
	        name:data_currency_pair.name,
	        open:data.open,
	        close:data.close,
	        min:data.min,
	        max:data.max,
	        date:date_send_at,
	        time:time_date_at,
	        candle_size:0,
	        direction:0,
	        volume:data.volume
	    }
	//A partir del segundo 1 se pueden enviar los datos al servidor y crear entradas
    }else{
    	//Si no se ha confirmado una entrada se restablecen valores porque la entrada no se envió al servidor
    	if(date_at.getSeconds() >= 15 && data_currency_pair.option_currently_open && !data_currency_pair.entry_confirmed){
    		rollbackEntryMartingala(data_currency_pair);
    	}

    	//Si existen parametros para enviar al servidor
    	if(data_currency_pair.last_params != 'start'){

    		data_currency_pair.last_candle_generated = new Candle(
    			data_currency_pair.last_params.name,
		        data_currency_pair.last_params.open,
		        data_currency_pair.last_params.close,
		        data_currency_pair.last_params.min,
		        data_currency_pair.last_params.max,
		        data_currency_pair.last_params.date,
		        data_currency_pair.last_params.time,
		        data_currency_pair.last_params.candle_size,
		        data_currency_pair.last_params.direction,
		        data_currency_pair.last_params.volume,
		        data_currency_pair.currency_pair
	        );
    		data_currency_pair.last_candle_generated.is_broke_level = false;
    		data_currency_pair.last_candle_generated.setDirection();

    		//si ya se sincronizo el objeto currency_pair
    		//y no existe una opción abierta
    		if(data_currency_pair.currency_pair && !data_currency_pair.option_currently_open){
    			data_currency_pair.last_candle_generated.setCandleSize();

	    		//se agrega la vela a la lista de velas del objeto currency_pair
	    		data_currency_pair.currency_pair.last_candles.push(data_currency_pair.last_candle_generated);

	    		//Si hay N velas se empieza a eliminar la primera
				if(data_currency_pair.currency_pair.last_candles.length >= (data_currency_pair.amount_last_candles + 1)){
					data_currency_pair.currency_pair.last_candles.splice(0, 1);
				}
	    		
	    		//Se calculan los datos de pronostico de las velas almacenadas en last_candle
	    		data_currency_pair.currency_pair.evaluateForecasts();

	    		//se recalcula la cantidad de rupturas de nivel en las ultimas
	    		//N velas
	    		data_currency_pair.currency_pair.setLastBrokesLevel();

    			//si martingala esta corriendo se evalua
    			//si se debe crear una entrada
	    		if(run_martingala && data_currency_pair.active && data_currency_pair.enabled && data_currency_pair.current_utility /*&& data_currency_pair.currency_pair.last_candles.length >= amount_last_candles*/){
	    			data_currency_pair.last_candle_generated.evaluateMartingala(data_currency_pair);
	    		}else{
	    			data_currency_pair.last_candle_generated.calculateForecastForNextCandle(data_currency_pair);
	    		}

				data_currency_pair.candle_pending_save = false;

				setTimeout(function(){
	    			data_currency_pair.last_candle_generated.save();
	    		}, 2000);			    		
	    	}else{
	    		//si no se ha creado currency_pair
	    		if(!data_currency_pair.currency_pair){
	    			//si no existe el objeto currency_pair se crea
		    		data_currency_pair.currency_pair = new CurrencyPair();
		    		data_currency_pair.currency_pair.name = data_currency_pair.name;
		    		data_currency_pair.currency_pair.active_id = data_currency_pair.active_id;
		    	//si existe una opción abierta
		    	}else if(data_currency_pair.option_currently_open){
		    		data_currency_pair.candle_pending_save = true;
		    	}
	    	}

	    	//restablecimiento de parametros para no seguir enviando
	    	//datos al servidor durante el minuto actual
    		data_currency_pair.last_params = 'start';

    		//En 5 segundos se envía a guardar la vela si se puede
    		//y se sincroniza el objeto currency_pair con el servidor
    		setTimeout(function(){
    			data_currency_pair.currency_pair.requestSync();
    		}, 5000);
    	}else{
    		//si existe una vela pendiente de envío y ya se cerró
    		//la opcion que estaba abierta
    		if(data_currency_pair.candle_pending_save && !data_currency_pair.option_currently_open){
	    		data_currency_pair.last_candle_generated.setCandleSize();

	    		//se agrega la vela a la lista de velas del objeto currency_pair
	    		data_currency_pair.currency_pair.last_candles.push(data_currency_pair.last_candle_generated);

	    		//Si hay N velas se empieza a eliminar la ultima
				if(data_currency_pair.currency_pair.last_candles.length >= (data_currency_pair.amount_last_candles + 1)){
					data_currency_pair.currency_pair.last_candles.splice(0, 1);
				}
	    		
	    		//Se calculan los datos de pronostico de las velas almacenadas en last_candle
	    		data_currency_pair.currency_pair.evaluateForecasts();

	    		//se recalcula la cantidad de rupturas de nivel en las ultimas
	    		//N velas
	    		data_currency_pair.currency_pair.setLastBrokesLevel();

    			//si martingala esta corriendo se evalua
    			//si se debe crear una entrada
	    		if(run_martingala && data_currency_pair.active && data_currency_pair.enabled && data_currency_pair.current_utility /*&& data_currency_pair.currency_pair.last_candles.length >= amount_last_candles*/){
	    			data_currency_pair.last_candle_generated.evaluateMartingala(data_currency_pair);
	    		}else{
	    			data_currency_pair.last_candle_generated.calculateForecastForNextCandle(data_currency_pair);
	    		}

				data_currency_pair.candle_pending_save = false;

				setTimeout(function(){
	    			data_currency_pair.last_candle_generated.save();
	    		}, 2000);	
			}
    	}

    	//Si martingala esta corriendo, no se han evaluado alertas en el minuto actual
    	//y no hay una entrada abierta
    	if(run_martingala && data_currency_pair.active && data_currency_pair.enabled && data_currency_pair.current_utility && data_currency_pair.last_martingala_one != date_at.getMinutes() && !data_currency_pair.option_currently_open){
    		//console.log('Enviando datos de primer segundo en '+date_send_at_s_s);
    		
    		//en last_martingala_one se almacena el ultimo minuto que se 
    		//realizo la evaluación de alertas martingala (Solo se evalua una vez por minuto)
    		data_currency_pair.last_martingala_one = date_at.getMinutes();

    		//si ya se sincronizo el objeto currency_pair
    		//se evalua la entrada martingala con la posición de apertura de la vela actual
    		if(data_currency_pair.currency_pair){
    			data_currency_pair.currency_pair.evaluateLastAlertMartingala(data.open, data_currency_pair);
    		}
    	}
    }
}

/**
 * Envia valor de la ultima alerta al servidor
 * @param {Float} value [Valor de la alerta]
 */
function setEntryValue(value, data_currency_pair){
	if(run_martingala && data_currency_pair.active && data_currency_pair.enabled && data_currency_pair.current_utility){
		setTimeout(function(){
			fetch("http://127.0.0.1:8000/api/iq_value/set-entry-value-martingala/"+data_currency_pair.name+"/"+value, {mode: 'no-cors'});
		}, 7000);
	}
}

function listenerWebSocket(e){
	if(e.message.type == 'sync_currency_pair'){
		for(var key in data_currency_pairs){
			if(data_currency_pairs[key].name == e.message.data.name && data_currency_pairs[key].active && data_currency_pairs[key].currency_pair){
				data_currency_pairs[key].currency_pair.dataSync(e.message.data);
			}
		}
	}
}

function listenWebsocket(){
	window.Echo.channel('home').listen('NewMessage', e => listenerWebSocket(e));
}

function leaveWebsocket(){
	window.Echo.leaveChannel('home');
}

listenWebsocket();

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;

    try{
        var data = null;

        try {
        	data = JSON.parse(str);	        	
        } catch(e) {
        }



        //result win - loose - sold
        if(data){
            if(data.name && data.name == 'candle-generated'){
            	let data_currency_pair = data_currency_pairs['_'+data.msg.active_id];

            	if(data_currency_pair){
            		evaluateCandle(data.msg, data_currency_pair);
            	}

            }else if(data.name && data.name == 'traders-mood-changed'){

            	let data_currency_pair = data_currency_pairs['_'+data.msg.asset_id];

            	if(data_currency_pair)
	            	data_currency_pair.traders_mood = (data.msg.value * 100).toFixed(2);

	        }else if(data.name && data.name == 'option-opened' && run_martingala){
	        	let data_currency_pair = data_currency_pairs['_'+data.msg.active_id];

            	if(data_currency_pair){
		        	data_currency_pair.entry_confirmed = true;
		            setEntryValue(data.msg.value, data_currency_pair);
		        }
	        }else if(data.name && data.name == 'option-closed' && run_martingala){	            	
	        	let data_currency_pair = data_currency_pairs['_'+data.msg.active_id];
            	if(data_currency_pair){
		            if(data.msg.result == 'equal'){
		            	data_currency_pair.attemps_direction += data_currency_pair.last_direction == 1?-1:1;
		        		data_currency_pair.last_entry_result = 0;
		                data_currency_pair.attemps--;
		                data_currency_pair.option_equal = true;

		                //Si era el primer intento y martingala se esta ejecutando de manera global
		                if(!config_trading.individual_martingala && data_currency_pair.attemps == 0 && global_martingala_is_running && data_currency_pair.active_id == active_id_global_martingala_running){
		                	global_martingala_is_running = false;
		                	active_id_global_martingala_running = null;
		                }
		            }else if(data.msg.result == 'win'){
		                data_currency_pair.current_gain += (data_currency_pair.data_entries[0].amount * data_currency_pair.data_entries[0].utility)/100;
		                data_currency_pair.max_gain = (data_currency_pair.current_gain > data_currency_pair.max_gain)?data_currency_pair.current_gain:data_currency_pair.max_gain;

		                global_current_gain += (data_currency_pair.data_entries[0].amount * data_currency_pair.data_entries[0].utility)/100;
		                global_max_gain = (global_current_gain > global_max_gain)?global_current_gain:global_max_gain;
		            	
		            	data_currency_pair.last_entry_result = 1;

		            	//Si martingala se esta ejecutando de manera global
		            	//Se restablecen variables de entrada martingala global
		                if(!config_trading.individual_martingala && data_currency_pair.active_id == active_id_global_martingala_running && global_martingala_is_running){
		                	global_martingala_is_running = false;
		                	active_id_global_martingala_running = null;
		                }
		            }else if(data.msg.result == 'loose'){
		                data_currency_pair.current_gain -= data_currency_pair.data_entries[0].amount;
		                global_current_gain -= data_currency_pair.data_entries[0].amount;
		            	data_currency_pair.last_entry_result = -1;
		                if(typeof stop_loss == 'number'){
		                    if(stop_loss_dynamic){
		                    	//Si martingala se esta ejecutando de manera individual
		                        //y las perdidas han llegado a un punto cercano del stop loss dinámico
		                        //el cual no permite realizar la entrada mínima (initial_amount)
		                        if(config_trading.individual_martingala && data_currency_pair.current_gain < ((data_currency_pair.max_gain - stop_loss) + initial_amount)){
		                            console.log('Sistema detenido por alcance de stop loss dinámico');
		                            console.log('Utilidad final: $ '+data_currency_pair.current_gain);
		                            let aux_id_martingala = data_currency_pair.id_martingala;
		                        	stopMartingalaCurrencyPair(data_currency_pair);
		                            console.log('**********************');

		                            if(config_trading.auto_start_with_stop_loss){
			                        	setTimeout(function(){
			                        		startMartingalaCurrencyPair(data_currency_pair);
			                        		data_currency_pair.id_martingala = aux_id_martingala;
			                        	}, 3000);
			                        }
		                        }
		                        //Si martingala se esta ejecutando de manera global
		                        //y las perdidas han llegado a un punto cercano del stop loss dinámico
		                        //el cual no permite realizar la entrada mínima (initial_amount)
		                        else if(!config_trading.individual_martingala && data_currency_pair.active_id == active_id_global_martingala_running && global_current_gain < ((global_max_gain - stop_loss) + initial_amount)){
		                            console.log('Sistema detenido por alcance de stop loss dinámico');
		                            console.log('Utilidad final: $ '+global_current_gain);
		                            let aux_id_martingala = data_currency_pair.id_martingala;
		                        	stopMartingala();
		                        	global_martingala_is_running = false;
		                        	active_id_global_martingala_running = null;
		                            console.log('**********************');

		                            if(config_trading.auto_start_with_stop_loss){
			                        	setTimeout(function(){
			                        		startMartingala();
			                        		data_currency_pair.id_martingala = aux_id_martingala;
			                        	}, 3000);
			                        }
		                        }
		                    }else{
		                    	//Si martingala se está ejecutando de manera individual
		                        //y las perdidas han llegado a un punto cercano del stop loss
		                        //el cual no permite realizar la entrada mínima (initial_amount)
		                        if(config_trading.individual_martingala && data_currency_pair.current_gain < 0 && (stop_loss - Math.abs(data_currency_pair.current_gain)) < initial_amount){
		                            console.log('Sistema detenido por alcance de stop loss');
		                            console.log('Utilidad final: $ '+data_currency_pair.current_gain);
		                            stopMartingalaCurrencyPair(data_currency_pair);

		                            if(config_trading.auto_start_with_stop_loss){
			                        	setTimeout(function(){
			                        		startMartingalaCurrencyPair(data_currency_pair);
			                        		data_currency_pair.id_martingala = aux_id_martingala;
			                        	}, 3000);
			                        }
		                        }
		                    	//Si martingala se está ejecutando de manera global
		                        //y las perdidas han llegado a un punto cercano del stop loss
		                        //el cual no permite realizar la entrada mínima (initial_amount)
		                        else if(!config_trading.individual_martingala && data_currency_pair.active_id == active_id_global_martingala_running && global_current_gain < 0 && (stop_loss - Math.abs(global_current_gain)) < initial_amount){
		                            console.log('Sistema detenido por alcance de stop loss');
		                            console.log('Utilidad final: $ '+global_current_gain);
		                            stopMartingala();

		                            global_martingala_is_running = false;
		                        	active_id_global_martingala_running = null;

		                            if(config_trading.auto_start_with_stop_loss){
			                        	setTimeout(function(){
			                        		startMartingala();
			                        		data_currency_pair.id_martingala = aux_id_martingala;
			                        	}, 3000);
			                        }
		                        }
		                    }

		                }
		            }

		            data_currency_pair.current_gain = parseFloat(data_currency_pair.current_gain.toFixed(2));
					data_currency_pair.max_gain = parseFloat(data_currency_pair.max_gain.toFixed(2));

					global_current_gain = parseFloat(global_current_gain.toFixed(2));
					global_max_gain = parseFloat(global_max_gain.toFixed(2));

		            data_currency_pair.data_entries.splice(0);
		            //Indica que la entrada ya se cerró
		            data_currency_pair.option_currently_open = false;
		        }

	        }else if(data.name && data.name == 'commission-changed' && data.msg.instrument_type == 'turbo-option'){
	        	let data_currency_pair = data_currency_pairs['_'+data.msg.active_id];

            	if(data_currency_pair)
	            	data_currency_pair.current_utility = 100 - data.msg.commission.value;

	        }else if(data.name && data.name == 'spot-buyback-quote-generated'){
	        	let data_currency_pair = data_currency_pairs['_'+data.msg.active];

            	if(data_currency_pair && data_currency_pair.option_currently_open && !data_currency_pair.entry_confirmed)
	        		data_currency_pair.entry_confirmed = true;
	        }else if(data.name && data.name == 'first-candles' && ws){
	        	requestSyncDataCurrencyPairs();
	        }
	    }
    }catch(error){
    	console.log(error);
    }

    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            outU8Array[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            outU8Array[outIdx++] = 192 | u >> 6;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            outU8Array[outIdx++] = 224 | u >> 12;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx) break;
            outU8Array[outIdx++] = 240 | u >> 18;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        }
    }
    outU8Array[outIdx] = 0;
    return outIdx - startIdx
}

function startApp(){

	var e = new XMLHttpRequest;
    e.open("GET", "https://" + domain + "/api/register/getregdata", !0),
    e.send(),
    e.onreadystatechange = function() {
        if (4 == e.readyState && 200 == e.status) {
            var t = JSON.parse(e.responseText);
            if (0 != t.isSuccessful) {
                user_balance_id = t.result.profile.balance_id;
                connectToServer();
				startMartingala();
            }
        }
    }

    setInterval(function(){
    	let current_date = new Date();

    	if(ws && current_date.getSeconds() >= 30){
    		ws.send('{"msg":"","name":"api_option_init_all"}');
    	}
    }, 60000)
}

function printForecastData(){
	for(var key in data_currency_pairs){
		if(data_currency_pairs[key].active && data_currency_pairs[key].enabled && data_currency_pairs[key].currency_pair){
			console.log(data_currency_pairs[key].name, data_currency_pairs[key].currency_pair.forecast_data);
			console.log('----------------------------------');
		}
	}
}

function printGains(){
	for(var key in data_currency_pairs){
		if(data_currency_pairs[key].currency_pair && data_currency_pairs[key].current_gain){
			console.log(data_currency_pairs[key].name, "Ganancia actual: $"+data_currency_pairs[key].current_gain+" Máxima ganancia: $"+data_currency_pairs[key].max_gain);
			console.log('----------------------------------');
		}
	}

	console.log('Total ganancia global: $'+global_current_gain);
	console.log('Total máxima ganancia global: $'+global_max_gain);
}

function printCurrentUtilities(){
	for(var key in data_currency_pairs){
		if(data_currency_pairs[key].active && data_currency_pairs[key].enabled && data_currency_pairs[key].currency_pair){
			console.log(data_currency_pairs[key].name, data_currency_pairs[key].current_utility?(data_currency_pairs[key].current_utility+"%"):"SIN UTILIDAD");
		}
	}
}

function printEnabled(){
	for(var key in data_currency_pairs){
		if(data_currency_pairs[key].currency_pair){
			console.log(data_currency_pairs[key].name, data_currency_pairs[key].enabled);
		}
	}
}

function printActiveIds(){
	for(var key in data_currency_pairs){
		console.log(data_currency_pairs[key].name, data_currency_pairs[key].active_id);
	}
}

function printDataEntry(){
	for(var key in data_currency_pairs){
		if(data_currency_pairs[key].active && data_currency_pairs[key].enabled && data_currency_pairs[key].currency_pair){
			console.log(data_currency_pairs[key].name, data_currency_pairs[key].data_entries);
		}
	}
}

function getCookie(cname) {
	  var name = cname + "=";
	  var decodedCookie = decodeURIComponent(document.cookie);
	  var ca = decodedCookie.split(';');
	  for(var i = 0; i <ca.length; i++) {
	    var c = ca[i];
	    while (c.charAt(0) == ' ') {
	      c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
	      return c.substring(name.length, c.length);
	    }
	  }
	  return "";
	}
startApp();