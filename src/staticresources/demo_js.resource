dojo.require('dojox.cometd');
dojo.require('dojox.cometd.timestamp');
dojo.require('dojox.cometd.ack');

dojo.ready(function() { 
    
    var datastream = {
        _topic: null,
        _connected: false,
        _disconnecting: false,
        _topicsubscription: null,
        _token: null, 
        _clientid: '3MVG9lKcPoNINVBJL81nlIzB6Z7TFQtwfc6rMsiZXaW_yUy2Dv35Ayfe248X4yEMgEz0GmNDK5QMJ0MSFZdha',
        _loginURL: location.protocol + '//' + location.host + '//' + 'services/oauth2/authorize',
    
        _init: function()
        { 
            dojo.removeClass('join', 'hidden');
            dojo.addClass('joined', 'hidden');
            
            dojo.query('#loginButton').onclick(function(e) {
            	datastream.login();
            });
            
            dojo.query('#createTopicButton').onclick(function(e)
            {
                datastream.createTopic();
            }); 
    
            dojo.query('#deleteTopicButton').onclick(function(e)
            {
                datastream.deleteTopic(dojo.byId('topicName').value);
            }); 
            
            dojo.query('#createAccountButton').onclick(function(e)
            {
                datastream.createAccount();
            }); 
            
            dojo.query('#updateAccountButton').onclick(function(e)
            {
                datastream.updateAccount();
            }); 
    
            dojo.query('#subscribeButton').onclick(function(e)
            {
                datastream.subscribe(dojo.byId('topic').value);
            }); 
    
            dojo.query('#leaveButton').onclick(datastream, 'leave');
    
            // Check if there was a saved application state
            var stateCookie = dojox.cometd.COOKIE?dojox.cometd.COOKIE.get('dojox.cometd.demo.state'):null;
            var state = stateCookie ? dojox.cometd.JSON.fromJSON(stateCookie) : null;
            // Restore the state, if present
            if (state)
            {
                dojo.byId('topic').value=state.topic;
                setTimeout(function()
                {
                    // This will perform the handshake
                    datastream.subscribe(state.topic);
                }, 0);
            }
        },
    
        subscribe: function(topic)
        {  
            var cometdURL = location.protocol + '//' + location.host + '/cometd/23.0';
            var auth = 'OAuth ' + token;
            dojox.cometd.configure({
            	url: cometdURL,
                requestHeaders: 
            	    { Authorization: auth}
            });
            dojox.cometd.handshake();
            datastream._disconnecting = false;
    
            if (topic == null || name.topic == 0)
            {
                alert('Please enter a topic');
                return;
            }
    
            datastream._topic = topic;
    
            dojo.addClass('join', 'hidden');
            dojo.removeClass('joined', 'hidden');
            datastream._topicsubscription = dojox.cometd.subscribe(datastream._topic, datastream.receive);
        },
    
        _unsubscribe: function()
        {
            if (datastream._topicsubscription)
            {
                dojox.cometd.unsubscribe(datastream._topicsubscription);
            }
            datastream._topicsubscription = null;
        },
    
        leave: function()
        { 
            datastream._unsubscribe(); 
            dojox.cometd.disconnect();
    
            // switch the input form
            dojo.removeClass('join', 'hidden');
            dojo.addClass('joined', 'hidden');
    
            dojo.byId('topic').focus();
    
            datastream._topic = null;
            datastream._disconnecting = true;
        },
    
        receive: function(message) 
        { 
            var datastream = dojo.byId('datastream');
        	data = message.data; 
            datastream.innerHTML += '<span class=\'text\'>' + JSON.stringify(data, null, '\t') + '</span><br/>';
            datastream.innerHTML += '<span class=\'text\'>' + '_____________ ' + '</span><br/>';
            datastream.scrollTop = datastream.scrollHeight - datastream.clientHeight;
        },
        
        display: function(text) {
            var datastream = dojo.byId('datastream');
            datastream.innerHTML += '<span class=\'data\'><span class=\'text\'>' + text + '</span></span><br/>';
            datastream.scrollTop = datastream.scrollHeight - datastream.clientHeight;
        }
    };
    
    dojo.addOnLoad(datastream, '_init');
    
    dojo.addOnUnload(function()
    {
        if (datastream._topic)
        {
            // dojox.cometd.reload();
            dojox.cometd.COOKIE.set('org.cometd.demo.state', dojox.cometd.JSON.toJSON({
                topic: datastream._topic
            }), { 'max-age': 5 });
        }
        else
            dojox.cometd.disconnect();
    }); 
});


