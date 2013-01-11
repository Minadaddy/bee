

module.exports = function(aida){



  aida.register('mail', function(options, callback){
      var mailer = require("nodemailer");
      var transportType = options.transport || 'SMTP';
      var message;
      var auth;
      var text;
      var html;
      var envelope;
      var attchments = [];
      options.childNodes.forEach(function(item){
        if(item.name == 'message'){
          message = item.value;
        }else if(item.name == 'auth'){
          var data = item.value;
          if(data.XOAuth2){
            auth = {
              XOAuth2: {
                user: data.user,
                clientId: data.clientId,
                clientSecret: data.clientSecret,
                refreshToken: data.refreshToken,
                accessToken: data.accessToken,
                timeout: data.timeout
              }
            }
          }else if(data.XOAuthToken){
            if(auth.XOAuthToken){
              auth = {
                XOAuthToken: mailer.createXOAuthGenerator({
                  user: data.user,
                  token: data.token,
                  tokenSecrete: data.tokenSecrete
                })
              }
            }else{
              auth = {
                XOAuthToken: data.XOAuthToken
              }
            }
          }else{
            auth = {
              user: data.user,
              pass: data.pass
            }
          }
        }
      });
      var transport = mailer.createTransport(transportType, {
        service: options.service,
        host: options.host,
        port: options.port || 465,
        secureConnection: options.ssl,
        auth: auth,
        ignoreTLS: (options.ignoreTLS ? options.ignoreTLS: false)
      });
      if(!message){
        throw new Error('the message node is required in mail task');
      }
      text = message.text;
      message.childNodes.forEach(function(item){
        if(item.name == 'text'){
          text = item.value.value;
        }else if(item.name == 'html'){
          html = item.value.value;
        }else if(item.name == 'attachment'){
          var data = item.value;
          var attch = {
            fileName: data.name,
            cid: data.cid
          }
          if(data.path){
            attch.filePath = data.path
          }else{
            attch.contents = data.value
          }
          attchments.push(attch)
        }else if(item.name == 'envelope'){
          envelope = {
            from: item.value.from,
            to: item.value.to,
            cc: item.value.cc,
            bcc: item.value.bcc
          }
        }
      });
      var mailOptions = {
        from: message.from,
        to: message.to,
        cc: message.cc,
        bcc: message.bcc,
        replyTo: message.replyTo,
        messageId: message.messageId,
        date: message.date,
        encoding: message.encoding,
        charset : message.charset,
        inReplyTo: message.inReplyTo,
        generateTextFromHTML: message.generateTextFromHTML,
        subject: message.subject,
        text: text,
        html: html,
        attchments: attchments,
        envelope: envelope
      }
      transport.sendMail(mailOptions, callback);
    });
}
   