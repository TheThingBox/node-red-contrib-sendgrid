module.exports = function(RED) {
    function SendGridNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            this.status({fill:"green",shape:"dot",text:"sending"});
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(this.credentials.key);

 	    if (config.content === "html"){
            	var data = {
                	from: config.from || msg.from,
                	to: config.to || msg.to,
                	cc: msg.cc,
                	bcc: msg.bcc,                
                	subject: msg.topic || msg.title || 'Message from Node-RED',
                	html: msg.payload.toString()
            	};
	    }
            else
            {
                var data = {
                        from: config.from || msg.from,
                        to: config.to || msg.to,
                        cc: msg.cc,
                        bcc: msg.bcc,
                        subject: msg.topic || msg.title || 'Message from Node-RED',
                        text: msg.payload.toString()
		};
            }
	    if(Array.isArray(msg.attachments))
		    data.attachments = msg.attachments;
            sgMail.send(data, function(err) {
                if (err) {
                    node.error(err.toString(), msg);
                }
            });
            this.status({});            
        });
    }
    RED.nodes.registerType("sendgrid", SendGridNode, {
        credentials: {
            key: {type:"password"}
        }
    });
}
